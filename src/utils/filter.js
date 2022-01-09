import { FilterType } from '../const.js';
import dayjs from 'dayjs';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => event.dateTo > dayjs()),
  [FilterType.PAST]: (events) => events.filter((event) => event.dateFrom < dayjs()),
};

export { filter };
