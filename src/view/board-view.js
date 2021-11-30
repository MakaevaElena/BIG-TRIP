import { createElement } from '../utils/render.js';

const createBoardTemplate = () => (
  `<ul class="trip-events__list">
  </ul`
);

export default class BoardView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBoardTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

