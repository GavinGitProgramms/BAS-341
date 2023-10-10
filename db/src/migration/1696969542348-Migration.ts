import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1696969542348 implements MigrationInterface {
  name = 'Migration1696969542348'

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
      `CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."appointment_type_enum" NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "providerId" uuid, "userId" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "qualification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_c8244868552c4364a5264440a66" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_f013bda65c235464178ac025925" FOREIGN KEY ("providerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "qualification" ADD CONSTRAINT "FK_6550f632c00a2739a1dad0381c1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "qualification" DROP CONSTRAINT "FK_6550f632c00a2739a1dad0381c1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99"`,
    )
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_f013bda65c235464178ac025925"`,
    )
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
