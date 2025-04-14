export namespace TimeRange {
  export enum Range {
    EIGHT_YEAR = 8,
    FIVE_YEAR = 5,
    THREE_YEAR = 3,
    ONE_YEAR = 1,
  }
  export const MAX_YEAR = Range.EIGHT_YEAR;
  export const keys = () => {
    const keys = Object.keys(Range);
    return keys.slice(keys.length / 2);
  };
  export const values = () => {
    const values = Object.values(Range);
    return values.slice(values.length / 2);
  };
}

export default TimeRange;
