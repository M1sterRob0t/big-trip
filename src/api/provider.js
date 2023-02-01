import Point from "../models/point";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (response) => {
  return response.map((el) => Point.dataToRaw(Point.parsePoint(el.payload.point)));
};

const createStorageStructure = (points) => {
  return points.reduce((acc, cur) => {
    return Object.assign({}, acc, {
      [cur.id]: cur
    });
  }, {});
};

export default class Provider {
  constructor(api, pointsStorage, offersStorage, destinationsStorage) {
    this._api = api;
    this._pointsStorage = pointsStorage;
    this._offersStorage = offersStorage;
    this._destinationsStorage = destinationsStorage;
  }

  getData() {
    if (isOnline()) {
      return this._api.getData().then((data) => {
        const [points, offers, destinations] = data;

        const pointsForStorage = createStorageStructure(points.map((point) => Point.dataToRaw(point)));
        this._pointsStorage.setItems(pointsForStorage);

        offers.forEach((offer, index) => this._offersStorage.setItem(index, offer));
        destinations.forEach((offer, index) => this._destinationsStorage.setItem(index, offer));

        return data;
      });
    }

    const storedPoints = Point.parsePoints(Object.values(this._pointsStorage.getItems()));
    const storedOffers = Object.values(this._offersStorage.getItems());
    const storedDestinations = Object.values(this._destinationsStorage.getItems());
    const data = [storedPoints, storedOffers, storedDestinations];
    return Promise.resolve(data);
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const pointsForStorage = createStorageStructure(points.map((point) => Point.dataToRaw(point)));
          this._pointsStorage.setItems(pointsForStorage);

          return points;
        });
    }

    const storedPoints = Object.values(this._pointsStorage.getItems());
    return Promise.resolve(Point.parsePoint(storedPoints));
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point).then((newPoint) => {
        this._pointsStorage.setItem(newPoint.id, Point.dataToRaw(newPoint));
        return newPoint;
      });
    }

    const localPoint = Object.assign({}, point, {id});
    this._pointsStorage.setItem(localPoint.id, Point.dataToRaw(point));
    return Promise.resolve(localPoint);
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point).then(() => {
        this._pointsStorage.removeItem(point.id);
      });
    }

    this._pointsStorage.removeItem(point.id);
    return Promise.resolve();
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point).then((newPoint) => {
        this._pointsStorage.setItem(newPoint.id, Point.dataToRaw(newPoint));
        return newPoint;
      });
    }

    const localNewPoint = Object.assign({}, point);
    this._pointsStorage.setItem(localNewPoint.id, Point.dataToRaw(localNewPoint));
    return Promise.resolve(localNewPoint);
  }

  sync() {
    if (isOnline()) {
      const storedPoints = Object.values(this._pointsStorage.getItems());

      this._api.sync(storedPoints).then((response) => {
        const createdPoints = getSyncedPoints(response.created);
        const updatedPoints = getSyncedPoints(response.updated);

        const items = createStorageStructure([...createdPoints, ...updatedPoints]);
        this._pointsStorage.setItems(items);
      });
    }
  }
}
