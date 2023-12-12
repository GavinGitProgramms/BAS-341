import { MigrationInterface, QueryRunner } from 'typeorm'

export class NotificationViewedMigration1702355001707
  implements MigrationInterface
{
  name = 'NotificationViewedMigration1702355001707'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "viewed" boolean NOT NULL DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "updated_date"`,
    )
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "viewed"`)
  }
}
