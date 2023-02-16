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
}

module.exports = DishController