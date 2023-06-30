echo '-----------------------delete project-----------------------------'
rm -ivrf ./baogao
echo '-----------------------clone project------------------------------'
git clone -b project/QianCuiShoppingMall https://KMol:Kmol2018@gitee.com/KMol/baogao.git
echo '-----------------------build front--------------------------------'
cd baogao/frontend
yarn
yarn build-only
echo '-----------------------choose version------------------------------'
declare -i n
declare str
strA=$(kubectl get po -n shopping -o yaml|grep qiancui-shopping:frontend-2)
declare strB
strB="frontend-2 -"
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
docker build -t qiancui-shopping:frontend-${n} -f ./docker/Dockerfile ./
echo '----------------------deploy pod---------------------------------'
cd ../../
kubectl apply -f /root/project/deploy-front/deploy-frontend${n}.yaml
