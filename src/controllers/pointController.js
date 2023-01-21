import EventEdit from "../components/event-edit";
import Event from "../components/event";
import {render, replace} from "../utils/render";

export default class PointController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;

    this._point = null;
    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, offers, destinations) {
    this._point = point;

    const oldEventComponent = this._eventComponent;
    const oldEventFormComponent = this._eventEditComponent;

    if (oldEventComponent && oldEventFormComponent) {
      this._eventEditComponent.updaitPoint(point);
      return;
    }

    this._eventComponent = new Event(point);
    this._eventEditComponent = new EventEdit(point, offers, destinations);

    this._eventComponent.setRollupButtonClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoriteCheckboxChangeHandler(() => {
      const newPoint = Object.assign({}, this._point, {isFavorite: !this._point.isFavorite});
      this._dataChangeHandler(this._point, newPoint);
      this._eventEditComponent.rerender();
    });

    render(this._container, this._eventComponent);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);

  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscPressHandler);
    }
  }
}

