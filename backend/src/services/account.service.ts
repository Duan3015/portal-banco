import { AppDataSource } from '../config/data-source';
import { Account, AccountStatus } from '../entities/Account.entity';
import { Customer } from '../entities/Customer.entity';
import { Repository } from 'typeorm';

export class AccountService {
  private accountRepository: Repository<Account>;
  private customerRepository: Repository<Customer>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(Account);
    this.customerRepository = AppDataSource.getRepository(Customer);
  }

  async create(data: {
    documentNumber: string;
    status?: AccountStatus;
  }): Promise<Account> {
    const customer = await this.customerRepository.findOne({
      where: { documentNumber: data.documentNumber },
    });

    if (!customer) {
      throw new Error('No existe un cliente con ese número de documento');
    }

    const existingAccount = await this.accountRepository.findOne({
      where: { customerId: customer.id },
    });

    if (existingAccount) {
      throw new Error('El cliente ya tiene una cuenta');
    }

    const account = this.accountRepository.create({
      customerId: customer.id,
      status: data.status || AccountStatus.ACTIVE,
    });

    const savedAccount = await this.accountRepository.save(account);

    customer.account = savedAccount;
    await this.customerRepository.save(customer);

    return savedAccount;
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      relations: ['customer'],
    });
  }

  async findByCustomerId(customerId: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { customerId },
      relations: ['customer'],
    });
  }
}
