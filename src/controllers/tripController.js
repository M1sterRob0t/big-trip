import {render, replace} from "../utils/render";
import Sort from "../components/sort";
import Days from "../components/trip-days";
import Day from "../components/trip-day";
import EventEdit from "../components/event-edit";
import Event from "../components/event";
import NoEvents from "../components/no-events";

const renderDays = (container, events) => {
  if (events.length === 0) {
    return;
  }

  const days = Math.ceil((events.at(-1).dateFrom / 1000 / 60 / 60 / 24 - (events.at(0).dateFrom / 1000 / 60 / 60 / 24 - 1)));
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

    render(container, sortComponent);
    render(container, daysComponent);

    const tripDaysElement = daysComponent.getElement();
    renderDays(tripDaysElement, points);

    const eventsLists = daysComponent.getEventsLists();
    renderPointsByDay(eventsLists, points, offers, destinations);
  }
}
