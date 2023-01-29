import {transferTypes, activityTypes, Preposition} from "../constants/constants";
import {capitalizeFirstLetter} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";

const DATE_FORMAT = `YY/MM/DD HH:mm`;
const defaultData = {
  buttonTextDelete: `Delete`,
  buttonTextSave: `Save`,
  isBlockForm: false,
};

const parseFormData = (formData) => {
  return {
    price: Number(formData.get(`event-price`)),
    dateFrom: new Date(moment(formData.get(`event-start-time`), DATE_FORMAT)),
    dateTo: new Date(moment(formData.get(`event-end-time`), DATE_FORMAT)),
  };
};

const createTripEventEditTemplate = (point, offers, destinations, isCreating, externalData) => {
  const {type, destination, offers: chosenOffers, price, dateFrom, dateTo, isFavorite} = point;
  const {name: city = ``, description, pictures} = destination;
  const isDestination = destination ? true : false;

  const allOffers = offers.find((el) => el.type === type).offers;
  const cities = destinations.map((el) => el.name);
  const preposition = activityTypes.includes(type) ? Preposition.IN : Preposition.TO;
  const dateStartFormatted = moment(dateFrom).format(DATE_FORMAT);
  const dateEndFormatted = moment(dateTo).format(DATE_FORMAT);
  const saveButtonText = externalData.buttonTextSave;
  const deleteButtonText = externalData.buttonTextDelete;
  const isBlockForm = externalData.isBlockForm;

  return (`
    <form class="trip-events__item  event  event--edit" action="#" method="post" ${isBlockForm ? `disabled` : ``}>
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferTypes.map((el) => createEventTypeMarkup(el)).join(``)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityTypes.map((el) => createEventTypeMarkup(el)).join(``)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalizeFirstLetter(type)} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1"
            type="text" name="event-destination" value="${city}" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${cities.map((el) => crateOptionMarkup(el)).join(``)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStartFormatted}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEndFormatted}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" min="0">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockForm ? `disabled` : ``}>${saveButtonText}</button>
        ${isCreating ? `
          <button class="event__reset-btn" type="reset" ${isBlockForm ? `disabled` : ``}>Cancel</button>` : `
          <button class="event__reset-btn" type="reset" ${isBlockForm ? `disabled` : ``}>${deleteButtonText}</button>
        `}

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden"
          type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn ${isCreating ? `visually-hidden` : ``}" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        <button class="event__rollup-btn ${isCreating ? `visually-hidden` : ``}" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${allOffers.map((el) => createOfferMarkup(el.title, el.price, chosenOffers)).join(``)}
          </div>
        </section>
        ${isDestination ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pictures.map((el) => createEventPhotoMarkup(el.src, el.description)).join(``)}
              </div>
            </div>
          </section>` : ``}
      </section>
    </form>
  `);
};

const createEventTypeMarkup = (type) => {
  return (`
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
    </div>
  `);
};

const crateOptionMarkup = (city) => {
  return (`
    <option value="${city}"></option>
  `);
};

const createOfferMarkup = (desc, price, chosenOffers) => {
  const title = desc.toLowerCase().split(` `).join(`-`);
  const isChecked = chosenOffers.find((offer) => offer.title === desc) ? true : false;

  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1"
        type="checkbox" name="event-offer-${title}" data-title="${desc.toLowerCase()}"
        ${isChecked ? `checked` : ``}
      >
      <label class="event__offer-label" for="event-offer-${title}-1">
        <span class="event__offer-title">${desc}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `);
};

const createEventPhotoMarkup = (src, alt) => {
  return (`
    <img class="event__photo" src="${src}" alt="${alt}">
  `);
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(point, offers, destinations, isCreating = false) {
    super();

    this._point = point;
    this._offers = offers;
    this._destinations = destinations;
    this._isCreating = isCreating;
    this._externalData = defaultData;

    this._formSubmitHandler = null;
    this._favoriteCheckboxChangeHandler = null;
    this._typeChangeHandler = null;
    this._destinationChangeHandler = null;
    this._deleteButtonClickHandler = null;
    this._rollupButtonClickHandler = null;
    this._priceInputChangeHandler = null;
    this._dateStartInputChangeHandler = null;
    this._offersCheckboxChangeHandler = null;

    this._flatpickr = null;

    this.setDateStartInputFocusHandler();
    this.setDateEndInputFocusHandler();
  }

  getTemplate() {
    return createTripEventEditTemplate(this._point, this._offers, this._destinations, this._isCreating, this._externalData);
  }

  setFormSubmitHandler(cb) {
    this._formSubmitHandler = cb;
    this.getElement().addEventListener(`submit`, cb);
  }

  setFavoriteCheckboxChangeHandler(cb) {
    this._favoriteCheckboxChangeHandler = cb;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, cb);
  }

  setTypeChangeHandler(cb) {
    this._typeChangeHandler = cb;
    this.getElement().querySelectorAll(`.event__type-input`).forEach((el) => el.addEventListener(`change`, cb));
  }

  setDestinationChangeHandler(cb) {
    this._destinationChangeHandler = cb;
    const inputDestination = this.getElement().querySelector(`.event__input--destination`);

    inputDestination.addEventListener(`change`, (evt) => {
      const isValid = this._destinations.find((el) => el.name === evt.target.value);
      if (isValid) {
        cb(evt);
      } else {
        inputDestination.setCustomValidity(`Please select a valid value.`);
      }
    });
  }

  setDateStartInputFocusHandler() {
    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    dateStartElement.addEventListener(`focus`, () => {
      this._applyFlatpickr(dateStartElement, {defaultDate: dateStartElement.value, maxDate: dateEndElement.value});
    });
  }

  setDateEndInputFocusHandler() {
    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    dateEndElement.addEventListener(`focus`, () => {
      this._applyFlatpickr(dateEndElement, {defaultDate: dateEndElement.value, minDate: dateStartElement.value});
    });
  }

  setDeleteButtonClickHandler(cb) {
    this._deleteButtonClickHandler = cb;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, cb);
  }

  setRollupButtonClickHandler(cb) {
    this._rollupButtonClickHandler = cb;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.setFavoriteCheckboxChangeHandler(this._favoriteCheckboxChangeHandler);
    this.setTypeChangeHandler(this._typeChangeHandler);
    this.setDestinationChangeHandler(this._destinationChangeHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setDateStartInputFocusHandler();
    this.setDateEndInputFocusHandler();
  }

  updatePoint(point) {
    this._point = point;
  }

  _applyFlatpickr(dateElement, settings) {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const flatpickrSetting = {
      // allowInput: true,
      enableTime: true,
      dateFormat: `y/m/d H:i`,
      onClose: this._dateStartInputChangeHandler,
    };

    this._flatpickr = flatpickr(dateElement, Object.assign({}, flatpickrSetting, settings));
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
    }
    super.removeElement();
  }

  _getChosenOffers() {
    const offerTitles = Array.from(this.getElement()
      .querySelectorAll(`.event__offer-checkbox`))
      .filter((el) => el.checked)
      .map((el) => el.dataset.title);

    const offersByType = this._offers.find((el) => el.type === this._point.type).offers;
    const chosenOffers = offersByType.filter((offer) => {
      return offerTitles.find((title) => offer.title.toLowerCase() === title);
    });

    return chosenOffers;
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    const offers = this._getChosenOffers();

    return Object.assign(parseFormData(formData), {offers});
  }

  setData(data = defaultData) {
    this._externalData = Object.assign({}, defaultData, data);
    this.rerender();
  }
}
