import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AuthModule, UserModule,RoleModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Admin',
      database: 'HRConnect',
      autoLoadEntities: true,
      synchronize: true,
    }
  )],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
},],
})
export class AppModule {}
