class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectTimer = null;
    this.reconnectDelay = 3000;
    this.subscriptions = {};
  }

  connect() {
    if (this.isConnecting || this.isConnected) return;
    this.isConnecting = true;

    if (this.socket) this.socket.close(1000, "replace");

    console.log("【WebSocket】正在连接 →", this.url);
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("【WebSocket】✅ 连接成功");
      this.isConnected = true;
      this.isConnecting = false;
      clearTimeout(this.reconnectTimer);

      // ✅ 关键：连接成功后，把所有已订阅的 topic 重新发一遍
      Object.keys(this.subscriptions).forEach((topic) => {
        this.send({ topic, type: "SUBSCRIBE" });
        console.log("【WebSocket】自动注册 topic →", topic);
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
        console.log("【WebSocket】消息格式异常", e);
      }
    };

    this.socket.onclose = (event) => {
      console.log("【WebSocket】断开 code:", event.code);
      this.isConnected = false;
      this.isConnecting = false;
      if (event.code !== 1000) this.reconnect();
    };

    this.socket.onerror = () => {
      console.log("【WebSocket】错误");
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
    }
  }

  close() {
    console.log("【WebSocket】手动关闭");
    if (this.socket) this.socket.close(1000, "manual");
    clearTimeout(this.reconnectTimer);
    this.isConnected = false;
  }

  subscribe(topic, callback) {
    console.log("【WebSocket】📌 订阅 topic →", topic);
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = [];
    }
    this.subscriptions[topic].push(callback);

    // 如果已经连上，直接发注册消息；没连上就等 onopen 里自动发
    if (this.isConnected) {
      this.send({ topic, type: "SUBSCRIBE" });
    }
    this.connect();
  }

  unsubscribe(topic, callback) {
    console.log("【WebSocket】📤 取消订阅 topic →", topic);
    if (!this.subscriptions[topic]) return;
    if (callback) {
      this.subscriptions[topic] = this.subscriptions[topic].filter(
        (cb) => cb !== callback,
      );
    } else {
      delete this.subscriptions[topic];
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
