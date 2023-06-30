import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { createUploadDir } from './file-upload/utils/file-tools';
import { Logger } from '@nestjs/common';
const fs = require('fs');
async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public');

  // #region 初始化swagger
  createUploadDir();
  const APP_NAME = process.env.npm_package_name;
  const APP_VERSION = process.env.npm_package_version;
  const swaggerOptions = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setVersion(APP_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  fs.writeFileSync("./public/apiDoc.json", JSON.stringify(document));
  SwaggerModule.setup("apiDoc", app, document);
  // #endregion

  // #region 基础安全配置及访问限制配置
  //避免常见请求头攻击
  app.use(helmet());
  //信任proxy设置的头文件
  app.set('trust proxy', 1);
  //限速每个ip固定时间内仅能访问多少次
  // app.use(
  //   rateLimit({
  //     // 1 分钟
  //     windowMs: 1 * 60 * 1000,
  //     // 每个ip最多：max次/windowMs毫秒
  //     max: 200,
  //   }),
  // );
  //开启跨域
  app.enableCors();
  // #endregion
  
  await app.listen(3001);
  logger.verbose('SWAGGER：http://localhost:3001/apiDoc')
  logger.verbose('SWAGGER-JSON：http://localhost:3001/apiDoc.json')
}
bootstrap();
