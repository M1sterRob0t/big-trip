import {monthes} from "../constants/constants";

const createTripDayTemplate = (date, counter) => {

  const formattedDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1 < 10 ? `0` + (date.getMonth() + 1) : (date.getMonth() + 1),
    date: date.getDate() < 10 ? `0` + date.getDate() : date.getDate(),
  };
  const datetime = `${formattedDate.year}-${formattedDate.month}-${formattedDate.date}`;

  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${counter}</span>
        <time class="day__date" datetime="${datetime}">${monthes[date.getMonth()]} ${date.getDate()}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>
  `);
};

export {createTripDayTemplate};
