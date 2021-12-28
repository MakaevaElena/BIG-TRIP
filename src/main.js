import TripPresenter from './presenter/trip-presenter.js';
// import { render, RenderPosition, } from './utils/render.js';
// import FilterView from './view/filter-view.js';
import { generateEvent } from './mocks/event-mock.js';
// import { generateFilter } from './utils/event-utils.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const WAYPOINT_COUNT = 10;

const events = Array.from({ length: WAYPOINT_COUNT }, generateEvent);

// const filters = generateFilter(events);

const filterModel = new FilterModel();

const tasksModel = new EventsModel();
tasksModel.tasks = events;

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, menuElement, EventsModel, FilterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, tasksModel);

// render(filterElement, new FilterView(filters, 'all'), RenderPosition.BEFOREEND);

// tripPresenter.init(events);
filterPresenter.init();
tripPresenter.init();

addNewEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
