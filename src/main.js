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

const renderDays = (container, events) => {
  if (events.length === 0) {
    return;
  }

  const days = Math.ceil((events.at(-1).dateFrom / 1000 / 60 / 60 / 24 - (events.at(0).dateFrom / 1000 / 60 / 60 / 24 - 1)));
  let date = events.at(0).dateFrom;
  const day = 1000 * 60 * 60 * 24;

  for (let i = 1; i <= days; i++) {
    const dayComponent = new Day(date, i);
    render(container, dayComponent.getElement());
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

  const eventRollupButtonClickHandler = () => {
    eventsList.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const eventEditRollupButtonClickHandler = () => {
    eventsList.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const eventRollupButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  const eventEditForm = eventEditComponent.getElement();

  eventRollupButton.addEventListener(`click`, eventRollupButtonClickHandler);
  eventEditForm.addEventListener(`submit`, eventEditRollupButtonClickHandler);

  render(eventsList, eventComponent.getElement()); // рендер в этот день
};

const renderTrip = (container, events) => {
  const sortComponent = new Sort();
  const daysComponent = new Days(points);

  render(container, sortComponent.getElement(), RenderPosition.BEFOREEND);
  render(container, daysComponent.getElement(), RenderPosition.BEFOREEND);

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

render(tripMain, tripInfoComponent.getElement(points), RenderPosition.AFTERBEGIN);
render(tripControlsHeaders[0], tabsComponent.getElement(), RenderPosition.AFTEREND);
render(tripControlsHeaders[1], filtersComponent.getElement(), RenderPosition.AFTEREND);

renderTrip(tripEvents, points);
