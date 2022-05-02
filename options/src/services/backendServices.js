import LexoRank from '@kayron013/lexorank';
import { DateTime, Duration, Interval } from 'luxon';
import compareLuxonDates from '../mixinCompareLuxonDates';

// Mock data
const Tasks = {
  a: {
    name: 'Name Group',
    groupCode: 'a',
    bucket: 0,
    tasks: [
      {
        id: 1,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank('aaa', '0').toString(),
        startDate: '2022-02-01',
        endDate: '2022-02-16',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 1',
      },
      {
        id: 2,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank('aab', '0').toString(),
        startDate: '2022-02-16',
        endDate: '2022-02-18',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 2',
      },
      {
        id: 3,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank('aac', '0').toString(),
        startDate: '2022-02-20',
        endDate: '2022-02-22',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 3',
      },
      {
        id: 4,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank('aad', '0').toString(),
        startDate: '2022-02-25',
        endDate: '2022-02-26',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 4',
      },
      {
        id: 5,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank('aaf', '0').toString(),
        startDate: '2022-02-26',
        endDate: '2022-02-28',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 5',
      },
    ],
  },
  b: {
    name: 'Name Group 2',
    groupCode: 'b',
    bucket: 0,
    tasks: [
      {
        id: 6,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank('baa', '0').toString(),
        startDate: '2022-02-01',
        endDate: '2022-02-16',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 1',
      },
      {
        id: 7,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank('bab', '0').toString(),
        startDate: '2022-02-16',
        endDate: '2022-02-18',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 2',
      },
      {
        id: 8,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank('bac', '0').toString(),
        startDate: '2022-02-20',
        endDate: '2022-02-22',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 3',
      },
      {
        id: 9,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank('bad', '0').toString(),
        startDate: '2022-02-25',
        endDate: '2022-02-26',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 4',
      },
      {
        id: 10,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank('baf', '0').toString(),
        startDate: '2022-02-26',
        endDate: '2022-02-28',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 5',
      },
    ],
  },
};

const api = {
  url: '',
  Tasks: {
    getTasks: () => {
      for (const key in Tasks) {
        if (Tasks[key].tasks.length === 0) {
          delete Tasks[key];
        }
      }
      return Tasks;
    },
    getTask: (id) => {
      let tasks = [];
      Tasks.forEach((el) => {
        tasks = [...tasks, ...el.tasks];
      });
      return tasks.filter((element) => element.id === id);
    },
    addTask: (task) => {
      const tasksIds = [];
      const groups = [];
      task.id = 1;

      for (const key in Tasks) {
        tasksIds.push(...Tasks[key].tasks.map((element) => element.id));
        groups.push(key);
      }

      if (tasksIds.length > 0) {
        const maxId = Math.max(...tasksIds);
        task.id = maxId + 1;
      }

      if (!Object.keys(Tasks).includes(task.groupCode)) {
        Tasks[task.groupCode] = {
          groupCode: task.groupCode,
          name: task.group,
          bucket: task.bucket,
          tasks: [
            task,
          ],
        };

        return task;
      }

      Tasks[task.groupCode].tasks.push(task);
      return Tasks;
    },
    addGroup: (group) => {
      Tasks[group.code] = {
        name: group.name,
        groupCode: group.code,
        bucket: 0,
        tasks: [],
      };
      return group;
    },
    removeTask: (task, group) => {
      Tasks[group].tasks = Tasks[group].tasks.filter((element) => element.id !== task.id);
      for (const key in Tasks) {
        if (Tasks[key].tasks.length === 0) {
          delete Tasks[key];
        }
      }
      return task;
    },
    updateTask: (task, group) => {
      const index = Tasks[group].tasks.findIndex((element) => element.id === task.id);
      Tasks[group].tasks[index] = task;
      return task;
    },
    removeGroup(group) {
      delete Tasks[group.code];
      return Tasks;
    },
    updateGroup(group) {
      console.log('bk', Tasks[group.code]);
      Tasks[group.code].name = group.name;
      return Tasks;
    },
    getDates(startGantt, endGantt) {
      let dates = [];
      for (const group in Tasks) {
        dates = [...dates, ...Tasks[group].tasks];
      }
      dates.sort((a, b) => compareLuxonDates(a.startDate, b.startDate));
      const { startDate } = dates[0];
      dates.sort((a, b) => compareLuxonDates(a.endDate, b.endDate));
      const { endDate } = dates[dates.length - 1];
      console.log(startDate, endDate);

      const interval = Interval.fromDateTimes(DateTime.fromFormat(startDate, 'yyyy-MM-dd').minus({
        months:
        startGantt,
      }), DateTime.fromFormat(endDate, 'yyyy-MM-dd').plus({ months: endGantt }))
        .splitBy(Duration.fromObject({ month: 1 }));

      return {
        dates: interval.map((element) => ({
          days: element.s.daysInMonth,
          month: element.s.toFormat('MMMM', { locale: 'it' }),
          year: element.s.toFormat('yyyy'),
        })),
        startDate,
      };
    },
  },

};

export default class BackendService {
  getDates(startGantt, endGantt) {
    return new Promise((resolve, reject) => {
      resolve(api.Tasks.getDates(startGantt, endGantt));
    });
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.Tasks.getTasks());
      }, 500);
    });
  }

  getTask(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.Tasks.getTask(id));
      }, 500);
    });
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.Tasks.addTask(task));
      }, 1);
    });
  }

  removeTask(task, group) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.Tasks.removeTask(task, group));
      }, 500);
    });
  }

  updateTask(task, group) {
    return new Promise((resolve, reject) => {
      resolve(api.Tasks.updateTask(task, group));
      setTimeout(() => {
      }, 500);
    });
  }

  addGroup(group) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(api.Tasks.addGroup(group));
      }, 1);
    });
  }

  removeGroup(group) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.Tasks.removeGroup(group));
      }, 1);
    });
  }

  updateGroup(group) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.Tasks.updateGroup(group));
      }, 1);
    });
  }
}
