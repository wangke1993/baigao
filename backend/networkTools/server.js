/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：内网穿透模块服务端
 */
const net = require('net');
//全局数据
let global_data = {
  client_reg_service: null, //【客户端注册】监听器：1.用户注册专用
  client: null, //【客户端】：1.存储当前连接客户端
  client_response_server: null, //【客户端映射响应】监听器：1.将请求的内网【响应】赋值给【请求套件】，用于连接请求；2.把内网的【响应】返回给外网的请求;
  request_control_server: null, //【请求控制】监听器：1.接受请求；2.通知【客户端收到请求】3.连接【客户端映射响应】
  request_list: {}, //【请求套件】容器：
  request_temp_list: [], //临时请求队列
  /*【客户端】容器：1.存储客户端及客户端配置：
	【客户端】ID：{
				client:客户端,
				client_xt:{
					heart_rate：上一次心跳
					heart_time：心跳定时器
					heart_healthy：心跳健康检查定时器
					heart_state：心跳健康状态
				},
				local_server:客户端映射服务,
				request_listen_list:{name:【请求监听器】},
				request_list:{name:【请求套件】容器}
				}
	*/
  client_list: {},
};
//全局配置
let global_conf = {
  token: 'j%SDFP8GrcSM!75s8XyAKYRHyEUy3^4H',
  xt_check_time: 5 * 1000, //心跳检测时间
  client_reg_service: {
    //【客户端注册】配置
    host: '0.0.0.0', //【客户端注册】监听IP
    port: 6001, //【客户端注册】监听端口
  },
  client_response_server: {
    //【请求映射响应】配置
    host: '0.0.0.0', //【请求映射响应】监听IP
    port: 6002, //【请求映射响应】监听端口
  },
};

/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：【请求映射响应】，一个请求对应一个响应socket
 */
function response_mapping() {
  //监听映射请求
  global_data.client_response_server = net
    .createServer((c) => {
      let client_id = null;
      c.on('data', (data) => {
        try {
          let data_arr = data
            .toString()
            .substring(0, data.toString().length - 1)
            .split(';');
          for (let item in data_arr) {
            item = JSON.parse(data_arr[item]);
            client_id = item.client_id;
            global_data.client_list[item.client_id].request_list[item.name][
              item.req_id
            ].ret_c = c;
          }
        } catch (err) {
          // console.log("-----------响应错误------------",err);
        }
      });
      if (!!client_id) {
        c.on('error', (err) => {
          console.error(`[ERROR] -  ${err}`);
          c.destroy();
          //客户端下线
          client_offline(client_id);
        });
      }
    })
    .listen(
      {
        host: global_conf.client_response_server.host,
        port: global_conf.client_response_server.port,
      },
      () => {
        console.info(
          `[INFO] - 【请求映射响应】监听开启 ： ${global_conf.client_response_server.host}:${global_conf.client_response_server.port}`,
        );
      },
    );
}
/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：【请求监听控制】，接受请求 -----> 通知客户端有新的请求 -----> 客户端连接本地接口及服务器接口 ----> 服务器收到接口 ----> 与当前请求接通数据
 */
