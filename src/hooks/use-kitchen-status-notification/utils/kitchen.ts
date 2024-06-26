import moment from 'moment';
import { MomentDay } from '../../../common/types/moment-day.type';
import { KitchenStatus } from '../types/kitchen-status.type';

export class Kitchen {
  private static OPEN_TIME = {hour: 12, minute: 0, second: 0, millisecond: 0};

  static get status() {
    if(this.isOpen()) {
      return KitchenStatus.Open;
    } if(this.isClosing()) {
      return KitchenStatus.Closing;
    } if(this.isClosed()) {
      return KitchenStatus.Closed;
    }
    throw new Error('Invalid status');
  }

  /** 주방 오픈 시간 */
  static get openTime() {
    return this.todayMoment.clone().set(this.OPEN_TIME);
  }

  /**
   * 주방 마감 예정 시간
   * - 주방 마감 시간 30분 전
   */
  static get closingTime() {
    return this.closeTime.clone().subtract(30, 'minutes');
  }

  /**
   * 주방 마감 시간
   * - 월요일은 오픈 다음날 1시 30분
   * - 나머지 요일은 오픈 다음날 2시
   */
  static get closeTime() {
    switch(this.today.day) {
      case MomentDay.Sunday:
        return this.todayMoment.clone().add(1, 'day').set(
          {hour: 1, minute: 30, second: 0, millisecond: 0},
        );
      case MomentDay.Monday:
      case MomentDay.Tuesday:
      case MomentDay.Wednesday:
      case MomentDay.Thursday:
      case MomentDay.Friday:
      case MomentDay.Saturday:
        return this.todayMoment.clone().add(1, 'day').set(
          {hour: 2, minute: 0, second: 0, millisecond: 0},
        );
      default:
        throw new Error('Invalid day');
    }
  }

  /** 주방 오픈 전일 경우 전일로 설정 */
  static get today() {
    let now = moment();
    
    if(this.isBeforeOpenTime(now)) {
      now = now.clone().subtract(1, 'day');
    }

    return {
      year: now.year(),
      month: now.month() + 1,
      date: now.date(),
      day: now.day(),
    };
  }

  static get todayMoment() {
    return moment({
      year: this.today.year,
      month: this.today.month - 1,
      date: this.today.date,
    });
  }

  private static isOpen() {
    return moment().isBetween(this.openTime, this.closingTime, undefined, '[)');
  }

  private static isClosing() {
    return moment().isBetween(this.closingTime, this.closeTime, undefined, '[)');
  }

  private static isClosed() {
    return moment().isBetween(this.closeTime, this.openTime.clone().add(1, 'day'), undefined, '[)');
  }

  /** 주방 오픈 전인지 확인 */
  private static isBeforeOpenTime(now: moment.Moment) {
    if(now.hour() < this.OPEN_TIME.hour) {
      return true;
    } if(now.hour() > this.OPEN_TIME.hour) {
      return false;
    }
    // hour가 같은 경우
    if(now.minute() < this.OPEN_TIME.minute) {
      return true;
    } if(now.minute() > this.OPEN_TIME.minute) {
      return false;
    }
    // minute가 같은 경우
    if(now.second() < this.OPEN_TIME.second) {
      return true;
    } if(now.second() > this.OPEN_TIME.second) {
      return false;
    }
    // second가 같은 경우
    if(now.millisecond() < this.OPEN_TIME.millisecond) {
      return true;
    } if(now.millisecond() > this.OPEN_TIME.millisecond) {
      return false;
    }
    // millisecond가 같은 경우
    return false;
  }

  private constructor() {}
}