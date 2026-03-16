import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_challenges", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("template_id").unsigned().notNullable()
      .references("id").inTable("challenge_templates").onDelete("CASCADE");
    table.enum("status", ["ACTIVE", "COMPLETED", "ABANDONED"]).defaultTo("ACTIVE").notNullable();
    table.timestamp("start_date").notNullable().defaultTo(knex.fn.now());
    table.timestamp("completed_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("user_challenges");
}
