import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_challenges', (table) => {
    table.text('notes').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_challenges', (table) => {
    table.dropColumn('notes');
  });
}
