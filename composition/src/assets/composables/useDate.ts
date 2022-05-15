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

export { getDateFormatted, getGanttStartDate };
