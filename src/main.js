import {createTripInfoTemplate} from "./components/trip-info";
import {createTripTabsTemplate} from "./components/trip-tabs";
import {createTripFiltersTemplate} from "./components/filters";
import {createTripSortTemplate} from "./components/sort";
import {createTripDaysTemplate} from "./components/trip-days";
import {createTripDayTemplate} from "./components/trip-day";
import {createTripEventEditTemplate} from "./components/event-edit";
import {createTripEventTemplate} from "./components/event";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMain, createTripInfoTemplate(), `afterbegin`);
render(tripControlsHeaders[0], createTripTabsTemplate(), `afterend`);
render(tripControlsHeaders[1], createTripFiltersTemplate(), `afterend`);
render(tripEvents, createTripSortTemplate());
render(tripEvents, createTripEventEditTemplate());
render(tripEvents, createTripDaysTemplate());

const tripDays = tripEvents.querySelector(`.trip-days`);
render(tripDays, createTripDayTemplate());

const tripEventsList = tripDays.querySelector(`.trip-events__list`);

const EVENTS_NUMBER = 3;
for (let i = 0; i < EVENTS_NUMBER; i++) {
  render(tripEventsList, createTripEventTemplate());
}

