import {monthes} from "../constants/constants";
import AbstractComponent from "./abstract-component";

const createTripDayTemplate = (date, counter) => {

  if (!date || !counter) {
    return (`
      <li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>
    `);
  }

  const formattedDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1 < 10 ? `0` + (date.getMonth() + 1) : (date.getMonth() + 1),
    date: date.getDate() < 10 ? `0` + date.getDate() : date.getDate(),
  };
  const datetime = `${formattedDate.year}-${formattedDate.month}-${formattedDate.date}`;

  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${counter}</span>
        <time class="day__date" datetime="${datetime}">${monthes[date.getMonth()]} ${date.getDate()}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>
  `);
};

export default class Day extends AbstractComponent {
  constructor(date, counter) {
    super();
    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._counter);
  }
}
