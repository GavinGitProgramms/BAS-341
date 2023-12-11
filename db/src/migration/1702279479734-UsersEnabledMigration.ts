import { MigrationInterface, QueryRunner } from 'typeorm'

export class UsersEnabledMigration1702279479734 implements MigrationInterface {
  name = 'UsersEnabledMigration1702279479734'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "enabled" boolean NOT NULL DEFAULT true`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enabled"`)
  }
}
