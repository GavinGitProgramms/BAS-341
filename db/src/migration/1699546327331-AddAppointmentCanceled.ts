import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAppointmentCanceled1699546327331 implements MigrationInterface {
  name = 'AddAppointmentCanceled1699546327331'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "canceled" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "canceled"`)
  }
}
