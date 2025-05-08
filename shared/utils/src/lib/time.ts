export type TimeUnitType = 'ms' | 's' | 'm' | 'h' | 'd';
export type TimeString = `${number}${TimeUnitType}`;

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

export class Time {
  public static toMs(time: TimeString) {
    return (
      parseFloat(time) *
      (() => {
        switch (time.match(/(ms|s|m|h|d)$/)![0]) {
          case 'd':
            return day;
          case 'h':
            return hour;
          case 'm':
            return minute;
          case 's':
            return second;
          default:
            return 1; // ms
        }
      })()
    );
  }

  public consts = {
    day,
    hour,
    minute,
    second,
  };

  public static isValid(str: unknown) {
    return typeof str === 'string' ? !!parseInt(str) : false;
  }

  public static readable(time: number) {
    if (time >= day) {
      const d = Math.floor(time / day);
      const h = Math.floor((time % day) / hour);
      const m = Math.floor(((time % day) % hour) / minute);
      const s = Math.floor((((time % day) % hour) % minute) / second);
      return `${d}d ${h}h ${m}m ${s}s`;
    } else if (time >= hour) {
      const h = Math.floor(time / hour);
      const m = Math.floor((time % hour) / minute);
      const s = Math.floor(((time % hour) % minute) / second);
      return `${h}h ${m}m ${s}s`;
    } else if (time >= minute) {
      const m = Math.floor(time / minute);
      const s = Math.floor((time % minute) / second);
      return `${m}m ${s}s`;
    } else if (time >= second) {
      const s = Math.floor(time / second);
      // const ms = time % second;
      // return `${s}s ${ms}ms`;
      return `${s}s`;
    } else {
      return `${time}ms`;
    }
  }
}
