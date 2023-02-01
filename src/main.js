import Tabs from "./components/trip-tabs";
import {render, RenderPosition, remove} from "./utils/render";
import TripController from "./controllers/tripController";
import Points from "./models/points";
import Offers from "./models/offers";
import Destinations from "./models/destinations";
import FiltersController from "./controllers/filtersController";
import NewEventButton from "./components/new-event-button";
import {Tab} from "./components/trip-tabs";
import Stats from "./components/stats";
import API from "./api/api";
import Loading from "./components/loading";
import TripInfoController from "./controllers/tripInfoController";
import Provider from "./api/provider";
import Storage from "./api/storage";

const AUTHORIZATION_TOKEN = `Basic f7v274089v202973yr2037vy23r79yv239ry239rvy239r0y2393v2ry933`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME_POINTS = `${STORE_PREFIX}-points-${STORE_VER}`;
const STORE_NAME_OFFERS = `${STORE_PREFIX}-offers-${STORE_VER}`;
const STORE_NAME_DESTINATIONS = `${STORE_PREFIX}-destinations-${STORE_VER}`;

const api = new API(AUTHORIZATION_TOKEN);
const pointsStorage = new Storage(STORE_NAME_POINTS, window.localStorage);
const offersStorage = new Storage(STORE_NAME_OFFERS, window.localStorage);
const destinationsStorage = new Storage(STORE_NAME_DESTINATIONS, window.localStorage);
const provider = new Provider(api, pointsStorage, offersStorage, destinationsStorage);


const pointsModel = new Points();
const offersModel = new Offers();
const destinationsModel = new Destinations();

const tabsComponent = new Tabs();
const newEventButtonComponent = new NewEventButton();
const statsComponent = new Stats();
const loadingComponent = new Loading();

const container = document.querySelector(`.page-main .page-body__container`);
const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, pointsModel, offersModel, destinationsModel, provider, newEventButtonComponent);
const filtersController = new FiltersController(tripControlsHeaders[1], pointsModel);
const tripInfoController = new TripInfoController(tripMain, pointsModel);

newEventButtonComponent.setButtonClickHandler(() => {
  filtersController.setDefaultView();
  tripController.createNewEvent();
});

tabsComponent.setTabClickHandler((evt) => {
  switch (evt.target.dataset.name) {

    case Tab.TABLE:
      statsComponent.removeStatistic();
      statsComponent.hide();
      tripController.show();
      newEventButtonComponent.disableModeOff();
      filtersController.enableFilters();
      break;

    case Tab.STATS:
      filtersController.disableFilters();
      newEventButtonComponent.disableModeOn();
      tripController.hide();
      statsComponent.show();
      statsComponent.printStatistic(pointsModel, offersModel, destinationsModel);
      break;
  }
});

render(tripControlsHeaders[0], tabsComponent, RenderPosition.AFTEREND);
tripInfoController.render();
filtersController.render();
render(tripMain, newEventButtonComponent);
render(container, statsComponent);
render(container, loadingComponent);

provider.getData()
  .then((data) => {
    const [points, offers, destinations] = data;
    pointsModel.data = points;
    offersModel.data = offers;
    destinationsModel.data = destinations;

    remove(loadingComponent);
    tripController.render();
    newEventButtonComponent.disableModeOff();
  })
  .catch(() => {
    remove(loadingComponent);
    tripController.render();
    newEventButtonComponent.disableModeOff();
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(`[offline]`, ``);
  provider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});
