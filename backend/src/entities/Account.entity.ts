import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ValueTransformer,
} from 'typeorm';
import { Customer } from './Customer.entity';

const accountNumberTransformer: ValueTransformer = {
  from: (value: number): string => {
    return value?.toString().padStart(10, '0') || '';
  },
  to: (value: any): any => {
    return value;
  },
};

export enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('accounts')
@Unique(['customerId']) 
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'bigint',
    unique: true,
    transformer: accountNumberTransformer,
  })
  accountNumber: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ unique: true })
  customerId: string;


  @ManyToOne(() => Customer, (customer) => customer.account)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
