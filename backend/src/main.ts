import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { createUploadDir } from './file-upload/utils/file-tools';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public');

  // #region 初始化swagger
  createUploadDir();
  const {
    npm_package_name: APP_NAME,
    npm_package_version: APP_VERSION,
    JWT_SECRET,
    env
  } = process.env;
  // #endregion
  if (env == 'dev') {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(APP_NAME)
      .setVersion(APP_VERSION)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup("swagger", app, document);
  }
  app.use(
    session({
      secret: JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // #region 基础安全配置及访问限制配置
  //避免常见请求头攻击
  app.use(helmet());
  //信任proxy设置的头文件
  app.set('trust proxy', 1);
  //限速每个ip固定时间内仅能访问多少次
  // 限制：同一个ip，20次/秒
  // app.use(
  //   rateLimit({
  //     // 1 分钟
  //     windowMs: 1 * 1000,
  //     // 每个ip最多：max次/windowMs毫秒
  //     max: 20,
  //   }),
  // );
  //开启跨域
  app.enableCors();
  // #endregion

  await app.listen(3001);
  if (env == 'dev') {
    logger.verbose('SWAGGER：http://localhost:3001/swagger');
    logger.verbose('SWAGGER-JSON：http://localhost:3001/swagger-json');
  }
}
bootstrap();
