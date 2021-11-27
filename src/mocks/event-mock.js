
const DESCRIPTIONS =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

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

// Тип
const generateEventType = () => getRandomArrayItem(WAYPOINT_TYPES);

// Пункт назначения
const generateDestination = () => getRandomArrayItem(DESTINATIONS);

// Опции
const generateOffers = (max) => {
  const offersCount = getRandomInteger(1, max);
  const offers = [];

  for (let i = 1; i < offersCount; i++) {
    const option = {
      // type: generateEventType(),
      title: DESCRIPTIONS(15),
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
      description: DESCRIPTIONS(),
    };
    photos.push(randomPhoto);
  }

  return photos;
};

// Точка маршрута
const generateEvent = () => ({
  type: generateEventType(),
  city: generateDestination(),
  offers: generateOffers(3),
  destination: {
    description: DESCRIPTIONS(),
    pictures: generatePhotos(3),
  },
});


