import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView"
import * as recipeView from "./views/recipeView"
import * as listView from "./views/listView"
import * as likesView from "./views/likesView"
import { elements, renderLoader, clearLoader } from "./views/base";

// APP GLOBAL STATE
const state = {
  // search: {
  //   result: []
  // }
  // current recipe Object
  // shop list Object
  // liked recipes
};

// SEARCH CONTROLLER
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    try {
      //  2. If query exists create new search object and add to state
      state.search = new Search(query);

      //  3. Prepare UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchRes);

      // 4. Seach for recipes
      await state.search.getResults();

      // 5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert(`Error in search`);
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener(`submit`, e => {
  e.preventDefault(); // Prevent page reset
  controlSearch();
})

elements.searchResPages.addEventListener(`click`, e => {
  const btn = e.target.closest(`.btn-inline`);
  if (btn) {
    const gotToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, gotToPage);
  }
})

// RECIPE CONTROLLER
const controlRecipe = async () => {
  // Get ID from URL
  const id = window.location.hash.replace(`#`, ``);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight the selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = await new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and times
      state.recipe.calcTimeToCook();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id),
      );
    } catch (err) {
      alert(`Error processing recipe`);
      console.log(err)
    }
  }
}

state.likes = new Likes();
// window.addEventListener(`hashchange`, controlRecipe);
// window.addEventListener(`load`, controlRecipe);
// Instead of above..
// ..we can do below..
[`hashchange`, `load`].forEach(e => window.addEventListener(e, controlRecipe));

//  LIST CONTROLLER
const controlList = () => {
  // Creaet new list IF here is none
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.additem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
}

// Handle delete and update list item events
elements.shopping.addEventListener(`click`, e => {
  const id = e.target.closest(`.shopping__item`).dataset.itemid;

  // Hnadle delete button
  if (e.target.matches(`.shopping__delete, .shopping__delete *`)) {
    // dele from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle count update
  } else if (e.target.matches(`.shopping__count-value`)) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//  LIKE CONTROLLER
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img,
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to te UI list
    likesView.renderLike(newLike)

  // User has NOT yet liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);

    // Toggle the lie button
    likesView.toggleLikeBtn(false);

    // Remove like to te UI list
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikesMenu(state.likes.getNumLikes());
}

// Restore liked recipes on page load
window.addEventListener(`load`, () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikesMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
})

/// Handling recipe servings (inc/dec) button clicks
elements.recipe.addEventListener(`click`, e => {
  // if matches btn-decrease or child elemnt of btn-decrease
  if (e.target.matches(`.btn-decrease, .btn-decrease *`)) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings(`dec`);
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(`.btn-increase, .btn-increase *`)) {
    // Increase button is clicked
    state.recipe.updateServings(`inc`)
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(`.recipe__btn--add, .recipe__btn--add *`)) {
    //Add ingredients to shipping list
    controlList();
  } else if ( e.target.matches(`.recipe__love, .recipe__love *`)) {
    // Like Controller
    controlLike();
  }
});