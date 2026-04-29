import { useState, useEffect, useRef } from "react";
import { Input, Button, Avatar, Spin } from "antd";
import { SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { subscribe, unsubscribe } from "@/utils/websocket";
import { getChatSessions, getChatMessages } from "@/api/service"; // 导入接口
import "./index.less";

const SHOP_ID = 1;

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatRef = useRef(null);

  const { goodsId, storeId } = location.state || {};
  const userStr = localStorage.getItem("userInfo");
  const userInfo = userStr ? JSON.parse(userStr) : {};
  const userId = userInfo.id;

  const [msg, setMsg] = useState("");
  const [list, setList] = useState([
    {
      type: "shop",
      name: "客服",
      avatar: "https://picsum.photos/40/40",
      content: "您好，请问有什么可以帮您？",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [loading, setLoading] = useState(true); // 加载状态

  // -------------------- 1. 刷新页面加载历史消息 --------------------
  useEffect(() => {
    if (!userId) return;

    const loadHistory = async () => {
      try {
        // 1. 先获取当前用户和店铺的会话
        const sessionsRes = await getChatSessions({ shopId: SHOP_ID });
        const session = sessionsRes.data?.find((s) => s.userId === userId);

        if (session) {
          // 2. 拿到会话ID，加载历史消息
          const messagesRes = await getChatMessages({ sessionId: session.id });
          const messages = messagesRes.data || [];

          // 3. 转换消息格式，渲染到页面
          const historyList = messages.map((msg) => {
            const isFromSelf = msg.fromUserId === userId;
            return {
              type: isFromSelf ? "user" : "shop",
              name: isFromSelf ? "我" : "客服",
              avatar: isFromSelf
                ? "https://picsum.photos/40/40?random=user"
                : "https://picsum.photos/40/40",
              content: msg.content,
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          });

          // 合并历史消息和欢迎语
          if (historyList.length > 0) {
            setList([
              {
                type: "shop",
                name: "客服",
                avatar: "https://picsum.photos/40/40",
                content: "您好，请问有什么可以帮您？",
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
              ...historyList,
            ]);
          }
        }
      } catch (err) {
        console.error("加载历史消息失败", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [userId]);

  // -------------------- 2. 订阅实时消息 --------------------
  useEffect(() => {
    if (!userId) return;

    const topic = `chat_${userId}`;

    const handleMessage = (data) => {
      console.log("用户收到消息：", data);
      if (data.type !== "CHAT") return;

      const isFromSelf = data.fromUserId === userId;
      const newMsg = {
        type: isFromSelf ? "user" : "shop",
        name: isFromSelf ? "我" : "客服",
        avatar: isFromSelf
          ? "https://picsum.photos/40/40?random=user"
          : "https://picsum.photos/40/40",
        content: data.content,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setList((prev) => [...prev, newMsg]);
    };

    subscribe(topic, handleMessage);

    return () => {
      unsubscribe(topic, handleMessage);
    };
  }, [userId]);

  // -------------------- 3. 发送消息 --------------------
  const send = () => {
    if (!msg.trim() || !userId) return;

    const topic = `chat_${userId}`;
    const message = {
      topic: topic,
      type: "CHAT",
      fromUserId: userId,
      shopId: SHOP_ID,
      goodsId: goodsId,
      senderType: "USER",
      content: msg,
    };

    // 本地先渲染，提升体验
    const newMsg = {
      type: "user",
      name: "我",
      avatar: "https://picsum.photos/40/40?random=user",
      content: msg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setList((prev) => [...prev, newMsg]);
    setMsg("");

    window.ws.send(message);
  };

  // -------------------- 4. 自动滚动到底部 --------------------
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [list]);

  if (loading) {
    return (
      <div
        className="chat-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        />
        <div className="chat-title">莹朗安防办公店</div>
      </div>

      <div
        className="chat-body"
        ref={chatRef}
      >
        {list.map((item, i) => (
          <div
            key={i}
            className={`chat-item ${item.type}`}
          >
            <Avatar
              src={item.avatar}
              size={40}
            />
            <div className="chat-content">
              <div className="chat-name">{item.name}</div>
              <div className="chat-bubble">{item.content}</div>
              <div className="chat-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <Input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="请输入您想要咨询的内容..."
          onPressEnter={send}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={send}
          style={{ height: 50, width: 50 }}
        />
      </div>
    </div>
  );
};

export default ChatPage;
