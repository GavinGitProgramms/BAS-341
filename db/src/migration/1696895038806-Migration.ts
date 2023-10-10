import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1696895038806 implements MigrationInterface {
  name = 'Migration1696895038806'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "qualification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_c8244868552c4364a5264440a66" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "qualification" ADD CONSTRAINT "FK_ded2abe65914cdd8f863151519b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "qualification" DROP CONSTRAINT "FK_ded2abe65914cdd8f863151519b"`,
    )
    await queryRunner.query(`DROP TABLE "qualification"`)
  }
}
