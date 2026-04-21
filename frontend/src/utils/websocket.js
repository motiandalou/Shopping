class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.listeners = {};
    this.isConnected = false;
    this.reconnectTimer = null;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
  }

  // 【关键】连接方法，防止重复创建连接
  connect() {
    // 如果正在连接或已经连接，直接返回
    if (this.isConnecting || (this.socket && this.isConnected)) {
      return;
    }
    this.isConnecting = true;

    if (this.socket) {
      this.socket.close(1000, "防止重复连接");
      this.socket = null;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("✅ WebSocket 连接成功", this.url);
      this.isConnected = true;
      this.isConnecting = false;
      clearTimeout(this.reconnectTimer);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.triggerEvent("message", data);
      } catch (e) {
        this.triggerEvent("message", event.data);
      }
    };

    this.socket.onclose = (event) => {
      console.log("❌ WebSocket 断开连接", this.url, "code:", event.code);
      this.isConnected = false;
      this.isConnecting = false;
      if (event.code !== 1000) {
        // 正常关闭（1000）不重连
        this.reconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.log("⚠️ WebSocket 连接错误");
      this.isConnected = false;
      this.isConnecting = false;
    };
  }

  reconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      console.log("🔄 尝试重连 WebSocket...");
      this.connect();
      this.reconnectTimer = null;
    }, this.reconnectDelay);
  }

  send(data) {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  // 【关键】主动关闭连接，不触发重连
  close() {
    if (this.socket) {
      this.socket.close(1000, "组件卸载");
      this.socket = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
  }

  onMessage(callback) {
    this.addEventListener("message", callback);
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  triggerEvent(event, data) {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach((cb) => cb(data));
  }
}

const WS_URL = "ws://localhost:8081/api/websocket/1";
const websocket = new WebSocketClient(WS_URL);

export default websocket;
