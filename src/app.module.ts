import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { PodcastsModule } from './podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './podcast/entities/podcast.entity';
import { Episode } from './podcast/entities/episode.entity';
import { Review } from './podcast/entities/review.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: true,
      logging:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
      entities: [Podcast, Episode, User, Review],
      ssl: { rejectUnauthorized: false },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => {
        return { user: req['user'] };
      },
      playground: true,
      introspection: true,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    PodcastsModule,
    UsersModule,
    AuthModule,
    UploadsModule.forRoot({
      bucketName: process.env.BUCKET_NAME,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
