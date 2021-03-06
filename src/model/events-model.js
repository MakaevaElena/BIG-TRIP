import AbstractObservable from '../observable/abstract-observable.js';
import { UpdateType } from '../const.js';

export default class EventsModel extends AbstractObservable {
  #events = [];
  #apiService = null;
  #offers = [];
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const events = await this.#apiService.events;
      this.#events = events.map(this.#adaptEventsToClient);
    } catch (err) {
      this.#events = [];
      throw new Error('Can\'t receive events');
    }

    try {
      const offers = await this.#apiService.offers;
      this.#offers = this.#adaptOffersToClient(offers);
    } catch (err) {
      this.#offers = [];
      throw new Error('Can\'t receive offers');
    }

    try {
      this.#destinations = await this.#apiService.destinations;
    } catch {
      this.#destinations = [];
      throw new Error('Can\'t receive destinations');
    }

    this._notify(UpdateType.INIT);
  }

  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  updateEvent = async (updateType, newEvent) => {
    const index = this.#events.findIndex((event) => event.id === newEvent.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#apiService.updateEvent(newEvent);
      const updatedEvent = this.#adaptEventsToClient(response);

      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType, updatedEvent);
    }
    catch (err) {
      throw new Error('Can\'t update event');
    }
  }

  addEvent = async (updateType, update) => {
    try {
      const response = await this.#apiService.addEvent(update);
      const newEvent = this.#adaptEventsToClient(response);
      this.#events = [newEvent, ...this.#events];

      this._notify(updateType, newEvent);
    }
    catch (err) {
      throw new Error('Can\'t add event');
    }
  }

  deleteEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }
    await this.#apiService.deleteEvent(update);

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptEventsToClient = (event) => {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        basePrice: event['base_price'],
        dateFrom: new Date(event['date_from']),
        dateTo: new Date(event['date_to']),
        isFavorite: event['is_favorite'],
      },
    );

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  #adaptOffersToClient = (serverOffers) => {
    const adaptedOffers = {};
    serverOffers.forEach((serverOffer) => {
      adaptedOffers[serverOffer.type] = serverOffer.offers;
    });
    return adaptedOffers;
  }

}
