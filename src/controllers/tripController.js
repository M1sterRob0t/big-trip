import {render, replace} from "../utils/render";
import Sort from "../components/sort";
import Days from "../components/trip-days";
import Day from "../components/trip-day";
import EventEdit from "../components/event-edit";
import Event from "../components/event";
import NoEvents from "../components/no-events";
import {SortType} from "../constants/constants";

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

const renderPointsByDay = (eventsLists, events, offers, destinations) => {
  const day = 1000 * 60 * 60 * 24;
  let date = events.at(0).dateFrom;

  for (let i = 0; i < eventsLists.length; i++) { // проходимся по всем дням
    for (let j = 0; j < events.length; j++) { // проходимся по всем событиям
      if (date.getDate() === events[j].dateFrom.getDate() && date.getMonth() === events[j].dateFrom.getMonth()) { // если дата одинаковая
        renderEvent(eventsLists[i], events[j], offers, destinations); // рендер в этот день
      }
    }
    date = new Date(+date + day);
  }
};

const renderEvent = (eventsList, event, offers, destinations) => {
  const eventComponent = new Event(event);
  const eventEditComponent = new EventEdit(event, offers, destinations);


  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const documentEscPressHandler = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, documentEscPressHandler);
    }
  };

  eventComponent.setRollupButtonClickHandler((evt) => {
    evt.preventDefault();
    replaceEventToEdit();
    document.addEventListener(`keydown`, documentEscPressHandler);
  });

  eventEditComponent.setFormSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, documentEscPressHandler);
  });

  render(eventsList, eventComponent); // рендер в этот день
};

const renderEvents = (container, events, offers, destinations) => {
  for (let i = 0; i < events.length; i++) {
    renderEvent(container, events[i], offers, destinations);
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
  constructor(container) {
    this._coltainer = container;

    this._points = null;
    this._offers = null;
    this._destinations = null;
  }

  render(points, offers, destinations) {
    this._points = points;
    this._offers = offers;
    this._destinations = destinations;
    const container = this._coltainer;

    if (points.length === 0) {
      const noEventsComponent = new NoEvents();
      render(container, noEventsComponent);
      return;
    }

    const sortComponent = new Sort();
    const daysComponent = new Days(points);

    sortComponent.setSortTypeChangeHandler(() => {
      const sortedPoints = sortPoints(sortComponent.sortType, this._points);
      daysComponent.getElement().innerHTML = ``;

      if (sortComponent.sortType === SortType.EVENT) {
        renderDays(tripDaysElement, points);
        const eventsLists = daysComponent.getEventsLists();
        renderPointsByDay(eventsLists, points, offers, destinations);
      } else {
        renderDays(tripDaysElement, points, true);
        const eventsLists = daysComponent.getEventsLists();
        renderEvents(eventsLists[0], sortedPoints, offers, destinations);
      }
    });

    render(container, sortComponent);
    render(container, daysComponent);
    const tripDaysElement = daysComponent.getElement();

    renderDays(tripDaysElement, points);
    const eventsLists = daysComponent.getEventsLists();
    renderPointsByDay(eventsLists, points, offers, destinations);
  }
}
