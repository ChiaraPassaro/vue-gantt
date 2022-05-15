import { DateTime } from "luxon";
import { state } from "../../stores/testStore";

import {
  getDateFormatted,
  getGanttStartDate,
} from "../../assets/composables/useDate";

import type { Task } from "../../assets/types/Task";

const getPositionDragBlock = (
  task: Task
): { width: number; marginLeft: number } => {
  const { width, marginLeft } = task;
  return { width, marginLeft };
};

const setPositionDragBlog = (task: Task, marginLeft: number): number => {
  console.log("setPositionDragBlog", task, marginLeft);

  task.marginLeft = marginLeft;
  return marginLeft;
};

const setWidthDragBlock = (task: Task): void => {
  console.log("setWidthDragBlock", task.width);

  task.width =
    state.configStyles.dayWidthEm * task.days * state.configStyles.defaultPx;

  console.log("setWidthDragBlock", task.width);
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
  setWidthDragBlock(task);
  console.log("taskData", task, distance, handle, vs);

  //get Start Date Gantt
  const startGantt = getGanttStartDate();

  //get start date task
  const startDate = getDateFormatted(task.startDate);
  //get end date task
  const endDate = getDateFormatted(task.endDate);
  //days and distances
  const daysCeil = Math.abs(Math.ceil(distance));
  const daysFloor = Math.abs(Math.floor(distance));
  const distanceCeil = Math.ceil(distance);
  const distanceFloor = Math.floor(distance);

  //if handle right
  //if vs left

  if (handle === "right") {
    if (vs === "left") {
      task.days =
        endDate.minus({ days: daysCeil }) > startDate
          ? task.days + distanceFloor
          : 1;
      task.endDate =
        endDate.minus({ days: daysCeil }) > startDate
          ? endDate.minus({ days: daysFloor }).toFormat("yyyy-MM-dd")
          : task.startDate;
      if (getDateFormatted(task.endDate) <= getDateFormatted(startGantt)) {
        task.startDate = startGantt;
      }
    } else if (vs === "right") {
      task.days += distanceCeil;
      const endDateNew = endDate
        .plus({ days: daysCeil })
        .toFormat("yyyy-MM-dd");
      task.endDate = endDateNew;
    }
  } else if (handle === "left") {
    if (vs === "left") {
      task.startDate = startDate
        .minus({ days: daysFloor })
        .toFormat("yyyy-MM-dd");

      task.days -= distanceFloor;
      console.log("task.offset", task.offset);
      task.offset += distanceFloor;
      console.log("task.offset", task.offset);

      if (getDateFormatted(task.startDate) <= getDateFormatted(startGantt)) {
        task.startDate = startGantt;
      }
    } else if (vs === "right") {
      const startDateNew =
        startDate.plus({ days: daysCeil }) < endDate
          ? getDateFormatted(task.startDate)
              .plus({ days: daysCeil })
              .toFormat("yyyy-MM-dd")
          : task.endDate;

      task.startDate = startDateNew;
      task.days =
        startDate.plus({ days: daysCeil }) < endDate
          ? task.days - distanceCeil
          : 1;

      task.offset =
        startDate.plus({ days: daysCeil }) < endDate
          ? task.offset + distanceCeil
          : getDateFormatted(task.startDate)
              .diff(
                DateTime.fromFormat(`${startGantt}-01`, "yyyy-MM-dd"),
                "days"
              )
              .toObject().days;
    }
  }

  console.log(task.offset);

  //  backendService.updateTask(task, task.groupCode);

  //updateTask DB
};

// setTaskData({
//   task: state.tasks[1],
//   distance: 0.3,
//   handle: "left",
//   vs: "right",
// });

export {
  getPositionDragBlock,
  setPositionDragBlog,
  setWidthDragBlock,
  setTaskData,
};
