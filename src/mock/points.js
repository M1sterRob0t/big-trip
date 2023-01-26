import _ from "lodash";
import {destinations} from "./destinations";
import {offersByType} from "./offers";
import {types} from "../constants/constants";


let date = new Date() - 1000 * 60 * 60 * 24 * 3;
const generatePoint = (id) => {
  const price = _.random(5, 150);
  const type = _.sample(types);
  const offers = _.sampleSize(offersByType.find((el) => el.type === type).offers, _.random(0, 5));
  const isFavorite = _.random(0, 1, true) > 0.5 ? true : false;
  const destination = _.sample(destinations);
  const dateFrom = new Date(date);
  const dateTo = new Date(Number(dateFrom) + _.random(0.2, 24, true) * 60 * 60 * 1000);
  date = dateTo;

  return {
    id,
    price,
    dateFrom,
    dateTo,
    destination,
    isFavorite,
    offers,
    type,
  };
};

const generatePoints = (amount) => {
  const points = [];
  for (let i = 1; i <= amount; i++) {
    points.push(generatePoint(i));
  }

  return points;
};

export {generatePoints};


