echo '-----------------------delete project-----------------------------'
#rm -ivrf ./baigao
echo '-----------------------clone project------------------------------'
#git clone git@gitee.com:KMol/baigao.git
echo '-----------------------build front--------------------------------'
if [ "$PWD" == "/root" ]; then
        cd /root/workspace/baigao-node/frontend
fi
cd baigao/wechat
# 第一次拉取代码后，后续均用pull拉取最新代码
git clean -f -d
git reset --hard HEAD
git pull -f
yarn
npm install miniprogram-ci --save
echo '---------------------- build -------------------------------------'
yarn build
echo '---------------------- mv custom-tab-bar -------------------------'
rm -ivrf dist/build/mp-weixin/custom-tab-bar/*
cp dist/build/mp-weixin/pages/custom-tab-bar/* dist/build/mp-weixin/custom-tab-bar
echo '---------------------- upload ------------------------------------'
node upload-code.js
