import TripInfo from "./components/trip-info";
import Tabs from "./components/trip-tabs";
import Filters from "./components/filters";
import Sort from "./components/sort";
import Days from "./components/trip-days";
import Day from "./components/trip-day";
import EventEdit from "./components/event-edit";
import Event from "./components/event";
import NoEvents from "./components/no-events";
import {generatePoints} from "./mock/points";
import {render, RenderPosition, replace} from "./utils/render";

const EVENTS_NUMBER = 15;
const points = generatePoints(EVENTS_NUMBER);

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

const renderPointsByDay = (container, events) => {
  const tripEventsLists = container.querySelectorAll(`.trip-events__list`);
  const day = 1000 * 60 * 60 * 24;
  let date = events.at(0).dateFrom;

  for (let i = 0; i < tripEventsLists.length; i++) { // проходимся по всем дням
    for (let j = 0; j < events.length; j++) { // проходимся по всем событиям
      if (date.getDate() === events[j].dateFrom.getDate() && date.getMonth() === events[j].dateFrom.getMonth()) { // если дата одинаковая
        renderEvent(tripEventsLists[i], events[j]); // рендер в этот день
      }
    }
    date = new Date(+date + day);
  }
};

const renderEvent = (eventsList, event) => {
  const eventComponent = new Event(event);
  const eventEditComponent = new EventEdit(event);


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

const renderTrip = (container, events) => {
  if (events.length === 0) {
    const noEventsComponent = new NoEvents();
    render(container, noEventsComponent);
    return;
  }

  const sortComponent = new Sort();
  const daysComponent = new Days(points);
  render(container, sortComponent);
  render(container, daysComponent);

  const tripDays = tripEvents.querySelector(`.trip-days`);
  renderDays(tripDays, events);
  renderPointsByDay(tripDays, events);
};

const tripInfoComponent = new TripInfo(points);
const tabsComponent = new Tabs();
const filtersComponent = new Filters();

const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripControlsHeaders[0], tabsComponent, RenderPosition.AFTEREND);
render(tripControlsHeaders[1], filtersComponent, RenderPosition.AFTEREND);

renderTrip(tripEvents, points);
