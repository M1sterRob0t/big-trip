import Point from "./models/point";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};


export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getData() {
    return Promise.all([this.getPoints(), this.getOffers(), this.getDestinations()]);
  }

  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/points`, {headers})
      .then((response) => response.json())
      .then((data) => Point.parsePoints(data));
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/offers`, {headers}).then((response) => response.json());
  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/destinations`, {headers})
      .then(checkStatus)
      .then((response) => response.json());
  }

  updatePoint(id, point) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-type`, `application/json`);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/points/${id}`, {
      headers,
      method: Method.PUT,
      body: JSON.stringify(Point.dataToRaw(point)),
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => Point.parsePoint(data));
  }

  createPoint(point) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-type`, `application/json`);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/points`, {
      headers,
      method: Method.POST,
      body: JSON.stringify(Point.dataToRaw(point)),
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => Point.parsePoint(data));
  }

  deletePoint(point) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-type`, `application/json`);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/points/${point.id}`, {
      headers,
      method: Method.DELETE,
      body: JSON.stringify(Point.dataToRaw(point)),
    })
      .then(checkStatus);
  }
}
