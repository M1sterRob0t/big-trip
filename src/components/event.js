import {transferTypes, Preposition} from "../constants/constants";
import {capitalizeFirstLetter} from "../utils/common";
import AbstractComponent from "./abstract-component";
import moment from "moment";

const TIME_FORMAT = `HH:mm`;
const DATETIME_FORMAT = `YYYY-MM-DDTHH:mm`;

const getFormattedDuration = (durationInMinutes, durationInHours, durationInDays) => {
  let duration = ``;

  if (durationInDays > 0) {
    let hours = durationInHours - durationInDays * 24;
    let minutes = durationInMinutes - durationInHours * 60;

    duration = `
      ${durationInDays < 10 ? `0` + durationInDays : durationInDays}D
      ${hours < 10 ? `0` + hours : hours}H
      ${minutes < 10 ? `0` + minutes : minutes}M
    `;
  } else if (durationInHours > 0) {
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

  return duration;
};

const createTripEventTemplate = (point) => {
  const {type, destination, offers, price, dateFrom, dateTo} = point;
  const {name: city} = destination;
  const preposition = transferTypes.includes(type) ? Preposition.TO : Preposition.IN;

  const timeStart = moment(dateFrom).format(TIME_FORMAT);
  const timeEnd = moment(dateTo).format(TIME_FORMAT);
  const datetimeStart = moment(dateFrom).format(DATETIME_FORMAT);
  const datetimeEnd = moment(dateTo).format(DATETIME_FORMAT);

  const durationInMinutes = Math.floor(moment.duration(dateTo - dateFrom).asMinutes());
  const durationInHours = Math.floor(moment.duration(dateTo - dateFrom).asHours());
  const durationInDays = Math.floor(moment.duration(dateTo - dateFrom).asDays());
  const duration = getFormattedDuration(durationInMinutes, durationInHours, durationInDays);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${preposition} ${city}</h3>

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
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }
}
