import dayjs from 'dayjs';

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',

  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris',

  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus',
];

const TITLES = [
  'Lorem ipsum dolor sit amet',
  'consectetur adipiscing',
  'Nullam nunc',
];

const WAYPOINT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const DESTINATIONS = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'New-York',
  'Prague',
  'Rio',
  'Oslo',
  'Moscow',
  'Tokyo',
  'Kioto',
  'Berlin',
  'Honkong',
];

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayItem = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
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

// Пункт назначения
const generateDestination = () => getRandomArrayItem(DESTINATIONS);

// Опции
const generateOffers = (max) => {
  const offersCount = getRandomInteger(1, max);
  // type: generateEventType(),
  const offers = [];

  for (let i = 1; i < offersCount; i++) {
    const option = {
      id: getRandomInteger(1, 20),
      title: generateTitle(15),
      price: getRandomInteger(20, 200),
    };
    offers.push(option);
  }
  return offers;
};

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

// Точка маршрута
const generateEvent = () => ({
  type: generateEventType(),

  offers: generateOffers(3),
  destination: {
    description: generateDescription(),
    name: generateDestination(),
    pictures: generatePhotos(3),
  },
  dateFrom: generateDateFrom(),
  dateTo: generateDateTo(),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  basePrice: getRandomInteger(100, 1000),
});

export { generateEvent };

