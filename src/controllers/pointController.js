import EventEdit from "../components/event-edit";
import Event from "../components/event";
import {render, replace} from "../utils/render";

export default class PointController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._point = null;
    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._isEditMode = false;
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

    this._eventEditComponent.setTypeChangeHandler((evt) => {
      const newPoint = Object.assign({}, this._point, {type: evt.target.value});
      this._dataChangeHandler(this._point, newPoint);
      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setDestinationChangeHandler((evt) => {
      const newPoint = Object.assign({}, this._point,
          {
            destination: destinations.find((el) => el.name === evt.target.value)
          });
      this._dataChangeHandler(this._point, newPoint);
      this._eventEditComponent.rerender();
    });

    render(this._container, this._eventComponent);
  }

  setDefaultView() {
    if (this._isEditMode) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._viewChangeHandler();
    this._isEditMode = true;
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    this._isEditMode = false;
    // this._eventEditComponent.reset();
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscPressHandler);
    }
  }
}

