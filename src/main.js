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
import NewEventButton from "./components/new-event-button";
import {Tab} from "./components/trip-tabs";
import Stats from "./components/stats";

const EVENTS_NUMBER = 10;
const pointsModel = new Points();
const offersModel = new Offers();
const destinationsModel = new Destinations();

pointsModel.data = generatePoints(EVENTS_NUMBER);
offersModel.data = offersByType;
destinationsModel.data = destinations;

const tripInfoComponent = new TripInfo(pointsModel.data);
const tabsComponent = new Tabs();
const newEventButtonComponent = new NewEventButton();
const statsComponent = new Stats();

const container = document.querySelector(`.page-main .page-body__container`);
const tripMain = document.querySelector(`.trip-main`);
const tripControlsHeaders = tripMain.querySelectorAll(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, pointsModel, offersModel, destinationsModel, newEventButtonComponent);
const filtersController = new FiltersController(tripControlsHeaders[1], pointsModel);

newEventButtonComponent.setButtonClickHandler(() => {
  tripController.createNewEvent();
});

tabsComponent.setTabClickHandler((evt) => {
  switch (evt.target.dataset.name) {

    case Tab.TABLE:
      statsComponent.removeStatistic();
      statsComponent.hide();
      tripController.show();
      newEventButtonComponent.disableModeOff();
      break;

    case Tab.STATS:
      newEventButtonComponent.disableModeOn();
      tripController.hide();
      statsComponent.show();
      statsComponent.printStatistic(pointsModel, offersModel, destinationsModel);
      break;

  }
});

render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripControlsHeaders[0], tabsComponent, RenderPosition.AFTEREND);
filtersController.render();
render(tripMain, newEventButtonComponent);
render(container, statsComponent);
tripController.render();
