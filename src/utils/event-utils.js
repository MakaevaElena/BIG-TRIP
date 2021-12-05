import dayjs from 'dayjs';

const isEventAfter = (date) => date && dayjs().isAfter(date, 'D');
const isEventBefore = (date) => date && dayjs().isBefore(date, 'D');

//ф-я фильтра в коммите 2.17 репозитория taskmanager
const eventToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events.filter((event) => isEventAfter(event.dateFrom)).length,
  past: (events) => events.filter((event) => isEventBefore(event.dateTo)).length,
  // now: (events) => events.filter((event) => isEventBefore(event.dateFrom) && isEventAfter(event.dateTo)).length,
};

export const generateFilter = (events) => Object.entries(eventToFilterMap).map(
  ([filterName, countEvents]) => ({
    name: filterName,
    count: countEvents(events),
  }),
);

const createDateTemplate = (dateFrom, format) => dayjs(dateFrom).format(format);

const createOffersTemplate = (offers) => {
  let offersTemplate = '';

  offers.forEach((offer) => {
    const { title, price } = offer;

    const offerTemplate = `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
        </li>`;

    offersTemplate += offerTemplate;
  });
  return offersTemplate;
};

//2.17 tasckmanager
const sortByDate = (events) => {
  const eventsByDay = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);

  return eventsByDay;
};

const sortByPrice = (events) => {
  const eventsByPrice = events.slice().sort((a, b) => a.basePrice - b.basePrice);

  return eventsByPrice;
};

export { isEventAfter, isEventBefore, createDateTemplate, createOffersTemplate, sortByDate, sortByPrice };
