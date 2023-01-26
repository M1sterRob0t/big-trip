import AbstractComponent from "./abstract-component";
import {Chart, registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const transferLabledTypes = [
  [`taxi`, `🚕 TAXI`],
  [`bus`, `🚌 BUS`],
  [`train`, `🚂 TRAIN`],
  [`ship`, `⚓ SHIP`],
  [`transport`, `🚆 TRANSPORT`],
  [`drive`, `🚗 DRIVE`],
  [`flight`, `✈ FLIGHT`],
];
const activityLabledTypes = [
  [`check-in`, `🏨 CHECK-IN`],
  [`sightseeing`, `🏛 SIGHTSEEING`],
  [`restaurant`, `🍔 RESTAURANT`],
];

const labledTypes = transferLabledTypes.concat(activityLabledTypes);
const transferTypes = transferLabledTypes.map((el) => el[0]);
const types = labledTypes.map((el) => el[0]);

const getMoneyByType = (points) => {
  return types
    .map((type) => {
      const money = points.reduce((acc, current) => {
        acc += (current.type === type) ? current.price : 0;
        return acc;
      }, 0);

      return {
        type,
        money,
      };
    })
    .map((el) => {
      const labledType = labledTypes.find((type) => type[0] === el.type);
      return {
        type: labledType[1],
        money: el.money
      };
    })
    .filter((el) => el.money > 0)
    .sort((a, b) => b.money - a.money);

};

const getHoursByType = (points) => {
  return types
    .map((type) => {
      const hours = points.reduce((acc, current) => {
        acc += (current.type === type) ? Math.round((current.dateTo - current.dateFrom) / 1000 / 60 / 60) : 0;
        return acc;
      }, 0);

      return {
        type,
        hours,
      };
    })
    .map((el) => {
      const labledType = labledTypes.find((type) => type[0] === el.type);
      return {
        type: labledType[1],
        hours: el.hours
      };
    })
    .filter((el) => el.hours > 0)
    .sort((a, b) => b.hours - a.hours);
};

const getTimesByType = (points) => {

  return transferTypes
    .map((type) => {
      const times = points.reduce((acc, current) => {
        acc += (current.type === type) ? 1 : 0;
        return acc;
      }, 0);

      return {
        type,
        times,
      };
    })
    .map((el) => {
      const labledType = labledTypes.find((type) => type[0] === el.type);
      return {
        type: labledType[1],
        times: el.times
      };
    })
    .filter((el) => el.times > 0)
    .sort((a, b) => b.times - a.times);
};

const createStatsTemplate = () => {
  return (`
    <section class="statistics visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>
  `);
};


export default class Stats extends AbstractComponent {
  constructor() {
    super();
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  printStatistic(pointsModel) {
    const points = pointsModel.data; //
    const moneyByType = getMoneyByType(points);
    const timesByType = getTimesByType(points);
    const hoursByType = getHoursByType(points);

    Chart.register(...registerables);
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = document.querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    this._moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `bar`,
      data: {
        labels: moneyByType.map((el) => el.type),
        datasets: [{
          data: moneyByType.map((el) => el.money),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
        }]
      },
      options: {
        indexAxis: `y`,
        plugins: {
          datalabels: {
            font: {
              size: 15,
              color: `#000000`,
            },
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          },
          title: {
            display: true,
            text: `MONEY`,
            font: {
              size: 25,
              color: `#000000`,
              weight: 600,
            },
            position: `left`
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              font: {
                size: 14
              },
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            barThickness: 44,
          },
          x: {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            minBarLength: 50
          },
        }
      }
    });

    this._transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `bar`,
      data: {
        labels: timesByType.map((el) => el.type),
        datasets: [{
          data: timesByType.map((el) => el.times),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        indexAxis: `y`,
        plugins: {
          datalabels: {
            font: {
              size: 15,
              color: `#000000`,
            },
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          },
          title: {
            display: true,
            text: `TRANSPORT`,
            font: {
              size: 25,
              color: `#000000`,
              weight: 600,
            },
            position: `left`
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              font: {
                size: 14
              },
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            barThickness: 44,
          },
          x: {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            minBarLength: 50
          },
        }
      }
    });

    this._timeSpentChart = new Chart(timeSpendCtx, {
      plugins: [ChartDataLabels],
      type: `bar`,
      data: {
        labels: hoursByType.map((el) => el.type),
        datasets: [{
          data: hoursByType.map((el) => el.hours),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        indexAxis: `y`,
        plugins: {
          datalabels: {
            font: {
              size: 15,
              color: `#000000`,
            },
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          },
          title: {
            display: true,
            text: `TIME SPENT`,
            font: {
              size: 25,
              color: `#000000`,
              weight: 600,
            },
            position: `left`
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              font: {
                size: 14
              },
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            barThickness: 44,
          },
          x: {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            minBarLength: 50
          },
        }
      }
    });
  }

  removeStatistic() {
    this._moneyChart.destroy();
    this._transportChart.destroy();
    this._timeSpentChart.destroy();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }
}
