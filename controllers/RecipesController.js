const Recipes = require('../database/services/recipes');

const RecipesController = {
  // Retrieve and return all recipes from the database.
  getAll: async (req, res) => {
    try {
      const results = await Recipes.allRecipes();

      return res.status(200).send({
        success: true,
        data: results,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'Some error occurred while retrieving recipes.',
      });
    }
  },

  // Create and Save a new Recipes
  create: async (req, res) => {
    console.log('create')
    try {
      // define variables
      const {
        name, difficulty, vegetarian,
      } = req.body;

      // validate vegetarian
      if (typeof vegetarian !== 'boolean') {
        return res.status(400).send({
          success: false,
          message: 'vegetarian field should be boolean',
        });
      }
      // validate name
      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: 'name field can not be empty',
        });
      }

      // validate difficulty
      if ((typeof difficulty !== 'number') || (difficulty <= 0) || (difficulty > 3)) {
        return res.status(400).send({
          success: false,
          message: 'difficulty field should be a number',
        });
      }

      const recipesDetail = {
        name,
        difficulty,
        vegetarian,
      };

      // Save user in the database
      const recipes = await Recipes.saveRecipes(recipesDetail);

      return res.status(201).send({
        success: true,
        data: recipes,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'Failed to save recipes!',
      });
    }
  },

  // Find a single recipes with an id
  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      // retrive recipes info
      const recipes = await Recipes.fetchById(id);
      if (!recipes) {
        return res.status(400).send({
          success: false,
          message: `Recipe with id ${id} does not exist`,
        });
      }

      return res.send({
        success: true,
        data: recipes,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'Some error occurred while retrieving recipe details.',
      });
    }
  },

  // Update the recipes identified by the parameter
  update: async (req, res) => {
    console.log('update');
    try {
      // check if req body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
          success: false,
          message: 'field should not be empty',
        });
      }

      // validate difficulty if it exist
      if ((req.body.difficulty) && ((typeof req.body.difficulty !== 'number') || (req.body.difficulty <= 0) || (req.body.difficulty > 3))) {
        return res.status(400).send({
          success: false,
          message: 'difficulty field should be a number',
        });
      }
      // validate vegetarian if it exist
      if ((req.body.vegetarian) && (typeof req.body.vegetarian !== 'boolean')) {
        return res.status(400).send({
          success: false,
          message: 'vegetarian field should be boolean',
        });
      }

      const { id } = req.params;

      // check if recipe exist
      const recipeExist = await Recipes.fetchById(id);
      if (!recipeExist) {
        return res.status(400).send({
          success: false,
          message: `Recipe with id ${id} does not exist`,
        });
      }

      const recipesDetail = req.body;
      // Find recipe and update it with the request body
      const recipes = await Recipes.fetchByIdAndUpdate(id, recipesDetail);
      return res.status(200).send({
        success: true,
        data: recipes,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'An error occured while updating recipe',
      });
    }
  },

  // Delete the recipes identified by the parameter
  delete: async (req, res) => {
    try {
      // define variables
      const { id } = req.params;

      // Find recipe and delete
      await Recipes.fetchByIdAndDelete(id);

      return res.status(200).send({
        success: true,
        message: 'Recipe successfully deleted',
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'An error occured while deleting recipe',
      });
    }
  },
};

module.exports = RecipesController;
