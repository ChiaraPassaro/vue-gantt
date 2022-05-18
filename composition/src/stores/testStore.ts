import { DateTime } from "luxon";
import { reactive } from "vue";

export const state = reactive({
  configStyles: {
    defaultPx: 16,
    dayWidthEm: 3,
    rowHeightRem: 3.3,
    paddingRow: 8,
    bgGroup: "212, 148, 255",
    paddingTopGroup: 2.2,
  },
  configDate: {
    now: DateTime.now(),
    startDate: "2022-02-20", // start date tasks gantt
    startGantt: 2, // start date gantt -2 month
    endGantt: 12, // end gantt +12
    dates: null,
  },
  rowSettings: {
    height: 36,
    margin: 0.2,
  },
  dragBlockSettings: {
    height: 100,
    widthHandles: 8,
    fontSize: 1,
    backgroundColor: "75, 75, 126",
    textColor: "75, 75, 126",
    borderRadius: 0.6,
    dragColor: "212, 148, 255",
  },
  tasks: [],
  loading: false,
});
