import AbstractSmartComponent from "./abstract-smart-component";
import {Filter, DEFAULT_FILTER_TYPE} from "../constants/constants";

const createTripFiltersTemplate = (points, currentFilter) => {
  const filters = Object.values(Filter);
  const isFuturePoints = points.filter((el) => el.dateFrom > new Date()).length > 0 ? true : false;
  const isPastPoints = points.filter((el) => el.dateFrom < new Date()).length > 0 ? true : false;

  return (`
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterMarkup(filter, currentFilter, isFuturePoints, isPastPoints)).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

const createFilterMarkup = (filterName, currentFilter, isFuturePoints, isPastPoints) => {
  const isChecked = (filterName === currentFilter) ? `checked` : ``;
  const isFutureDisabled = (filterName === Filter.FUTURE) && !isFuturePoints ? `disabled` : ``;
  const isPastDisabled = (filterName === Filter.PAST) && !isPastPoints ? `disabled` : ``;
  // ${isFutureDisabled} ${isPastDisabled}

  return (`
    <div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter" value="${filterName}"
        ${isChecked} ${isFutureDisabled} ${isPastDisabled}
      >
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>
  `);
};

export default class Filters extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;
    this._filterChangeHandler = null;
    this._currentFilter = DEFAULT_FILTER_TYPE;
  }

  getTemplate() {
    return createTripFiltersTemplate(this._points, this._currentFilter);
  }

  setFilterChanngeHandler(cb) {
    this._filterChangeHandler = cb;
    this.getElement().querySelectorAll(`.trip-filters__filter-input`).forEach((filter) => {
      filter.addEventListener(`change`, cb);
    });
  }

  recoveryListeners() {
    this.setFilterChanngeHandler(this._filterChangeHandler);
  }

  updateData(points, currentFilter) {
    this._points = points;
    this._currentFilter = currentFilter;
  }
}
