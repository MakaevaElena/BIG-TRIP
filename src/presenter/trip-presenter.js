import EventNewPresenter from './event-new-presenter.js';
import EventPresenter, { State } from './event-presenter.js';

import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import LoadingView from '../view/loading-view.js';

import { DEFAULT_EVENT } from '../const.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

import { render, RenderPosition, remove } from '../utils/render.js';
import { sortDateDown, sortDurationDown, sortPriceDown } from '../utils/event-utils.js';
import { filter } from '../utils/filter.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #eventsModel = null;
  #sortComponent = null;
  #filterModel = null;

  #eventsListComponent = new EventsListView();
  #noEventsComponent = null;
  #eventPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #eventNewPresenter = null;
  #isLoading = true;
  #loadingComponent = new LoadingView();

  constructor(tripEventsContainer, eventsModel, filterModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#noEventsComponent = new NoEventsView(this.#filterType);

    this.#eventNewPresenter = new EventNewPresenter(this.#eventsListComponent, this.#handleViewAction);
  }

  init = () => {
    this.events.sort(sortDateDown);

    this.#renderBoard();

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);
    this.#filterType = this.#filterModel.filter;

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

  createEvent = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (!this.#tripEventsContainer.contains(this.#eventsListComponent.element)) {
      this.#renderListEvent();
    }

    this.#eventNewPresenter.init(DEFAULT_EVENT, this.#eventsModel.offers, this.#eventsModel.destinations);

    remove(this.#noEventsComponent);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents = () => {
    render(this.#tripEventsContainer, this.#noEventsComponent, RenderPosition.BEFOREEND);
  }

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
    eventPresenter.init(event, this.#eventsModel.offers, this.#eventsModel.destinations);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = () => {
    this.events.forEach((event) => this.#renderEvent(event));
  }

  #renderBoard = () => {
    const events = this.events;
    const eventsCount = events.length;
    if (this.#isLoading) {
      this.#renderLoading();
    } else {
      if (eventsCount.length === 0) {
        this.#renderNoEvents();
        return;
      }

      this.#renderSort();
      this.#renderListEvent();
      this.#renderEvents(events);
    }
  }

  #renderLoading = () => {
    render(this.#tripEventsContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenter.get(update.id).setViewState(State.SAVING);
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;

      case UserAction.ADD_EVENT:
        this.#eventNewPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          this.#eventNewPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_EVENT:
        this.#eventPresenter.get(update.id).setViewState(State.DELETING);
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(data.id).init(data, this.#eventsModel.offers, this.#eventsModel.destinations);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard();
        remove(this.#sortComponent);
        remove(this.#noEventsComponent);

        if (!this.events.length) {
          this.#renderNoEvents();
        }

        {
          this.#currentSortType = SortType.DEFAULT;
          this.#renderBoard();
        }
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
}
