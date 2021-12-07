import { getRandomInteger, getRandomArrayItem } from '../utils/common.js';
import { generateDescription, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers } from './utils-mock.js';
import { DESTINATIONS } from './data-mock';

// Пункт назначения
const generateDestination = () => getRandomArrayItem(DESTINATIONS);

// Точка маршрута
const generateEvent = () => {
  const dateFrom = generateDateFrom();
  return {
    basePrice: getRandomInteger(100, 1000),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    destination: {
      description: generateDescription(),
      name: generateDestination(),
      pictures: generatePhotos(3),
    },
    id: getRandomInteger(1, 100),
    isFavorite: false,
    offers: generateOffers(3),
    type: generateEventType(),
  };
};

export { generateEvent };

