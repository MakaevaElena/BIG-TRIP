import AbstractView from './abstract-view.js';

import { sortByDate } from '../utils/event-utils.js';
import { createDateTemplate } from '../utils/event-utils.js';

const showStartEndEvents = (sortedEvents) => {
  const startEventName = sortedEvents[0].destination.name;
  const endEventName = sortedEvents[sortedEvents.length - 1].destination.name;

  const startEventDate = createDateTemplate(sortedEvents[0].dateFrom, 'MMM DD');
  const endEventDate = createDateTemplate(sortedEvents[sortedEvents.length - 1].dateFrom, 'MMM DD');

  const routeMessage = sortedEvents.length > 2 ?
    `${startEventName} &mdash; ... &mdash; ${endEventName}` :
    `${startEventName} &mdash; ${endEventName}`;

  const routeDates = `${startEventDate}&nbsp;&mdash;&nbsp;${endEventDate}`;

  return `<h1 class="trip-info__title">${routeMessage}</h1>
          <p class="trip-info__dates">${routeDates}</p>`;
};

const createTripInfoTemplate = (sortedEvents) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">

    ${showStartEndEvents(sortedEvents)}

    </div>
  </section>`
);

export default class RouteView extends AbstractView {
  #events = null;

  constructor(events) {
    super();
    this.#events = sortByDate(events);
  }

  get template() {
    return createTripInfoTemplate(this.#events);
  }
}
