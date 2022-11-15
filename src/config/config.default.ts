import { MidwayConfig } from '@midwayjs/core';
import { Audit } from '../entity/Audit.entity';
import path from 'path';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '00544669988',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: path.join(__dirname, '../../data/test.sqlite'),
        synchronize: true,
        logging: true,

        // 配置实体模型 或者 entities: '/entity',
        entities: [Audit],
      },
    },
  },
} as MidwayConfig;
