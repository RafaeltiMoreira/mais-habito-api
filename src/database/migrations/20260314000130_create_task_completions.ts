import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("task_completions", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("task_id").unsigned().notNullable()
      .references("id").inTable("tasks").onDelete("CASCADE");
    table.timestamp("completed_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("task_completions");
}
