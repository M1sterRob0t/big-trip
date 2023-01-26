import AbstractComponent from "./abstract-component";

const createNewEventButtonTemplate = () => {
  return (`
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  `);
};

export default class NewEventButton extends AbstractComponent {
  getTemplate() {
    return createNewEventButtonTemplate();
  }

  setButtonClickHandler(cb) {
    this.getElement().addEventListener(`click`, () => {
      this.disableModeOn();
      cb();
    });
  }

  disableModeOn() {
    this.getElement().disabled = true;
  }

  disableModeOff() {
    this.getElement().disabled = false;
  }
}
