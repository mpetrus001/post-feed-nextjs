import { User } from "../entities/User";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserData1608873836820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const UserRepository = queryRunner.connection.getRepository(User);
    await UserRepository.save([
      {
        username: "sophie",
        email: "sophie@computer.local",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$0d/0G5JRziqKuczKZA3xYg$7X0K+dCS0w2HwazbUsCTaipkXSbHHwU5YR8XHsr29vc",
      },
      {
        username: "matthew",
        email: "matthew@computer.local",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$8D3+5UMfNiqYFK5ZCxtAVQ$3waVgf0kwEJUajKTYvK5Kk+8rQ4T9ufSYMSaXs+12Zk",
      },
      {
        username: "sadie",
        email: "sadie@computer.local",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$P5ALf3yQ6DUWUlmvyWUGLQ$NETw1X7RshribaGspKBvgffUhW8VW1vLRvtFOHagt7Y",
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const UserRepository = queryRunner.connection.getRepository(User);
    await UserRepository.clear();
  }
}
