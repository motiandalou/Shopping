import { useState, useEffect, useRef } from "react";
import { Layout, List, Avatar, Input, Button, Badge } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import "./index.less";
import { subscribe, unsubscribe } from "@/utils/websocket";
import {
  getChatSessions,
  getChatMessages,
  clearUnread,
  getUserStatus,
} from "@/api/service";
import emptyImg from "@/assets/image/empty.png";

const { Sider, Content } = Layout;

// TODO 店铺ID应该是动态的，目前是单店铺,这里先写死
const SHOP_ID = 1;

const ServiceChat = () => {
  // 切换用户的ID
  const [selectedUser, setSelectedUser] = useState(() => {
    // 从本地缓存读取上次选中的用户
    try {
      const lastUser = localStorage.getItem("lastChatUser");
      return lastUser ? JSON.parse(lastUser) : null;
    } catch (e) {
      return {};
    }
  });
  // 发送消息的人(是哪个用户发的)
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
              userName: session.userName || `用户 ${session.userId}`,
              sessionId: session.id,
            },
            messages: [],
            unread: session.unreadCount || 0,
          };
        });

        setUserList(map);

        // 页面刷新后，自动选中上次聊天的用户
        const lastUserStr = localStorage.getItem("lastChatUser");
        if (lastUserStr) {
          try {
            const parsedUser = JSON.parse(lastUserStr);
            if (parsedUser && parsedUser.userId) {
              handleSelectUser(parsedUser);
            }
          } catch (e) {
            localStorage.removeItem("lastChatUser");
          }
        }
      } catch (err) {
        console.error("拉取会话列表失败", err);
      }
    };
    fetchSessions();
  }, []);

  // 订阅--店铺
  useEffect(() => {
    const topic = `shop_${SHOP_ID}`;

    subscribe(topic, (data) => {
      // 推送用户状态
      if (data.type === "USER_STATUS") {
        const userId = data.fromUserId;
        // 用户状态: 在线 / 离线
        const isOnline = data.content === "online";

        setUserList((prev) => {
          if (!prev[userId]) return prev;
          return {
            ...prev,
            [userId]: {
              ...prev[userId],
              isOnline: isOnline,
            },
          };
        });
        return;
      }
      // 不是聊天的截断
      if (data.type !== "CHAT") return;
      // 自己不给自己推送
      if (data.senderType == "SHOP_ADMIN") return;
      // 自己不渲染自己发的消息
      if (data.fromUserId == selectedUser?.userId) return;

      const fromUserId = data.fromUserId;
      // 列表显示用的简短内容
      const lastContent = data.content || "[图片]";
      setUserList((prev) => {
        const old = prev[fromUserId];
        if (old) {
          // 已有用户：更新最后一条内容 + 未读
          const isSelected = selectedUser?.userId === fromUserId;
          return {
            ...prev,
            [fromUserId]: {
              ...old,
              lastContent,
              unread: isSelected ? 0 : old.unread + 1,
            },
          };
        } else {
          // 新用户：自动加入列表
          return {
            ...prev,
            [fromUserId]: {
              info: {
                userId: fromUserId,
                userName: data.userName || `用户 ${fromUserId}`,
                sessionId: data.sessionId || fromUserId,
              },
              messages: [],
              lastContent,
              unread: 1,
            },
          };
        }
      });
    });

    return () => unsubscribe(topic);
  }, [selectedUser, SHOP_ID]);

  // 订阅--每一个单独的用户的消息
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
          info: {
            userId: fromUserId,
            userName: data.userName || `用户 ${fromUserId}`,
          },
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

  useEffect(() => {
    // 拉取用户在线状态
    const fetchStatus = async () => {
      const res = await getUserStatus();
      const statusMap = await res.json();
      setUserList((prev) => {
        const newList = { ...prev };
        Object.keys(statusMap).forEach((userId) => {
          if (newList[userId]) {
            newList[userId].isOnline = statusMap[userId];
          }
        });
        return newList;
      });
    };
    fetchStatus();
  }, []);

  // 切换用户
  const handleSelectUser = async (user) => {
    if (!user || !user.userId) return;

    setSelectedUser(user);

    // 保存当前用户到本地，实现刷新记忆
    localStorage.setItem("lastChatUser", JSON.stringify(user));

    setUserList((prev) => ({
      ...prev,
      [user.userId]: { ...prev[user.userId], unread: 0 },
    }));
    // 清空未读消息
    await clearUnread({ sessionId: user.sessionId });

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
    if (!inputValue.trim() || !selectedUser || !selectedUser.userId) return;

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
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 0);
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
          renderItem={(user) => {
            if (!user || !user.info) return null;
            const isOnline = user.isOnline ?? false;
            return (
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
                  description={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: isOnline ? "#52c41a" : "#cccccc",
                        }}
                      />
                      {isOnline ? "在线" : "离线"}
                    </div>
                  }
                />
                {user.unread > 0 && <Badge count={user.unread} />}
              </List.Item>
            );
          }}
        />
      </Sider>

      <Content className="chat-content">
        {selectedUser &&
        Object.keys(selectedUser).length > 0 &&
        selectedUser.userId ? (
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