function request_control_listen(client_id) {
  for (let name in global_data.client_list[client_id].local_server) {
    global_data.client_list[client_id].request_listen_list[name] = net
      .createServer((c) => {
        //创建【请求ID】
        let req_id = [c.remoteAddress, c.remoteFamily, c.remotePort].join('_');
        //存储【请求套件】
        let a = global_data.client_list[client_id].request_list[name];
        global_data.client_list[client_id].request_list[name] = { ...a, ...{} };
        global_data.client_list[client_id].request_list[name][req_id] = {
          req_c: c, //请求socket
          ret_c: null, //响应socket
        };
        //发起【映射请求】
        let client_req_local = {
          client_id: client_id, //客户端id
          req_id: req_id, //请求id
          name: name, //所属配置
          date: new Date(),
        };
        //加入临时请求队列
        global_data.request_temp_list.push(client_req_local);
        setTimeout(mapping, 35 * global_data.request_temp_list.length);
        function mapping() {
          console.log(
            '--------------请求队列长度：',
            global_data.request_temp_list.length,
          );
          if (global_data.request_temp_list.length > 0) {
            let temp_client_req_local = global_data.request_temp_list.shift();
            let temp_client_id = temp_client_req_local.client_id;
            let temp_req_id = temp_client_req_local.req_id;
            // console.log("请求响应", JSON.stringify(temp_client_req_local))
            global_data.client_list[temp_client_id].client.write(
              JSON.stringify(temp_client_req_local) + ';',
            );
            //递归检测【请求映射】是否获取成功
            function click_ret_c() {
              if (!!global_data.client_list[temp_client_id]) {
                if (
                  global_data.client_list[temp_client_id].request_list[name][
                    temp_req_id
                  ]['ret_c'] != null
                ) {
                  let req =
                    global_data.client_list[temp_client_id].request_list[name][
                      temp_req_id
                    ].req_c; //请求socket
                  let ret =
                    global_data.client_list[temp_client_id].request_list[name][
                      temp_req_id
                    ]['ret_c']; //响应socket
                  //资源对接
                  req.pipe(ret);
                  //将客户端的数据接到当前请求中
                  ret.pipe(req);
                  ret.on('error', (err) => {
                    //read ECONNRESET 主动中断
                    console.error(`[ERROR] - ret:${err}`);
                    req.destroy();
                    //请求失效清空当前请求套件
                    console.log('[INFO] -  删除【请求套件】' + temp_req_id);
                    if (!!global_data.client_list[temp_client_id]) {
                      delete global_data.client_list[temp_client_id]
                        .request_list[name][temp_req_id];
                    }
                    console.log(
                      '[INFO] -  【请求套件】数量' +
                        temp_req_id +
                        '：' +
                        global_data.client_list.length,
                    );
                  });
                  req.on('error', (err) => {
                    console.error(`req [ERROR] -  req:${err}`);
                    ret.destroy();
                    //请求失效清空当前请求套件
                    console.log('[INFO] -  删除【请求套件】' + temp_req_id);
                    if (!!global_data.client_list[temp_client_id]) {
                      delete global_data.client_list[temp_client_id]
                        .request_list[name][temp_req_id];
                    }
                  });
                } else {
                  //等待100ms后再检测
                  setTimeout(click_ret_c, 100);
                }
              }
            }
            click_ret_c();
          }
        }
      })
      .listen(
        {
          host: '0.0.0.0',
          port: global_data.client_list[client_id].local_server[name]
            .service_port,
        },
        () => {
          console.info(
            `[INFO] - 【请求监听】监听器启动： 0.0.0.0:${global_data.client_list[client_id].local_server[name].service_port}`,
          );
        },
      );
    let my_server =
      global_data.client_list[client_id].request_listen_list[name];
    let PORT =
      global_data.client_list[client_id].local_server[name].service_port;
    my_server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log('地址正被使用，重试中...');
        setTimeout(() => {
          my_server.close();
          my_server.listen(PORT, '0.0.0.0');
        }, 1000);
      }
    });
  }
}
/**
 * 作者：王克
 * 时间：2020年11月23日
 * 功能：客户端下线触发
 */
function client_offline(client_id) {
  try {
    if (!!global_data.client_list[client_id]) {
      //关闭所有【请求监听】
      for (let name in global_data.client_list[client_id].request_listen_list) {
        global_data.client_list[client_id].request_listen_list[name].close();
      }
      //关闭所有定时器
      clearInterval(global_data.client_list[client_id].client_xt.heart_time);
      clearInterval(global_data.client_list[client_id].client_xt.heart_healthy);
      //删除【客户端】
      console.log('[INFO] -  删除【客户端】' + client_id);
      delete global_data.client_list[client_id];
      console.log('[INFO] -  【客户端】下线' + client_id);
      console.log(
        '[INFO] -  【客户端】数量：' +
          Object.keys(global_data.client_list).length,
      );
    }
  } catch (e) {
    console.log(global_data.client_list[client_id]);
    //TODO handle the exception
    console.log(e);
  }
}
/**
 * 作者：王克
 * 时间：2020年11月24日
 * 功能：【客户端】心跳检测
 */
