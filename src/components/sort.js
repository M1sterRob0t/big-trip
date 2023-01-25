import AbstractComponent from "./abstract-component";
import {capitalizeFirstLetter} from "../utils/common";
import {SortType} from "../constants/constants";

const createTripSortTemplate = () => {
  const sortTypes = Object.values(SortType);
  return (`
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    ${sortTypes.map((el) => createSortItemMarkup(el)).join(``)}
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>
  `);
};

const createSortItemMarkup = (type) => {
  const isCheckded = (type === SortType.EVENT) ? `checked` : ``;

  return (`
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
        value="sort-${type}" data-sort-type=${type} ${isCheckded}>
      <label class="trip-sort__btn" for="sort-${type}">
        ${capitalizeFirstLetter(type)}
      </label>
    </div>
  `);
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.EVENT;
  }

  getTemplate() {
    return createTripSortTemplate();
  }

  get sortType() {
    return this._currentSortType;
  }

  set sortType(sortType) {
    this._currentSortType = sortType;
  }

  setSortTypeChangeHandler(cb) {
    this._currentSortType = SortType.EVENT;
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();

      const sortType = evt.target.dataset.sortType;

      if (this.sortType === sortType) {
        return;
      }

      this.sortType = sortType;

      cb(this.sortType);
    });
  }
}

