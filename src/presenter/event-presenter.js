import EventView from '../view/event-view.js';
import EditEventView from '../view/edit-event-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsListContainer = null;
  #changeData = null;
  #changeMode = null;

  #eventComponent = null;
  #editEventComponent = null;

  #event = null;
  #mode = Mode.DEFAULT;

  constructor(eventsListContainer, changeData, changeMode) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
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
    this.#editEventComponent.setDeleteHandler(this.#handleDeleteEvent);
    this.#editEventComponent.setCloseHandler(this.#handleCloseEditClick);

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
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  }

  // #handleDeleteEvent = () => {
  //   remove(this.#eventComponent);
  //   remove(this.#editEventComponent);
  // }

  // #handleFormSubmit = (event) => {
  //   this.#changeData(
  //     UserAction.UPDATE_EVENT,
  //     UpdateType.MINOR,
  //     event,
  //   );
  //   this.#replaceFormToEvent();
  // }

  //7.1.6 Реализует удаление и оптимизирует сохранение
  #handleDeleteEvent = (event) => {
    this.#changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  }

  #handleFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      update,
    );
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
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };

  // #handleFavoriteClick = () => {
  //   this.#changeData({ ...this.#event, isFavorite: !this.#event.isFavorite });
  // }
  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      { ...this.#event, isFavorite: !this.#event.isFavorite },
    );
  }

  #handleEditClick = () => {
    this.#replaceEventToForm();
  }

  #handleCloseEditClick = () => {
    this.#editEventComponent.reset(this.#event);
    this.#replaceFormToEvent();
  }

}

