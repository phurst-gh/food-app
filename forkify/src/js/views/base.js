// Re-used items across different modules

export const elements = {
  searchForm: document.querySelector(`.search`),
  searchInput: document.querySelector(`.search__field`),
  searchRes: document.querySelector(`.results`),
  searchResList: document.querySelector(`.results__list`),
  searchResPages: document.querySelector(`.results__pages`),
  recipe: document.querySelector(`.recipe`),
  shopping: document.querySelector(`.shopping__list`),
  likesMenu: document.querySelector(`.likes__field`),
  likesList: document.querySelector(`.likes__list`),
}
// loader class created in renderLoader so cannot be grabbed and add to elements (above)..
// ..instead, we use this object to avoid hard coding the class and pass where needed (below)
export const elementStrings = {
  loader: `loader`,
}

export const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML(`afterbegin`, loader);
}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
}