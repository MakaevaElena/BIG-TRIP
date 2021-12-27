import AbstractObservable from '../utils/abstract-observable.js';

export default class EventsModel extends AbstractObservable {
  #events = [];

  set events(events) {
    this.#events = [...events];
  }

  get events() {
    return this.#events;
  }
}
