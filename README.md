# 柏高（BaiGao）

## 介绍
基于nestJs+mongoDB+vue3+element-plus+uni-app技术栈的大前端后台管理系统；可基于当前系统快速构建toG、toB、toC常见业务系统；经过商业项目验证，可放心食用；
## 亮点介绍
### 1.大前端生态，node全栈开发
	nestJs+ts：nestJs可以理解为node生态中的spring
	vue3+ts+element：高效、高性能的前端框架和UI
	mongoDB：高性能、分布式noSql数据库
### 2.代码优先
	模型字段变动，无需关注数据库，直接修改模型即可
### 3.云原生
	全链路docker部署
### 4.api转function,省时、省事、省心、不吵架
	根据swagger将api生成为可调用的函数，更便捷的对接后端接口，更高效的同步后端接口变更，包含注释，权限标识及相关DTO
	vue3：ts格式，封装axios
	uni-app：js格式，封装uni.request
	
### 5.超低内存占用，不吃内存；
### 6.常用功能集成，拿来就用，不重复造轮子
## 功能清单及规划
<!-- ![功能清单及规划](./detail.png) -->
## 怎么部署
### 1.安装docker（windows请打开wsl功能，并升级到wsl2，然后再安装docker）,警告！警告！警告！（生产环境请先将数据盘挂载到/var/lib/docker）
### 2.部署mongoDB，主从部署（mongoDB事务必须采用主从方式），警告！警告！警告！（mongoDB正式环境请不要暴露到公网，不要使用默认端口27017，数据无价记得定期备份）
	# 启动主节点
	docker run -d -p 27017:27017 --name mongodb-primary -v ./primary-data:/data/db mongo:6.0.5 --replSet mongo-rep
	# 启动从节点
	docker run -d -p 27018:27017 --name mongodb-secondary -v ./secondary-data:/data/db mongo:6.0.5 --replSet mongo-rep
	# 进入主节点，并配置主从、用户及数据库等
	docker exec -it mongodb-primary /bin/bash
	mongosh
	# 配置主从节点，此处ip换成自己宿主机的ip
	rs.initiate({_id:"mongo-rep", version:1, members:[{_id:0, host:"192.168.1.2:27017", priority:6}, {_id:1, host:"192.168.1.2:27018", priority:3}]})
	# 创建数据库
	use baigao
	# 创建用户
	db.createUser({user:'baigao',pwd:'123456',roles:[{role:'dbOwner',db:'baigao'}]});
	# 授权用户
	db.auth("baigao","123456");
	# mongoDB部署结束，退出容器即可
	# 使用navcat连接到数据库，使用/backend/dbbak/baigao.js进行数据库恢复即可使用,默认账号：baigai 密码：123456

### 3.部署redis
	# 创建redis.conf，内容如下
	requirepass 123456
	# 部署docker
	docker run --name=redis --volume=./redis.conf:/usr/local/etc/redis/redis.conf --volume=./data:/data --workdir=/data -p 6379:6379 --restart=no --detach=true redis redis-server /usr/local/etc/redis/redis.conf --appendonly yes
### 4.部署服务端到服务器
```
0.前置条件：
	nodejs：v16.20.0
	git：version 2.39.1
	Docker: version 24.0.1, build 6802122
	Docker Compose： version v2.18.1

1.创建文件夹：file用于存储数据库文件
	mkdir -p file/private
	mkdir -p file/public

2.创建docker-compose.yml
version: '3.8'
services:
    app:
       image: 'youProject:backend'
       restart: unless-stopped
       ports:
          - '3001:3001'
       volumes:
          - /var/lib/docker/workspace/backend/file/private:/dist/private
          - /var/lib/docker/workspace/backend/file/public:/dist/public

3.创建并运行backend-build-docker.sh

echo '-----------------------delete project-----------------------------'
#rm -ivrf ./baigao
echo '-----------------------clone project------------------------------'
git clone -b project/youProject git@github.com:wangke1993/baigao.git
echo '-----------------------build backend------------------------------'
cd baigao/backend
# 第一次拉取代码后，后续均用pull拉取最新代码
# git pull -f
yarn
yarn build
# 注意！注意！：这里的env请存储到服务器，不要把生成环境相关密钥放到git仓库
cp docker/.env dist
cp -r node_modules dist
# https://blog.csdn.net/qq_41953872/article/details/124296209 滚动更新实践
echo '----------------------build docker image-------------------------'
docker build -t youProject:backend -f ./docker/Dockerfile ./
cd ../../
docker-compose -p youProject-backend up -d
```
### 5.部署前端到服务器
```
1.创建docker-compose.yml
version: '3.8'
services:
    app:
       image: 'baigao:frontend'
       restart: unless-stopped
       ports:
          - '88:80'
          - '89:81'
2.创建并运行fontend-build-docker.sh
echo '-----------------------delete project-----------------------------'
# rm -ivrf ./baogao
echo '-----------------------clone project------------------------------'
git clone -b project/youProject git@github.com:wangke1993/baigao.git
echo '-----------------------build front--------------------------------'
cd baogao/frontend
# 第一次拉取代码后，后续均用pull拉取最新代码
# git pull -f
yarn
yarn build-only
echo '----------------------build docker image-------------------------'
docker build -t youProject:frontend -f ./docker/Dockerfile ./
echo '----------------------deploy pod---------------------------------'
cd ../../
docker-compose -p youProject-frontend up -d
```
### 6.部署onlyOffice(可选，会占用较大硬盘空间，请提前规划好存储方案)
```
docker run --name=onlyoffice -i -t -d -p 666:80 -v ./logs:/var/log/onlyoffice -v ./data:/var/www/onlyoffice/Data onlyoffice/documentserver
关闭token验证
进入容器：
docker exec -it onlyoffice /bin/bash
cd /etc/onlyoffice/documentserver
sed -i 's/true/false/g' local.json
supervisorctl restart all
```
### 7.部署nginx-proxy-manager用户域名映射及ssl部署（可选）
```
1.创建docker-compose.yml
version: '3.8'
services:
    app:
       image: 'jc21/nginx-proxy-manager:latest' // 汉化：chishin/nginx-proxy-manager-zh:latest
       restart: unless-stopped
       ports:
          - '80:80'
          - '81:81'
          - '443:443'
       volumes:
          - ./data:/data
          - ./letsencrypt:/etc/letsencrypt
2.docker-compose up -d
```

## 工具推荐
源切换：nrm \
node版本管理：nvm

## 版本说明
当前版本：1.0 \
发布时间：2023-6-30 \
关键词：nestJs、vue3、ts、mongoDB、uni-app、element-plus、微信生态、大前端、云原生
## 尾巴
挑刺使人进步，欢迎大佬们多提意见、建议，多挑刺，多找茬；
## 技术交流，进群请加微信
手机号（微信同号）：17612702450 \
加微请备注：柏高