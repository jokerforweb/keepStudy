import {observable} from 'aurelia-framework';
import './time-recorder.scss';

export class TimeRecorder {
  @observable dateTime = null;
  dateTimes = [];

  dateTimeChanged(newValue) {
    this.dateTimes.push(newValue);
  }
}
