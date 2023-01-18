import {createElement} from "../utils";

const createNoEventsMarkup = () => {
  return (`
    <p class="trip-events__msg">Click New Event to create your first point</p>
  `);
};

export default class NoEvents {
  getTemplate() {
    return createNoEventsMarkup();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

