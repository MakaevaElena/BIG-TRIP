import TripPresenter from './presenter/trip-presenter.js';
import { remove, render, RenderPosition, } from './utils/render.js';
// import FilterView from './view/filter-view.js';
import { generateEvent } from './mocks/event-mock.js';
// import { generateFilter } from './utils/event-utils.js';
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

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, menuElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      // Показать фильтры
      filterPresenter.init();
      // Показать доску
      tripPresenter.init();
      // Скрыть статистику
      remove(statisticsComponent);
      break;

    case MenuItem.STATS:
      // Скрыть фильтры
      filterPresenter.destroy();
      // Скрыть доску
      tripPresenter.destroy();
      // Показать статистику
      statisticsComponent = new StatisticsView(eventsModel.events);
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND);
filterPresenter.init();
tripPresenter.init();

//отобразим статистику
// render(tripMainElement, new StatisticsView(eventsModel.events), RenderPosition.BEFOREEND);

addNewEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
