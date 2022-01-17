import dayjs from 'dayjs';

const SortType = {
  DEFAULT: 'day-down',
  PRICE_DOWN: 'price-down',
  DURATION_DOWN: 'duration-down',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const MenuItem = {
  TABLE: 'table',
  STATS: 'stats',
};

const DEFAULT_EVENT = {
  basePrice: 2000,
  dateFrom: dayjs(),
  dateTo: dayjs().add(3, 'd'),
  destination: {
    description: 'Description of New City',
    name: 'Choose destination',
    pictures: [],
  },
  id: 80,
  isFavorite: true,
  offers: [],
  type: 'Flight',
};

export { SortType, UserAction, UpdateType, FilterType, MenuItem, DEFAULT_EVENT };
