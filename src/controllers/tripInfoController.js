import TripInfo from "../components/trip-info";
import {render, RenderPosition} from "../utils/render";

export default class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._points = null;
    this._tripInfoComponent = null;

    this._pointsModel.setDataChangeHandler(this._dataChangeHandler.bind(this));
  }

  render() {
    this._points = this._pointsModel.dataAll.slice().sort((a, b) => a.dateFrom - b.dateFrom);
    this._tripInfoComponent = new TripInfo(this._points);
    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _dataChangeHandler() {
    this._points = this._pointsModel.dataAll.slice().sort((a, b) => a.dateFrom - b.dateFrom);
    this._tripInfoComponent.updatePoints(this._points);
    this._tripInfoComponent.rerender();
  }
}
