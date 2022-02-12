import {DateTime} from "luxon";

const compareLuxonDates = (a, b) => {
  return DateTime.fromFormat(a, "yyyy-MM-dd").toMillis() - DateTime.fromFormat(b, "yyyy-MM-dd").toMillis()
}

export default compareLuxonDates;