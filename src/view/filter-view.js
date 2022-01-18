import AbstractView from './abstract-view.js';
import { addNewEventButton } from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name } = filter;

  return `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"  ${type === currentFilterType ? 'checked' : ''}>
    <label class ="trip-filters__filter-label" for="filter-${type}">${name}</label>
  </div>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
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
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler, true);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
    addNewEventButton.disabled = false;
  }
}
