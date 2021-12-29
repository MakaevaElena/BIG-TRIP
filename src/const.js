const SortType = {
  DEFAULT: 'day-down',
  PRICE_DOWN: 'price-down',
  DURATION_DOWN: 'duration-down',
};

const FilterType = {
  ALL: 'everything',
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
  // INIT: 'INIT',
};

const MenuItem = {
  ADD_NEW_EVENT: 'add-new-task',
  TABLE: 'table',
  STATS: 'stats',
};

const TypeColors = ['#158DEB', '#FFD054'];

export { SortType, UserAction, UpdateType, FilterType, MenuItem, TypeColors };
