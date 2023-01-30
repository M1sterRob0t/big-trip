import EventEdit from "../components/event-edit";
import Event from "../components/event";
import {render, RenderPosition, replace, remove} from "../utils/render";

const SHAKE_ANIMATION_TIMEOUT = 500;
const ERROR_CLASS_NAME = `error`;

export const Mode = {
  DEFAULT: `default`,
  EDITING: `editing`,
  CREATING: `creating`,
};

export const EmptyPoint = {
  price: 100,
  dateFrom: new Date(),
  dateTo: new Date(+new Date() + 1000 * 60 * 60 * 24),
  destination: ``,
  isFavorite: false,
  offers: [],
  type: `bus`,
};

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
    this.isCreatingMode = false;
  }

  render(point, offers, destinations, isCreatingMode = false) {
    this._point = point;
    this.isCreatingMode = isCreatingMode;

    const oldEventComponent = this._eventComponent;
    const oldEventFormComponent = this._eventEditComponent;

    if (oldEventComponent && oldEventFormComponent) {
      this._eventEditComponent.updatePoint(point);
      return;
    }

    this._eventComponent = new Event(point);
    this._eventEditComponent = new EventEdit(point, offers, destinations, isCreatingMode);

    this._eventComponent.setRollupButtonClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.isSavingMode = true;
      const formData = this._eventEditComponent.getData();
      this._eventEditComponent.setData({buttonTextSave: `Saving...`, isBlockForm: true});

      const newPoint = Object.assign({}, this._point, formData);
      const oldPoint = isCreatingMode ? null : this._point;
      this._dataChangeHandler(oldPoint, newPoint);
    });

    this._eventEditComponent.setFavoriteCheckboxChangeHandler(() => {
      const newPoint = Object.assign({}, this._point, {isFavorite: !this._point.isFavorite});
      this._dataChangeHandler(this._point, newPoint);
    });

    this._eventEditComponent.setTypeChangeHandler((evt) => {
      const newPoint = Object.assign({}, this._point, {type: evt.target.value});

      this._point = newPoint;
      this._eventEditComponent.updatePoint(newPoint);
      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setDestinationChangeHandler((evt) => {
      const newPoint = Object.assign({}, this._point, {
        destination: destinations.find((el) => el.name === evt.target.value)
      });

      this._point = newPoint;
      this._eventEditComponent.updatePoint(newPoint);
      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.setData({buttonTextDelete: `Deleting...`, isBlockForm: true});
      this._dataChangeHandler(this._point, null);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setPriceInputChangeHandler((evt) => {
      const newPoint = Object.assign({}, this._point, {price: evt.target.value});

      this._point = newPoint;
      this._eventEditComponent.updatePoint(newPoint);
      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setDateStartInputChangeHandler((dateFrom) => {
      const newPoint = Object.assign({}, this._point, {dateFrom});
      this._point = newPoint;
      this._eventEditComponent.updatePoint(newPoint);
    });

    this._eventEditComponent.setDateEndInputChangeHandler((dateTo) => {
      const newPoint = Object.assign({}, this._point, {dateTo});
      this._point = newPoint;
      this._eventEditComponent.updatePoint(newPoint);
    });

    this._eventEditComponent.setOffersChangeHandler((chosenOffers) => {
      const newPoint = Object.assign({}, this._point, {offers: chosenOffers});
      this._point = newPoint;
      this._eventEditComponent.updatePoint(newPoint);
    });

    if (isCreatingMode) {
      this.isEditMode = true;
      document.addEventListener(`keydown`, this._onEscKeyDown);
      render(this._container, this._eventEditComponent, RenderPosition.BEFOREBEGIN);
    } else {
      render(this._container, this._eventComponent);
    }
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
    if (!isSubmit) {
      this._resetChanges();
    }

    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this.isEditMode = false;
    this.isSavingMode = false;
  }

  _resetChanges() {
    this._point = Object.assign(this._oldPoint, {isFavorite: this._point.isFavorite});
    this._eventEditComponent.updatePoint(this._point);
    this._eventEditComponent.rerender();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {

      if (this.isCreatingMode) {
        this._eventEditComponent.setData({buttonTextDelete: `Deleting...`, isBlockForm: true});
        this._dataChangeHandler(this._point, null);
        return;
      }

      this._replaceEditToEvent();
    }
  }

  addErrorClass() {
    this._eventEditComponent.setData();
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventEditComponent.getElement().classList.add(ERROR_CLASS_NAME);
    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  removeErrorClass() {
    this._eventEditComponent.getElement().classList.remove(ERROR_CLASS_NAME);
  }
}

