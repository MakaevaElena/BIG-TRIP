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
// const sorters = sortByDate(events);

const WAYPOINT_COUNT = 10;

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
  #eventsListComponent = new EventsListView(); //Board
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
    // console.log(this.#sourcedEvents);

    this.#renderListEvent();
    this.#renderPage(this.#events);
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
    // const menuElement = this.#tripMainContainer.querySelector('.trip-controls__navigation');
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
    // const tripInfoComponent = new TripInfoView();
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoComponent, this.#costComponent, RenderPosition.BEFOREEND);
  }

  #renderListEvent = () => {
    // const tripEventsListComponent = new EventsListView();
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

  #renderPage = (events) => {
    this.#renderPriceAndRoute();
    this.#renderMenuButtons();
    this.#renderSort(events);
    // this.#renderFilters(filters);

    if (this.#events.length === 0) {
      this.#renderNoEvents();
    } else {
      // this.#renderListEvent();
      this.#renderEvents(events);
    }
  }
}
