import {createTripInfoTemplate} from "./components/trip-info";
import {createTripTabsTemplate} from "./components/trip-tabs";
import {createTripFiltersTemplate} from "./components/filters";
import {createTripSortTemplate} from "./components/sort";
import {createTripDaysTemplate} from "./components/trip-days";
import {createTripDayTemplate} from "./components/trip-day";
import {createTripEventEditTemplate} from "./components/event-edit";
import {createTripEventTemplate} from "./components/event";
import {generatePoints} from "./mock/points";

const EVENTS_NUMBER = 15;
const points = generatePoints(EVENTS_NUMBER);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderDays = (events) => {
  if (events.length === 0) {
    return;
  }

  const days = Math.ceil((events.at(-1).dateFrom / 1000 / 60 / 60 / 24 - (events.at(0).dateFrom / 1000 / 60 / 60 / 24 - 1)));
  let date = events.at(0).dateFrom;
  const day = 1000 * 60 * 60 * 24;

  for (let i = 1; i <= days; i++) {
    render(tripDays, createTripDayTemplate(date, i));
    date = new Date(+date + day);
  }
};

const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMain, createTripInfoTemplate(points), `afterbegin`);
render(tripControlsHeaders[0], createTripTabsTemplate(), `afterend`);
render(tripControlsHeaders[1], createTripFiltersTemplate(), `afterend`);
render(tripEvents, createTripSortTemplate());
render(tripEvents, createTripEventEditTemplate(points[0]));
render(tripEvents, createTripDaysTemplate());

const tripDays = tripEvents.querySelector(`.trip-days`);
renderDays(points);

const renderPointsByDay = (events) => {
  const tripEventsLists = tripDays.querySelectorAll(`.trip-events__list`);
  const day = 1000 * 60 * 60 * 24;
  let date = events.at(0).dateFrom;

  for (let i = 0; i < tripEventsLists.length; i++) {
    for (let j = 0; j < events.length; j++) {
      if (date.getDate() === events[j].dateFrom.getDate() && date.getMonth() === events[j].dateFrom.getMonth()) { // дата одинаковая
        render(tripEventsLists[i], createTripEventTemplate(events[j])); // рендер в тот же день
      }
    }
    date = new Date(+date + day);
  }
};

renderPointsByDay(points);
