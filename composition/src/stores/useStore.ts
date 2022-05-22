import { defineStore } from "pinia";
import { DateTime } from "luxon";
import { getDateFormatted } from "@/assets/composables/useDate";

export const useStore = defineStore({
  id: "useStore",
  state: () => ({
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
  }),
  getters: {
    //Now flag position
    offsetNow(): string {
      if (Object.keys(this.tasks).length > 0 && this.configDate.startDate) {
        const offset = this.configDate.now
          .diff(
            DateTime.fromFormat(
              this.getGanttStartDate.toFormat("yyyy-MM"),
              "yyyy-MM"
            ),
            "days"
          )
          .toObject().days;

        return `${
          this.configStyles.dayWidthEm *
          Math.floor(offset) *
          this.configStyles.defaultPx
        }px`;
      }
      return "0px";
    },
    getGanttStartDate(): DateTime {
      const date = getDateFormatted(this.configDate.startDate).minus({
        months: this.configDate.startGantt,
      });
      return date;
    },
    getMinWidthDragBlock(): number {
      return this.configStyles.defaultPx * this.configStyles.dayWidthEm;
    },
  },
  actions: {
    setDates(dates: object) {
      this.configDate.dates = dates;
    },
    setStartDate(date: string) {
      this.configDate.startDate = date;
    },
    setLoading(state: boolean) {
      this.loading = state;
    },
  },
});
