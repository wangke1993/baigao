import io from "@hyoga/uni-socket.io";
import { getToken } from "./authToken";
let uri = "wss://tws.baigao.com";
const { envVersion } = __wxConfig;
if (envVersion == "develop") {
  uri = "ws://localhost:3001";
  // uri = "wss://tws.baigao.com";
} else if (envVersion == "trial") {
  uri = "wss://tws.baigao.com";
} else if (envVersion == "release") {
  uri = "wss://ws.baigao.com";
}
export const connect = () => {
  // TODO: 实时通讯机制,全局连接，哪儿需要，哪儿订阅
  let socket = io(uri, {
    query: {
      Authorization: `Bearer ${getToken()}`,
    },
    transports: ["websocket"],
    timeout: 5000,
  });
  socket.on("connect", () => {
    // ws连接已建立，此时可以进行socket.io的事件监听或者数据发送操作
    // 连接建立后，本插件的功能已完成，接下来的操作参考socket.io官方客户端文档即可
    console.log("ws 已连接");
    // socket.io 唯一连接id，可以监控这个id实现点对点通讯
    const { id } = socket;
    socket.on(id, (message) => {
      // 收到服务器推送的消息，可以跟进自身业务进行操作
      console.log("ws 收到服务器消息：", message);
    });
    setTimeout(() => {
      socket.emit(
        "message",
        { msg: "来自小程序的消息", user: "B" },
        { text: "abc" }
      );
    }, 2 * 1000);
  });
  socket.on("message", (msg) => {
    console.log("message", msg);
  });
  socket.on("disconnect", (msg) => {
    console.log("连接中断", msg);
    const tim = setTimeout(() => {
      // 重新连接
      socket.connect();
      clearTimeout(tim);
    }, 15 * 1000);
  });
};
