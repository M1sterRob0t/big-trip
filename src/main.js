import TripInfo from "./components/trip-info";
import Tabs from "./components/trip-tabs";
import Filters from "./components/filters";
import Sort from "./components/sort";
import Days from "./components/trip-days";
import Day from "./components/trip-day";
import EventEdit from "./components/event-edit";
import Event from "./components/event";
import {generatePoints} from "./mock/points";
import {render, RenderPosition} from "./utils";

const EVENTS_NUMBER = 15;
const points = generatePoints(EVENTS_NUMBER);
console.log(points);
const renderDays = (events) => {
  if (events.length === 0) {
    return;
  }

  const days = Math.ceil((events.at(-1).dateFrom / 1000 / 60 / 60 / 24 - (events.at(0).dateFrom / 1000 / 60 / 60 / 24 - 1)));
  let date = events.at(0).dateFrom;
  const day = 1000 * 60 * 60 * 24;

  for (let i = 1; i <= days; i++) {
    const dayComponent = new Day(date, i);
    render(tripDays, dayComponent.getElement());
    date = new Date(+date + day);
  }
};

const renderPointsByDay = (events) => {
  const tripEventsLists = tripDays.querySelectorAll(`.trip-events__list`);
  const day = 1000 * 60 * 60 * 24;
  let date = events.at(0).dateFrom;

  for (let i = 0; i < tripEventsLists.length; i++) { // проходимся по всем дням
    for (let j = 0; j < events.length; j++) { // проходимся по всем событиям
      if (date.getDate() === events[j].dateFrom.getDate() && date.getMonth() === events[j].dateFrom.getMonth()) { // если дата одинаковая
        const eventComponent = new Event(events[j]);
        render(tripEventsLists[i], eventComponent.getElement()); // рендер в этот день
      }
    }
    date = new Date(+date + day);
  }
};

const tripInfoComponent = new TripInfo(points);
const tabsComponent = new Tabs();
const filtersComponent = new Filters();
const sortComponent = new Sort();
const daysComponent = new Days(points);
const eventEditComponent = new EventEdit(points[0]);


const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMain, tripInfoComponent.getElement(points), RenderPosition.AFTERBEGIN);
render(tripControlsHeaders[0], tabsComponent.getElement(), RenderPosition.AFTEREND);
render(tripControlsHeaders[1], filtersComponent.getElement(), RenderPosition.AFTEREND);
render(tripEvents, sortComponent.getElement(), RenderPosition.BEFOREEND);
render(tripEvents, eventEditComponent.getElement(), RenderPosition.BEFOREEND);
render(tripEvents, daysComponent.getElement(), RenderPosition.BEFOREEND);

const tripDays = tripEvents.querySelector(`.trip-days`);
renderDays(points);
renderPointsByDay(points);
