import { DateTime } from "luxon";
import { state } from "../../stores/testStore";

const getDateFormatted = (date: string): DateTime => {
  return DateTime.fromFormat(date, "yyyy-MM-dd");
};

const getGanttStartDate = (): string => {
  const date = getDateFormatted(state.configDate.startDate)
    .minus({ months: state.configDate.startGantt })
    .toFormat("yyyy-MM");
  return date;
};

const compareLuxonDates = (a, b) => {
  return (
    DateTime.fromFormat(a, "yyyy-MM-dd").toMillis() -
    DateTime.fromFormat(b, "yyyy-MM-dd").toMillis()
  );
};

export { getDateFormatted, getGanttStartDate, compareLuxonDates };
