import TripPresenter from './presenter/trip-presenter.js';
import { remove, render, RenderPosition, } from './utils/render.js';
import { generateEvent } from './mocks/event-mock.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MenuView from './view/menu-view.js';
import { MenuItem } from './const.js';
import StatisticsView from './view/statistics-view.js';

const EVENT_COUNT = 10;

const events = Array.from({ length: EVENT_COUNT }, generateEvent);
const eventsModel = new EventsModel();
eventsModel.events = events;

let statisticsComponent = null;
const filterModel = new FilterModel();
const siteMenuComponent = new MenuView();

const tripMainElement = document.querySelector('.trip-main');
const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.destroy();
      filterPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;

    case MenuItem.STATS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.events);
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

filterPresenter.init();
tripPresenter.init();

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND);

addNewEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
