import TripPresenter from './presenter/trip-presenter.js';
import { render, RenderPosition, } from './utils/render.js';
// import FilterView from './view/filter-view.js';
import { generateEvent } from './mocks/event-mock.js';
// import { generateFilter } from './utils/event-utils.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MenuView from './view/menu-view.js';
import { MenuItem } from './const.js';
import StatisticsView from './view/statistics-view.js';

const tripMainElement = document.querySelector('.trip-main');
const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
// const addNewEventButton = document.querySelector('.trip-main__event-add-btn');
const siteMenuComponent = new MenuView();

const WAYPOINT_COUNT = 10;

const events = Array.from({ length: WAYPOINT_COUNT }, generateEvent);

// const filters = generateFilter(events);

const filterModel = new FilterModel();

const eventsModel = new EventsModel();
eventsModel.tasks = events;

render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND);
// render(filterElement, new FilterView(filters, 'all'), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, menuElement, EventsModel, FilterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);

const handleEventNewFormClose = () => {
  siteMenuComponent.element.querySelector(`[aria-label=${MenuItem.TABLE}]`).disabled = false;
  siteMenuComponent.element.querySelector(`[aria-label=${MenuItem.STATS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      // Скрыть статистику
      // Показать фильтры
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      filterPresenter.destroy();
      filterPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createEvent(handleEventNewFormClose);
      siteMenuComponent.element.querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      siteMenuComponent.element.querySelector(`[value=${MenuItem.STATISTICS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      // Показать фильтры
      filterPresenter.init();
      // Показать доску
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      // Скрыть фильтры
      filterPresenter.destroy();
      // Скрыть доску
      tripPresenter.destroy();
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

// tripPresenter.init(events);
// filterPresenter.init();
// tripPresenter.init();

// Для удобства отладки скроем Фильтры и доску
// filterPresenter.init();
// boardPresenter.init();
// и отобразим сразу статистику
render(tripMainElement, new StatisticsView(eventsModel.events), RenderPosition.BEFOREEND);

// addNewEventButton.addEventListener('click', (evt) => {
//   evt.preventDefault();
//   tripPresenter.createEvent();
// });
