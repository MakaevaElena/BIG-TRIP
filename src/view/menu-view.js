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
  }
}
