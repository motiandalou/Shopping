class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectTimer = null;
    this.reconnectDelay = 3000;
    this.subscriptions = {}; // 存储 topic -> [callback]
    this.subscribedTopics = new Set();
  }

  connect() {
    if (this.isConnecting || this.isConnected) return;
    this.isConnecting = true;

    if (this.socket) {
      this.socket.close(1000, "replace");
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("【WebSocket】✅ 连接成功");
      this.isConnected = true;
      this.isConnecting = false;
      clearTimeout(this.reconnectTimer);

      // 连接成功后重新订阅所有 topic
      Object.keys(this.subscriptions).forEach((topic) => {
        this.sendSubscribe(topic);
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const topic = data.topic;

        if (topic && this.subscriptions[topic]) {
          this.subscriptions[topic].forEach((cb) => cb(data));
        }
      } catch (e) {
        console.log("【WebSocket】消息解析异常", e);
      }
    };

    this.socket.onclose = (event) => {
      console.log("【WebSocket】断开 code:", event.code);
      this.isConnected = false;
      this.isConnecting = false;
      if (event.code !== 1000) {
        this.reconnect();
      }
    };

    this.socket.onerror = () => {
      console.log("【WebSocket】连接错误");
      this.isConnected = false;
      this.isConnecting = false;
    };
  }

  reconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
      this.reconnectTimer = null;
    }, this.reconnectDelay);
  }

  send(data) {
    if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.log("【WebSocket】暂未连接，消息无法发送", data);
    }
  }

  close() {
    console.log("【WebSocket】手动关闭");
    if (this.socket) this.socket.close(1000, "manual");
    clearTimeout(this.reconnectTimer);
    this.isConnected = false;
    this.subscribedTopics.clear();
  }

  // 发送订阅指令
  sendSubscribe(topic) {
    this.send({ topic, type: "SUBSCRIBE" });
    this.subscribedTopics.add(topic);
    console.log("【WebSocket】✅ 已订阅 topic →", topic);
  }

  // 订阅
  subscribe(topic, callback) {
    if (!topic || !callback) return;

    // 加入订阅列表
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = [];
    }

    // 避免重复添加同一个回调
    if (!this.subscriptions[topic].includes(callback)) {
      this.subscriptions[topic].push(callback);
    }

    // 连接成功就直接订阅
    if (this.isConnected) {
      this.sendSubscribe(topic);
    }

    // 确保连接
    this.connect();
  }

  // 取消订阅
  unsubscribe(topic, callback) {
    if (!this.subscriptions[topic]) return;

    if (callback) {
      this.subscriptions[topic] = this.subscriptions[topic].filter(
        (cb) => cb !== callback,
      );
    }

    // 没有回调了就清理 topic
    if (!this.subscriptions[topic] || this.subscriptions[topic].length === 0) {
      delete this.subscriptions[topic];
      this.subscribedTopics.delete(topic);
      console.log("【WebSocket】📤 完全取消订阅 topic →", topic);
    }
  }
}

const WS_URL = "ws://localhost:8888/ws";
const websocket = new WebSocketClient(WS_URL);
window.ws = websocket;

export const subscribe = (topic, callback) =>
  websocket.subscribe(topic, callback);
export const unsubscribe = (topic, callback) =>
  websocket.unsubscribe(topic, callback);
export default websocket;
