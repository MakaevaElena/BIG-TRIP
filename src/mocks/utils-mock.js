import dayjs from 'dayjs';
import { getRandomInteger, getRandomArrayItem } from '../utils/utils.js';
import { DESCRIPTIONS, TITLES, WAYPOINT_TYPES } from './data-mock.js';

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
const generatePhotos = (count) => {
  const photos = [];

  for (let i = 1; i <= count; i++) {
    const randomPhotoId = getRandomInteger(1, 2000);
    const randomPhoto = {
      src: `http://picsum.photos/248/152?r=${randomPhotoId}`,
      description: generateDescription(),
    };
    photos.push(randomPhoto);
  }

  return photos;
};

// Даты
const generateDateFrom = () => {
  const maxHoursGap = 100;
  const hoursGap = getRandomInteger(-maxHoursGap, maxHoursGap);

  const maxMinutesGap = 60;
  const minutesGap = getRandomInteger(-maxMinutesGap, maxMinutesGap);

  const dateFrom = dayjs()
    .add(hoursGap, 'hours')
    .add(minutesGap, 'minute')
    .toDate();

  return dateFrom;
};

const generateDateTo = () => {
  const maxHoursGap = 100;
  const hoursGap = getRandomInteger(-maxHoursGap, maxHoursGap);

  const maxMinutesGap = 60;
  const minutesGap = getRandomInteger(-maxMinutesGap, maxMinutesGap);

  const dateTo = dayjs()
    .add(hoursGap, 'hours')
    .add(minutesGap, 'minute')
    .toDate();

  return dateTo;
};

// Опции
const generateOffers = (max) => {
  const offersCount = getRandomInteger(1, max);

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
