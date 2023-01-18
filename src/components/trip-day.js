import {monthes} from "../constants/constants";
import {createElement} from "../utils";

const createTripDayTemplate = (date, counter) => {

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

export default class Day {
  constructor(date, counter) {
    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._counter);
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
