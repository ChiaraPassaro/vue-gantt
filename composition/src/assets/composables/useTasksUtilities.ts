import { computed } from "@vue/reactivity";
import { DateTime } from "luxon";
import { state } from "../../stores/testStore";

import {
  getDateFormatted,
  getGanttStartDate,
} from "../../assets/composables/useDate";

import type { Task } from "../../assets/types/Task";

//computed
const getMinWidthDragBlock = computed(() => {
  return state.configStyles.defaultPx * state.configStyles.dayWidthEm;
});

const getPositionDragBlock = (
  task: Task
): { width: number; marginLeft: number } => {
  const { days, offset } = task;
  const width =
    state.configStyles.dayWidthEm * state.configStyles.defaultPx * days;
  const marginLeft =
    state.configStyles.dayWidthEm * state.configStyles.defaultPx * offset;

  return { width, marginLeft };
};

// const setTaskStartDate = (task: Task, distance: number): void => {};
// const setTaskEndDate = (task: Task, distance: number): void => {};
// const setTaskDays = (task: Task, distance: number): void => {};

const setTaskData = ({
  task,
  distance,
  handle,
  vs,
}: {
  task: Task;
  distance: number;
  handle: string;
  vs: string;
}) => {
  const startGantt = getGanttStartDate();
  const startDateTask = getDateFormatted(task.startDate);
  const endDateTask = getDateFormatted(task.endDate);
  //days and distances
  const daysCeil = Math.abs(Math.ceil(distance));
  const daysFloor = Math.abs(Math.floor(distance));
  const distanceCeil = Math.ceil(distance);
  const distanceFloor = Math.floor(distance);

  if (handle === "right") {
    if (vs === "left") {
      task.days =
        endDateTask.minus({ days: daysCeil }) > startDateTask
          ? task.days + distanceFloor
          : 1;
      task.endDate =
        endDateTask.minus({ days: daysCeil }) > startDateTask
          ? endDateTask.minus({ days: daysFloor }).toFormat("yyyy-MM-dd")
          : task.startDate;
      if (getDateFormatted(task.endDate) <= getDateFormatted(startGantt)) {
        task.startDate = startGantt;
      }
    } else if (vs === "right") {
      task.days += distanceCeil;
      task.endDate = endDateTask
        .plus({ days: daysCeil })
        .toFormat("yyyy-MM-dd");
    }
  } else if (handle === "left") {
    if (vs === "left") {
      task.startDate = startDateTask
        .minus({ days: daysFloor })
        .toFormat("yyyy-MM-dd");

      task.days -= distanceFloor;
      task.offset += distanceFloor;

      if (getDateFormatted(task.startDate) <= getDateFormatted(startGantt)) {
        task.startDate = startGantt;
      }
    } else if (vs === "right") {
      const startDateNew =
        startDateTask.plus({ days: daysCeil }) < endDateTask
          ? getDateFormatted(task.startDate)
              .plus({ days: daysCeil })
              .toFormat("yyyy-MM-dd")
          : task.endDate;

      task.startDate = startDateNew;
      task.days =
        startDateTask.plus({ days: daysCeil }) < endDateTask
          ? task.days - distanceCeil
          : 1;

      task.offset =
        startDateTask.plus({ days: daysCeil }) < endDateTask
          ? task.offset + distanceCeil
          : getDateFormatted(task.startDate)
              .diff(
                DateTime.fromFormat(`${startGantt}-01`, "yyyy-MM-dd"),
                "days"
              )
              .toObject().days;
    }
  }

  //  backendService.updateTask(task, task.groupCode);

  //updateTask DB
};

const setOffsetTasks = () => {
  if (Object.keys(state.tasks).length > 0) {
    const ganttStartDate = DateTime.fromFormat(
      state.configDate.startDate,
      "yyyy-MM-dd"
    )
      .minus({ months: state.configDate.startGantt })
      .toFormat("yyyy-MM");

    /* for...in loops iterate over the entire prototype chain,
     which is virtually never what you want.
     Use Object.{keys,values,entries}, and iterate over the resulting array.
     */
    Object.entries(state.tasks).forEach(([key]) => {
      state.tasks[key].tasks = state.tasks[key].tasks.map((task) => {
        let { startDate } = task;
        startDate = DateTime.fromFormat(startDate, "yyyy-MM-dd");

        const offset = startDate
          .diff(
            DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"),
            "days"
          )
          .toObject().days;
        return {
          ...task,
          days:
            DateTime.fromFormat(task.endDate, "yyyy-MM-dd").diff(
              DateTime.fromFormat(task.startDate, "yyyy-MM-dd"),
              "days"
            ).days + 1,
          offset,
        };
      });
    });
  }
};

export {
  getPositionDragBlock,
  setTaskData,
  getMinWidthDragBlock,
  setOffsetTasks,
};
