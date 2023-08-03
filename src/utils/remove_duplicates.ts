type Filter<T> = (value: T, otherValue: T) => boolean;
const removeDuplicates = <T>(array: T[], filter: Filter<T>): T[] => {
  const filtered: T[] = [];
  for (const item of array) {
    if (filtered.findIndex((a) => filter(a, item)) === -1) {
      filtered.push(item);
    }
  }
  return filtered;
};
export default removeDuplicates;
