/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('game_couch_players', (table) => {
    table.increments('id').primary();
    table
      .integer('game_couch_id')
      .unsigned()
      .references('id')
      .inTable('game_couch')
      .onDelete('CASCADE'); // if event is deleted , also delete couch_players
    table.string('player_name').notNullable(); // name enter when they join the link or username if have account
    table.string('player_uid').nullable(); // if they have an account on Game Couch
    table.timestamp('joined_at').defaultTo(knex.fn.now()); // when they joined
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('game_couch_players');
};
