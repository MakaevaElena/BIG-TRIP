import AbstractView from './abstract-view.js';

const createCostTemplate = () =>
  `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`;

export default class CostView extends AbstractView {
  get template() {
    return createCostTemplate();
  }
}

