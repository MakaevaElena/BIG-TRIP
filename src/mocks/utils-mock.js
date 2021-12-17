import dayjs from 'dayjs';
import { getRandomInteger, getRandomArrayItem } from '../utils/common.js';
import { DESCRIPTIONS, TITLES, WAYPOINT_TYPES } from './data-mock.js';

const MAX_HOURS_GAP = 24;
const MAX_MINUTES_GAP = 60;
const MIN_DURATION_HOURS = 1;
const MAX_DURATION_HOURS = 100;
const MIN_DURATION_MINUTES = 1;
const MAX_DURATION_MINUTES = 59;

// Даты

const generateDateFrom = () => {

  const daysGap = getRandomInteger(-MAX_HOURS_GAP, MAX_HOURS_GAP);
  const minutesGap = getRandomInteger(-MAX_MINUTES_GAP, MAX_MINUTES_GAP);

  const dateFrom = dayjs()
    .add(daysGap, 'day')
    .add(minutesGap, 'minute')
    .toDate();

  return dateFrom;
};

const generateDateTo = (dateFrom) => {

  const durationHours = getRandomInteger(MIN_DURATION_HOURS, MAX_DURATION_HOURS);
  const durationMinutes = getRandomInteger(MIN_DURATION_MINUTES, MAX_DURATION_MINUTES);

  const dateTo = dayjs(dateFrom)
    .add(durationHours, 'h')
    .add(durationMinutes, 'm')
    .toDate();

  return dateTo;
};

// Описание
const generateDescription = () => {
  const randomIndex = getRandomInteger(0, DESCRIPTIONS.length - 1);
  return DESCRIPTIONS[randomIndex];
};

// Название
const generateTitle = () => {
  const randomIndex = getRandomInteger(0, TITLES.length - 1);
  return TITLES[randomIndex];
};

// Тип
const generateEventType = () => getRandomArrayItem(WAYPOINT_TYPES);

// Фото
const generatePhotos = (max) => {
  const photoCounts = getRandomInteger(0, max);
  const photos = [];

  for (let i = 1; i <= photoCounts; i++) {
    const randomPhotoId = getRandomInteger(1, 2000);
    const randomPhoto = {
      src: `http://picsum.photos/248/152?r=${randomPhotoId}`,
      description: generateDescription(),
    };
    photos.push(randomPhoto);
  }

  return photos;
};

// Опции
const generateOffers = (max) => {
  const offersCount = getRandomInteger(0, max);

  const offers = [];

  for (let i = 1; i < offersCount; i++) {
    const offer = {
      id: getRandomInteger(1, 100),
      title: generateTitle(15),
      price: getRandomInteger(20, 200),
    };
    offers.push(offer);
  }
  return offers;
};

export { generateDescription, generateTitle, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers };
