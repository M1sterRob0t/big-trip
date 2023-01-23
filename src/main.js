import TripInfo from "./components/trip-info";
import Tabs from "./components/trip-tabs";
import {generatePoints} from "./mock/points";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/tripController";
import {destinations} from "./mock/destinations";
import {offersByType} from "./mock/offers";
import Points from "./models/points";
import Offers from "./models/offers";
import Destinations from "./models/destinations";
import FiltersController from "./controllers/filtersController";

const EVENTS_NUMBER = 10;
const pointsModel = new Points();
const offersModel = new Offers();
const destinationsModel = new Destinations();

pointsModel.data = generatePoints(EVENTS_NUMBER);
offersModel.data = offersByType;
destinationsModel.data = destinations;

const tripInfoComponent = new TripInfo(pointsModel.data);
const tabsComponent = new Tabs();

const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEvents, pointsModel, offersModel, destinationsModel);

render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripControlsHeaders[0], tabsComponent, RenderPosition.AFTEREND);
const filtersController = new FiltersController(tripControlsHeaders[1], pointsModel);
filtersController.render();

tripController.render();
