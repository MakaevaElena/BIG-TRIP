import { render, RenderPosition, replace, remove } from './utils/render.js';
import FilterView from './view/filter-view.js';
import MenuView from './view/menu-view.js';
import TripInfoView from './view/trip-info-view.js';
import CostView from './view/cost-view.js';
import EventsListView from './view/events-list-view.js';
import SortView from './view/sort-view.js';
import EventView from './view/event-view.js';
import EditEventView from './view/edit-event-view.js';
import NewEventView from './view/new-event-view.js';
import NoEventsView from './view/no-events-view.js';

// МОКИ
import { generateEvent } from './mocks/event-mock.js';
import { generateNewEvent } from './mocks/new-event-mock.js';
import { sortByDate } from './utils/event-utils.js';
import { generateFilter } from './utils/event-utils.js';

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
    replace(editEventComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, editEventComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.setFormSubmitHandler(() => {
    replaceEditToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.setFormSubmitHandler(() => {
    replaceEditToEvent();
    eventsList.removeChild(eventComponent);
    remove(eventComponent);
    remove(editEventComponent);
  });

  render(eventsList, eventComponent, RenderPosition.BEFOREEND);
};

const renderMenuButtons = () => {
  render(menuElement, new MenuView(), RenderPosition.BEFOREEND);
  render(filterElement, new FilterView(filters), RenderPosition.BEFOREEND);
  render(tripEventsElement, new SortView(sorters), RenderPosition.AFTERBEGIN);
};

const renderTripInfo = (allEvents) => {

  if (allEvents.length === 0) {
    render(tripEventsElement, new NoEventsView(), RenderPosition.BEFOREEND);

  } else {
    // заменили на компонент вместо querySelector('.trip-info')
    const tripInfoComponent = new TripInfoView();
    render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(tripInfoComponent, new CostView(), RenderPosition.BEFOREEND);

    // ul для списка точек,заменили на компонент вместо querySelector('.trip-events__list');
    const tripEventsListComponent = new EventsListView();
    render(tripEventsElement, tripEventsListComponent, RenderPosition.BEFOREEND);
    render(tripEventsListComponent, new NewEventView(generateNewEvent()), RenderPosition.BEFOREEND);

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
