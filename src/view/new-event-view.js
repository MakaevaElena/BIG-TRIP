import { createDateTemplate } from '../utils/event-utils.js';
import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common.js';
import { generateDescription, generatePhotos, generateOffers, generateEventType } from '../mocks/utils-mock.js';
import { WAYPOINT_TYPES, DESTINATIONS } from '../mocks/data-mock.js';

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


const createEditOffersTemplate = (offers) => {

  const offerItems = offers.map((offer) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage">
      <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
                        </label>
    </div>`
  ));

  return `<div class="event__available-offers">
            ${offerItems.join('\n')}
          </div>`;
};

const createPhotosTemplate = (photos) => {
  let photosTemplate = '';

  photos.forEach((photo) => {
    const { src: source, description: alt } = photo;
    const photoTemplate = `<img class="event__photo" src="${source}" alt="${alt}">`;
    photosTemplate += photoTemplate;
  });
  return photosTemplate;
};

const createPhotosContainer = (destination) => (
  `<div class="event__photos-container">
<div class="event__photos-tape">
  ${createPhotosTemplate(destination.pictures)}
</div>
</div>`
);

const generateNewEvent = () => {
  const dateFrom = dayjs();
  const dateTo = '';

  return {
    basePrice: 0,
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: {
      description: generateDescription(30),
      name: '',
      pictures: generatePhotos(),
    },
    id: getRandomInteger(0, 9999),
    isFavorite: '',
    offers: generateOffers(6),
    type: generateEventType(),
  };
};

const createNewEventTemplate = (someEvent) => {
  const {
    id,
    type,
    dateFrom,
    dateTo,
    basePrice,
    offers,
    destination,
  } = someEvent;

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${createTypeListTemplate(id, type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      Flight
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${createCityOptionsTemplate()}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${createDateTemplate(dateFrom, 'DD/MM/YY HH:MM')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${createDateTemplate(dateTo, 'DD/MM/YY HH:MM')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
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

export default class NewEventView extends AbstractView {
  #event = null;

  constructor(event = generateNewEvent()) {
    super();
    this.#event = event;
  }

  get template() {
    return createNewEventTemplate(this.#event);
  }
}
