import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();

interface Config {
  environment: string;
  servicePort: string;
  dbUri: string;
  dbName: string;
  dbProd: string;
  jwtSecret: string;
  jwtSecretAdmin: string;
  rabbitHost: string;
  spacesBucketName: string;
  spacesUrl: string;
  spacesEndpoint: string;
  masterWebhookUrl: string;
  aws: {
    endpoint: string;
    region: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  redisHost: string;
  redisPort: string;
  redisPassword: string;
}

@Injectable()
export class ConfigService {
  private config = {} as Config;
  constructor() {
    this.config.environment = process.env.NODE_ENV;
    this.config.servicePort = process.env.PORT;
    this.config.dbUri = process.env.DB_URI;
    this.config.dbName = process.env.DB_NAME;
    this.config.jwtSecret = process.env.JWT_SECRET;
    this.config.jwtSecretAdmin = process.env.JWT_SECRET_ADMIN;
    this.config.rabbitHost = process.env.RABBIT_HOST;
    this.config.spacesBucketName = process.env.DO_SPACES_BUCKET_NAME;
    this.config.spacesUrl = process.env.DO_SPACES_URL;
    this.config.spacesEndpoint = process.env.DO_SPACES_ENDPOINT;
    this.config.aws = {
      endpoint: process.env.DO_SPACES_ENDPOINT,
      region: process.env.DO_SPACES_REGION,
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
      },
    };
    this.config.dbProd = process.env.DB_NAME_PRODUCTION;
    this.config.masterWebhookUrl = process.env.MASTER_WEBHOOK_URL;
    this.config.redisHost = process.env.REDIS_HOST;
    this.config.redisPort = process.env.REDIS_PORT;
    this.config.redisPassword = process.env.REDIS_PASSWORD;
  }

  public get(key: keyof Config): any {
    return this.config[key];
  }
}
