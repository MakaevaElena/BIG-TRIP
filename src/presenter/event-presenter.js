import EventView from '../view/event-view.js';
import EditEventView from '../view/edit-event-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsListContainer = null;
  #changeDate = null;
  #changeMode = null;

  #eventComponent = null;
  #editEventComponent = null;

  #event = null;
  #mode = Mode.DEFAULT;

  constructor(eventsListContainer, changeDate, changeMode) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeDate = changeDate;
    this.#changeMode = changeMode;
  }

  init = (event) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView(event);

    this.#editEventComponent = new EditEventView(event);

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editEventComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editEventComponent.setDeleteHandler(this.#deleteEvent);
    this.#editEventComponent.setCloseHandler(this.#replaceFormToEvent);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this.#eventsListContainer, this.#eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }

  #deleteEvent = () => {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  }

  #replaceEventToForm = () => {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#editEventComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeDate({ ...this.#event, isFavorite: !this.#event.isFavorite });
  }

  #handleEditClick = () => {
    this.#replaceEventToForm();
  }

  #handleFormSubmit = (event) => {
    this.#changeDate(event);
    this.#replaceFormToEvent();
  }

}

