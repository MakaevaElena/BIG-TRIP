import { render, RenderPosition } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { sortDateDown, sortDurationDown, sortPriceDown } from '../utils/event-utils.js';
import { SortType } from '../const.js';
// import FilterView from '../view/filter-view.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/new-event-view.js';
import MenuView from '../view/menu-view.js';
import TripInfoView from '../view/trip-info-view.js';
import CostView from '../view/cost-view.js';
import EventPresenter from './event-presenter.js';

// import { generateFilter } from '../utils/event-utils.js';
// const filters = generateFilter(events);

// const WAYPOINT_COUNT = 10;

export default class TripPresenter {
  #tripMainContainer = null; //'.trip-main'
  #tripMenuContainer = null; //'.trip-controls__navigation'
  // #tripFiltersContainer = null;//'.trip-controls__filters'
  #tripEventsContainer = null;//'.trip-events'

  #tripInfoComponent = new TripInfoView();
  #costComponent = new CostView();
  #menuComponent = new MenuView();
  // #filterComponent = new FilterView();
  #sortComponent = new SortView(SortType.DEFAULT);
  #eventsListComponent = new EventsListView();
  #noEventsComponent = new NoEventsView();

  #events = [];
  #eventPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedEvents = [];

  constructor(tripMainContainer, tripEventsContainer, tripMenuContainer) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    // this.#tripFiltersContainer = tripFiltersContainer;
    this.#tripMenuContainer = tripMenuContainer;
  }

  init = (events) => {
    this.#events = [...events];
    this.#sourcedEvents = [...events];
    this.#events.sort(sortDateDown);

    // const filters = generateFilter(events);
    this.#renderPage();
  }

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#sourcedEvents = updateItem(this.#sourcedEvents, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  #clearEvents = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  }

  #sortEvents = (sortType) => {
    switch (sortType) {
      case SortType.DEFAULT:
        this.#events.sort(sortDateDown);
        break;
      case SortType.DURATION_DOWN:
        this.#events.sort(sortDurationDown);
        break;
      case SortType.PRICE_DOWN:
        this.#events.sort(sortPriceDown);
        break;
      default:
        this.#events = [...this.#sourcedEvents];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortEvents(sortType);
    this.#clearEvents();
    this.#renderEvents();
  }

  #renderMenuButtons = () => {
    render(this.#tripMenuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
  };

  // #renderFilters = () => {
  //   const filterElement = this.#tripMainContainer.querySelector('.trip-controls__filters');
  //   render(filterElement, this.#filterComponent, RenderPosition.BEFOREEND);
  // }

  #renderSort = () => {
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderNoEvents = () => {
    render(this.#tripEventsContainer, this.#noEventsComponent, RenderPosition.BEFOREEND);
  }

  #renderPriceAndRoute = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoComponent, this.#costComponent, RenderPosition.BEFOREEND);
  }

  #renderListEvent = () => {
    render(this.#tripEventsContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#handleEventChange, this.#handleModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = (from, to) => {
    this.#events
      .slice(from, to)
      .forEach((event) => this.#renderEvent(event));
  }

  #renderPage = () => {
    this.#renderPriceAndRoute();
    this.#renderMenuButtons();
    if (this.#events.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderListEvent();
      this.#renderEvents();
    }
  }
}
