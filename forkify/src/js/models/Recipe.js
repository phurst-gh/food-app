import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert(`Something went wrong :(`);
      console.log(error);
    }
  };

  calcTimeToCook() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time= periods * 15;
  };

  calcServings() {
    this.servings = 4;
  };

  parseIngredients() {
    const unitsLong = [`cans`, `can`, `tbsps`, `tablespoons`, `tablespoon`, `ounces`, `ounce`, `teaspoons`, `teaspoon`, `cups`, `pounds`, `pound`];
    const unitsShort = [`can`, `can`, `tbsp`, `tbsp`, `tbsp`, `oz`, `oz`, `tsp`, `tsp`, `cup`, `lbrs`, `lbrs`];
    const units = [...unitsShort, `kg`, `g`];
    
    const newIngredients = this.ingredients.map(el => {
      // 1. Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, units[i]);
      });

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ` `);

      // 3. Parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(` `);

      // Find the position of unit (tbsp/oz etc) when we dont know which unit we're looking for
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2))

      let objIng;
      if (unitIndex > -1) {
        // unit exists
        // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace(`-`, `+`));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join(`+`));
        };

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(` `)
        };

      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but the first element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: ``,
          ingredient: arrIng.slice(1).join(` `)
        }
      } else if (unitIndex === -1) {
        // unit doesnt exist, and no nuumber in 1st positionm
        objIng = {
          count: 1,
          unit: ``,
          ingredient
        }
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {
    // Servings
    const newServings = type === `dec` ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(item => {
      item.count *=  (newServings / this.servings);
    })
console.log(newServings)
    this.servings = newServings
  }
}