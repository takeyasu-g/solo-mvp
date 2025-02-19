/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('game_couch', (table) => {
    table.increments('id').primary();
    table
      .integer('host_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('host_username').notNullable(); // Store host’s username instead of exposing ID
    table.string('game_name').notNullable();
    table.string('game_image'); // Store game image URL (not actual image)
    table.integer('max_seats').notNullable();
    table.timestamp('event_time').notNullable();
    table.string('location'); // Online meeting place (Discord)
    table.string('title').notNullable();
    table.text('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Auto-generate timestamp
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('game_couch');
};
