import AbstractComponent from "./abstract-component";

const createTripDaysTemplate = () => {
  return (`
    <ul class="trip-days">
    </ul>
  `);
};

export default class Days extends AbstractComponent {
  getTemplate() {
    return createTripDaysTemplate(this._date, this._counter);
  }
}
