import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './Account.entity';

export enum DocumentType {
  CC = 'CC',
  CE = 'CE',
  PAS = 'PAS',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Column({ unique: true })
  documentNumber: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Account, (account) => account.customer, { nullable: true })
  @JoinColumn()
  account?: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
