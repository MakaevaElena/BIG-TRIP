import { render, RenderPosition } from './utils/render.js';
import FilterView from './view/filter-view.js';
import MenuView from './view/menu-view.js';
import RouteView from './view/route.js';
import CostView from './view/cost.js';
import BoardView from './view/board-view.js';
import SortView from './view/sort-view.js';
import EventView from './view/event-view.js';
import EditEventView from './view/edit-event-view.js';
import NewEventView from './view/new-event-view.js';

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

render(tripMainElement, new RouteView().element, RenderPosition.AFTERBEGIN);
const tripInfoElement = document.querySelector('.trip-info');
render(tripInfoElement, new CostView().element, RenderPosition.BEFOREEND);
render(menuElement, new MenuView().element, RenderPosition.BEFOREEND);
render(filterElement, new FilterView(filters).element, RenderPosition.BEFOREEND);
render(tripEventsElement, new SortView(sortedEvents).element, RenderPosition.AFTERBEGIN);
render(tripEventsElement, new BoardView().element, RenderPosition.BEFOREEND);
// ul для списка точек, ищем после отрисовки блока createContentEventListTemplate
const tripEventsListElement = document.querySelector('.trip-events__list');

render(tripEventsListElement, new EditEventView(events[0]).element, RenderPosition.AFTERBEGIN);
render(tripEventsListElement, new NewEventView(generateNewEvent()).element, RenderPosition.BEFOREEND);

for (let i = 1; i < Math.min(events.length, EVENTS_COUNT_PER_STEP); i++) {
  render(tripEventsListElement, new EventView(events[i]).element, RenderPosition.BEFOREEND);
}

// скролл не работает
if (events.length > EVENTS_COUNT_PER_STEP) {
  let renderedEventCount = EVENTS_COUNT_PER_STEP;

  window.addEventListener('scroll', (evt) => {
    evt.preventDefault();
    events
      .slice(renderedEventCount, renderedEventCount + EVENTS_COUNT_PER_STEP)
      .forEach((event) => render(tripEventsListElement, new EventView(event).element, RenderPosition.BEFOREEND));

    renderedEventCount += EVENTS_COUNT_PER_STEP;
  });
}


