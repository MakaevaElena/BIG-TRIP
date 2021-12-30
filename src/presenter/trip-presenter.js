import { render, RenderPosition, remove } from '../utils/render.js';
// import { updateItem } from '../utils/common.js';
import { sortDateDown, sortDurationDown, sortPriceDown } from '../utils/event-utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';
import EventNewPresenter from './event-new-presenter.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import MenuView from '../view/menu-view.js';
import TripInfoView from '../view/trip-info-view.js';
import CostView from '../view/cost-view.js';
import EventPresenter from './event-presenter.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #tripMenuContainer = null;
  #tripEventsContainer = null;
  #eventsModel = null;
  #sortComponent = null;
  #filterModel = null;

  #tripInfoComponent = new TripInfoView();
  #costComponent = new CostView();
  #menuComponent = new MenuView();
  #eventsListComponent = new EventsListView();
  #noEventsComponent = null;

  #eventPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #eventNewPresenter = null;

  constructor(tripMainContainer, tripEventsContainer, tripMenuContainer, eventsModel, filterModel) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripMenuContainer = tripMenuContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventNewPresenter = new EventNewPresenter(this.#eventsListComponent, this.#handleViewAction);
  }

  init = () => {
    this.events.sort(sortDateDown);
    this.#renderBoard();
    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredEvents.sort(sortDateDown);
      case SortType.DURATION_DOWN:
        return filteredEvents.sort(sortDurationDown);
      case SortType.PRICE_DOWN:
        return filteredEvents.sort(sortPriceDown);
    }
    return filteredEvents;
  }


  destroy = () => {
    this.#clearBoard();

    remove(this.#sortComponent);

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  createEvent = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#eventNewPresenter.init(callback);

    remove(this.#noEventsComponent);
  }

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;

      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;

      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard();
        remove(this.#sortComponent);
        remove(this.#noEventsComponent);
        this.#renderBoard();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderMenuButtons = () => {
    render(this.#tripMenuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    // render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents = () => {
    this.#noEventsComponent = new NoEventsView(this.#filterType);
    render(this.#tripEventsContainer, this.#noEventsComponent, RenderPosition.BEFOREEND);
  }

  #renderPriceAndRoute = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoComponent, this.#costComponent, RenderPosition.BEFOREEND);
  }

  // #clearEvents = () => {
  //   this.#eventPresenter.forEach((presenter) => presenter.destroy());
  //   this.#eventPresenter.clear();
  // }

  #clearBoard = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }
  }

  #renderListEvent = () => {
    render(this.#tripEventsContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = () => {
    const events = this.events;
    // console.log(events);
    events.forEach((event) => this.#renderEvent(event));
  }


  #renderBoard = () => {
    const events = this.events;
    const eventsCount = events.length;
    this.#renderPriceAndRoute();
    this.#renderMenuButtons();
    if (eventsCount === 0) {
      this.#renderNoEvents();
      return;
    }
    this.#renderSort();
    this.#renderListEvent();
    this.#renderEvents();

  }
}
