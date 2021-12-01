import { createElement } from '../utils/render.js';

const createEventsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul`
);

export default class EventsListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEventsListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

