import { render, RenderPosition } from './utils/render.js';
import FilterView from './view/filter-view.js';
import MenuView from './view/menu-view.js';
import TripInfoView from './view/trip-info-view.js';
import CostView from './view/cost.js';
import EventsListView from './view/events-list-view.js';
import SortView from './view/sort-view.js';
import EventView from './view/event-view.js';
import EditEventView from './view/edit-event-view.js';
import NewEventView from './view/new-event-view.js';
import NoEventsView from './view/no-events-view.js';

// МОКИ
import { generateEvent } from './mocks/event-mock.js';
import { generateNewEvent } from './mocks/new-event-mock.js';
import { sortByDate } from './mocks/sort.js';
import { generateFilter } from './mocks/filter.js';

const tripMainElement = document.querySelector('.trip-main');
const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const WAYPOINT_COUNT = 10;
const EVENTS_COUNT_PER_STEP = 5;

//Генерация моковых обьектов
const events = Array.from({ length: WAYPOINT_COUNT }, generateEvent);
const filters = generateFilter(events);
const sorters = sortByDate(events);

// Функции рендера
const renderEvent = (eventsList, event) => {
  const eventComponent = new EventView(event);
  const editEventComponent = new EditEventView(event);

  const replaceEventToEdit = () => {
    eventsList.replaceChild(editEventComponent.element, eventComponent.element);
  };

  const replaceEditToEvent = () => {
    eventsList.replaceChild(eventComponent.element, editEventComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEventToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEditToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.element.querySelector('.event__reset-btn').addEventListener('click', () => {
    replaceEditToEvent();
    eventsList.removeChild(eventComponent.element);
    eventComponent.removeElement();
    editEventComponent.removeElement();
  });

  editEventComponent.element.querySelector('.event__save-btn').addEventListener('click', () => {
    replaceEditToEvent();
  });

  render(eventsList, eventComponent.element, RenderPosition.BEFOREEND);
};

const renderMenuButtons = () => {
  render(menuElement, new MenuView().element, RenderPosition.BEFOREEND);
  render(filterElement, new FilterView(filters).element, RenderPosition.BEFOREEND);
  render(tripEventsElement, new SortView(sorters).element, RenderPosition.AFTERBEGIN);
};

const renderTripInfo = (allEvents) => {

  if (allEvents.length === 0) {
    render(tripEventsElement, new NoEventsView().element, RenderPosition.BEFOREEND);

  } else {
    // заменили на компонент вместо querySelector('.trip-info')
    const tripInfoComponent = new TripInfoView().element;
    render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(tripInfoComponent, new CostView().element, RenderPosition.BEFOREEND);

    // ul для списка точек,заменили на компонент вместо querySelector('.trip-events__list');
    const tripEventsListComponent = new EventsListView().element;
    render(tripEventsElement, tripEventsListComponent, RenderPosition.BEFOREEND);
    render(tripEventsListComponent, new NewEventView(generateNewEvent()).element, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(events.length, EVENTS_COUNT_PER_STEP); i++) {
      renderEvent(tripEventsListComponent, events[i]);
    }

    if (events.length > EVENTS_COUNT_PER_STEP) {
      let renderedEventCount = EVENTS_COUNT_PER_STEP;

      window.addEventListener('scroll', (evt) => {
        evt.preventDefault();
        events
          .slice(renderedEventCount, renderedEventCount + EVENTS_COUNT_PER_STEP)
          .forEach((event) => renderEvent(tripEventsListComponent, event));

        renderedEventCount += EVENTS_COUNT_PER_STEP;
      });
    }
  }
};

// рендер страницы
renderMenuButtons(events);
renderTripInfo(events);
