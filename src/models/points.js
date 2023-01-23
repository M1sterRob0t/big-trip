import {Filter} from "../constants/constants";

const getFilteredPoints = (points, filterType) => {
  let filteredPoints;
  switch (filterType) {
    case Filter.EVERYTHING:
      filteredPoints = points.slice();
      break;
    case Filter.FUTURE:
      filteredPoints = points.filter((el) => el.dateFrom > new Date());
      break;
    case Filter.PAST:
      filteredPoints = points.filter((el) => el.dateFrom < new Date());
      break;
  }

  return filteredPoints;
};

export default class Points {
  constructor() {
    this._data = [];

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];

    this._activeFilter = Filter.EVERYTHING;
  }

  get data() {
    return getFilteredPoints(this._data, this._activeFilter);
  }

  set data(data) {
    this._data = data;
    this._callHandlers(this._dataChangeHandlers);
  }

  set activeFilter(filter) {
    this._activeFilter = filter;
    this._callHandlers(this._filterChangeHandlers);
  }

  udpdateData(id, newData) {
    const index = this._data.findIndex((el) => el.id === id);

    if (index === -1) {
      return;
    }

    this._data = [].concat(this._data.slice(0, index), newData, this._data.slice(index + 1));
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
