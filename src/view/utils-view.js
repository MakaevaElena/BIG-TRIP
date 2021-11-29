import dayjs from 'dayjs';
const createDateTemplate = (dateFrom, format) => dayjs(dateFrom).format(format);

const createOffersTemplate = (offers) => {
  let offersTemplate = '';

  offers.forEach((offer) => {
    const { title, price } = offer;

    const offerTemplate = `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
        </li>`;

    offersTemplate += offerTemplate;
  });
  return offersTemplate;
};

export { createDateTemplate, createOffersTemplate };
