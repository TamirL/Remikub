export type CompareFunction<T> = (item1: T, item2: T) => number;

export type Comparator<T> =
  CompareFunction<T> &
  {
    reverse(): Comparator<T>;
    then(nextComparator: CompareFunction<T>): Comparator<T>;
  };



export const compare = {
  byField<TObject, TField>(fieldGetter: (item: TObject) => TField, compareFunction: CompareFunction<TField>): Comparator<TObject> {
    return compare.fromCompareFunction((item1: TObject, item2: TObject) => {
      return compareFunction(fieldGetter(item1), fieldGetter(item2));
    });
  },

  byStringField<T>(
    stringFieldGetter: (item: T) => string | null | undefined,
    caseFirst: 'upper' | 'lower' | false = 'upper',
    nullsFirst: boolean = false,
  ): Comparator<T> {
    return compare.byField(stringFieldGetter, compare.stringsCaseInsensitive(caseFirst, nullsFirst));
  },

  stringsCaseInsensitive(
    caseFirst: 'upper' | 'lower' | false = 'upper',
    nullsFirst: boolean = false,
  ): Comparator<string | null | undefined> {
    return compare.fromCompareFunction((str1: string | null | undefined, str2: string | null | undefined): number => {
      if (str1 === null || str1 === undefined) {
        return nullsFirst ? -1 : 1;
      }

      if (str2 === null || str2 === undefined) {
        return nullsFirst ? 1 : -1;
      }

      const caseInsensitiveCompareResult = str1.localeCompare(str2, ['en', 'he'], { sensitivity: 'base' });

      // A result which is not 0 is already good enough - it means that case independent - this string is not the same
      if (caseInsensitiveCompareResult) {
        return caseInsensitiveCompareResult;
      }

      // caseFirst means that in case the case-insensitive result is the same - for example "aaa" vs "AAA"
      // we want to sort with a preference to uppercase results - AKA "AAA" before "aaa" for caseFirst = 'upper'
      // But if caseFirst is not defined or is false - we keep the comparison case-insensitive only, which means "aaa" and "AAA" return 0
      // which is "equals"
      if (!caseFirst) {
        return caseInsensitiveCompareResult;
      }

      // In case the strings are "case-insensitive equal" we want to compare them by the "case first" rule
      return str1.localeCompare(str2, ['en', 'he'], { caseFirst });
    });
  },

  booleans(trueFirst: boolean = true): Comparator<boolean> {
    return compare.fromCompareFunction((first: boolean, second: boolean) => {
      const result = first === second ? 0 : first ? -1 : 1;
      return trueFirst ? result : -result;
    });
  },

  numbers: (): Comparator<number | undefined | null> => {
    return compare.fromCompareFunction((num1: number | undefined | null, num2: number | undefined | null): number => {
      return (num1 ?? 0) - (num2 ?? 0);
    });
  },

  writeTimestamp: function <T extends { writeTimestamp: number }>(): Comparator<T> {
    return compare.byField<T, number>((item) => item?.writeTimestamp, compare.numbers());
  },

  enum<T extends Record<string, string | number>>(enumVal: T): Comparator<T[keyof T]> {
    const values = Object.values(enumVal);
    return compare.fromCompareFunction((val1: T[keyof T], val2: T[keyof T]): number => {
      return values.indexOf(val1) - values.indexOf(val2);
    });
  },

  unionType<T>(unionTypeOrder: T[]): Comparator<T> {
    return compare.fromCompareFunction((val1: T, val2: T): number => {
      return unionTypeOrder.indexOf(val1) - unionTypeOrder.indexOf(val2);
    });
  },

  fromCompareFunction<T>(compareFunction: CompareFunction<T>): Comparator<T> {
    const comparator = function (item1: T, item2: T): number {
      return compareFunction(item1, item2);
    };

    comparator.reverse = function (): Comparator<T> {
      return compare.fromCompareFunction((item1, item2) => {
        return -compareFunction(item1, item2);
      });
    };

    comparator.then = function (nextCompareFunction: CompareFunction<T>): Comparator<T> {
      return compare.fromCompareFunction((item1, item2) => {
        return compareFunction(item1, item2) || nextCompareFunction(item1, item2);
      });
    };

    return comparator;
  },
};