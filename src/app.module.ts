import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { OtpService } from './otp/otp.service';
import { OtpModule } from './otp/otp.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //MongooseModule.forRoot('mongodb://localhost:27017/nest_ecommerce'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    OtpModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService, OtpService, S3Service],
})
export class AppModule {}
