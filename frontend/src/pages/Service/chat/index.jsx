import { useState, useEffect, useRef } from "react";
import { Layout, List, Avatar, Input, Button, Badge } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import "./index.less";
import { subscribe, unsubscribe } from "@/utils/websocket";
import { getChatSessions, getChatMessages } from "@/api/service";
import emptyImg from "@/assets/image/empty.png";

const { Sider, Content } = Layout;

// TODO 店铺ID应该是动态的，目前是单店铺,这里先写死
const SHOP_ID = 1;

const ServiceChat = () => {
  // 切换用户的ID
  const [selectedUser, setSelectedUser] = useState(null);
  // 发送消息的人(不是客户,是哪个用户发的)
  const [selectedFromUserId, setSelectedFromUserId] = useState(null);
  const [userList, setUserList] = useState({});
  const [inputValue, setInputValue] = useState("");
  const chatRef = useRef(null);
  // 用户信息
  const userStr = localStorage.getItem("userInfo");
  const userInfo = userStr ? JSON.parse(userStr) : {};
  const userId = userInfo.id;

  // 初始加载会话列表
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getChatSessions({ shopId: SHOP_ID });
        const list = res.data || [];

        const map = {};
        list.forEach((session) => {
          map[session.userId] = {
            info: {
              userId: session.userId,
              // TODO 需要显示真名(用户注册的名字)这里先简单展示
              userName: `用户 ${session.userId}`,
              sessionId: session.id,
            },
            messages: [],
            unread: session.unreadCount || 0,
          };
        });

        setUserList(map);
      } catch (err) {
        console.error("拉取会话列表失败", err);
      }
    };
    fetchSessions();
  }, []);

  // TODO 订阅店铺ID

  // 订阅
  useEffect(() => {
    if (!selectedUser?.userId) return;

    const topic = `chat_${selectedUser.userId}`;
    // 订阅
    subscribe(topic, (data) => {
      if (data.type !== "CHAT") return;
      // 如果这条消息是我自己发的，直接 return，不渲染
      if (data.senderType === "SHOP_ADMIN") return;
      // 哪个用户发的
      const fromUserId = data.fromUserId;
      const newMsg = {
        content: data.content,
        sender: data.senderType === "SHOP_ADMIN" ? "admin" : "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setUserList((prev) => {
        const user = prev[fromUserId] || {
          info: { userId: fromUserId, userName: `用户 ${fromUserId}` },
          messages: [],
          unread: 0,
        };

        return {
          ...prev,
          [fromUserId]: {
            ...user,
            messages: [...user.messages, newMsg],
            unread: selectedUser?.userId !== fromUserId ? user.unread + 1 : 0,
          },
        };
      });
    });

    // 取消订阅
    return () => {
      unsubscribe(topic);
    };
  }, [selectedUser]);

  // 切换用户
  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    setUserList((prev) => ({
      ...prev,
      [user.userId]: { ...prev[user.userId], unread: 0 },
    }));

    try {
      const res = await getChatMessages({ sessionId: user.sessionId });
      const list = res.data || [];
      // 谁发送的消息(用户)
      setSelectedFromUserId(list[0]?.fromUserId);

      const messages = list.map((msg) => ({
        content: msg.content,
        sender: msg.senderType === "SHOP_ADMIN" ? "admin" : "user",
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setUserList((prev) => ({
        ...prev,
        [user.userId]: { ...prev[user.userId], messages },
      }));
    } catch (err) {
      console.error("拉取历史消息失败", err);
    }
  };

  // 发送消息
  const handleSend = () => {
    if (!inputValue.trim() || !selectedUser) return;

    const targetUserId = selectedUser.userId;
    const topic = `chat_${targetUserId}`;

    const sendData = {
      topic: topic,
      type: "CHAT",
      fromUserId: selectedFromUserId,
      shopId: SHOP_ID,
      senderType: "SHOP_ADMIN",
      content: inputValue,
    };

    // 发送
    window.ws.send(sendData);

    const newMsg = {
      content: inputValue,
      sender: "admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setUserList((prev) => ({
      ...prev,
      [targetUserId]: {
        ...prev[targetUserId],
        messages: [...prev[targetUserId].messages, newMsg],
      },
    }));

    setInputValue("");
  };

  // 自动滚动
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [userList, selectedUser]);

  const currentMessages = selectedUser
    ? userList[selectedUser.userId]?.messages || []
    : [];

  return (
    <Layout className="service-page">
      <Sider
        width={250}
        className="user-list-sider"
      >
        <List
          dataSource={Object.values(userList)}
          renderItem={(user) => (
            <List.Item
              className={`user-item ${selectedUser?.userId === user.info.userId ? "active" : ""}`}
              onClick={() => handleSelectUser(user.info)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    src={`https://picsum.photos/40/40?random=${user.info.userId}`}
                    style={{ width: 50, height: 50 }}
                  />
                }
                title={user.info.userName}
                description={`咨询ID: ${user.info.userId}`}
              />
              {user.unread > 0 && <Badge count={user.unread} />}
            </List.Item>
          )}
        />
      </Sider>

      <Content className="chat-content">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h3>与 {selectedUser.userName} 的对话</h3>
            </div>

            <div
              className="chat-messages"
              ref={chatRef}
            >
              {currentMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message-bubble ${msg.sender === "admin" ? "admin" : "user"}`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入回复..."
                rows={2}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                className="send-btn"
              >
                发送
              </Button>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <img src={emptyImg} />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ServiceChat;
