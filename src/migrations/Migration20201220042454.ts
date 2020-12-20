import { Migration } from '@mikro-orm/migrations';

export class Migration20201220042454 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "email" to "username";');


    this.addSql('alter table "user" drop constraint "user_email_unique";');

    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
