class Socket {
    // 类初始化方法
    constructor(wsUrl) {
        this.wsUrl = wsUrl
    };
    // 实例方法(websocket初始化)
    wsInit() {
        if (typeof WebSocket === "undefined") {
            alert("您的浏览器不支持socket");
            return;
        } else {
            // 实例化websocket
            this.ws = new WebSocket(this.wsUrl);
            // 监听websocket连接
            this.ws.onopen = this.wsOpen;
            // 监听websocket错误信息
            this.ws.onerror = this.wsError;
        }
    };
    // 监听websocket消息
    wsGetMessage(callback) {
        this.ws.onmessage = function (msg) {
            let socketData = JSON.parse(msg.data)
            callback(socketData)
        }
    }
    // 实例方法(websocket连接成功)
    wsOpen() {
        console.log('websocket连接成功')
    }
    // 实例方法(websocket连接失败)
    wsError() {
        console.log('websocket连接出错')
    }
    //实例方法(websocket关闭)
    wsClose() {
        console.log('websocket关闭')
    }
}

export default Socket