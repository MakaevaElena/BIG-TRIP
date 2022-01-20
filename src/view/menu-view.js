import AbstractView from './abstract-view.js';
import { MenuItem } from '../const.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" aria-label="${MenuItem.TABLE}">Table</a>
                <a class="trip-tabs__btn" href="#" aria-label="${MenuItem.STATS}">Stats</a>
              </nav>`
);

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  setMenuItem = (menuItem) => {
    const item = this.element.querySelector(`[aria-label=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.ariaLabel);

    if (!evt.target.classList.contains('trip-tabs__btn--active')) {
      const prevActiveMenuOption = this.element.querySelector('.trip-tabs__btn--active');

      evt.target.classList.add('trip-tabs__btn--active');
      prevActiveMenuOption.classList.remove('trip-tabs__btn--active');
    }
  }
}
