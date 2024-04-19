const ci = require("miniprogram-ci");

(async () => {
  console.log("开始上传.....");
  const project = new ci.Project({
    appid: "xxxxxxx",
    type: "miniProgram",
    projectPath: `${__dirname}/dist/build/mp-weixin`,
    privateKeyPath: `${__dirname}/deploy/private/private.wx.key`,
  });
  try {
    await ci.upload({
      project,
      robot: 1,
      // FIXME:小程序代码如果有变更，发布的时候在这里更新版本和备注
      version: "1.0.0",
      desc: "本次上传了哪些内容",
      setting: {
        es6: true,
      },
      onProgressUpdate: console.log,
    });
    console.log("上传成功");
    console.log(
      "前往发布: https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?lang=zh_CN"
    );
  } catch (e) {
    console.error("上传错误", e);
  }
})();
