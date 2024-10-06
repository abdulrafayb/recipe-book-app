import * as model from "./model.js";
import { MODAL_CLOSE_SEC, FORM_OPEN_AGAIN } from "./config.js";
import recipeView from "./views/recipe-view.js";
import searchView from "./views/search-view.js";
import resultsView from "./views/results-view.js";
import paginationView from "./views/pagination-view.js";
import bookmarksView from "./views/bookmarks-view.js";
import addRecipeView from "./views/add-recipe-view.js";

// adding polyfills for modern features to support old browsers
import "core-js/stable"; // for polyfilling everything
import "regenerator-runtime/runtime"; // for polyfilling async/await
import bookmarksView from "./views/bookmarks-view.js";

/* if (module.hot) {
  module.hot.accept();
} */

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // updating results view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());

    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id); // one async function calling another one

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    /* in the real world we handle errors by actually displaying some message in the UI so that the user can know what is wrong and for now we are handling API related errors in the 'model', but we want to display error in the UI so its something that should also happen in the 'view', so we implement a new method in the 'view' to handle and display errors by dynamically putting it into HTML and displaying it on the page, and here we don't pass in any error because the error we threw/propogated here is not useful as it does not make any sense for the user so we use the default one that we set up in 'view' and not here like rendererror(message) as this would not have been the correct place to do it as this is the 'controller' not 'view'  */
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    // render search results
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

/* these functions here can be called controllers or handlers because we are using the MVC pattern and also because they are event handlers that run whenever some event happens, in this case this controller will execute when the user clicks the increase/decrease buttons of servings, so it will increase/decrease the serving number and adjust ingredients list */
const controlServings = function (newServings) {
  // update the recipe servings in the state
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // uploading new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderMessage();

    // render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // changing id into url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // close the window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    setTimeout(function () {
      addRecipeView.renderForm();
    }, FORM_OPEN_AGAIN * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
