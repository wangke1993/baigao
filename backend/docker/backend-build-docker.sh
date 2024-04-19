echo '-----------------------delete project-----------------------------'
#rm -ivrf ./baigao
echo '-----------------------clone project------------------------------'
git clone git@gitee.com:KMol/baigao.git
echo '-----------------------build backend------------------------------'
if [ "$PWD" == "/root" ]; then
	cd /root/workspace/baigao-node/backend
fi
cd baigao/backend
# 第一次拉取代码后，后续均用pull拉取最新代码
# git pull -f
yarn
yarn add sharp --ignore-engines
yarn build
# 注意！注意！：这里的env请存储到服务器，不要把生成环境相关密钥放到git仓库
cp docker/.env dist
cp -r node_modules dist
# https://blog.csdn.net/qq_41953872/article/details/124296209 滚动更新实践
echo '----------------------build docker image-------------------------'
docker build -t baigao:backend -f ./docker/Dockerfile ./
cd ../../
docker-compose -p baigao-backend up -d

echo '----------------------clear docker image-------------------------'

# 获取所有标记为 <none> 的镜像 ID
IMAGE_IDS=$(docker images -f "dangling=true" -q)

# 检查是否存在标记为 <none> 的镜像
if [ -z "$IMAGE_IDS" ]; then
  echo "No <none> tagged images found."
  exit 0
fi

# 删除标记为 <none> 的镜像
docker rmi $IMAGE_IDS
echo "Deleted <none> tagged images:"
echo $IMAGE_IDS