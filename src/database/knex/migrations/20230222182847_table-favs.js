exports.up = function(knex) {
  return knex.schema.createTable('favs', function(table) {
    table.increments('id');
    table.integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.integer('dish_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('dish')
      .onDelete('CASCADE')
      table.timestamp("created_at").default(knex.fn.now())
      table.timestamp("updated_at").default(knex.fn.now())
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('favs');
};
