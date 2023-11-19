import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1700435027666 implements MigrationInterface {
  name = 'Migration1700435027666'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_type_enum" AS ENUM('REGULAR', 'SERVICE_PROVIDER', 'ADMIN')`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "type" "public"."user_type_enum" NOT NULL DEFAULT 'REGULAR', "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."appointment_type_enum" AS ENUM('BEAUTY', 'FITNESS', 'MEDICAL')`,
    )
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."appointment_type_enum" NOT NULL, "description" character varying NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "canceled" boolean NOT NULL DEFAULT false, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "provider_id" uuid, "user_id" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "qualification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_c8244868552c4364a5264440a66" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."event_type_enum" AS ENUM('APPOINTMENT_CREATED', 'APPOINTMENT_CANCELED', 'APPOINTMENT_UPDATED', 'APPOINTMENT_BOOKED')`,
    )
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."event_type_enum" NOT NULL, "payload" jsonb NOT NULL DEFAULT '{}', "created_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('APP', 'SMS', 'EMAIL')`,
    )
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notification_type_enum" NOT NULL, "message" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_378ea106aad574466ce9c50b365" FOREIGN KEY ("provider_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_15d50a87502380623ff0c27e458" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "qualification" ADD CONSTRAINT "FK_ded2abe65914cdd8f863151519b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "qualification" DROP CONSTRAINT "FK_ded2abe65914cdd8f863151519b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_15d50a87502380623ff0c27e458"`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_378ea106aad574466ce9c50b365"`,
    )
    await queryRunner.query(`DROP TABLE "notification"`)
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`)
    await queryRunner.query(`DROP TABLE "event"`)
    await queryRunner.query(`DROP TYPE "public"."event_type_enum"`)
    await queryRunner.query(`DROP TABLE "qualification"`)
    await queryRunner.query(`DROP TABLE "appointment"`)
    await queryRunner.query(`DROP TYPE "public"."appointment_type_enum"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`,
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TYPE "public"."user_type_enum"`)
  }
}
