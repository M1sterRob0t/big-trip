import AbstractComponent from "./abstract-component";

const createLoadingTemplate = () => {
  return (`
    <p class="trip-events__msg">Loading...</p>
  `);
};

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }

  getEventsLists() {
    return this.getElement().querySelectorAll(`.trip-events__list`);
  }
}
