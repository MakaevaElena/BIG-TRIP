import { render, RenderPosition } from './utils/render.js';
import FilterView from './view/filter-view.js';
import MenuView from './view/menu-view.js';
import TripInfoView from './view/trip-info-view.js';
import CostView from './view/cost-view.js';
import EventsListView from './view/events-list-view.js';
import SortView from './view/sort-view.js';
import NoEventsView from './view/no-events-view.js';
import { updateItem } from '../utils/common.js';
// import { SortType } from '../src/const.js';
import EventPresenter from './event-presenter.js';

const WAYPOINT_COUNT = 10;
// const EVENTS_COUNT_PER_STEP = 5;

export default class TripPresenter {
  #tripMainContainer = null; //'.trip-main'
  #tripEventsContainer = null;//'.trip-events'
  #tripFiltersContainer = null;//'.trip-controls__filters'
  #menuContainer = null; //'.trip-controls__navigation'

  #menuComponent = new MenuView();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #eventsListComponent = new EventsListView(); //Board
  #noEventsComponent = new NoEventsView();
  #tripInfoComponent = new TripInfoView();
  #costComponent = new CostView();

  #events = [];
  #eventPresenter = new Map();
  // #currentSortType = SortType.DEFAULT;
  #sourcedEvents = [];

  constuctor(tripMainContainer, tripEventsContainer, tripFiltersContainer, menuContainer) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripFiltersContainer = tripFiltersContainer;
    this.#menuContainer = menuContainer;
  }

  init = (events) => {
    this.#events = [...events];
    this.#sourcedEvents = [...events];

    this.#renderTripInfo();
  }

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#sourcedEvents = updateItem(this.#sourcedEvents, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#handleEventChange, this.#handleModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  // #clearEvents = () => {
  //   this.#eventPresenter.forEach((presenter) => presenter.destroy());
  //   this.#eventPresenter.clear();
  // }

  #renderMenuButtons = () => {
    render(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
  };

  #renderFilters = () => {
    render(this.#tripFiltersContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }

  #renderSort = () => {
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents = () => {
    render(this.#tripEventsContainer, this.#noEventsComponent, RenderPosition.BEFOREEND);
  }

  #renderPrice() {
    // const tripInfoComponent = new TripInfoView();
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoComponent, this.#costComponent, RenderPosition.BEFOREEND);
  }

  #renderListEvent() {
    // const tripEventsListComponent = new EventsListView();
    //перенести в init?
    render(this.#tripEventsContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);
    // render(tripEventsListComponent, new NewEventView(generateNewEvent()), RenderPosition.BEFOREEND);
  }

  #renderEvents() {
    for (let i = 0; i < Math.min(this.#events.length, WAYPOINT_COUNT); i++) {
      this.#renderEvent(this.#eventsListComponent, this.#events[i]);
    }
  }

  #renderTripInfo() {
    if (this.#events.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderMenuButtons();
      this.#renderFilters();
      this.#renderSort();
      this.#renderPrice();
      this.#renderListEvent();
      this.#renderEvents();
    }
  }
}
