const ci = require("miniprogram-ci");
(async () => {
  const project = new ci.Project({
    appid: "wx4eabb7169991c923",
    type: "miniProgram",
    projectPath: "dist/build/mp-weixin",
    privateKeyPath: "deploy/private",
    ignores: ["node_modules/**/*"],
  });
  // 每次发布这里需要修改一下
  const uploadResult = await ci.upload({
    project,
    version: "2.2.668",
    desc: "测试cicd流程",
    setting: {
      es6: true,
    },
    onProgressUpdate: console.log,
  });
  console.log("上传结果", { uploadResult });
})();
