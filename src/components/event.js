import {transferTypes, Preposition} from "../constants/constants";
import {capitalizeFirstletter} from "../utils/common";
import AbstractComponent from "./abstract-component";

const createTripEventTemplate = (point) => {
  const {type, destination, offers, price, dateFrom, dateTo} = point;
  const {name: city} = destination;
  const preposition = transferTypes.includes(type) ? Preposition.TO : Preposition.IN;

  const dateStart = {
    year: dateFrom.getFullYear(),
    month: dateFrom.getMonth() < 10 ? `0` + dateFrom.getMonth() : dateFrom.getMonth(),
    date: dateFrom.getDate() < 10 ? `0` + dateFrom.getDate() : dateFrom.getDate(),
    hours: dateFrom.getHours() < 10 ? `0` + dateFrom.getHours() : dateFrom.getHours(),
    minutes: dateFrom.getMinutes() < 10 ? `0` + dateFrom.getMinutes() : dateFrom.getMinutes(),
  };

  const dateEnd = {
    year: dateTo.getFullYear(),
    month: dateTo.getMonth() < 10 ? `0` + dateTo.getMonth() : dateTo.getMonth(),
    date: dateTo.getDate() < 10 ? `0` + dateTo.getDate() : dateTo.getDate(),
    hours: dateTo.getHours() < 10 ? `0` + dateTo.getHours() : dateTo.getHours(),
    minutes: dateTo.getMinutes() < 10 ? `0` + dateTo.getMinutes() : dateTo.getMinutes(),
  };

  const timeStart = `${dateStart.hours}:${dateStart.minutes}`;
  const timeEnd = `${dateEnd.hours}:${dateEnd.minutes}`;
  const datetimeStart = `${dateStart.year}-${dateStart.month}-${dateStart.date}T${timeStart}`;
  const datetimeEnd = `${dateEnd.year}-${dateEnd.month}-${dateEnd.date}T${timeEnd}`;

  const durationInMinutes = Math.round((dateTo - dateFrom) / 1000 / 60);
  const durationInHours = Math.floor((dateTo - dateFrom) / 1000 / 60 / 60);
  const durationInDays = Math.floor((dateTo - dateFrom) / 1000 / 60 / 60 / 24);

  let duration = null;
  if (durationInDays >= 1) {
    let hours = durationInHours - durationInDays * 24;
    let minutes = durationInMinutes - durationInHours * 60;

    duration = `
      ${durationInDays < 10 ? `0` + durationInDays : durationInDays}D
      ${hours < 10 ? `0` + hours : hours}H
      ${minutes < 10 ? `0` + minutes : minutes}M
    `;
  } else if (durationInHours >= 1) {
    let minutes = durationInMinutes - durationInHours * 60;

    duration = `
      ${durationInHours < 10 ? `0` + durationInHours : durationInHours}H
      ${minutes < 10 ? `0` + minutes : minutes}M
    `;
  } else {
    duration = `
      ${durationInMinutes < 10 ? `0` + durationInMinutes : durationInMinutes}M
    `;
  }


  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstletter(type)} ${preposition} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${datetimeStart}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${datetimeEnd}">${timeEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers.map((offer) => createOffersMarkup(offer.title, offer.price)).join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

const createOffersMarkup = (title, price) => {

  return (`
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>
  `);
};

export default class Event extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createTripEventTemplate(this._point);
  }

  setRollupButtonClickHandler(cb) {
    this.getElement().addEventListener(`click`, cb);
  }
}
