import {createElement} from "../utils/render";
import {HIDING_CLASS} from "../constants/constants";

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't be instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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

  show() {
    this.getElement().classList.remove(HIDING_CLASS);
  }

  hide() {
    this.getElement().classList.add(HIDING_CLASS);
  }
}
