import _ from "lodash";
import {cities} from "../constants/constants";

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const generateDestination = () => {
  const description = _.shuffle(descriptions).slice(0, _.random(1, 4));
  const name = _.sample(cities);
  const pictures = new Array(_.random(1, 5)).fill(``).map(() => {
    return {
      src: `http://picsum.photos/248/152?r=${Math.random()};`,
      description: _.sample(descriptions),
    };
  });

  return {
    description,
    name,
    pictures,
  };
};
const destinations = cities.map(() => generateDestination());

export {destinations};
