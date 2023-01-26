import AbstractComponent from "./abstract-component";
import {Filter} from "../constants/constants";

const createTripFiltersTemplate = () => {
  const filters = Object.values(Filter);

  return (`
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterMarkup(filter)).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

const createFilterMarkup = (filterName) => {
  const isChecked = (filterName === Filter.EVERYTHING) ? `checked` : ``;

  return (`
    <div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter" value="${filterName}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>
  `);
};

export default class Filters extends AbstractComponent {
  getTemplate() {
    return createTripFiltersTemplate();
  }

  setFilterChanngeHandler(cb) {
    this.getElement().querySelectorAll(`.trip-filters__filter-input`).forEach((filter) => {
      filter.addEventListener(`change`, cb);
    });
  }
}
