import { LighthouseConfig } from 'lighthouse';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

// TODO 修改成 I 开头
export interface AuditOptions {
  awaitAuditCompleted?: boolean;
  upTimeout?: number;
  chromePort?: number;
  chromePath?: string;
  lighthouseConfig?: LighthouseConfig;
}
