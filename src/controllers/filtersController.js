import Filters from "../components/filters";
import {render, RenderPosition} from "../utils/render";

export default class FiltersController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    // this._activeFilter = null;
  }

  render() {
    const filtersComponent = new Filters();

    filtersComponent.setFilterChanngeHandler((evt) => {
      this._filterChangeHandler(evt.target.value);
    });

    render(this._container, filtersComponent, RenderPosition.AFTEREND);
  }

  _filterChangeHandler(filterType) {
    this._pointsModel.activeFilter = filterType;
    // this._activeFilter = filterType;
  }
}
