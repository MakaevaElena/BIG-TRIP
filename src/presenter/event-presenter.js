import EventView from '../view/event-view.js';
import EditEventView from '../view/edit-event-view.js';

import { UserAction, UpdateType, Mode } from '../const.js';

import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { isEscapeEvent } from '../utils/event-utils.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
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

  init = (event, offers, destinations) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEditEventComponent = this.#editEventComponent;
    this.#eventComponent = new EventView(event, offers);
    this.#editEventComponent = new EditEventView(event, offers, destinations);

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editEventComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editEventComponent.setDeleteClickHandler(this.#handleDeleteEvent);
    this.#editEventComponent.setCloseHandler(this.#handleCloseEditClick);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this.#eventsListContainer, this.#eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventComponent, prevEditEventComponent);
      this.#mode = Mode.DEFAULT;
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

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#editEventComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#editEventComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#editEventComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#eventComponent.shake(resetFormState);
        this.#editEventComponent.shake(resetFormState);
        break;
    }
  }

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
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToEvent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

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

