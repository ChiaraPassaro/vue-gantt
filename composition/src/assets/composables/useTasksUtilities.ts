import { DateTime } from "luxon";
import { useStore } from "@/stores/useStore";

import { getDateFormatted } from "../../assets/composables/useDate";

import type { Task } from "../../assets/types/Task";

/**
 * Get width and marginLeft from data task
 * @param task
 * @returns { width, marginLeft }
 */
const getPositionDragBlock = (
  task: Task
): { width: number; marginLeft: number } => {
  const store = useStore();
  const { days, offset } = task;
  const width =
    store.configStyles.dayWidthEm * store.configStyles.defaultPx * days;
  const marginLeft =
    store.configStyles.dayWidthEm * store.configStyles.defaultPx * offset;

  return { width, marginLeft };
};

/**
 *  Set data task: startDate, andDate, width, marginLeft
 * @param { task, distance, handle, vs }
 *
 */
const setTaskData = ({
  task,
  distance,
  handle,
  vs,
}: {
  task: Task;
  distance: number;
  handle: string | null;
  vs: string | null;
}) => {
  //dates
  const store = useStore();
  const startGantt = store.getGanttStartDate;
  const startDateTask = getDateFormatted(task.startDate);
  const endDateTask = getDateFormatted(task.endDate);

  //days and distances
  const daysCeil = Math.abs(Math.ceil(distance));
  const daysFloor = Math.abs(Math.floor(distance));
  const distanceCeil = Math.ceil(distance);
  const distanceFloor = Math.floor(distance);

  //when drag and distance have a decimal we choose ceil or floor
  const decimal = distance - Math.floor(distance);
  const days = decimal > 0.5 ? daysCeil : daysFloor;
  const distanceRound = decimal > 0.5 ? distanceCeil : distanceFloor;

  if (handle === "right") {
    //set days and endDate, startDate doesn't change
    if (vs === "left") {
      //subtract days
      task.days =
        endDateTask.minus({ days: daysCeil }) > startDateTask
          ? task.days + distanceFloor
          : 1;
      task.endDate =
        endDateTask.minus({ days: daysCeil }) > startDateTask
          ? endDateTask.minus({ days: daysFloor }).toFormat("yyyy-MM-dd")
          : task.startDate;
    } else if (vs === "right") {
      //add days
      task.days += distanceCeil;
      task.endDate = endDateTask
        .plus({ days: daysCeil })
        .toFormat("yyyy-MM-dd");
    }
  } else if (handle === "left") {
    //set days and startDateTask, endDate doesn't change
    if (vs === "left") {
      // go back with the startDate
      task.startDate = startDateTask
        .minus({ days: daysFloor })
        .toFormat("yyyy-MM-dd");
      //add days
      task.days -= distanceFloor;
      //subtract offSet
      task.offset += distanceFloor;
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
  } else if (distance < 0) {
    // when drag left
    task.startDate = startDateTask.minus({ days }).toFormat("yyyy-MM-dd");
    task.endDate = endDateTask.minus({ days }).toFormat("yyyy-MM-dd");
    task.offset = task.offset + distanceRound;
  } else if (distance > 0) {
    //when drag right
    task.startDate = startDateTask.plus({ days }).toFormat("yyyy-MM-dd");
    task.endDate = endDateTask.plus({ days }).toFormat("yyyy-MM-dd");
    task.offset = task.offset + distanceRound;
  }

  console.log("startDate", task.startDate, "offset", task.offset);
  //  backendService.updateTask(task, task.groupCode);

  //updateTask DB
};

const setOffsetTasks = () => {
  const store = useStore();
  if (Object.keys(store.tasks).length > 0) {
    const ganttStartDate = DateTime.fromFormat(
      store.configDate.startDate,
      "yyyy-MM-dd"
    )
      .minus({ months: store.configDate.startGantt })
      .toFormat("yyyy-MM");

    /* for...in loops iterate over the entire prototype chain,
     which is virtually never what you want.
     Use Object.{keys,values,entries}, and iterate over the resulting array.
     */
    Object.entries(store.tasks).forEach(([key]) => {
      store.tasks[key].tasks = store.tasks[key].tasks.map((task) => {
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

// const setTaskStartDate = (task: Task, distance: number): void => {};
// const setTaskEndDate = (task: Task, distance: number): void => {};
// const setTaskDays = (task: Task, distance: number): void => {};

export { getPositionDragBlock, setTaskData, setOffsetTasks };
