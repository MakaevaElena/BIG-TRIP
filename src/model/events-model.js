import AbstractObservable from '../utils/abstract-observable.js';
// import { UpdateType } from '../const.js';

export default class EventsModel extends AbstractObservable {
  #events = [];
  // #offers = [];
  // #destinations = [];
  // #apiService = null;

  // constructor(apiService) {
  //   super();
  //   this.#apiService = apiService;
  // }

  set events(events) {
    this.#events = [...events];
  }

  get events() {
    return this.#events;
  }

  // init = async () => {
  //   try {
  //     const events = await this.#apiService.events;
  //     this.#events = events.map(this.#adaptToClient);
  //   } catch (err) {
  //     this.#events = [];
  //   }
  //   this._notify(UpdateType.INIT);
  // }

  // #adaptToClient = (data) => {
  //   const adaptedData = {
  //     ...data,
  //     basePrice: data['base_price'],
  //     dateFrom: data['date_from'] !== null ? new Date(data['date_from']) : data['date_from'],
  //     dateTo: data['date_to'] !== null ? new Date(data['date_to']) : data['date_to'],
  //     isFavorite: data['is_favorite'],
  //   };

  //   delete adaptedData['base_price'];
  //   delete adaptedData['date_from'];
  //   delete adaptedData['date_to'];
  //   delete adaptedData['is_favorite'];

  //   return adaptedData;
  // }

  // updateEvent = async (updateType, update) => {
  updateEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
    // try {
    //   const response = await this.#apiService.updateEvent(update);
    //   const updatedEvent = this.#adaptToClient(response);
    //   this.#events = [
    //     ...this.#events.slice(0, index),
    //     updatedEvent,
    //     ...this.#events.slice(index + 1),
    //   ];
    //   this._notify(updateType, updatedEvent);
    // } catch (err) {
    //   throw new Error('Can\'t update event');
    // }
  }

  // addEvent = async (updateType, update) => {
  addEvent = (updateType, update) => {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
    // try {
    //   const response = await this.#apiService.addTask(update);
    //   const newEvent = this.#adaptToClient(response);
    //   this.#events = [newEvent, ...this.#events];
    //   this._notify(updateType, newEvent);
    // } catch (err) {
    //   throw new Error('Can\'t add event');
    // }
  }

  // deleteEvent = async (updateType, update) => {
  deleteEvent = (updateType, update) => {

    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);

    // try {
    //   // Обратите внимание, метод удаления задачи на сервере
    //   // ничего не возвращает. Это и верно,
    //   // ведь что можно вернуть при удалении задачи?
    //   await this.#apiService.deleteTask(update);
    //   this.#events = [
    //     ...this.#events.slice(0, index),
    //     ...this.#events.slice(index + 1),
    //   ];
    //   this._notify(updateType);
    // } catch (err) {
    //   throw new Error('Can\'t delete event');
    // }
  }

}
