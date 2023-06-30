echo '-----------------------delete project-----------------------------'
rm -ivrf ./baogao
echo '-----------------------clone project------------------------------'
git clone -b project/QianCuiShoppingMall https://KMol:Kmol2018@gitee.com/KMol/baogao.git
echo '-----------------------build backend------------------------------'
cd baogao/backend
yarn
yarn build
cp docker/.env dist
cp -r node_modules dist
echo '-----------------------choose version------------------------------'
declare -i n
declare str
strA=$(kubectl get po -n shopping -o yaml|grep qiancui-shopping:backend-2)
declare strB
strB="backend-2 -"
declare isTwo
isTwo=$(echo $strA | grep "${strB}")
if [[ "$isTwo" != "" ]]
then
	echo 'build 1'
	n=1
else
	n=2
	echo 'build 2'
fi
echo '----------------------build docker image-------------------------'
docker build -t qiancui-shopping:backend-${n} -f ./docker/Dockerfile ./
echo '----------------------deploy pod---------------------------------'
cd ../../
kubectl apply -f /root/project/deploy-back/deploy-backend${n}.yaml
