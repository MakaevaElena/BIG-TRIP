import EditEventView from '../view/edit-event-view.js';
import { UserAction, UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../utils/render.js';

export default class EventNewPresenter {
  #eventListContainer = null;
  #changeData = null;
  #eventEditComponent = null;

  constructor(eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (event, commonOffers, commonDestinations) => {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EditEventView(event, commonOffers, commonDestinations);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#eventListContainer, this.#eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#eventEditComponent === null) {
      return;
    }

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      event,
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
