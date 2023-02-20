const { request, response } = require("express");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishController {
  async create(request, response) {
    const { name, description, price, image, category, dish_ingredients } = request.body;
    
    // Verifica se todos os dados necessários foram fornecidos
    if (!name || !description || !price || !category) {
      throw new AppError("Não foi possível cadastrar o prato, verifique se inseriu todas as informações");
    }
    
    // Array que armazenará os IDs dos ingredientes do prato
    let ingredientIds = [];
    
    // Loop pelos ingredientes do prato
    for (const dishIngredient of dish_ingredients) {
      // Procura o ingrediente na tabela 'ingredients' pelo nome
      const [ingredient] = await knex('ingredients').where({ name: dishIngredient });
      
      if (ingredient) { // Se o ingrediente já existe, adiciona o ID no array
        ingredientIds.push(ingredient.id);
      } else { // Se o ingrediente não existe, insere um novo na tabela 'ingredients' e adiciona o ID no array
        const newIngredient = await knex('ingredients').insert({ name: dishIngredient, image: 'image.jpg' });
        ingredientIds.push(newIngredient[0]);
      }
    }
    
    // Verifica se já existe um prato com o mesmo nome na tabela 'dish'
    const [existingDish] = await knex('dish').where({ name });
    if (existingDish) {
      throw new AppError(`Já existe um prato com o nome ${name}`);
    }
    
    // Insere o prato na tabela 'dish' e armazena o ID retornado
    const dishId = await knex('dish').insert({
      name,
      description,
      price,
      category,
      image
    });
    
    // Cria um array de objetos com os IDs do prato e dos ingredientes para inserir na tabela 'dish_ingredients'
    const dishIngredientsInsert = ingredientIds.map(ingredientId => ({ dish_id: dishId[0], ingredient_id: ingredientId }));
    await knex('dish_ingredients').insert(dishIngredientsInsert);
  
    return response.json("Prato salvo com sucesso");
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name,
      description,
      price,
      category,
      image,
      ingredients_to_add = [],
      ingredients_to_remove = [],
    } = request.body;
  
    const dish = await knex('dish').where({ id }).first();
    if (!dish) {
      throw new AppError('Prato não encontrado');
    }
  
    let ingredientIdsToAdd = [];
    if (ingredients_to_add.length > 0) {
      const newIngredients = await knex('ingredients').whereIn('name', ingredients_to_add);
  
      const newIngredientsNames = newIngredients.map(ingredient => ingredient.name);
  
      const notFoundIngredients = ingredients_to_add.filter(
        ingredientName => !newIngredientsNames.includes(ingredientName)
      );
  
      if (notFoundIngredients.length > 0) {
        throw new AppError(`Os seguintes ingredientes não foram encontrados: ${notFoundIngredients.join(', ')}`);
      }
  
      ingredientIdsToAdd = newIngredients.map(ingredient => ingredient.id);
    }
  
    let ingredientIdsToRemove = [];
    if (ingredients_to_remove.length > 0) {
      const ingredients = await knex('ingredients').whereIn('name', ingredients_to_remove);
  
      const ingredientsNames = ingredients.map(ingredient => ingredient.name);
  
      const notFoundIngredients = ingredients_to_remove.filter(
        ingredientName => !ingredientsNames.includes(ingredientName)
      );
  
      if (notFoundIngredients.length > 0) {
        throw new AppError(`Os seguintes ingredientes não foram encontrados: ${notFoundIngredients.join(', ')}`);
      }
  
      ingredientIdsToRemove = ingredients.map(ingredient => ingredient.id);
    }
  
    const trx = await knex.transaction();
    try {
      await trx('dish_ingredients').where({ dish_id: id }).delete();
  
      if (ingredientIdsToAdd.length > 0) {
        const dishIngredientsToAdd = ingredientIdsToAdd.map(ingredientId => ({ dish_id: id, ingredient_id: ingredientId }));
        await trx('dish_ingredients').insert(dishIngredientsToAdd);
      }
  
      if (ingredientIdsToRemove.length > 0) {
        await trx('dish_ingredients').whereIn('ingredient_id', ingredientIdsToRemove).delete();
      }
  
      const newDish = {
        name: name || dish.name,
        description: description || dish.description,
        price: price || dish.price,
        category: category || dish.category,
        image: image || dish.image,
      };
  
      await trx('dish').where({ id }).update(newDish);
  
      await trx.commit();
  
      return response.json({ id, ...newDish });
    } catch (err) {
      await trx.rollback();
      throw new AppError('Erro ao atualizar prato');
    }
  }

  async delete(request, response){
    const { id } = request.params

    const dish = await knex('dish').where({ id }).first();

    if(!dish) {
      throw new AppError("Prato não encontrado")
    }

    await knex.transaction(async (trx) => {
      await trx("dish_ingredients").where({ dish_id: id }).delete()
      await trx("dish").where({ id }).delete()
    });

    return response.json("Prato excluido com sucesso")
  }

  async show(request, response){
    const { id } = request.params

    // faz uma consulta no banco de dados para encontrar o prato com o id correspondente
    const dish = await knex("dish").where({ id }).first();

    if (!dish) { // se o prato não for encontrado, retorna um erro
      throw new AppError("Prato nao encontrado!")
    }

    const dishIngredients = await knex("dish_ingredients")
    .where({ dish_id: id })
    .join('ingredients', 'dish_ingredients.ingredient_id', '=', 'ingredients.id')
    .select('ingredients.name'); // faz uma consulta no banco de dados para recuperar os ingredientes do prato com o id correspondente

    // cria um objeto com as informações do prato e seus ingredientes
    return response.json({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      category: dish.category,
      ingredients: dishIngredients
    })
  }

  async index(_request, response) {
    const dishes = await knex('dish')
      .select('dish.id', 'dish.name', 'dish.description', 'dish.price', 'dish.category', 'dish.image', knex.raw('GROUP_CONCAT(ingredients.name, ", ") as ingredients'))
      .leftJoin('dish_ingredients', 'dish.id', 'dish_ingredients.dish_id')
      .leftJoin('ingredients', 'dish_ingredients.ingredient_id', 'ingredients.id')
      .groupBy('dish.id')
      .orderBy('dish.name');
  
    return response.json(dishes);
  }
}

module.exports = DishController