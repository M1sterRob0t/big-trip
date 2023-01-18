import {monthes} from "../constants/constants";
import {createElement} from "../utils";


const createTripInfoTemplate = (points) => {
  const price = points.length > 0 ? points.reduce((acc, cur) => acc + cur.price, 0) : 0;
  const route = points.length > 0 ? points.map((point) => point.destination.name) : null;
  const monthStart = points.length > 0 ? points.at(0).dateFrom.getMonth() : null;
  const dayStart = points.length > 0 ? points.at(0).dateFrom.getDate() : null;
  const monthFinish = points.length > 0 ? points.at(-1).dateFrom.getMonth() : null;
  const dayFinish = points.length > 0 ? points.at(-1).dateFrom.getDate() : null;

  return (`
    <section class="trip-main__trip-info  trip-info">
      ${points.length > 0 ? `
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${createTitleMarkup(route)}
        </h1>

        <p class="trip-info__dates">
          ${monthes[monthStart]} ${dayStart}&nbsp;&mdash;&nbsp;${monthStart !== monthFinish ? monthes[monthFinish] : ``} ${dayFinish}
        </p>
      </div>
      ` : ``}
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>
  `);
};

const createTitleMarkup = (route) => {
  let title;

  if (route.length > 3) {
    title = `${route[0]} &mdash; ... &mdash; ${route[route.length - 1]}`;
  } else if (route.length === 3) {
    title = `${route[0]} &mdash; ${route[1]} &mdash; ${route[2]}`;
  } else if (route.length === 2) {
    title = `${route[0]} &mdash; ${route[1]}`;
  } else if (route.length === 1) {
    title = `${route[0]}`;
  } else {
    title = ``;
  }

  return (`
    <h1 class="trip-info__title">${title}</h1>
  `);
};

export default class TripInfo {
  constructor(points) {
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
