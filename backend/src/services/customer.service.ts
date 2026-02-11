import { AppDataSource } from '../config/data-source';
import { Customer, DocumentType } from '../entities/Customer.entity';
import { Repository } from 'typeorm';

export class CustomerService {
  private repository: Repository<Customer>;

  constructor() {
    this.repository = AppDataSource.getRepository(Customer);
  }

  async create(data: {
    documentType: DocumentType;
    documentNumber: string;
    fullName: string;
    email: string;
  }): Promise<Customer> {
    const existingByDocument = await this.repository.findOne({
      where: { documentNumber: data.documentNumber },
    });

    if (existingByDocument) {
      throw new Error('El número de documento ya existe');
    }

    const existingByEmail = await this.repository.findOne({
      where: { email: data.email },
    });

    if (existingByEmail) {
      throw new Error('El email ya existe');
    }

    const customer = this.repository.create(data);
    return await this.repository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.repository.find({
      relations: ['account'],
    });
  }
}
