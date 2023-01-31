import {render, remove} from "../utils/render";
import Sort from "../components/sort";
import Days from "../components/trip-days";
import Day from "../components/trip-day";
import NoEvents from "../components/no-events";
import {SortType} from "../constants/constants";
import PointController from "./pointController";
import {EmptyPoint} from "./pointController";
import {HIDING_CLASS} from "../constants/constants";

const renderDays = (container, events, isSorted = false) => {
  if (isSorted) {
    const dayComponent = new Day();
    render(container, dayComponent);
    return;
  }

  const dateFirst = new Date(events.at(0).dateFrom.getFullYear(), events.at(0).dateFrom.getMonth(), events.at(0).dateFrom.getDate());
  const dateLast = new Date(events.at(-1).dateFrom.getFullYear(), events.at(-1).dateFrom.getMonth(), events.at(-1).dateFrom.getDate());

  const days = (dateLast - dateFirst) / 1000 / 60 / 60 / 24 + 1;
  let date = events.at(0).dateFrom;
  const day = 1000 * 60 * 60 * 24;

  for (let i = 1; i <= days; i++) {
    const dayComponent = new Day(date, i);
    render(container, dayComponent);
    date = new Date(+date + day);
  }
};

const getSortedPoints = (sortType, array) => {
  let sortedPoints = array.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints.sort((a, b) => a.dateFrom - b.dateFrom);
      break;
    case SortType.PRICE:
      sortedPoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedPoints.sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      break;
  }

  return sortedPoints;
};

export default class TripController {
  constructor(container, pointsModel, offersModel, destinationsModel, provider, newEventButtonComponent) {
    this._coltainer = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinatiosModel = destinationsModel;
    this._provider = provider;
    this._newEventButtonComponent = newEventButtonComponent;

    this._sortComponent = new Sort();
    this._daysComponent = new Days();
    this._noEventsComponent = new NoEvents();

    this._points = null;
    this._offers = null;
    this._destinations = null;

    this._pointControllers = [];

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._pointsModel.setFilterChangeHandler(this._filterChangeHandler);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  render() {
    this._points = this._pointsModel.data;
    this._offers = this._offersModel.data;
    this._destinations = this._destinatiosModel.data;

    if (this._points.length === 0) {
      remove(this._sortComponent);
      this._noEventsComponent = new NoEvents();
      render(this._coltainer, this._noEventsComponent);
      return;
    }

    render(this._coltainer, this._sortComponent);
    render(this._coltainer, this._daysComponent);

    const tripDaysElement = this._daysComponent.getElement();
    const sortType = this._sortComponent.sortType;

    this._renderBySortType(tripDaysElement, sortType, getSortedPoints(sortType, this._points));
  }

  createNewEvent() {
    this._viewChangeHandler();
    remove(this._noEventsComponent);
    const tripDaysElement = this._daysComponent.getElement();
    this._creatingPoint = new PointController(tripDaysElement, this._dataChangeHandler, this._viewChangeHandler);
    this._creatingPoint.render(EmptyPoint, this._offers, this._destinations, true);
    this._pointControllers.push(this._creatingPoint);
  }

  show() {
    this._sortComponent.setDefaultSortType();
    this._updaitEvents();
    this._coltainer.classList.remove(HIDING_CLASS);
  }

  hide() {
    this._coltainer.classList.add(HIDING_CLASS);
  }

  _renderBySortType(container, sortType, sortedPoints) {
    if (sortType === SortType.EVENT) {
      renderDays(container, this._points);
      const eventsLists = this._daysComponent.getEventsLists();
      this._renderEventsByDays(eventsLists, this._points, this._offers, this._destinations);
    } else {
      renderDays(container, this._points, true);
      const eventsLists = this._daysComponent.getEventsLists();
      this._renderEventsWithoutDays(eventsLists[0], sortedPoints, this._offers, this._destinations);
    }
  }

  _sortTypeChangeHandler(sortType) {
    const sortedPoints = getSortedPoints(sortType, this._points);
    this._removeEvents();

    const tripDaysElement = this._daysComponent.getElement();
    this._renderBySortType(tripDaysElement, sortType, sortedPoints);
    this._newEventButtonComponent.disableModeOff();
  }

  _dataChangeHandler(oldData, newData) {
    if (oldData === null || oldData === EmptyPoint) {
      if (newData === null) {
        this._pointControllers.at(-1).destroy();
        this._pointControllers = this._pointControllers.slice(0, -1);
        this._newEventButtonComponent.disableModeOff();
      } else {
        const pointController = this._pointControllers.at(-1);
        this._provider.createPoint(newData).
          then((newServerData) => {
            this._pointsModel.addData(newServerData);
            pointController.render(newServerData, this._offers, this._destinations);

            this._removeEvents();
            this.render();
            this._newEventButtonComponent.disableModeOff();
          })
          .catch(() => {
            pointController.render(newData, this._offers, this._destinations);
            pointController.addErrorClass();
          });
      }
    } else if (newData === null) {
      const pointController = this._pointControllers.find((el) => el.isEditMode);
      this._provider.deletePoint(oldData)
        .then(() => {
          this._pointsModel.removeData(oldData.id);
          this._updaitEvents();
        })
        .catch(() => {
          pointController.render(newData, this._offers, this._destinations);
          pointController.addErrorClass();
        });
    } else {
      const pointController = this._pointControllers.find((el) => el.isEditMode);
      this._provider.updatePoint(oldData.id, newData)
        .then((newServerData) => {
          this._pointsModel.updateData(oldData.id, newServerData);
          pointController.render(newServerData, this._offers, this._destinations);

          const isSavingMode = pointController.isSavingMode;
          if (isSavingMode) {
            this._removeEvents();
            this.render();
            this._newEventButtonComponent.disableModeOff();
          }
        })
        .catch(() => {
          pointController.render(newData, this._offers, this._destinations);
          pointController.addErrorClass();
        });
    }
  }

  _viewChangeHandler() {
    this._pointControllers.forEach((el) => el.setDefaultView());
  }

  _filterChangeHandler() {
    this._removeEvents();

    remove(this._sortComponent);
    remove(this._noEventsComponent);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    this.render();
    this._newEventButtonComponent.disableModeOff();
  }

  _removeEvents() {
    this._pointControllers.forEach((el) => el.destroy());
    this._pointControllers = [];
    this._daysComponent.getElement().innerHTML = ``;
  }

  _updaitEvents() {
    this._removeEvents();
    this.render();
  }

  _renderEventsByDays(eventsLists, points, offers, destinations) {
    const day = 1000 * 60 * 60 * 24;
    let date = points.at(0).dateFrom;

    for (let i = 0; i < eventsLists.length; i++) { // проходимся по всем дням
      for (let j = 0; j < points.length; j++) { // проходимся по всем событиям
        if (date.getDate() === points[j].dateFrom.getDate() && date.getMonth() === points[j].dateFrom.getMonth()) { // если дата одинаковая
          const pointController = new PointController(eventsLists[i], this._dataChangeHandler, this._viewChangeHandler);
          pointController.render(points[j], offers, destinations); // рендер в этот день
          this._pointControllers.push(pointController);
        }
      }
      date = new Date(+date + day);
    }
  }

  _renderEventsWithoutDays(eventsList, points, offers, destinations) {
    for (let i = 0; i < points.length; i++) {
      const pointController = new PointController(eventsList, this._dataChangeHandler, this._viewChangeHandler);
      this._pointControllers.push(pointController);
      pointController.render(points[i], offers, destinations);
    }
  }
}
