import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return `<div class="trip-filters__filter">
    <input id="filter__${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"  ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
    <label class ="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`;
};

export const createFilterTemplate = (filterItems, currentFilterType) => {
  // console.log(filterItems);
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}

  <button class="visually-hidden" type="submit">Accept filter</button>
</form > `;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
