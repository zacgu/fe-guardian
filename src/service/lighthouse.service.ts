import { Provide } from '@midwayjs/decorator';

import { AuditOptions } from '../interface';
import { triggerAudit, checkURLIsAvailable } from '../core/lighthouse';
import { Audit, AuditStatus } from '../entity/Audit.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

// 初始化路径
const DEFAULT_UP_TIMEOUT = 30000;
const DEFAULT_CHROME_PORT = 9222;
const DEFAULT_CHROME_PATH = process.env.CHROME_PATH;

@Provide()
export class LighthouseService {
  @InjectEntityModel(Audit)
  auditModel: Repository<Audit>;

  async run(
    name: string,
    url: string,
    wait: boolean,
    options: AuditOptions = {}
  ) {
    // 判断 url 的有效性
    if (!url) {
      throw new Error('No URL provided. URL is required for auditing.');
    }

    if (!/^https?:\/\//.test(url))
      throw new Error(
        `URL "${url}" does not contain a protocol (http or https).`
      );

    // 入口一个新的记录
    const audit = new Audit(name, new URL(url).host, url);
    await this.auditModel.save(audit);

    const {
      upTimeout = DEFAULT_UP_TIMEOUT,
      chromePort = DEFAULT_CHROME_PORT,
      chromePath = DEFAULT_CHROME_PATH,
      lighthouseConfig = {},
    } = options;

    // 检查 url 是否可达
    try {
      await checkURLIsAvailable(url, upTimeout);
    } catch (e) {
      audit.status = AuditStatus.FAILED;
      await this.auditModel.save(audit);
      // TODO 缺个log
      return {
        result: 'fail',
      };
    }

    if (!wait) {
      triggerAudit(url, chromePort, chromePath, lighthouseConfig)
        .then(result => {
          audit.report = result;
          audit.status = AuditStatus.COMPLETED;
          this.auditModel.save(audit);
        })
        .catch(() => {
          audit.status = AuditStatus.FAILED;
          this.auditModel.save(audit);
        });
      return new Promise(resolve => resolve('done'));
    }

    try {
      audit.report = await triggerAudit(
        url,
        chromePort,
        chromePath,
        lighthouseConfig
      );
      audit.status = AuditStatus.COMPLETED;
    } catch (e) {
      audit.status = AuditStatus.FAILED;
    } finally {
      await this.auditModel.save(audit);
    }

    return audit.report;
  }

  async test() {
    return 'test';
  }
}
