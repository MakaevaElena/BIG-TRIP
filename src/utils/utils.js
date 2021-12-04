import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayItem = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
};

const isEventAfter = (date) => date && dayjs().isAfter(date, 'D');
const isEventBefore = (date) => date && dayjs().isBefore(date, 'D');

export { getRandomInteger, getRandomArrayItem, isEventAfter, isEventBefore };
