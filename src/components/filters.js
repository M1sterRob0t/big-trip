import {createElement} from "../utils";

const Filter = {
  FUTURE: `Future`,
  PAST: `Past`,
  EVERYTHING: `Everything`,
};

const filters = [Filter.EVERYTHING, Filter.FUTURE, Filter.PAST];

const createTripFiltersTemplate = () => {
  return (`
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterMarkup(filter)).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

const createFilterMarkup = (filterName) => {
  return (`
    <div class="trip-filters__filter">
      <input id="filter-${filterName.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName.toLowerCase()}">
      <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">${filterName}</label>
    </div>
  `);
};

export default class Filters {
  getTemplate() {
    return createTripFiltersTemplate();
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
