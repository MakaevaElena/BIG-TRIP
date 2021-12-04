import { createElement } from '../utils/render.js';

const createCostTemplate = () =>
  `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`;

export default class CostView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCostTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

