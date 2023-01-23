import TripInfo from "./components/trip-info";
import Tabs from "./components/trip-tabs";
import Filters from "./components/filters";
import {generatePoints} from "./mock/points";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/tripController";
import {destinations} from "./mock/destinations";
import {offersByType} from "./mock/offers";
import Points from "./models/points";

const EVENTS_NUMBER = 15;
const pointsModel = new Points();
pointsModel.points = generatePoints(EVENTS_NUMBER);

const tripInfoComponent = new TripInfo(pointsModel.points);
const tabsComponent = new Tabs();
const filtersComponent = new Filters();

const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEvents, pointsModel);

render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripControlsHeaders[0], tabsComponent, RenderPosition.AFTEREND);
render(tripControlsHeaders[1], filtersComponent, RenderPosition.AFTEREND);

tripController.render(offersByType, destinations);
