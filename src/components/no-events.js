import AbstractComponent from "./abstract-component";

const createNoEventsMarkup = () => {
  return (`
    <p class="trip-events__msg">Click New Event to create your first point</p>
  `);
};

export default class NoEvents extends AbstractComponent {
  getTemplate() {
    return createNoEventsMarkup();
  }
}

