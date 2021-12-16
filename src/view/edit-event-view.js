import { createDateTemplate } from '../utils/event-utils.js';
import AbstractView from './abstract-view.js';
import { WAYPOINT_TYPES, DESTINATIONS } from '../mocks/data-mock.js';

const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';

// const DEFAULT_EVENT = {
//   basePrice: 2000,
//   dateFrom: 'MAR 18',
//   dateTo: 'MAY 7',
//   destination: {
//     description: 'The Best place in the World',
//     name: 'Beijing',
//     pictures: 'http://picsum.photos/248/152?r=100'
//   },
//   id: 80,
//   isFavorite: true,
//   offers: '',
//   type: 'Flight',
// };

const createTypeTemplate = (id, type, currentType) => {
  const isChecked = currentType === type ? 'checked' : '';

  return `<div class="event__type-item">
    <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
    <label class ="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
  </div>`;
};

const typesInLowerCase = WAYPOINT_TYPES.map((type) => type.toLowerCase());
const createTypeListTemplate = (id, currentType) => typesInLowerCase.map((type) => createTypeTemplate(id, type, currentType)).join('');

const createCityOptionTemplate = (cityName) => `<option value="${cityName}"></option>`;
const createCityOptionsTemplate = () => DESTINATIONS.map((cityName) => createCityOptionTemplate(cityName)).join('');
// console.log(createCityOptionsTemplate());

const createEditOfferTemplate = (id, offer) => (
  `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage">
      <label class="event__offer-label" for="event-offer-luggage-${id}">
      <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
                        </label>
    </div>`
);

const createEditOffersTemplate = (id, offers) => offers.map((offer) => createEditOfferTemplate(id, offer)).join('');

const createPhotosTemplate = (photos) => {
  let photosTemplate = '';

  photos.forEach((photo) => {
    const { src: source, description: alt } = photo;
    const photoTemplate = `<img class="event__photo" src="${source}" alt="${alt}">`;
    photosTemplate += photoTemplate;
  });
  return photosTemplate;
};

const createPhotosContainer = (destination) => {
  if (!destination.pictures) {
    return '';
  }
  return `<div class="event__photos-container">
<div class="event__photos-tape">
  ${createPhotosTemplate(destination.pictures)}
</div>
</div>`;
};

const createEditEventTemplate = (someEvent) => {
  const {
    id,
    type,
    offers,
    destination,
    dateFrom,
    dateTo,
    basePrice,
  } = someEvent;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypeListTemplate(id, type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
        ${createCityOptionsTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${createDateTemplate(dateFrom, DATE_TIME_FORMAT,)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${createDateTemplate(dateTo, DATE_TIME_FORMAT,)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createEditOffersTemplate(id, offers)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        ${createPhotosContainer(destination)}

      </section>
    </section>
  </form>
</li>`;
};

export default class EditEventView extends AbstractView {
  #event = null;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEditEventTemplate(this.#event);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.#event);
  }

  setDeleteHandler = (callback) => {
    this._callback.eventReset = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#eventResetHandler);
  }

  #eventResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.eventReset(this.#event);
  }
}

