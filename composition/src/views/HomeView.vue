<script setup lang="ts">
import { DateTime } from "luxon";
import { onMounted, ref } from "vue";
import { state } from "../stores/testStore";
import BackendService from "@/assets/services/backendServices";

import {
  getPositionDragBlock,
  setTaskData,
  getMinWidthDragBlock,
  setOffsetTasks,
} from "../assets/composables/useTasksUtilities";

import { getGanttStartDate } from "../assets/composables/useDate";

import GroupComponent from "@/components/GroupComponent.vue";
import RowComponent from "../components/RowComponent.vue";
import DragBlock from "../components/DragBlock.vue";
import { computed } from "@vue/reactivity";

const backendService = new BackendService();

//reference container for scroll
const container = ref(null);

const initPositionScroll = () => {
  setTimeout(() => {
    const ganttStartDate = DateTime.fromFormat(
      state.configDate.startDate,
      "yyyy-MM-dd"
    )
      .minus({ months: state.configDate.startGantt })
      .toFormat("yyyy-MM");

    const offset =
      state.configDate.now
        .diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days")
        .toObject().days - 5;

    container.value.scrollTo({
      left:
        offset * state.configStyles.defaultPx * state.configStyles.dayWidthEm,
      behavior: "smooth",
    });
  }, 100);
};

//position Now
const offsetNow = computed(() => {
  if (Object.keys(state.tasks).length > 0 && state.configDate.startDate) {
    const ganttStartDate = getGanttStartDate();
    const offset = state.configDate.now
      .diff(DateTime.fromFormat(`${ganttStartDate}-01`, "yyyy-MM-dd"), "days")
      .toObject().days;

    return `${
      state.configStyles.dayWidthEm *
      Math.floor(offset) *
      state.configStyles.defaultPx
    }px`;
  }
  return "0px";
});

//dates to show
const getDatesFromTasks = () => {
  return new Promise((resolve) => {
    backendService
      .getDates(state.configDate.startGantt, state.configDate.endGantt)
      .then((results) => {
        resolve(results);
      });
  });
};

onMounted(() => {
  state.loading = true;
  // get tasks from backend
  backendService.getTasks().then((result) => {
    state.tasks = result;

    getDatesFromTasks().then((results) => {
      state.configDate.dates = results.dates;
      state.configDate.startDate = results.startDate;
      state.loading = false;
      setOffsetTasks(); // init offset
      initPositionScroll(); // start scroll
      // set Groups Tasks
      // handleScroll
    });
  });
});
</script>

<template>
  <main class="gantt">
    <!--Left Column-->
    <div class="gantt__left"></div>
    <!--/Left Column-->
    <!--Right Column-->
    <div
      ref="container"
      class="gantt__right"
      :style="`
        --width-day:${
          state.configStyles.dayWidthEm * state.configStyles.defaultPx
        }px;
        --row-height: ${state.configStyles.rowHeightRem}rem;
        --padding-row:${state.configStyles.paddingRow}px;
        --top-padding:${state.configStyles.paddingRow * 3}px;
        --drag-color:${state.dragBlockSettings.dragColor};
        --padding-top-group: ${state.dragBlockSettings.paddingTopGroup}em;
       `"
    >
      <div
        v-if="!state.loading"
        :style="`--margin-now:${offsetNow}`"
        class="now"
      />
      <template v-if="state.loading">
        <h2 class="loading">Loading</h2>
      </template>
      <div class="year" v-else-if="Object.keys(state.tasks).length > 0">
        <div class="months">
          <!--Date Labels-->
          <div v-if="state.configDate.dates" class="months__row">
            <div
              v-for="month in state.configDate.dates"
              :key="month.month + month.year"
              class="month"
            >
              <div class="month__label">
                <div
                  :id="`${month.month}-${month.year}`"
                  class="labels_months_month"
                >
                  {{ month.month }} {{ month.year }}
                </div>
              </div>
              <div class="month__days">
                <div v-for="day in month.days" :key="day + month" class="day">
                  {{ day }}
                </div>
              </div>
            </div>
          </div>
          <!-- task groups -->
          <GroupComponent
            v-for="(group, index) in state.tasks"
            :key="`${index}-${group.name}`"
            style=""
            class="tasks__group"
          >
            <!-- name groups -->
            <template v-slot:name>
              <h4>{{ group.name }}</h4>
            </template>
            <!-- /name groups -->

            <!-- tasks rows -->
            <template v-slot:rows>
              <RowComponent
                v-for="task in group.tasks"
                :rowSettings="state.rowSettings"
                :key="'task-' + task.id"
              >
                <template v-slot:content>
                  <!-- single task draggable and resizable -->
                  <DragBlock
                    :design="{
                      ...state.dragBlockSettings,
                      minWidth: getMinWidthDragBlock,
                    }"
                    :position="getPositionDragBlock(task)"
                    @handleRightToRight="setTaskData({ task, ...$event })"
                    @handleRightToLeft="setTaskData({ task, ...$event })"
                    @handleLeftToLeft="setTaskData({ task, ...$event })"
                    @handleLeftToRight="setTaskData({ task, ...$event })"
                  />
                  <!-- single task draggable and resizable -->
                </template>

                {{ task.name }}
              </RowComponent>
            </template>
            <!-- tasks rows -->
          </GroupComponent>
          <!-- /task groups -->
        </div>
      </div>
      <template v-else>
        <div class="nothing">
          <h2>Nothing to render</h2>
          <h3>Create a Task Group!</h3>
        </div>
      </template>
    </div>
    <!--/Right Column-->
  </main>
</template>

<style lang="scss">
@import "@/assets/scss/style.scss";
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
  --bg-group: "0,0,0";
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
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: rgba(var(--drag-color), 0.5);
          border-bottom: 2px solid white;
          font-size: 1em;
          line-height: calc(var(--padding-top-group) - 2px);
          span {
            width: 70%;
            text-align: left;
          }
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

            &[drop-active="true"] {
              //add ondragover
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
            border-right: 1px solid transparentize($border-color, 0.8);
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
              content: "";
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
        .nothing,
        .loading {
          margin: auto;
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
        content: "Now";
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
