import { DateTime } from "luxon";

const getDateFormatted = (date: string): DateTime => {
  return DateTime.fromFormat(date, "yyyy-MM-dd");
};

const compareLuxonDates = (a, b) => {
  return (
    DateTime.fromFormat(a, "yyyy-MM-dd").toMillis() -
    DateTime.fromFormat(b, "yyyy-MM-dd").toMillis()
  );
};

export { getDateFormatted, compareLuxonDates };
