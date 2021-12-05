import { getRandomInteger } from '../utils/common.js';
import { generateDescription, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers } from './utils-mock.js';


// Точка маршрута
const generateNewEvent = () => ({
  basePrice: 0,
  dateFrom: generateDateFrom(),
  dateTo: generateDateTo(),
  destination: {
    description: generateDescription(),
    name: '',
    pictures: generatePhotos(3),
  },
  id: getRandomInteger(1, 100),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: generateOffers(3),
  type: generateEventType(),
});

export { generateNewEvent };

