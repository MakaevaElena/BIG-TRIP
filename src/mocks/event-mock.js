import { getRandomInteger, getRandomArrayItem } from '../utils/common.js';
import { generateDescription, generateEventType, generatePhotos, generateDateFrom, generateDateTo, generateOffers } from './utils-mock.js';
import { DESTINATIONS } from './data-mock';
import { nanoid } from 'nanoid';
const PRICE_MIN = 100;
const PRICE_MAX = 1000;
const PHOTOS_MAX = 5;
const OFFERS_MAX = 3;

const generateDestinationName = () => getRandomArrayItem(DESTINATIONS);

const generateDestination = (cityName) => {
  const destination = {
    description: generateDescription(),
    name: cityName,
    pictures: generatePhotos(PHOTOS_MAX),
  };
  return destination;
};

const generateDestinations = DESTINATIONS.map((cityName) => generateDestination(cityName));

const generateEvent = () => {
  const dateFrom = generateDateFrom();
  const generetedType = generateEventType();
  const cityName = generateDestinationName();
  return {
    basePrice: getRandomInteger(PRICE_MIN, PRICE_MAX),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    destination: generateDestination(cityName),
    id: nanoid(),
    isFavorite: false,
    offers: generateOffers(generetedType, OFFERS_MAX),
    type: generetedType,
  };
};

export { generateEvent, generateDestinations };

