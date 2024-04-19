const net = require('net');
let server_host = "127.0.0.1"
let client;
let client_xt={
	old_xt_time:0,//上一次心跳
	heart_time:null,//心跳定时器
	heart_healthy_time:null,//心跳健康检测定时器
	old_xt_state:true, //上一次心跳健康情况
	xt_check_time:2*1000 //心跳检测间隔
}
let global_conf = {
	token: "j%SDFP8GrcSM!75s8XyAKYRHyEUy3^4H", //连接密钥
	register_server: { //【客户端注册服务】配置
		host: server_host, // ip
		port: 6001 // 端口
	},
	response_mapping: { //【响应映射服务】配置
		host: server_host, // ip
		port: 6002 // 端口
	},
	local_server: { //【本地服务】映射
		"backend": {
			local_host: "localhost", // ip
			local_port: 3001, // 本地端口
			service_port: 6003 // 服务器映射
		}
	}
}

/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：客户端注册
 */
function client_register() {
	client = net.createConnection({
		port: global_conf.register_server.port,
		host: global_conf.register_server.host
	}, () => {
		let data = {
			token: global_conf.token,
			local_server: global_conf.local_server
		}
		client.write(JSON.stringify(data)+";");
		console.log("【客户端】成功上线")
		//开启心跳
		//10秒向【服务端】发送要给心跳包
		client_xt.heart_time = setInterval(() => {
			//10秒向【服务端】发送要给心跳包
			client.write(JSON.stringify({
				"xt_time": parseInt(new Date().getTime() / 1000) + '',
				"type":"xt"
				})+";");
		}, client_xt.xt_check_time);
		client_xt.old_xt_state=true;
		//开启心跳检测
		client_xt.heart_healthy_time = setInterval(() => {
			//收不到心跳包则重新连接
			if (client.readyState == "closed") {
				if(!!client)
				{
					client.destroy();
				}
				//清除定时器
				//清除定时器
				if(!!client_xt.heart_healthy_time)
				{
					clearInterval(client_xt.heart_healthy_time);
				}
				if(!!client_xt.heart_time)
				{
					clearInterval(client_xt.heart_time);
				}
				client_xt.old_xt_time=0;
				console.log(`122:[${(new Date()).toLocaleString()}] 正在重新连接服务器...`);
				main();
			}
			//判断之前记录的【服务器心跳】是否大于10秒，大于
			console.log("服务端心跳:"+client_xt.old_xt_time+":"+client_xt.old_xt_state);
			if((client_xt.old_xt_time!=0)&&!client_xt.old_xt_state)
			{
				console.log(`服务器连接不健康，重新开始连接${parseInt(new Date().getTime() / 1000)}-${client_xt.old_xt_time}=${parseInt(new Date().getTime() / 1000) - client_xt.old_xt_time}`);
				//清除定时器
				if(!!client_xt.heart_healthy_time)
				{
					clearInterval(client_xt.heart_healthy_time);
				}
				if(!!client_xt.heart_time)
				{
					clearInterval(client_xt.heart_time);
				}
				if(!!client)
				{
					client.destroy();
				}
				main();
			}
			if(client_xt.old_xt_state)
			{
				old_xt_state = false;
			}
		}, client_xt.xt_check_time);
	});
	client.setTimeout(1000);
}
/**
 * 作者：王克
 * 时间：2020年11月20日
 * 功能：【本地服务】映射
 */
function local_server_mapping() {
	client.on('data', (data) => {
		try {
			let data_arr = data.toString().substring(0,data.toString().length-1).split(";");
			for (let item in data_arr) {
				item = JSON.parse(data_arr[item]);
				if(item.type=="xt")
				{
					//接受心跳
					client_xt.old_xt_time = item.xt_time;
					client_xt.old_xt_state = true;
					console.log("【服务器】心跳时间："+client_xt.old_xt_time);
				}else{
					console.log("【客户端】响应控制", item.toString())
					let server_mapping = net.createConnection({
						port: global_conf.response_mapping.port,
						host: global_conf.response_mapping.host
					}, () => {
						let local_server = net.connect({
							port: global_conf.local_server[item.name].local_port,
							host: global_conf.local_server[item.name].local_host
						}, () => {
							//将请求的数据接到客户端中
							local_server.pipe(server_mapping);
						});
						local_server.on('error', (err) => {
							console.log("【本地映射】连接出错", err)
						});
						server_mapping.pipe(local_server);
						server_mapping.write(JSON.stringify(item)+";");
					});
					server_mapping.on('error', (err) => {
						console.log("【服务映射】连接出错", err)
					});
				}
			}
		} catch (err) {
			console.log("映射错误", err)
		}
	});
}

function client_error() {
	client.on('error', (err) => {
		console.log("【客户端】连接出错", err)
		console.log("重新连接服务器......")
		//清除定时器
		if(!!client_xt.heart_healthy_time)
		{
			clearInterval(client_xt.heart_healthy_time);
		}
		if(!!client_xt.heart_time)
		{
			clearInterval(client_xt.heart_time);
		}
		if(!!client)
		{
			client.destroy();
		}
		client = null;
		setTimeout(main, 500);
	});
}

function main() {
	client_register();
	local_server_mapping();
	client_error();
}
main();

