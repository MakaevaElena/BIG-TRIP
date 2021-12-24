import { getRandomInteger, getRandomArrayItem } from '../utils/common.js';
import { generateDescription, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers } from './utils-mock.js';
import { DESTINATIONS } from './data-mock';
import { nanoid } from 'nanoid';
const PRICE_MIN = 100;
const PRICE_MAX = 1000;
const PHOTOS_MAX = 5;
const OFFERS_MAX = 8;

// Пункт назначения
const generateDestinationName = () => getRandomArrayItem(DESTINATIONS);

const generateDestination = () => {
  const destination = {
    description: generateDescription(),
    name: generateDestinationName(),
    pictures: generatePhotos(PHOTOS_MAX),
  };
  return destination;
};

const generateDestinations = (max) => {
  const counts = getRandomInteger(0, max);
  const destinations = [];
  for (let i = 1; i <= counts; i++) {
    const newDest = generateDestination();
    destinations.push(newDest);
  }
  return destinations;
};

// Точка маршрута
const generateEvent = () => {
  const dateFrom = generateDateFrom();
  const generetedType = generateEventType();
  return {
    basePrice: getRandomInteger(PRICE_MIN, PRICE_MAX),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    destination: generateDestination(),
    // destination: {
    //   description: generateDescription(),
    //   name: generateDestinationName(),
    //   pictures: generatePhotos(PHOTOS_MAX),
    // },
    id: nanoid(),
    isFavorite: false,
    offers: generateOffers(generetedType, OFFERS_MAX),
    type: generetedType,
  };
};

export { generateEvent, generateDestinations };

