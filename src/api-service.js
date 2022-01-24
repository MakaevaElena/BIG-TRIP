import { Method } from './const.js';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get events() {
    return this.#load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this.#load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  updateEvent = async (data) => {
    const response = await this.#load({
      url: `points/${data.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(data)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  addEvent = async (data) => {
    const response = await this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(data)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  deleteEvent = async (data) => await this.#load({
    url: `points/${data.id}`,
    method: Method.DELETE,
  });

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers },
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (data) => {
    const adaptedData = {
      ...data,
      'base_price': data.basePrice,
      'date_from': data.dateFrom.toISOString(),
      'date_to': data.dateTo.toISOString(),
      'is_favorite': data.isFavorite,
      'id': String(data.id),
    };

    delete adaptedData.basePrice;
    delete adaptedData.dateFrom;
    delete adaptedData.dateTo;
    delete adaptedData.isFavorite;

    return adaptedData;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
