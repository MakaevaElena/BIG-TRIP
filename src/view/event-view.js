import dayjs from 'dayjs';
import { createDateTemplate, eventDurationFormat } from '../utils/event-utils.js';
import AbstractView from './abstract-view.js';
import he from 'he';

const EVENT_DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

const createTypeIconTemplate = (type) =>
  `<div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${String(type).toLowerCase()}.png" alt="Event ${type} icon">
  </div>`;

const createTitleTemplate = (type, destination) => `<h3 class="event__title">${type} ${he.encode(destination.name)}</h3>`;

const createScheduleTemplate = (dateFrom, dateTo) => {
  const startTimeFormat = dayjs(dateFrom).format(TIME_FORMAT);
  const endTimeFormat = dayjs(dateTo).format(TIME_FORMAT);
  const duration = dayjs(dateTo).diff(dayjs(dateFrom), 'm');

  return ` <div class="event__schedule">
<p class="event__time">
  <time class="event__start-time" datetime="${dateFrom}">${startTimeFormat}</time>
  &mdash;
  <time class="event__end-time" datetime="${dateTo}">${endTimeFormat}</time>
</p>
<p class="event__duration">${eventDurationFormat(duration)}</p>
</div>`;
};

const createOffersTemplate = (offers) => {
  let offersTemplate = '';

  offers.forEach((offer) => {
    const { title, price } = offer;

    const offerTemplate = `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
        </li>`;

    offersTemplate += offerTemplate;
  });
  return offersTemplate;
};

const createFavoriteTemplate = (isFavorite) => {
  const isFavoriteClass = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';
  return ` <button class="${isFavoriteClass}" type="button">
<span class="visually-hidden">Add to favorite</span>
<svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
</svg>
</button>`;
};

const createEventTemplate = (someEvent) => {
  const {
    type,
    offers,
    destination,
    dateFrom,
    dateTo,
    isFavorite,
    basePrice,
  } = someEvent;

  return `<li class="trip-events__item">
  <div class="event">

    <time class="event__date" datetime="${dateFrom}">${createDateTemplate(dateFrom, EVENT_DATE_FORMAT)}</time>

    ${createTypeIconTemplate(type)}

    ${createTitleTemplate(type, destination)}

    ${createScheduleTemplate(dateFrom, dateTo)}

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
     ${createOffersTemplate(offers)}
    </ul>

    ${createFavoriteTemplate(isFavorite)}

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class EventView extends AbstractView {
  #event = null;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEventTemplate(this.#event);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }


  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClick);
  }

  #favoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

}

