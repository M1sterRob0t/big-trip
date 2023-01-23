export default class Points {
  constructor() {
    this._points = [];
    this._dataChangeHandlers = [];
  }

  get points() {
    return this._points;
  }

  set points(points) {
    this._points = points;
    this._callHandlers(this._dataChangeHandlers);
  }

  udpdatePoint(id, newPoint) {
    const index = this._points.findIndex((el) => el.id === id);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
