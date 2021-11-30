import { getRandomInteger, getRandomArrayItem } from '../utils/utils.js';
import { generateDescription, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers } from './utils-mock.js';
import { DESTINATIONS } from './data-mock';

// Пункт назначения
const generateDestination = () => getRandomArrayItem(DESTINATIONS);

// Точка маршрута
const generateEvent = () => ({
  basePrice: getRandomInteger(100, 1000),
  dateFrom: generateDateFrom(),
  dateTo: generateDateTo(),
  destination: {
    description: generateDescription(),
    name: generateDestination(),
    pictures: generatePhotos(3),
  },
  id: getRandomInteger(1, 100),
  isFavorite: false,
  offers: generateOffers(3),
  type: generateEventType(),
});

export { generateEvent };

