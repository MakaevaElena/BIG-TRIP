import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {}

  // 6.1.3 Обучит компонент обновлять данные
  updateData = (update) => {
    if (!update) {
      return;
    }
    // "кто последнй тот и прав"
    this._data = { ...this._data, ...update };

    this.updateElement();
  }

  // 6.1.2 Обучит компонент обновлять шаблон
  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
