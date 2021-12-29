const calculateTypeCost = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const uniqueTypesCost = getUniqueAmount(uniqueTypes);

  events.forEach((event) => {
    uniqueTypesCost[event.type] += event.basePrice;
  });

  const uniqueTypesCostOrdered = new Map(Object.entries(uniqueTypesCost).sort((a, b) => b[1] - a[1]));

  return uniqueTypesCostOrdered;
};

const calculateTypeCount = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const uniqueTypesCount = getUniqueAmount(uniqueTypes);

  events.forEach((event) => {
    uniqueTypesCount[event.type]++;
  });

  const uniqueTypesCountOrdered = new Map(Object.entries(uniqueTypesCount).sort((a, b) => b[1] - a[1]));
  return uniqueTypesCountOrdered;
};

const calculateTypeTime = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const uniqueTypesTime = getUniqueAmount(uniqueTypes);

  events.forEach((event) => {
    const eventDuration = dayjs(event.dateTo).diff(dayjs(event.dateFrom), 'm');
    uniqueTypesTime[event.type] += eventDuration;
  });

  const uniqueTypesTimeOrdered = new Map(Object.entries(uniqueTypesTime).sort((a, b) => b[1] - a[1]));

  return uniqueTypesTimeOrdered;
};
export { calculateTypeCost, calculateTypeCount, calculateTypeTime }
