export default class Destinations {
  constructor() {
    this._data = [];
    this._dataChangeHandlers = [];
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
    this._callHandlers(this._dataChangeHandlers);
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

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
