<script setup xmlns:input="http://www.w3.org/1999/html">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <div
      :style="`
        --width-day:${configStyles.dayWidthEm * configStyles.defaultPx}px;
        --row-height: ${configStyles.rowHeightRem}rem;
        --padding-row:${configStyles.paddingRow}px;
        --top-padding:${configStyles.paddingRow * 3}px;
        --drag-color:${taskProps.dragColor};
        --padding-top-group: ${configStyles.paddingTopGroup}em;
       `"
      class="container">
    <div class="gantt">
      <!--Left Column-->
      <div class="gantt__left">
        <div class="gantt__menu">
          <h1 class="gantt__menu__logo">Gantt title</h1>
          <button
              class="btn btn--primary"
              @click="taskModalAdd"
          >+ task
          </button>
        </div>
        <ul v-if="tasks" class="gantt__left__wrapper">
          <li v-for="(group, i) in tasks" :key="group.groupCode" class="gantt__left__bucket">
            <h2 class="gantt__left__title-group">{{ group.name }}
              <font-awesome-icon
                  v-if="thisGroupOpen(group.groupCode)"
                  :icon="menuLeft.angleUp"
                  @click="closeGroup(group.groupCode)"/>
              <font-awesome-icon
                  v-if="!thisGroupOpen(group.groupCode)"
                  :icon="menuLeft.angleDown"
                  @click="closeGroup(group.groupCode)"/>
            </h2>
            <!--List tasks-->
            <ul v-if="group.tasks.length > 0 && thisGroupOpen(group.groupCode)" class="gantt__left__tasks">
              <!--Single task name draggable-->
              <li
                  v-for="(task, k) in group.tasks"
                  :key="task.rank"
                  :data-rank="task.rank"
                  class="gantt__left__row"
                  draggable="true"
                  @dragstart="startDrag($event, k, task.rank)">
                <div
                    v-if="k === 0"
                    class="drag-prev"
                    @dragleave="leaveDropZone($event, k)"
                    @dragover="allowDrop($event, k)"
                    @drop="onDrop($event, k, task.rank, 'prev')"
                    @dragenter.prevent>
                </div>
                <div
                    :class="(menuLeft.activeTask === task.rank) ? 'active' : ''"
                    class="gantt__left__row__title">
                  <h3>
                    {{ task.name }} | {{ task.rank }}
                  </h3>
                  <ul class="gantt__left__row__title__icons">
                    <li>
                      <font-awesome-icon :icon="menuLeft.pen" @click="openModalModify(k, task.groupCode)"/>
                    </li>
                    <li>
                      <font-awesome-icon
                          :icon="menuLeft.trash"
                          @click="removeTask(task, task.groupCode)"/>
                    </li>
                  </ul>
                </div>
                <div
                    class="drag-next"
                    @dragleave="leaveDropZone($event)"
                    @dragover="allowDrop($event)"
                    @drop="onDrop($event, k, task.rank, 'next')"
                    @dragenter.prevent
                >
                </div>
              </li>
              <!--/Single task name draggable-->
            </ul>
            <!--/List tasks-->
          </li>

        </ul>
      </div>
      <!--/Left Column-->

      <!--Right Column-->
      <div ref="container" class="gantt__right">
        <div :style="`--margin-now:${offsetNow}`" class="now"></div>
        <div class="year">
          <div class="months">
            <!--Date Labels-->
            <div v-if="configDate.dates" class="months__row">
              <div v-for="month in configDate.dates" :key="month.month+month.year" class="month">
                <div class="month__label">
                  <div :id="`${month.month}-${month.year}`" class="labels_months_month">{{ month.month }} {{
                      month.year
                    }}
                  </div>
                </div>
                <div class="month__days">
                  <div
                      v-for="day in month.days"
                      :key="day+month" class="day">{{ day }}
                  </div>
                </div>
              </div>
            </div>
            <!--Tasks Row-->
            <div v-if="tasks">
              <div
                  v-for="(group, i) in tasks"
                  :key="group.groupCode"
                  :style="`
                    --width-group: ${widthGroup(group.groupCode)};
                    --left-group: ${leftGroup(group.groupCode)};
                    --bg-group: ${configStyles.bgGroup};
                   ${thisGroupOpen(group.groupCode) ? '' : 'padding-bottom: 0;'}`"

                  class="tasks__row__group">
                <div class="tasks__row__group__title">
                  <h4>{{ group.name }}</h4>
                </div>
                <!--Single Task-->
                <div
                    v-for="(task, k) in group.tasks"
                    v-if="thisGroupOpen(group.groupCode)"
                    :key="task.rank"
                    class="tasks__row__task"
                >
                  <Task
                      :background-color="taskProps.backgroundColor"
                      :border-radius="taskProps.borderRadius"
                      :font-size="0.9"
                      :index="task.rank"
                      :margin-left="marginLeft(task.offset)"
                      :min-width="minWidth"
                      :name="task.name"
                      :text-color="taskProps.textColor"
                      :width="widthTask(task)"
                      @update-date="setTaskData(task, $event, null, null)"
                      @update-margin="task.offset = $event"
                      @handle-right-to-left="setTaskData(task, $event, 'right', 'left')"
                      @handle-right-to-right="setTaskData(task,  $event,'right', 'right')"
                      @handle-left-to-left="setTaskData(task, $event, 'left', 'left')"
                      @handle-left-to-right="setTaskData(task,  $event,'left', 'right')"
                      @end-update-task="activateTask(false)"
                      @init-update-task="activateTask($event)"
                  >
                  </Task>
                  <!--/Single Task-->
                </div>
              </div>
              <!--/Tasks Row-->
              <!--Day Lines-->
              <div
                  v-for="(day, index) in days"
                  :key="day"
                  :style="`left: ${configStyles.defaultPx * configStyles.dayWidthEm * index}px`"
                  class="months__overlay__day-line"
              >
              </div>
              <!--/Day Lines-->
            </div>
          </div>
        </div>

      </div>
      <!--/Right Column-->
    </div>
    <!--Modals-->
    <!--add months back-->
    <div v-if="modals.backMonths" class="modal">
      <div class="modal__inner">
        <header>
          <h2>Vuoi cambiare la data di partenza del progetto?</h2>
        </header>
        <div class="content">
          <div class="button-group flex">
            <button
                class="btn btn--primary"
                @click="changeStartGantt">
              Sì
            </button>
            <button
                class="btn btn--alert"
                @click="modals.backMonths = false">
              No
            </button>
          </div>
        </div>
      </div>

    </div>
    <!--mod task-->
    <div v-if="modals.taskModalMod" class="modal">
      <div class="modal__inner">
        <header>
          <h2>Modifica il task: {{ tasks[modals.groupTaskMod.code].tasks[modals.indexTaskMod].name }}</h2>
        </header>
        <div class="content">
          <div class="input-group">
            <label class="typo__label">Tagging</label>
            <VueMultiselect
                v-model="modals.groupTaskMod"
                :multiple="false"
                :options="groups"
                :taggable="true"
                label="name"
                placeholder="Type to search or add tag"
                tag-placeholder="Add this as new tag"
                track-by="code"
                @tag="addTag"
            />
          </div>
          <div class="input-group">
            <input id="nametask" v-model="tasks[modals.groupTaskMod.code].tasks[modals.indexTaskMod].name"
                   name="nametask"
                   placeholder="Titolo task" type="text">
          </div>
          <div class="input-group flex">
            <div class="col">
              <input id="startDate" v-model="tasks[modals.groupTaskMod.code].tasks[modals.indexTaskMod].startDate"
                     name="startDate" type="date">
            </div>
            <div class="col">
              <input id="endDate" v-model="tasks[modals.groupTaskMod.code].tasks[modals.indexTaskMod].endDate"
                     name="endDate" type="date">
            </div>
          </div>
        </div>
        <footer>
          <div class="button-group flex">
            <button
                class="btn btn--primary"
                @click="saveTask(tasks[modals.groupTaskMod.code].tasks[modals.indexTaskMod], modals.groupTaskMod.code)">
              salva
            </button>
            <button
                class="btn btn--alert"
                @click="modals.taskModalMod = false">
              Annulla
            </button>
          </div>
        </footer>
      </div>
    </div>
    <!--add task-->
    <div v-if="modals.taskModalAdd" class="modal">
      <div class="modal__inner">
        <header>
          <h2>Aggiungi un task</h2>
        </header>
        <div class="content">
          <div class="input-group">
            <label class="typo__label">Tagging</label>
            <VueMultiselect
                v-model="newTask.groupValue"
                :multiple="false"
                :options="groups"
                :taggable="true"
                label="name"
                placeholder="Type to search or add tag"
                tag-placeholder="Add this as new tag"
                track-by="code"
                @tag="addTag"
            />
          </div>
          <div class="input-group">
            <input id="nametask" v-model="newTask.name" name="nametask" placeholder="Titolo task" type="text">
          </div>
          <div class="input-group flex">
            <div class="col">
              <input id="startDate" v-model="newTask.startDate" name="startDate" type="date">
            </div>
            <div class="col">
              <input id="endDate" v-model="newTask.endDate" name="endDate" type="date">
            </div>
          </div>
        </div>
        <footer>
          <div class="button-group flex">
            <button
                class="btn btn--primary"
                @click="addTask">
              salva
            </button>
            <button
                class="btn btn--alert"
                @click="modals.taskModalAdd = false">
              Annulla
            </button>
          </div>
        </footer>
      </div>
    </div>
    <!--/Modals-->
  </div>
</template>

<script>
import {DateTime, Duration, Interval} from "luxon";
import compareLuxonDates from "./mixinCompareLuxonDates";
import LexoRank from "@kayron013/lexorank";
import Task from "@/components/Task.vue";

import backendService from "./services/backendServices";
import VueMultiselect from 'vue-multiselect';

const BackendService = new backendService;

//Fontawesome Icons
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {faAngleDown} from '@fortawesome/free-solid-svg-icons';
import {faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

export default {
  components: {Task, FontAwesomeIcon, VueMultiselect},
  data() {
    return {
      taskProps: {
        backgroundColor: '212, 148, 255',
        textColor: '212, 148, 255',
        dragColor: '212, 148, 255',
        borderRadius: 0.6,
      },
      configStyles: {
        defaultPx: 16,
        dayWidthEm: 3,
        rowHeightRem: 3.3,
        paddingRow: 8,
        bgGroup: '212, 148, 255',
        paddingTopGroup: 2.2,
      },
      configDate: {
        now: DateTime.now(),
        startDate: 0, //start date tasks gantt
        startGantt: 2, //start date gantt -2 month
        endGantt: 12, //end gantt +12
        dates: null,
      },
      newTask: {
        groupValue: null,
        name: null,
        endDate: null,
        startDate: null,
        group: null
      },
      menuLeft: {
        pen: faPen,
        trash: faTrash,
        angleDown: faAngleDown,
        angleUp: faAngleUp,
        activeTask: false,
        activeMenu: false,
      },
      modals: {
        groupTaskMod: null,
        indexTaskMod: null,
        taskModalMod: false,
        backMonths: false,
        taskModalAdd: false,
      },
      openGroups: {},
      groups: [],
      tasks: [],
    }
  },
  mounted() {
    BackendService.getTasks().then(result => {
      this.tasks = result;
      this.getDatesFromTasks().then((results) => {
        this.configDate.dates = results.dates;
        this.configDate.startDate = results.startDate;

        this.offsetTasks(); //init offset
        this.initPositionscroll(); // start scroll
        this.setGroups(); //set Groups Tasks

        this.$refs.container.addEventListener('scroll', this.handleScroll);
      });
    });

  },
  computed: {
    thisGroupOpen() {
      return (group) => {
        return this.openGroups[group] === true;
      }
    },
    widthGroup() {
      return (group) => {
        if (this.tasks[group].tasks.length > 0) {
          let arrayDatesStart = this.tasks[group].tasks.map(element => DateTime.fromFormat(element.startDate, 'yyyy-MM-dd'));
          let arrayDatesEnd = this.tasks[group].tasks.map(element => DateTime.fromFormat(element.endDate, 'yyyy-MM-dd'));
          let min = DateTime.min(...arrayDatesStart);
          let max = DateTime.max(...arrayDatesEnd);
          let days = max.diff(min, 'days').toObject().days;
          let width = (days + 1) * this.configStyles.dayWidthEm * this.configStyles.defaultPx;
          return `${width}px`;
        }
        return '0px';
      }
    },
    leftGroup() {
      return (group) => {
        if (this.tasks[group].tasks.length > 0 && this.configDate.startDate) {
          let ganttStartDate = DateTime.fromFormat(this.configDate.startDate, "yyyy-MM-dd").minus({months: this.configDate.startGantt}).toFormat("yyyy-MM");
          let orderedList = this.tasks[group].tasks.slice().sort((a, b) => compareLuxonDates(a.startDate, b.startDate));
          let diff = DateTime.fromFormat(orderedList[0].startDate, "yyyy-MM-dd").diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days").toObject().days;
          let offset = diff * this.configStyles.dayWidthEm * this.configStyles.defaultPx;

          return `${offset}px`;
        }
        return '0px';
      }
    },
    /**
     * days
     * calculate days for labels
     * @returns {number}
     */
    days() {
      let days = 0;
      if (this.configDate.dates) {
        this.configDate.dates.forEach(element => days += element.days)
      }
      return days;
    },
    /**
     * calculate minwidth day
     * @returns {number}
     */
    minWidth() {
      return this.configStyles.defaultPx * this.configStyles.dayWidthEm;
    },
    /**
     * offsetNow
     * Calculate position Now
     * @returns {string|boolean}
     */
    offsetNow() {
      if (Object.keys(this.tasks).length > 0 && this.configDate.startDate) {
        let ganttStartDate = DateTime.fromFormat(this.configDate.startDate, "yyyy-MM-dd").minus({months: this.configDate.startGantt}).toFormat("yyyy-MM");
        let offset = this.configDate.now.diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days").toObject().days;
        console.log('startdat', this.configDate.startDate, this.configDate.startGantt)
        return `${this.configStyles.dayWidthEm * Math.floor(offset) * this.configStyles.defaultPx}px`;
      }
      return '0px';
    },
    /**
     * widthTask
     * Calculate width task from days
     * @returns {function(*)}
     */
    widthTask() {
      return (task) => {
        return this.configStyles.dayWidthEm * task.days * this.configStyles.defaultPx;
      }
    },
    /**
     * marginLeft
     * Calculate Margin left tasks from offset
     * @returns {function(*)}
     */
    marginLeft() {
      return (offset) => {
        return this.configStyles.dayWidthEm * offset * this.configStyles.defaultPx;
      }
    },
  },
  methods: {
    //TODO Modify Groups, drag Groups
    //TODO Loading and Stop mod
    closeGroup(group) {
      this.openGroups[group] = !this.openGroups[group];
    },
    setGroups() {
      this.groups = [];
      for (const key in this.tasks) {
        this.groups.push({
          name: this.tasks[key].name,
          code: key
        });

        this.openGroups[key] = true;
      }
    },
    /**
     * initPositionscroll
     * calc position of tasks container scroll
     */
    initPositionscroll() {
      setTimeout(() => {
        let ganttStartDate = DateTime.fromFormat(this.configDate.startDate, "yyyy-MM-dd").minus({months: this.configDate.startGantt}).toFormat("yyyy-MM");

        let offset = this.configDate.now.diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days").toObject().days - 5;

        this.$refs.container.scrollTo({
          left: offset * this.configStyles.defaultPx * this.configStyles.dayWidthEm,
          behavior: 'smooth'
        });
      }, 100);
    },
    /**
     * getDatesFromTasks
     * create date labels
     */
    getDatesFromTasks() {
      return new Promise((resolve, reject) => {
        BackendService.getDates(this.configDate.startGantt, this.configDate.endGantt).then((results) => {
              resolve(results);
            }
        );
      });
    },
    /**
     * OffsetTasks
     * Add offset to div tasks
     */
    offsetTasks() {
      if (Object.keys(this.tasks).length > 0) {
        let ganttStartDate = DateTime.fromFormat(this.configDate.startDate, "yyyy-MM-dd").minus({months: this.configDate.startGantt}).toFormat("yyyy-MM");

        for (const key in this.tasks) {
          this.tasks[key].tasks = this.tasks[key].tasks.map((task, index) => {
            let {startDate} = task;
            startDate = DateTime.fromFormat(startDate, "yyyy-MM-dd");

            let offset = startDate.diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days").toObject().days;
            return {
              ...task,
              days: DateTime.fromFormat(task.endDate, "yyyy-MM-dd").diff(DateTime.fromFormat(task.startDate, "yyyy-MM-dd"), "days").days + 1,
              offset,
            }
          });
        }
      }
    },
    /**
     * changeStartGantt
     * add 1 moth to start date
     */
    changeStartGantt() {
      this.configDate.startGantt = this.configDate.startGantt + 1;
      this.getDatesFromTasks().then((results) => {
        this.configDate.dates = results.dates;
        this.configDate.startDate = results.startDate;
        this.offsetTasks();
        this.modals.backMonths = false;
      });
    },
    /**
     * openModalModify
     * @param index
     */
    openModalModify(index, groupCode) {
      this.modals.groupTaskMod = {code: groupCode, name: this.tasks[groupCode].name};
      this.modals.indexTaskMod = index;
      this.modals.taskModalMod = true;
    },
    /**
     * activateTask
     * Change color bg of selected task
     * @param index
     */
    activateTask(index) {
      this.menuLeft.activeTask = index;
    },
    /**
     * setTaskData
     * Set new dates of task
     * @param task
     * @param distance
     * @param handle
     * @param vs
     */
    setTaskData(task, distance, handle, vs) {
      const ganttStartDate = DateTime.fromFormat(this.configDate.startDate, "yyyy-MM-dd").minus({months: this.configDate.startGantt}).toFormat("yyyy-MM");
      const startDate = DateTime.fromFormat(task.startDate, "yyyy-MM-dd");
      const endDate = DateTime.fromFormat(task.endDate, "yyyy-MM-dd");

      if (handle === 'right') {
        if (vs === 'left') {
          task.days = (
              endDate
                  .minus({days: Math.abs(Math.ceil(distance))}) > startDate)
              ? task.days + Math.floor(distance) : 1;

          task.endDate =
              (endDate
                  .minus({days: Math.abs(Math.ceil(distance))}) > startDate)
                  ?
                  endDate
                      .minus({days: Math.abs(Math.floor(distance))})
                      .toFormat("yyyy-MM-dd")
                  : task.startDate;

          if (task.endDate <= this.configDate.startGantt) { //se arrivo al primo giorno del gantt
            task.startDate = this.configDate.startGantt;
          }
        } else if (vs === 'right') {

          task.days = task.days + Math.ceil(distance);

          let endDateNew = endDate
              .plus({days: Math.abs(Math.ceil(distance))})
              .toFormat("yyyy-MM-dd");

          task.endDate = endDateNew;
        }
      } else if (handle === 'left') {
        if (vs === 'left') {
          task.startDate = startDate
              .minus({days: Math.abs(Math.floor(distance))})
              .toFormat("yyyy-MM-dd");

          task.days = task.days - Math.floor(distance);
          task.offset = task.offset + Math.floor(distance);

          if (task.startDate <= this.configDate.startGantt) { //se arrivo al primo giorno del gantt
            task.startDate = this.configDate.startGantt;
          }
        } else if (vs === 'right') {

          let startDateNew =
              (startDate.plus({days: Math.abs(Math.ceil(distance))}) < endDate) ?
                  DateTime.fromFormat(task.startDate, "yyyy-MM-dd")
                      .plus({days: Math.abs(Math.ceil(distance))})
                      .toFormat("yyyy-MM-dd") : task.endDate;

          task.startDate = startDateNew;

          task.days = (startDate.plus({days: Math.abs(Math.ceil(distance))}) < endDate) ? task.days - Math.ceil(distance) : 1;

          task.offset =
              (startDate
                      .plus({days: Math.abs(Math.ceil(distance))})
                  < endDate
              )
                  ? task.offset + Math.ceil(distance)
                  : DateTime.fromFormat(task.startDate, "yyyy-MM-dd").diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days").toObject().days
          ;

        }

      } else {
        if (distance < 0) {
          task.endDate =
              endDate
                  .minus({days: Math.abs(Math.floor(distance))})
                  .toFormat("yyyy-MM-dd");
          task.startDate = DateTime.fromFormat(task.startDate, "yyyy-MM-dd")
              .minus({days: Math.abs(Math.floor(distance))})
              .toFormat("yyyy-MM-dd");
        } else {
          task.endDate =
              endDate
                  .plus({days: Math.abs(Math.ceil(distance))})
                  .toFormat("yyyy-MM-dd");
          task.startDate = DateTime.fromFormat(task.startDate, "yyyy-MM-dd")
              .plus({days: Math.abs(Math.ceil(distance))})
              .toFormat("yyyy-MM-dd");
        }
      }
      /**
       * Send data to API
       */
      BackendService.updateTask(task, task.groupCode);
    },
    /**
     * handle scroll on tasks container
     * @param e
     */
    handleScroll(e) {
      if (e.target.scrollLeft + e.target.offsetWidth >= document.querySelector('.tasks__row__group').offsetWidth) {
        this.configDate.endGantt = this.configDate.endGantt + 2;
        this.getDatesFromTasks().then((results) => {
          this.configDate.dates = results.dates;
          this.configDate.startDate = results.startDate;
        });
      } else if (e.target.scrollLeft <= 0) {
        this.modals.backMonths = true;
      }
    },
    /**
     * Start drag on tasks label
     * @param e
     * @param index
     */
    startDrag(e, index, rank) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('itemIndex', index);
      e.dataTransfer.setData('itemRank', rank);
    },
    /**
     * handle ondrop on tasks label
     * @param e
     * @param dropIndex
     * @param vs
     */
    onDrop(e, dropIndex, dropRank, vs) {
      let itemIndex = e.dataTransfer.getData('itemIndex');
      let itemRank = LexoRank.from(e.dataTransfer.getData('itemRank'));
      let itemRankValue = itemRank.value;
      let itemGroupLetter = itemRankValue[0];

      dropRank = LexoRank.from(dropRank);
      let dropBucket = dropRank.bucket;
      let dropRankValue = dropRank.value;
      let dropGroupLetter = dropRankValue[0];

      let rank = null;
      let newIndex = 0;

      let toLast = dropIndex === this.tasks[dropGroupLetter].tasks.length - 1;
      let firstToNextNotLast = dropIndex === 0 && vs === 'next' && dropIndex !== this.tasks[dropGroupLetter].tasks.length - 1;
      let toFirstPrev = dropIndex === 0 && vs === 'prev';
      let next = vs === 'next';

      if (toLast) {
        rank = LexoRank.from(this.tasks[dropGroupLetter].tasks[dropIndex].rank).increment();
        newIndex = dropIndex + 1;
      } else if (firstToNextNotLast) {
        rank = LexoRank.between(this.tasks[dropGroupLetter].tasks[dropIndex].rank, this.tasks[dropGroupLetter].tasks[dropIndex + 1].rank);
        newIndex = 1;
      } else if (toFirstPrev) {
        rank = LexoRank.between(LexoRank.from(this.tasks[dropGroupLetter].tasks[dropIndex].rank).decrement(), LexoRank.from(this.tasks[dropGroupLetter].tasks[dropIndex].rank));
        newIndex = 0;
      } else if (next) {
        rank = LexoRank.between(this.tasks[dropGroupLetter].tasks[dropIndex].rank, this.tasks[dropGroupLetter].tasks[dropIndex + 1].rank);
        newIndex = dropIndex + 1;
      }

      if (rank) {
        newIndex = (dropGroupLetter === itemGroupLetter && itemIndex < newIndex) ? newIndex - 1 : newIndex;
        let task = this.tasks[itemGroupLetter].tasks.splice(itemIndex, 1)[0];
        task.bucket = dropBucket;
        task.groupCode = dropGroupLetter;
        task.rank = rank.toString();
        this.tasks[task.groupCode].tasks.splice(newIndex, 0, task);
        this.saveTask(task, task.groupCode);
      }

      e.target.setAttribute('drop-active', 'false');
    },
    /**
     * leaveDropZone remove attribute
     * @param e
     */
    leaveDropZone(e) {
      e.preventDefault();
      e.target.setAttribute('drop-active', 'false');
    },
    /**
     * allowDrop add attribute
     * @param e
     */
    allowDrop(e) {
      e.preventDefault();
      e.target.setAttribute('drop-active', 'true');
    },
    /**
     * saveTask
     * @param task
     */
    saveTask(task, group) {
      BackendService.updateTask(task, group).then(result => {
        BackendService.getTasks().then(result => {
          this.tasks = result;
          this.modals.groupTaskMod = null;
          this.modals.indexTaskMod = null;
          this.modals.taskModalMod = false;
          this.offsetTasks();
        });
      });
    },
    taskModalAdd() {
      this.setGroups(); //set Groups Tasks
      this.newTask.groupValue = this.groups[0];
      this.modals.taskModalAdd = true;
    },
    addTag(newTag) {
      let char = this.groups[this.groups.length - 1].code;

      let group = String.fromCharCode(char.charCodeAt(char.length - 1) + 1);
      if (char[char.length - 1] === 'z') {
        group = char + 'a';
      }

      const tag = {
        name: newTag,
        code: group
      }

      this.groups.push(tag)
      this.newTask.groupValue = tag;
    },
    /**
     * addTask
     */
    addTask() {
      //TODO Checks
      let lexoRank = (this.tasks[this.newTask.groupValue.code])
          ? LexoRank.from(this.tasks[this.newTask.groupValue.code].tasks[this.tasks[this.newTask.groupValue.code].tasks.length - 1].rank).increment().toString()
          : new LexoRank(this.newTask.groupValue.code + 'aa', 0).toString();

      let task = {
        bucket: 0,
        groupCode: this.newTask.groupValue.code,
        rank: lexoRank,
        startDate: DateTime.fromFormat(this.newTask.startDate, "yyyy-MM-dd").toFormat("yyyy-MM-dd"),
        endDate: DateTime.fromFormat(this.newTask.endDate, "yyyy-MM-dd").toFormat("yyyy-MM-dd"),
        days: DateTime.fromFormat(this.newTask.endDate, "yyyy-MM-dd").diff(DateTime.fromFormat(this.newTask.startDate, "yyyy-MM-dd"), "days").toObject().days,
        offset: 0,
        width: DateTime.fromFormat(this.newTask.endDate, "yyyy-MM-dd").diff(DateTime.fromFormat(this.newTask.startDate, "yyyy-MM-dd"), "days").toObject().days * this.configStyles.dayWidthEm * this.configStyles.defaultPx,
        marginLeft: 0,
        name: this.newTask.name,
      };

      BackendService.addTask(task).then(() => {
        this.openGroups[task.groupCode] = true;
        BackendService.getTasks().then(() => {
          this.offsetTasks();
        });
      });

      this.newTask.name = null;
      this.newTask.startDate = null;
      this.newTask.endDate = null;
      this.modals.taskModalAdd = false;
    },
    /**
     * removeTask
     * @param id
     */
    removeTask(task, group) {
      //TODO add loading
      this.menuLeft.activeMenu = false;

      BackendService.removeTask(task, group).then(() => {
        BackendService.getTasks().then(result => {
          this.tasks = result;
          this.offsetTasks();
        });
      });

    },
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="scss">
@import "assets/scss/style";
//These computed proprietes are managed by data
:root {
  --base-font: 16px;
  --width-day: 0;
  --width-resize: 4px;
  --row-height: 0;
  --margin: 0;
  --margin-now: 0;
  --padding-row: 0.7em;
  --top-padding: 4px;
  --label-height: 2em;
  --drag-height: 0.7em;
  --drag-color: 0, 0, 0;
  --width-group: 0;
  --left-group: 0;
  --bg-group: '0,0,0';
  --padding-group-top: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: var(--base-font);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;

  .container {
    display: flex;
    width: 100%;
    min-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;

    .gantt {
      display: flex;
      //background-color: $gantt-bg;
      width: 100%;

      &__left {
        width: $gantt-row-width;

        &__left__tasks,
        &__wrapper {
          list-style: none;
        }

        &__title-group {
          font-size: 1em;
          line-height: calc(var(--padding-top-group) - 2px);
          background-color: rgba(var(--drag-color), 0.5);
          border-bottom: 2px solid white;
        }

        .gantt__menu {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: calc(var(--label-height) * 2);
          margin-bottom: var(--top-padding);
          padding: 0.5em;
          border-bottom: 2px solid rgb(var(--drag-color));

          &__logo {
            font-size: 1.1em;
          }
        }

        &__row {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: var(--row-height);
          list-style: none;

          .drag-prev,
          .drag-next {
            width: 100%;
            height: var(--drag-height);
            flex-shrink: 0;

            &[drop-active=true] { //aggiungere ondragover
              background-color: rgba(var(--drag-color), 0.8);
            }

          }


          &__title {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.5em;
            height: 100%;
            border-top: 1px solid $border-color;
            border-bottom: 1px solid $border-color;
            font-size: 0.5em;
            font-weight: normal;


            &.active {
              background-color: lighten($label-months-bg, 40%);
            }

            &__icons {
              list-style: none;

              li {
                display: inline;
                width: 15%;
                margin: 0 0.2em;
              }
            }


            &:last-child {
              border-bottom: 0;
            }
          }

          &:not(:first-child) {
            height: calc(var(--row-height) - var(--drag-height));

            .gantt__left__row__title {
              height: calc(100% - var(--drag-height) / 2);
            }
          }

        }
      }

      &__right {
        display: flex;
        position: relative;
        width: calc(100% - 12rem);
        border-left: 1px solid $border-color;
        overflow-x: scroll;
        overflow-y: hidden;

        .months {
          height: 100%;
          position: relative;

          &__overlay__day-line {
            position: absolute;
            top: 0;
            z-index: 0;
            display: flex;
            height: 100%;
            width: var(--width-day);
            border-right: 1px solid transparentize($border-color, 0.8)
          }

          .months__row {
            display: flex;
            position: relative;
            z-index: 1;
            margin-bottom: var(--top-padding);

            .month {
              background-color: $label-months-bg;
              color: $label-months-color;

              &:last-child {
                border-right: 0;
              }

              &__label {
                width: 100%;
                height: var(--label-height);
                line-height: var(--label-height);
                border-right: 1px solid $border-color;
                border-bottom: 1px solid $border-color;
                background-color: $label-months-bg;
                font-weight: bold;
                text-transform: uppercase;
              }

              &__days {
                display: flex;
                justify-content: space-around;
                height: var(--label-height);
                border-bottom: 1px solid $border-color;

                .day {
                  flex-shrink: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: var(--width-day);
                  height: 100%;
                  border-right: 1px solid $border-color;
                }
              }
            }
          }

          .tasks__row__group {
            position: relative;
            padding-top: var(--padding-top-group);
            padding-bottom: var(--drag-height);

            &__title {
              position: absolute;
              top: 0.4em;
              left: var(--left-group);
              width: var(--width-group);
              text-align: left;
              height: 0.3em;
            }

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: var(--left-group);
              width: var(--width-group);
              height: 0.3em;
              background-color: rgba(var(--bg-group), 0.6);
            }
          }

          .tasks__row__task {
            display: flex;
            height: calc(var(--row-height) - var(--drag-height));
            padding: var(--drag-height) 0 0 0;
            align-items: center;
          }
        }
      }
    }

    .now {
      position: absolute;
      top: calc(var(--label-height) * 2);
      z-index: 0;
      margin-left: calc(var(--margin-now) - 4px);
      height: calc(100% - var(--label-height) * 2);
      width: 8px;
      background-color: rgb(102, 50, 153);
      filter: invert(1) saturate(1);

      &::before {
        content: 'Now';
        display: block;
        position: absolute;
        top: 0;
        left: 100%;
        padding: 0 0.3em;
        font-size: 1rem;
        color: white;
        background-color: rgb(102, 50, 153);
        font-weight: bold;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);

    &__inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 80%;
      height: 80%;
      padding: 1em;
      background-color: white;
      border-radius: $border-radius;
      text-align: left;

      header {
        border-bottom: 2px solid $border-color;
        padding: 0.5em 0;
      }

      .content {
        height: 80%;
      }

      footer {
        padding: 0.5em 0;
        border-top: 1px solid $border-color;
      }

      .button-group {
        button {
          margin-left: 0;
        }
      }

      .input-group {
        input {
          width: 100%;
          margin: 0.5em 0;
          line-height: 2em;
        }
      }
    }
  }
}
</style>
