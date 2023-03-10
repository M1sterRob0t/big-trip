export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.isFavorite = data[`is_favorite`];
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  static dataToRaw(data) {
    return {
      [`base_price`]: data.price,
      [`date_from`]: data.dateFrom.toISOString(),
      [`date_to`]: data.dateTo.toISOString(),
      [`destination`]: data.destination,
      [`id`]: data.id,
      [`is_favorite`]: data.isFavorite,
      [`offers`]: data.offers,
      [`type`]: data.type,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRaw());
  }
}