function clientHealthy(client_id) {
  //每10秒检查一次，当前时间-客户端心跳==1则健康
  if (global_data.client_list[client_id].client_xt.heart_state) {
    console.log(
      `207:[${new Date().toLocaleString()}] 客户端${client_id}健康${
        global_data.client_list[client_id].client_xt.heart_state
      }`,
    );
    global_data.client_list[client_id].client_xt.heart_state = false;
  } else {
    console.log(
      `211:[${new Date().toLocaleString()}] 客户端${client_id}心跳停止${parseInt(
        new Date().getTime() / 1000,
      )}-${global_data.client_list[client_id].client_xt.heart_rate}=${
        parseInt(new Date().getTime() / 1000) -
        global_data.client_list[client_id].client_xt.heart_rate
      }`,
    );
    if (global_data.client_list[client_id].client) {
      global_data.client_list[client_id].client.destroy();
    }
    client_offline(client_id);
  }
}
/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：【客户端注册】，监听客户端的注册连接
 */
function client_register() {
  global_data.client_reg_service = net
    .createServer((c) => {
      let client_id = [c.remoteAddress, c.remoteFamily, c.remotePort].join('_');
      c.on('data', (data) => {
        try {
          let data_arr = data
            .toString()
            .substring(0, data.toString().length - 1)
            .split(';');
          data = JSON.parse(data_arr[0]);
          if (data.type == 'xt') {
            global_data.client_list[client_id].client_xt.heart_rate =
              data.xt_time;
            global_data.client_list[client_id].client_xt.heart_state = true;
            console.log(
              `238:[${new Date().toLocaleString()}] 客户端${client_id}的心跳：`,
              global_data.client_list[client_id].client_xt.heart_rate,
            );
          } else if (data.token == global_conf.token) {
            console.log('[INFO] -  【客户端】上线：', client_id);
            global_data.client_list[client_id] = {
              client: c,
              local_server: data.local_server,
            };
            global_data.client_list[client_id].request_listen_list = {};
            global_data.client_list[client_id].request_list = {};
            //注册监听事件
            request_control_listen(client_id);
            console.log(
              '[INFO] -  【客户端】数量：' +
                Object.keys(global_data.client_list).length,
            );

            //开启心跳_Start-------------------
            global_data.client_list[client_id].client_xt = {
              heart_rate: parseInt(new Date().getTime() / 1000),
              heart_time: setInterval(() => {
                //10秒向【客户端】发送要给心跳包
                console.log('[INFO] -  发送心跳包给【客户端】' + client_id);
                if (!!global_data.client_list[client_id].client) {
                  c.write(
                    JSON.stringify({
                      xt_time:
                        global_data.client_list[client_id].client_xt.heart_rate,
                      type: 'xt',
                    }) + ';',
                  );
                }
              }, global_conf.xt_check_time),
              heart_healthy: setInterval(() => {
                //每10秒检测【客户端心跳状况】
                clientHealthy(client_id);
              }, global_conf.xt_check_time),
              heart_state: true,
            };
            //开启心跳_END-------------------
          } else {
            console.log('[INFO] -  密钥错误');
            c.destroy();
          }
        } catch (err) {
          console.log('[ERROR] -  注册错误', err);
          console.log(data.toString());
          c.destroy();
        }
      });
      c.on('error', (err) => {
        console.error(`[ERROR] -  ${err}`);
        c.destroy();
        //删除客户端
        client_offline(client_id);
      });
    })
    .listen(
      {
        host: global_conf.client_reg_service.host,
        port: global_conf.client_reg_service.port,
      },
      () => {
        console.info(
          `[INFO] - 【客户端注册】监听器启动： ${global_conf.client_reg_service.host}:${global_conf.client_reg_service.port}`,
        );
      },
    );
}
/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：按顺序启动监听器
 */
function main() {
  //启动【客户端注册】监听
  client_register();
  //启动【请求映射响应】监听
  response_mapping();
}

//------------启动程序----------
try {
  main();
} catch (e) {
  //TODO handle the exception
  console.log('运行异常：', e);
}

//------------启动程序----------
