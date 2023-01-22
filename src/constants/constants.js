const transferTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const activityTypes = [`check-in`, `sightseeing`, `restaurant`];
const Preposition = {TO: `to`, IN: `in`};
const types = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
const cities = [`Moscow`, `Berlin`, `Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`, `Vienna`, `Nurnberg`, `Budapest`, `Bratislava`, `Paris`];
const Month = {
  JANUARY: `Jan`,
  FEBRUARY: `Feb`,
  MARCH: `Mar`,
  APRIL: `April`,
  MAY: `May`,
  JUNE: `Jun`,
  JULY: `Jul`,
  AUGUST: `Aug`,
  SEPTEMBER: `Sep`,
  OCTOBER: `Oct`,
  DECEMBER: `Dec`,
};

const monthes = [
  Month.JANUARY,
  Month.FEBRUARY,
  Month.MARCH,
  Month.APRIL,
  Month.MAY,
  Month.JUNE,
  Month.JULY,
  Month.AUGUST,
  Month.SEPTEMBER,
  Month.OCTOBER,
  Month.DECEMBER
];

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export {transferTypes, activityTypes, Preposition, types, cities, monthes, SortType};
