import EventEdit from "../components/event-edit";
import Event from "../components/event";
import {render, replace, remove} from "../utils/render";

export const Mode = {
  DEFAULT: `default`,
  EDITING: `editing`,
  CREATING: `creating`,
};

export const EmptyPoint = {};

export default class PointController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._point = null;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._oldPoint = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this.isEditMode = false;
    this.isSavingMode = false;
  }

  render(point, offers, destinations) {
    this._point = point;

    const oldEventComponent = this._eventComponent;
    const oldEventFormComponent = this._eventEditComponent;

    if (oldEventComponent && oldEventFormComponent) {
      this._eventEditComponent.updatePoint(point);
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

      this.isSavingMode = true;
      const formData = this._eventEditComponent.getData();
      const newPoint = Object.assign({}, this._point, formData);

      this._dataChangeHandler(this._point, newPoint);
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
      const newPoint = Object.assign({}, this._point, {
        destination: destinations.find((el) => el.name === evt.target.value)});
      this._dataChangeHandler(this._point, newPoint);
      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._dataChangeHandler(this._point, null);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    render(this._container, this._eventComponent);
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this.isEditMode) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._viewChangeHandler();
    this.isEditMode = true;
    this._oldPoint = this._point;
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent(isSubmit) {
    this.isEditMode = false;
    this.isSavingMode = false;

    if (!isSubmit) {
      this._resetChanges();
    }

    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _resetChanges() {
    this._dataChangeHandler(this._point, this._oldPoint);
    this._eventEditComponent.rerender();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscPressHandler);
    }
  }
}

