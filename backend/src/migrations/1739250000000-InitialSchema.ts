import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración inicial: tablas customers, accounts y secuencia account_number_seq.
 * Ejecutar con: npm run migration:run
 */
export class InitialSchema1739250000000 implements MigrationInterface {
  name = 'InitialSchema1739250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extensión para uuid_generate_v4()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Enums
    await queryRunner.query(`
      CREATE TYPE "documenttype_enum" AS ENUM ('CC', 'CE', 'PAS');
    `);
    await queryRunner.query(`
      CREATE TYPE "accountstatus_enum" AS ENUM ('Active', 'Inactive');
    `);

    // Tabla customers (sin accountId primero por dependencia circular)
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "documentType" "documenttype_enum" NOT NULL,
        "documentNumber" character varying NOT NULL,
        "fullName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_customers_documentNumber" UNIQUE ("documentNumber"),
        CONSTRAINT "UQ_customers_email" UNIQUE ("email"),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id")
      );
    `);

    // Secuencia para número de cuenta
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS account_number_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `);

    // Tabla accounts
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "accountNumber" bigint NOT NULL DEFAULT nextval('account_number_seq'),
        "status" "accountstatus_enum" NOT NULL DEFAULT 'Active',
        "customerId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_accounts_accountNumber" UNIQUE ("accountNumber"),
        CONSTRAINT "UQ_accounts_customerId" UNIQUE ("customerId"),
        CONSTRAINT "PK_accounts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_accounts_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id")
      );
    `);

    // Columna accountId en customers (relación 1:1)
    await queryRunner.query(`
      ALTER TABLE "customers"
      ADD COLUMN "accountId" uuid NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE "customers"
      ADD CONSTRAINT "FK_customers_account" FOREIGN KEY ("accountId") REFERENCES "accounts"("id");
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_customers_accountId" ON "customers" ("accountId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_customers_account";`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "accountId";`);
    await queryRunner.query(`DROP TABLE "accounts";`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS account_number_seq;`);
    await queryRunner.query(`DROP TABLE "customers";`);
    await queryRunner.query(`DROP TYPE "accountstatus_enum";`);
    await queryRunner.query(`DROP TYPE "documenttype_enum";`);
  }
}
