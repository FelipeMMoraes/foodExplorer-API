exports.up = knex => knex.schema.createTable("ordereds", table => {
  table.increments("id");

  table.string("status");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());

  table.integer("user_id").references("id").inTable("users");
});
  

exports.down = knex => knex.schema.dropTable("ordereds");