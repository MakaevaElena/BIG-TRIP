import AbstractView from './abstract-view.js';

const createEventsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul`
);

export default class EventsListView extends AbstractView {
  get template() {
    return createEventsListTemplate();
  }
}

