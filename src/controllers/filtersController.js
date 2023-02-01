import Filters from "../components/filters";
import {DEFAULT_FILTER_TYPE} from "../utils/constants";
import {render, RenderPosition} from "../utils/render";

export default class FiltersController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._points = null;
    this._filtersComponent = null;
    this._currentFilter = DEFAULT_FILTER_TYPE;

    this._pointsModel.setDataChangeHandler(this._dataChangeHandler.bind(this));
  }

  render() {
    this._points = this._pointsModel.data;
    this._filtersComponent = new Filters(this._points);

    this._filtersComponent.setFilterChanngeHandler((evt) => {
      this._filterChangeHandler(evt.target.value);
    });

    render(this._container, this._filtersComponent, RenderPosition.AFTEREND);
  }

  setDefaultView() {
    this._filterChangeHandler(DEFAULT_FILTER_TYPE);
    this._dataChangeHandler();
  }

  disableFilters() {
    this.setDefaultView();
    this._filtersComponent.disableFilters();
  }

  enableFilters() {
    this._filtersComponent.enableFilters();
  }

  _filterChangeHandler(filterType) {
    this._pointsModel.activeFilter = filterType;
    this._currentFilter = filterType;
  }

  _dataChangeHandler() {
    this._points = this._pointsModel.dataAll;
    this._filtersComponent.updateData(this._points, this._currentFilter);
    this._filtersComponent.rerender();
  }
}
