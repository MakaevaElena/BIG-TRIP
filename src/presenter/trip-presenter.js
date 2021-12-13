import { render, RenderPosition } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { FILTERS, SORTING } from '../const.js';
import FilterView from '../view/filter-view.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/new-event-view.js';
import MenuView from '../view/menu-view.js';
import TripInfoView from '../view/trip-info-view.js';
import CostView from '../view/cost-view.js';

import EventPresenter from './event-presenter.js';

const WAYPOINT_COUNT = 10;
// const EVENTS_COUNT_PER_STEP = 5;

export default class TripPresenter {
  #tripMainContainer = null; //'.trip-main'
  #tripEventsContainer = null;//'.trip-events'
  #tripFiltersContainer = null;//'.trip-controls__filters'
  #tripMenuContainer = null; //'.trip-controls__navigation'

  #menuComponent = new MenuView();
  #filterComponent = new FilterView(FILTERS[0]);
  #sortComponent = new SortView(SORTING[0]);
  #eventsListComponent = new EventsListView(); //Board
  #noEventsComponent = new NoEventsView();
  #tripInfoComponent = new TripInfoView();
  #costComponent = new CostView();

  #events = [];
  #eventPresenter = new Map();
  // #currentSortType = SORTING[0];
  // #sourcedEvents = [];

  constuctor(tripMainContainer, tripEventsContainer, tripFiltersContainer, tripMenuContainer) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripFiltersContainer = tripFiltersContainer;
    this.#tripMenuContainer = tripMenuContainer;
  }

  init = (events) => {
    this.#events = [...events];
    // this.#sourcedEvents = [...events];
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    // this.#sourcedEvents = updateItem(this.#sourcedEvents, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  // #clearEvents = () => {
  //   this.#eventPresenter.forEach((presenter) => presenter.destroy());
  //   this.#eventPresenter.clear();
  // }
  // #sortTasks = (sortType) => { }
  // #handleSortTypeChange = (sortType) => { }

  #renderMenuButtons = () => {
    render(this.#tripMenuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
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

  #renderPriceAndRoute = () => {
    // const tripInfoComponent = new TripInfoView();
    this.#tripInfoComponent = new TripInfoView();
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoComponent, this.#costComponent, RenderPosition.BEFOREEND);
  }

  #renderListEvent = () => {
    // const tripEventsListComponent = new EventsListView();
    this.#eventsListComponent = new EventsListView();
    render(this.#tripEventsContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#handleEventChange, this.#handleModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = () => {
    for (let i = 0; i < Math.min(this.#events.length, WAYPOINT_COUNT); i++) {
      this.#renderEvent(this.#eventsListComponent, this.#events[i]);
    }
  }

  #renderBoard = () => {
    this.#renderMenuButtons();
    this.#renderFilters();
    this.#renderSort();
    if (this.#events.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderPriceAndRoute();
      this.#renderListEvent();
      this.#renderEvents();
    }
  }
}
