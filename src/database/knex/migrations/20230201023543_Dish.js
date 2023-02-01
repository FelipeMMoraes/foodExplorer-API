exports.up = knex => knex.schema.createTable("dish", table => {
  table.increments("id");

  table.string("name").notNullable();
  table.string("description").notNullable();
  table.float("price").notNullable();
  table.string("category").notNullable();
  table.string("image");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});
  

exports.down = knex => knex.schema.dropTable("dish");