import { DataSource } from 'typeorm';
import { Customer } from '../entities/Customer.entity';
import { Account } from '../entities/Account.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5434'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, Account],
  synchronize: false, 
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  logging: false,
});

export async function setupAccountNumberSequence(): Promise<void> {
  try {
    await AppDataSource.query(`
      CREATE SEQUENCE IF NOT EXISTS account_number_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `);

    await AppDataSource.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'accounts') THEN
          ALTER TABLE accounts 
          ALTER COLUMN "accountNumber" 
          SET DEFAULT nextval('account_number_seq');
        END IF;
      END $$;
    `);

    console.log('Secuencia account_number_seq configurada');
  } catch (error) {
    console.warn('No se pudo configurar la secuencia (puede que la tabla no exista aún):', error);
  }
}
