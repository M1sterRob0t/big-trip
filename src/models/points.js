import {Filter} from "../constants/constants";

const getFilteredPoints = (points, filterType) => {
  let filteredPoints;
  switch (filterType) {
    case Filter.EVERYTHING:
      filteredPoints = points.slice().sort((a, b) => a.dateFrom - b.dateFrom);
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

  get dataAll() {
    return this._data;
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

  updateData(id, newData) {
    const index = this._data.findIndex((el) => el.id === id);

    if (index === -1) {
      return false;
    }

    this._data = [].concat(this._data.slice(0, index), newData, this._data.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeData(id) {
    const index = this._data.findIndex((el) => el.id === id);

    if (index === -1) {
      return false;
    }

    this._data = [].concat(this._data.slice(0, index), this._data.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addData(data) {
    this._data = [].concat(data, this._data);
    this._callHandlers(this._dataChangeHandlers);
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
