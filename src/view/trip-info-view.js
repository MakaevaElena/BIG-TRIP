import AbstractView from './abstract-view.js';

const createTripInfoTemplate = () => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>
  </section>`
);

export default class TripInfoView extends AbstractView {
  get template() {
    return createTripInfoTemplate();
  }
}
