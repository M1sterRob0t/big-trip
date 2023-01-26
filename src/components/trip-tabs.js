import AbstractComponent from "./abstract-component";

const TAB_ACTIVE_CLASS = `trip-tabs__btn--active`;
export const Tab = {
  TABLE: `table`,
  STATS: `stats`,
};

const createTripTabsTemplate = () => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-name="table">Table</a>
      <a class="trip-tabs__btn" href="#" data-name="stats">Stats</a>
    </nav>
  `);
};

export default class Tabs extends AbstractComponent {
  constructor() {
    super();
    this._activeTabName = Tab.TABLE;
  }
  getTemplate() {
    return createTripTabsTemplate();
  }

  setTabClickHandler(cb) {
    const tabs = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    tabs.forEach((tab) => tab.addEventListener(`click`, (evt) => {
      if (evt.target.dataset.name === this._activeTabName) {
        return;
      }
      this._activeTabName = evt.target.dataset.name;
      tabs.forEach((el) => el.classList.remove(TAB_ACTIVE_CLASS));
      evt.target.classList.add(TAB_ACTIVE_CLASS);
      cb(evt);
    }));
  }
}

