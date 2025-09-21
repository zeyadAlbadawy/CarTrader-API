import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, MiddlewareBuilder } from '@nestjs/core';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
const cookieSession = require('cookie-session');
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    // There are two steps to config .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //put the validation pipe inside the appModule so that while e2e testing this will be instanitated
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // Middleware that applies to all routers
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['123'],
        }),
      )
      .forRoutes('*');
  }
}
