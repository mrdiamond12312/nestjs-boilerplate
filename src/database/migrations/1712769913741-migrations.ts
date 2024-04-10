import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712769913741 implements MigrationInterface {
  name = 'Migrations1712769913741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, "address" character varying, "detailed_address" character varying, "dob" TIMESTAMP, "phone_number" character varying, "full_name" character varying, "role" character varying NOT NULL DEFAULT 'user', "citizen_id" character varying, "citizen_card_front" character varying, "citizen_card_back" character varying, CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
