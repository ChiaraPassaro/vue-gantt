import { DateTime } from "luxon";
import LexoRank from "@kayron013/lexorank";
import { reactive } from "vue";

export const state = reactive({
  configStyles: { dayWidthEm: 2, defaultPx: 36 },
  configDate: {
    now: DateTime.now(),
    startDate: "2022-02-20", // start date tasks gantt
    startGantt: 2, // start date gantt -2 month
    endGantt: 12, // end gantt +12
    dates: null,
  },
  groups: [
    {
      width: 36,
      left: 0,
      open: true,
      name: "Group",
      groupCode: "a",
      bucket: 0,
    },
  ],
  rowSettings: {
    height: 36,
    margin: 0.2,
  },
  dragBlockSettings: {
    height: 100,
    widthHandles: 8,
    minWidth: 36,
    fontSize: 1,
    backgroundColor: "75, 75, 126",
    textColor: "75, 75, 126",
    borderRadius: 0.6,
  },
  tasks: [
    {
      id: 1,
      bucket: 0,
      groupCode: "a",
      rank: new LexoRank("aaa", "0").toString(),
      startDate: "2022-02-01",
      endDate: "2022-02-16",
      days: 15,
      offset: 10,
      width: 36 * 15,
      marginLeft: 360,
      name: "Lorem Ipsum 1",
    },
    {
      id: 2,
      bucket: 0,
      groupCode: "a",
      rank: new LexoRank("aab", "0").toString(),
      startDate: "2022-02-16",
      endDate: "2022-02-18",
      days: 2,
      offset: 1,
      width: 62,
      marginLeft: 36,
      name: "Lorem Ipsum 2",
    },
    {
      id: 3,
      bucket: 0,
      groupCode: "a",
      rank: new LexoRank("aac", "0").toString(),
      startDate: "2022-02-20",
      endDate: "2022-02-22",
      days: 2,
      offset: 10,
      width: 62,
      marginLeft: 360,
      name: "Lorem Ipsum 3",
    },
    {
      id: 4,
      bucket: 0,
      groupCode: "a",
      rank: new LexoRank("aad", "0").toString(),
      startDate: "2022-02-25",
      endDate: "2022-02-26",
      days: 1,
      offset: 5,
      width: 36,
      marginLeft: 36 * 5,
      name: "Lorem Ipsum 4",
    },
    {
      id: 5,
      bucket: 0,
      groupCode: "a",
      rank: new LexoRank("aaf", "0").toString(),
      startDate: "2022-02-26",
      endDate: "2022-02-28",
      days: 2,
      offset: 1,
      width: 62,
      marginLeft: 36,
      name: "Lorem Ipsum 5",
    },
  ],
});
