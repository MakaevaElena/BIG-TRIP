import { getRandomInteger, getRandomArrayItem } from '../utils/common.js';
import { generateDescription, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers } from './utils-mock.js';
import { DESTINATIONS } from './data-mock';
import { nanoid } from 'nanoid';
const PRICE_MIN = 100;
const PRICE_MAX = 1000;
const PHOTOS_MAX = 5;
const OFFERS_MAX = 8;

// Пункт назначения
const generateDestination = () => getRandomArrayItem(DESTINATIONS);

// Точка маршрута
const generateEvent = () => {
  const dateFrom = generateDateFrom();
  return {
    basePrice: getRandomInteger(PRICE_MIN, PRICE_MAX),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    destination: {
      description: generateDescription(),
      name: generateDestination(),
      pictures: generatePhotos(PHOTOS_MAX),
    },
    id: nanoid(),
    isFavorite: false,
    offers: generateOffers(OFFERS_MAX),
    type: generateEventType(),
  };
};

export { generateEvent };

