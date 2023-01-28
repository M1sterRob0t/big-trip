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

    return fetch(`https://13.ecmascript.pages.academy/big-trip/points`, {headers}).then((response) => response.json());
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/offers`, {headers}).then((response) => response.json());
  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://13.ecmascript.pages.academy/big-trip/destinations`, {headers}).then((response) => response.json());
  }
}
