export default class Storage {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value,
            })
        )
    );
  }

  setItems(items) {
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  removeItem(key) {
    const storedItems = this.getItems();
    delete storedItems[key];

    this._storage.setItem(this._storeKey, JSON.stringify(storedItems));
  }
}
