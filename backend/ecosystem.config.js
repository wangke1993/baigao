module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'BG-server',
      //TODO:修改为实际的地址
      script: 'main.js',
      // 副本数量（推荐于cpu核心数相同）
      instances: 4,
      exec_mode: 'cluster',
      env: { env: 'prod' },
    },
  ],
};
