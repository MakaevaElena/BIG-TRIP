import { createDateTemplate } from '../utils/event-utils.js';
import { WAYPOINT_TYPES, DESTINATIONS } from '../mocks/data-mock.js';
import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { generateOffers } from '../mocks/utils-mock.js';
import { generateDestinations } from '../mocks/event-mock.js';
import he from 'he';

const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';

const findObjectfromArray = (arr, value) => arr.find((obj) => obj.name === value);

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

const createEditOfferTemplate = (offer) => (
  `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" data-id="${offer.id}">
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
                        </label>
    </div>`
);

const createEditOffersTemplate = (offers) => offers.map((offer) => createEditOfferTemplate(offer)).join('');

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

const createEditEventTemplate = (data) => {
  const {
    id,
    type,
    offers,
    destination,
    dateFrom,
    dateTo,
    basePrice,
  } = data;

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
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
        ${createCityOptionsTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${createDateTemplate(dateFrom, DATE_TIME_FORMAT,)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${createDateTemplate(dateTo, DATE_TIME_FORMAT,)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}">
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
        ${createEditOffersTemplate(offers)}
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

export default class EditEventView extends SmartView {
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor(event) {
    super();
    this._data = EditEventView.parseEventToData(event);
    this.#setInnerHandlers();
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  get template() {
    return createEditEventTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseHandler(this._callback.closeEdit);
    this.setDeleteClickHandler(this._callback.eventReset);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #setDatepickerStart = () => {
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    this.#datepickerStart = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'd/m/y H:i',
        ['time_24hr']: true,
        enableTime: true,
        defaultDate: this._data.dateFrom,
        onChange: this.#dateStartChangeHandler,
      },
    );
  }

  #setDatepickerEnd = () => {
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
    this.#datepickerStart = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'd/m/y H:i',
        ['time_24hr']: true,
        enableTime: true,
        defaultDate: this._data.dateTo,
        onChange: this.#dateEndChangeHandler,
      },
    );
  }

  #dateStartChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate,
    });
  }

  #dateEndChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate,
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);
    this.element.querySelector('input[name=event-end-time]').addEventListener('input', this.#onDateToInput);
    this.element.querySelector('input[name=event-start-time]').addEventListener('input', this.#onDateFromInput);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
  }

  reset = (event) => {
    this.updateData(EditEventView.parseEventToData(event));
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditEventView.parseDataToEvents(this._data));
  }

  setCloseHandler = (callback) => {
    this._callback.closeEdit = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeHandler);
  }

  #closeHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEdit();
  }

  setDeleteClickHandler = (callback) => {
    this._callback.eventReset = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#eventResetHandler);
    // this.element.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#eventResetHandler);
  }

  #eventResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.eventReset(EditEventView.parseDataToEvents(this._data));
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: generateOffers(evt.target.value, 5),
    }
    );
  }

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOffers = Array.from(document.querySelectorAll('.event__offer-checkbox:checked'));
    const offerIds = checkedOffers.map((element) => element.dataset.id);

    const offers = this._data.offers.filter((offer) => offerIds.filter((offerId) => offer.id === offerId));

    this.updateData({
      offers: offers,
    }, true);
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      destination: findObjectfromArray(generateDestinations, evt.target.value),
    });
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  #onDateToInput = (evt) => {
    evt.preventDefault();
    this.updateData({
      dateTo: evt.target.value,
    }, true);
  }

  #onDateFromInput = (evt) => {
    evt.preventDefault();
    this.updateData({
      dateFrom: evt.target.value,
    }, true);
  }

  static parseEventToData = (event) => ({ ...event });
  static parseDataToEvents = (data) => ({ ...data });

}

