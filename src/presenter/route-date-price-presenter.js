import { render, remove, RenderPosition } from '../utils/render.js';
import RouteView from '../view/trip-info-view.js';
import CostView from '../view/cost-view.js';

export default class RoutePresenter {
  #routeContainer = null;
  #eventsModel = null;
  #routeComponent = null;
  #priceComponent = null;

  constructor(routeBoard, eventsModel) {
    this.#routeContainer = routeBoard;
    this.#eventsModel = eventsModel;

    // this.#routeComponent = null;
    // this.#priceComponent = null;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderRoute();
  }

  #removeRoute = () => {
    if (this.#routeComponent !== null) {
      remove(this.#routeComponent);
      remove(this.#priceComponent);
    }
  }

  #renderRoute = () => {
    const events = this.#eventsModel.events;

    if (events.length > 0) {
      this.#routeComponent = new RouteView(events);
      this.#priceComponent = new CostView(events);

      render(this.#routeContainer, this.#routeComponent, RenderPosition.AFTERBEGIN);

      const tripInfoElement = document.querySelector('.trip-info');
      render(tripInfoElement, this.#priceComponent, RenderPosition.BEFOREEND);
    }
  }

  #handleModelEvent = () => {
    this.#removeRoute();
    this.#renderRoute();
  }
}
