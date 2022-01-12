import AbstractView from './abstract-view.js';

const calculatePrice = (events) => {
  const priceTotal = events.reduce((total, event) => {
    const { basePrice, offers } = event;

    let offersTotal = 0;

    if (offers && offers.length > 0) {
      offersTotal = offers.reduce((sum, offer) => (sum += offer.price), 0);
    }
    total += basePrice + offersTotal;
    return total;
  }, 0);

  return priceTotal;
};

const createCostTemplate = (price) =>
  `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`;

export default class CostView extends AbstractView {
  #price = null;

  constructor(events) {
    super();
    this.#price = calculatePrice(events);
  }

  get template() {
    return createCostTemplate(this.#price);
  }
}

