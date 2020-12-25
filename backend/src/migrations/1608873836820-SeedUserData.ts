import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserData1608873836820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			INSERT INTO "user" ("id", "createdAt", "updatedAt", "username", "email", "password") VALUES
			(1,	'2020-12-25 05:12:17.915023',	'2020-12-25 05:12:17.915023',	'sophie',	'sophie@computer.local',	'$argon2i$v=19$m=4096,t=3,p=1$0d/0G5JRziqKuczKZA3xYg$7X0K+dCS0w2HwazbUsCTaipkXSbHHwU5YR8XHsr29vc'),
			(2,	'2020-12-25 05:12:35.279516',	'2020-12-25 05:12:35.279516',	'matthew',	'matthew@computer.local',	'$argon2i$v=19$m=4096,t=3,p=1$8D3+5UMfNiqYFK5ZCxtAVQ$3waVgf0kwEJUajKTYvK5Kk+8rQ4T9ufSYMSaXs+12Zk'),
			(3,	'2020-12-25 05:12:44.477474',	'2020-12-25 05:12:44.477474',	'sadie',	'sadie@computer.local',	'$argon2i$v=19$m=4096,t=3,p=1$P5ALf3yQ6DUWUlmvyWUGLQ$NETw1X7RshribaGspKBvgffUhW8VW1vLRvtFOHagt7Y');
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
