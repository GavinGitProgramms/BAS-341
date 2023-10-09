import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1696794790742 implements MigrationInterface {
  name = 'Migration1696794790742'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_type_enum" AS ENUM('REGULAR', 'SERVICE_PROVIDER', 'ADMIN')`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("username" character varying NOT NULL, "type" "public"."user_type_enum" NOT NULL DEFAULT 'REGULAR', "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_78a916df40e02a9deb1c4b75edb" PRIMARY KEY ("username"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."appointment_type_enum" AS ENUM('BEAUTY', 'FITNESS', 'MEDICAL')`,
    )
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."appointment_type_enum" NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "provider_id" character varying, "user_id" character varying, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_378ea106aad574466ce9c50b365" FOREIGN KEY ("provider_id") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_15d50a87502380623ff0c27e458" FOREIGN KEY ("user_id") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_15d50a87502380623ff0c27e458"`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_378ea106aad574466ce9c50b365"`,
    )
    await queryRunner.query(`DROP TABLE "appointment"`)
    await queryRunner.query(`DROP TYPE "public"."appointment_type_enum"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TYPE "public"."user_type_enum"`)
  }
}
