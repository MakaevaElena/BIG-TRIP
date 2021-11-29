import { createContentEventListTemplate } from './view/content-view.js';
import { createEditEventTemplate } from './view/edit-event-view.js';
import { createEventTemplate } from './view/event-view.js';
import { createFilterTemplate } from './view/filter-view.js';
import { createMenuTemplate } from './view/menu-view.js';
import { createNewEventTemplate } from './view/new-event-view.js';
import { createRouteDateCostTemplate } from './view/route-date-cost-view.js';
import { createSortTemplate } from './view/sort-view.js';

// МОКИ
import { generateEvent } from './mocks/event-mock.js';
import { generateNewEvent } from './mocks/new-event-mock.js';
import { sortByDate } from './mocks/sort.js';
import { generateFilter } from './mocks/filter.js';

const tripMainElement = document.querySelector('.trip-main');
const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const WAYPOINT_COUNT = 20;
const EVENTS_COUNT_PER_STEP = 5;

//Генерация моковых обьектов
const events = Array.from({ length: WAYPOINT_COUNT }, generateEvent);
// console.log(events);

// сортировка по Дате
// пункт 2.18 taskmanager
const sortedEvents = sortByDate(events);

// ФИЛЬТРЫ
const filters = generateFilter(events);

// Отрисовка страницы
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// render(tripMainElement, createEventTemplate(sortedEvents), 'afterbegin');
render(tripMainElement, createRouteDateCostTemplate(), 'afterbegin');
render(menuElement, createMenuTemplate(), 'beforeend');
render(filterElement, createFilterTemplate(filters), 'beforeend');

render(tripEventsElement, createSortTemplate(sortedEvents), 'afterbegin');
render(tripEventsElement, createContentEventListTemplate(), 'beforeend');

// ul для списка точек, ищем после отрисовки блока createContentEventListTemplate
const tripEventsListElement = document.querySelector('.trip-events__list');

render(tripEventsListElement, createEditEventTemplate(events[0]), 'afterbegin');
render(tripEventsListElement, createNewEventTemplate(generateNewEvent()), 'beforeend');

for (let i = 1; i < Math.min(events.length, EVENTS_COUNT_PER_STEP); i++) {
  render(tripEventsListElement, createEventTemplate(events[i]), 'beforeend');
}

// скролл
if (events.length > EVENTS_COUNT_PER_STEP) {
  let renderedEventCount = EVENTS_COUNT_PER_STEP;

  window.addEventListener('scroll', (evt) => {
    evt.preventDefault();
    events
      .slice(renderedEventCount, renderedEventCount + EVENTS_COUNT_PER_STEP)
      .forEach((event) => render(tripEventsListElement, createEventTemplate(event), 'beforeend'));

    renderedEventCount += EVENTS_COUNT_PER_STEP;
  });
}


