
//2.17 tasckmanager
export const sortByDate = (events) => {
  const eventsByDay = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);

  return eventsByDay;
};

export const sortByPrice = (events) => {
  const eventsByPrice = events.slice().sort((a, b) => a.basePrice - b.basePrice);

  return eventsByPrice;
};
