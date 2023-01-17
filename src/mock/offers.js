import _ from "lodash";
import {types} from "../constants/constants";

const allOffers = [
  {
    title: `Upgrade to a business class`,
    price: 120
  },
  {
    title: `Order Uber`,
    price: 20,
  },
  {
    title: `Add luggage`,
    price: 50,
  },
  {
    title: `Rent a car`,
    price: 200,
  },
  {
    title: `Switch to comfort`,
    price: 100,
  },
  {
    title: `Add breakfast`,
    price: 50,
  },
  {
    title: `Lunch in city`,
    price: 30,
  },
  {
    title: `Book tickets`,
    price: 40,
  }
];

const generateOffersByType = (type, array) => {
  return {
    type,
    offers: _.sampleSize(array, 5)
  };
};
const offersByType = types.map((type) => generateOffersByType(type, allOffers));
export {offersByType};
