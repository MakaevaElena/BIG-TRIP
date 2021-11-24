import { createContentEventListTemplate } from './view/content-view.js';
import { createEditPointTemplate } from './view/edit-point-view.js';
import { createEventTemplate } from './view/event-view.js';
import { createFilterTemplate } from './view/filter-view.js';
import { createMenuTemplate } from './view/menu-view.js';
import { createNewPointTemplate } from './view/new-point-view.js';
import { createRouteDateCostTemplate } from './view/route-date-cost-view.js';
import { createSortTemplate } from './view/sort-view.js';

const tripMainElement = document.querySelector('.trip-main');
const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events'); //для сортировки


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createRouteDateCostTemplate(), 'afterbegin');
render(menuElement, createMenuTemplate(), 'beforeend');
render(filterElement, createFilterTemplate(), 'beforeend');

render(tripEventsElement, createSortTemplate(), 'afterbegin');
render(tripEventsElement, createContentEventListTemplate(), 'beforeend');

// ul для списка точек, ищем после отрисовки блока createContentEventListTemplate
const tripEventsListElement = document.querySelector('.trip-events__list');

render(tripEventsListElement, createEditPointTemplate(), 'afterbegin');
render(tripEventsListElement, createNewPointTemplate(), 'beforeend');
render(tripEventsListElement, createEventTemplate(), 'beforeend');
render(tripEventsListElement, createEventTemplate(), 'beforeend');
render(tripEventsListElement, createEventTemplate(), 'beforeend');


