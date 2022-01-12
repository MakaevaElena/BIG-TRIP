import AbstractView from './abstract-view';

const createLoadingMessage = () => (
  '<p class="trip-events__msg">Loading...</p>'
);

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingMessage();
  }
}
