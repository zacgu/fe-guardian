import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuditStatus {
  RUNNING = 'RUNNING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

@Entity('audit')
export class Audit {
  // 自增主键
  @PrimaryGeneratedColumn()
  id: number;

  // 创建的时候 自动更新
  @CreateDateColumn({
    type: 'datetime',
  })
  timeCreated: Date;

  // 更新的时候 自动更新
  @UpdateDateColumn({
    type: 'datetime',
  })
  timeCompleted?: Date;

  @Column({
    default: 'NO NAME',
  })
  name: string;

  @Column()
  host: string;

  @Column()
  url: string;

  // TODO 看看能不能变成 json 或者 LHP
  @Column({ type: 'simple-json', nullable: true })
  report?: string;

  // 状态
  @Column()
  status: AuditStatus;

  constructor(name, host, url) {
    this.name = name;
    this.host = host;
    this.url = url;
    this.status = AuditStatus.RUNNING;
  }
}
