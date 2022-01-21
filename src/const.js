import dayjs from 'dayjs';

const DateFormat = {
  EVENT_DATE_FORMAT: 'MMM D',
  TIME_FORMAT: 'HH:mm',
  DATE_TIME_FORMAT: 'DD/MM/YY HH:mm',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
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
  basePrice: '',
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  id: 80,
  isFavorite: true,
  offers: [],
  type: 'taxi',
};

const WAYPOINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export { DateFormat, SortType, UserAction, UpdateType, FilterType, MenuItem, DEFAULT_EVENT, WAYPOINT_TYPES };
