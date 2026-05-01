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

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.isConnected = true;
      this.isConnecting = false;
      clearTimeout(this.reconnectTimer);

      Object.keys(this.subscriptions).forEach((topic) => {
        // 这里！！！只发 topic，不要 type
        this.send({ topic });
      });
    };

    this.socket.onmessage = (event) => {
      try {
        // 二次解析
        let data = event.data;
        while (typeof data === "string") {
          data = JSON.parse(data);
        }

        const topic = data.topic;
        if (topic && this.subscriptions[topic]) {
          this.subscriptions[topic].forEach((cb) => cb(data));
        }
      } catch (e) {
        console.log("【WebSocket】消息格式异常", e);
      }
    };

    this.socket.onclose = (event) => {
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
    if (this.socket) this.socket.close(1000, "manual");
    clearTimeout(this.reconnectTimer);
    this.isConnected = false;
  }

  subscribe(topic, callback) {
    console.log("订阅 topic →", topic);
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = [];
    }
    this.subscriptions[topic].push(callback);

    if (this.isConnected) {
      this.send({ topic });
    }
    this.connect();
  }

  unsubscribe(topic, callback) {
    console.log("取消订阅 topic →", topic);
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
