import {render, remove} from "../utils/render";
import Sort from "../components/sort";
import Days from "../components/trip-days";
import Day from "../components/trip-day";
import NoEvents from "../components/no-events";
import {SortType} from "../constants/constants";
import PointController from "./pointController";
import {Mode, EmptyPoint} from "./pointController";

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

const sortPoints = (sortType, array) => {
  let sortedPoints = array.slice();

  switch (sortType) {
    case SortType.EVENT:
      break;
    case SortType.PRICE:
      sortedPoints.sort((a, b) => a.price - b.price);
      break;
    case SortType.TIME:
      sortedPoints.sort((a, b) => (a.dateTo - a.dateFrom) - (b.dateTo - b.dateFrom));
      break;
  }

  return sortedPoints;
};

export default class TripController {
  constructor(container, pointsModel, offersModel, destinationsModel) {
    this._coltainer = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinatiosModel = destinationsModel;

    this._points = null;
    this._offers = null;
    this._destinations = null;

    this._sortComponent = null;
    this._daysComponent = null;

    this._sortComponent = new Sort();
    this._daysComponent = new Days();

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

    const container = this._coltainer;
    const points = this._points;
    const offers = this._offers;
    const destinations = this._destinations;

    if (points.length === 0) {
      const noEventsComponent = new NoEvents();
      render(container, noEventsComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._daysComponent);
    const tripDaysElement = this._daysComponent.getElement();

    renderDays(tripDaysElement, points);
    const eventsLists = this._daysComponent.getEventsLists();
    this._renderEventsByDays(eventsLists, points, offers, destinations);
  }

  _sortTypeChangeHandler(sortType) {
    const sortedPoints = sortPoints(sortType, this._points);
    this._removeEvents();
    const tripDaysElement = this._daysComponent.getElement();

    if (sortType === SortType.EVENT) {
      renderDays(tripDaysElement, this._points);
      const eventsLists = this._daysComponent.getEventsLists();
      this._renderEventsByDays(eventsLists, this._points, this._offers, this._destinations);
    } else {
      renderDays(tripDaysElement, this._points, true);
      const eventsLists = this._daysComponent.getEventsLists();
      this._renderEventsWithoutDays(eventsLists[0], sortedPoints, this._offers, this._destinations);
    }
  }

  _dataChangeHandler(oldData, newData) {
    if (oldData === EmptyPoint) {
      this._mode = Mode.CREATING;
      if (newData === null) {
        this._pointControllers[0].destroy();
        this._removeEvents();
        this.render();
      } else {
        this._pointsModel.addData(newData);
        this._pointControllers[0].render(newData, this._offers, this._destinations);
      }
    } else if (newData === null) {
      this._pointsModel.removeData(oldData.id);
      this._updaitEvents();
    } else {
      const index = this._pointsModel.updateData(oldData.id, newData);
      if (index) {
        this._pointControllers[index].render(newData, this._offers, this._destinations);
      }
    }
  }

  _viewChangeHandler() {
    this._pointControllers.forEach((el) => el.setDefaultView());
  }

  _filterChangeHandler() {
    this._removeEvents();

    remove(this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    this.render();
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
