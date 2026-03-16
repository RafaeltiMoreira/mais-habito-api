import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("challenge_template_id").unsigned().nullable()
      .references("id").inTable("challenge_templates").onDelete("SET NULL");
    table.string("title").notNullable();
    table.text("description").nullable();
    table.integer("points").notNullable().defaultTo(10);
    table.boolean("is_daily_routine").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tasks");
}
