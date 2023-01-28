import TripInfo from "./components/trip-info";
import Tabs from "./components/trip-tabs";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/tripController";
import Points from "./models/points";
import Offers from "./models/offers";
import Destinations from "./models/destinations";
import FiltersController from "./controllers/filtersController";
import NewEventButton from "./components/new-event-button";
import {Tab} from "./components/trip-tabs";
import Stats from "./components/stats";
import API from "./api";
import Point from "./models/point";

const AUTHORIZATION_TOKEN = `Basic f7v274089v202973yr2037vy23r79yv239ry239rvy239r0y2393v2ry93`;
const api = new API(AUTHORIZATION_TOKEN);
const pointsModel = new Points();
const offersModel = new Offers();
const destinationsModel = new Destinations();


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


render(tripControlsHeaders[0], tabsComponent, RenderPosition.AFTEREND);
filtersController.render();
render(tripMain, newEventButtonComponent);
render(container, statsComponent);


api.getData()
  .then((data) => {
    const [rawPoints, offers, destinations] = data;
    const points = Point.parsePoints(rawPoints);

    pointsModel.data = points;
    offersModel.data = offers;
    destinationsModel.data = destinations;

    const tripInfoComponent = new TripInfo(pointsModel.data);
    render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
    tripController.render();
  });
