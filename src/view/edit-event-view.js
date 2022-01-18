import { createDateTemplate } from '../utils/event-utils.js';
import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';
import { DEFAULT_EVENT } from '../const.js';
import dayjs from 'dayjs';
import { addNewEventButton, WAYPOINT_TYPES } from '../const.js';

const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

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

const createCityOptionsTemplate = (serverDestinations) => {
  let dataListContentTemplate = '';
  serverDestinations.forEach((serverDestination) => {
    dataListContentTemplate += createCityOptionTemplate(serverDestination.name);
  });
  return dataListContentTemplate;
};

const createEditOfferTemplate = (type, offer, possibleOffers, isDisabled) => {
  // const result = Array.isArray(possibleOffers);
  // console.log(result);
  // console.log(possibleOffers);
  // console.log(type);

  let isSelectedPointOffer = false;
  //! отфильтровать по типу
  // const pointOffers = Array.from(possibleOffers).filter((curentOffer) => curentOffer.type === type);
  // const pointOffers = possibleOffers[type].filter((curentOffer) => curentOffer.type === type);
  const pointOffers = possibleOffers[type.type];

  // console.log(pointOffers);

  if (pointOffers) {
    pointOffers.forEach((pointOffer) => {
      if (offer.id === pointOffer.id) {
        isSelectedPointOffer = true;
      }
    });
  }

  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" data-id="${offer.id}" data-title="${offer.title}" data-price="${offer.price}" ${isDisabled ? 'disabled' : ''}  ${isSelectedPointOffer ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
                        </label>
    </div>`;
};

const createEditOffersTemplate = (type, offers, possibleOffers, isDisabled) => offers.map((offer) => createEditOfferTemplate(type, offer, possibleOffers, isDisabled)).join('');

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

const createEditEventTemplate = (data, possibleOffers, possibleDestinations) => {
  const {
    id,
    type,
    offers,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  // console.log(data);

  let isOffer = '';
  if (offers.length === 0) {
    isOffer = 'visually-hidden';
  }

  let isDestination = '';
  if (destination.length === 0) {
    isDestination = 'visually-hidden';
  }

  const isEditForm = {
    ROLLUP_BUTTON_CLASS: 'event__rollup-btn',
    RESET_BUTTON_NAME: 'Delete',
  };

  if (data.id === DEFAULT_EVENT.id) {
    isEditForm.ROLLUP_BUTTON_CLASS = 'visually-hidden';
    isEditForm.RESET_BUTTON_NAME = 'Cancel';
  }

  return `<li class="trip-events__item ${isEditForm.ADD_FORM_CLASS}">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox"  ${isDisabled ? 'disabled' : ''}>

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
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-${id}"  ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-${id}">
        ${createCityOptionsTemplate(possibleDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${createDateTemplate(dateFrom, DATE_TIME_FORMAT,)}" required ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${createDateTemplate(dateTo, DATE_TIME_FORMAT,)}" required ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}" required min="1" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit"  ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : isEditForm.RESET_BUTTON_NAME}</button>
      <button class="${isEditForm.ROLLUP_BUTTON_CLASS}" type="button"  ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers  ${isOffer}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createEditOffersTemplate(type, offers, possibleOffers, isDisabled)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description ${isDestination}">${destination.description}</p>

        ${createPhotosContainer(destination)}

      </section>
    </section>
  </form>
</li>`;
};

export default class EditEventView extends SmartView {
  #datepickerStart = null;
  #datepickerEnd = null;
  #possibleOffers = null;
  #possibleDestinations = null;

  constructor(event, possibleOffers, possibleDestinations) {
    super();
    this._data = EditEventView.parseEventToData(event);
    this.#possibleOffers = possibleOffers;
    this.#possibleDestinations = possibleDestinations;
    this.#setInnerHandlers();
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  get template() {
    return createEditEventTemplate(this._data, this.#possibleOffers, this.#possibleDestinations);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseHandler(this._callback.closeEdit);
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
        defaultDate: dayjs(this._data.dateFrom).toISOString(),
        onChange: this.#dateStartChangeHandler,
        maxDate: this._data.dateTo.toString(),
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
        defaultDate: dayjs(this._data.dateTo).toISOString(),
        onChange: this.#dateEndChangeHandler,
        minDate: this._data.dateFrom.toString(),
      },
    );
  }

  #dateStartChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: dayjs(userDate),
    });
  }

  #dateEndChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: dayjs(userDate),
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#eventResetHandler);
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
    addNewEventButton.disabled = false;
  }

  setCloseHandler = (callback) => {
    const editRollupButton = this.element.querySelector('.event__rollup-btn');
    if (editRollupButton !== null) {
      this._callback.closeEdit = callback;
      editRollupButton.addEventListener('click', this.#closeHandler);

    }
  }

  #closeHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEdit();
  }

  setDeleteClickHandler = (callback) => {
    this._callback.eventReset = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#eventResetHandler);
  }

  #eventResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.eventReset(EditEventView.parseDataToEvents(this._data));
    addNewEventButton.disabled = false;
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: this.#possibleOffers[evt.target.value],
    }
    );
  }

  #offerChangeHandler = (evt) => {
    evt.preventDefault();

    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    const checkedOffersValues = checkedOffers.map((offer) => ({
      id: Number(offer.dataset.id),
      title: offer.dataset.title,
      price: Number(offer.dataset.price),
    }));

    this.updateData({
      offers: checkedOffersValues,
    }, true);
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const newDestination = this.#possibleDestinations.find((destination) => destination.name === evt.target.value);

    this.updateData({
      destination: {
        description: newDestination.description,
        name: newDestination.name,
        pictures: newDestination.pictures,
      },
    });

  };

  #onPriceInput = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: Number(evt.target.value),
    }, true);
  }

  static parseEventToData = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseDataToEvents = (data) => {
    const event = { ...data };

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}

