import { createElement } from '../utils/render.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;

  return `<div class="trip-filters__filter">
    <input id="filter__${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}"  ${isChecked ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
    <label class ="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`;
};

export const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}


  <button class="visually-hidden" type="submit">Accept filter</button>
</form > `;
};

export default class FilterView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
