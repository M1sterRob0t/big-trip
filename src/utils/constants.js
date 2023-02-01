export const transferLabeledTypes = [
  [`taxi`, `🚕 TAXI`],
  [`bus`, `🚌 BUS`],
  [`train`, `🚂 TRAIN`],
  [`ship`, `⚓ SHIP`],
  [`transport`, `🚆 TRANSPORT`],
  [`drive`, `🚗 DRIVE`],
  [`flight`, `✈ FLIGHT`],
];
export const activityLabeledTypes = [
  [`check-in`, `🏨 CHECK-IN`],
  [`sightseeing`, `🏛 SIGHTSEEING`],
  [`restaurant`, `🍔 RESTAURANT`],
];

export const labeledTypes = transferLabeledTypes.concat(activityLabeledTypes);
export const transferTypes = transferLabeledTypes.map((el) => el[0]);
export const activityTypes = activityLabeledTypes.map((el) => el[0]);
export const types = labeledTypes.map((el) => el[0]);
export const Preposition = {TO: `to`, IN: `in`};


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

const Filter = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const DEFAULT_FILTER_TYPE = Filter.EVERYTHING;
const HIDING_CLASS = `visually-hidden`;

export {monthes, SortType, Filter, HIDING_CLASS, DEFAULT_FILTER_TYPE};
