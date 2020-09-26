import { elements } from "./base";

// no curly bracers will automatically return return
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = ``;
};
export const clearResults = () => {
  elements.searchResList.innerHTML = ``;
  elements.searchResPages.innerHTML = ``;
};

export const highlightSelected = id => {
  const selectedElement = document.querySelector(`a[href*="#${id}"]`);
  const resultsArr  = Array.from(document.querySelectorAll(`.results__link`));

  resultsArr.forEach(item => {
    item.classList.remove(`results__link--active`);
  });

  if (selectedElement) selectedElement.classList.add(`results__link--active`);
};

export const truncateTitle = (title, limit = 17) => {
  const newTitle = [];

  if (title.length > limit) {
    // split into array which allows access to reduce
    title.split(` `).reduce((accumulator, item) => {
      // using the accumulator we can add the length of the words in the array..
      // ..adding each word length together, once the total length > limit we..
      // ..return the new array - this prevents truncating half-way through words.
      if (accumulator + item.length <= limit) {
        newTitle.push(item);
      }
      return accumulator + item.length;
    }, 0) // initial value of accumulator is 0 (2nd arg)

    return `${newTitle.join(` `)}...`;
  }

  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${truncateTitle(recipe.title, 20)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;

  elements.searchResList.insertAdjacentHTML(`beforeend`, markup);
};

// type: prev or next
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto="${type === `prev` ? page - 1 : page +1}">
    <span>Page ${type === `prev` ? page - 1 : page +1}</span>  
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type == `prev` ? `left` : `right`}"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  let button;
  // rounds up: eg. if we have 4.5 pages that doesnt work, we round up to have 5 pages
  const pages = Math.ceil(numResults / resPerPage);

  if (page === 1 && pages > 1) {
    //btn only to next
    button = createButton(page, `next`);
  } else if (page < pages) {
    // both btns
    button = `
      ${createButton(page, `prev`)}
      ${createButton(page, `next`)}
    `
  } else if (page === pages && pages > 1) {
    // btn only to previous
    button = createButton(page, `prev`);
  }

  elements.searchResPages.insertAdjacentHTML(`afterbegin`, button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // call function on each element/item
  // automatically passes the current element (instead of forEach(el => renderRecipes(el)))
  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
