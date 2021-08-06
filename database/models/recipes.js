const mongoose = require('../dbConection');

const { Schema } = mongoose;

const RecipesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prepTime: {
    type: Date,
    default: new Date(),
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
  },
  vegetarian: {
    type: Boolean,
    required: true,
  },

});

// club model
mongoose.model('recipes', RecipesSchema);

// module exports
module.exports = mongoose.model('recipes');
