import SmartView from '../view/smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import dayjs from 'dayjs';
import { eventDurationFormat } from '../utils/event-utils.js';

const getUniqueTypes = (events) => {
  const uniqueTypes = new Set();
  events.map((event) => uniqueTypes.add(event.type));
  return uniqueTypes;
};

const getUniqueAmount = (uniqueTypes) => {
  const uniqueTypesAmount = {};
  uniqueTypes.forEach((type) => {
    uniqueTypesAmount[type] = 0;
  });
  return uniqueTypesAmount;
};

const calculateTypeCost = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const uniqueTypesCost = getUniqueAmount(uniqueTypes);

  events.forEach((event) => {
    uniqueTypesCost[event.type] += event.basePrice;
  });

  const uniqueTypesCostOrdered = new Map(Object.entries(uniqueTypesCost).sort((a, b) => b[1] - a[1]));

  return uniqueTypesCostOrdered;
};

const calculateTypeCount = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const uniqueTypesCount = getUniqueAmount(uniqueTypes);

  events.forEach((event) => {
    uniqueTypesCount[event.type]++;
  });

  const uniqueTypesCountOrdered = new Map(Object.entries(uniqueTypesCount).sort((a, b) => b[1] - a[1]));
  return uniqueTypesCountOrdered;
};

const calculateTypeTime = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const uniqueTypesTime = getUniqueAmount(uniqueTypes);

  events.forEach((event) => {
    const eventDuration = dayjs(event.dateTo).diff(dayjs(event.dateFrom), 'm');
    uniqueTypesTime[event.type] += eventDuration;
  });

  const uniqueTypesTimeOrdered = new Map(Object.entries(uniqueTypesTime).sort((a, b) => b[1] - a[1]));

  return uniqueTypesTimeOrdered;
};

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, events) => {
  moneyCtx.height = BAR_HEIGHT * 5;

  const eventTypesCost = calculateTypeCost(events);
  const typeLabels = [...eventTypesCost.keys()];
  const typeValues = [...eventTypesCost.values()];

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typeLabels,
      datasets: [{
        data: typeValues,
        backgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return moneyChart;
};
const renderTypeChart = (typeCtx, events) => {
  typeCtx.height = BAR_HEIGHT * 5;

  const eventTypesCount = calculateTypeCount(events);
  const typeLabels = [...eventTypesCount.keys()];
  const typeValues = [...eventTypesCount.values()];

  const typeChart = new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typeLabels,
      datasets: [{
        data: typeValues,
        backgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return typeChart;
};
const renderTimeChart = (timeCtx, events) => {
  timeCtx.height = BAR_HEIGHT * 5;

  const eventTypesTime = calculateTypeTime(events);
  const typeLabels = [...eventTypesTime.keys()];
  const typeValues = [...eventTypesTime.values()];

  const timeChart = new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typeLabels,
      datasets: [{
        data: typeValues,
        backgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${eventDurationFormat(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return timeChart;
};


const createStatisticsTemplate = () => `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="money" width="900"></canvas>
          </div>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="type" width="900"></canvas>
          </div>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="time" width="900"></canvas>
          </div>
        </section>`;

export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;
  _data = null;

  constructor(events) {
    super();
    this._data = events;
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }
    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }
    if (this.#timeChart) {
      this.#timeChart.destroy();
      this.#timeChart = null;
    }
  }

  #setCharts = () => {

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    this.#moneyChart = renderMoneyChart(moneyCtx, this._data);
    this.#typeChart = renderTypeChart(typeCtx, this._data);
    this.#timeChart = renderTimeChart(timeCtx, this._data);
  }

  restoreHandlers() {
    this.#setCharts();
  }
}
