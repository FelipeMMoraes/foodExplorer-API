exports.up = knex => knex.schema.createTable("ingredients", table => {
  table.increments("id");

  table.string("name").notNullable();
  table.string("image").notNullable();
});
  

exports.down = knex => knex.schema.dropTable("ingredients");