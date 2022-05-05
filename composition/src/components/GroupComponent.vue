<script setup lang="ts">
import LexoRank from "@kayron013/lexorank";
import RowComponent from "../components/RowComponent.vue";

import { reactive } from "vue";

const state = reactive({
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
    marginLeft: 0,
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
      offset: 0,
      width: 36 * 15,
      marginLeft: 0,
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
      offset: 0,
      width: 62,
      marginLeft: 0,
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
      offset: 0,
      width: 62,
      marginLeft: 36 * 10,
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
      offset: 0,
      width: 36,
      marginLeft: 64,
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
      offset: 0,
      width: 62,
      marginLeft: 36,
      name: "Lorem Ipsum 5",
    },
  ],
});
</script>

<template>
  <div
    v-for="(group, index) in state.groups"
    :key="index + group.name"
    :style="`
    --width-group: ${group.width};
    --left-group: ${group.left};
    ${group.open ? '' : 'padding-bottom: 0;'}`"
    class="tasks__group"
  >
    <div class="tasks__group__title">
      <h4>{{ group.name }}</h4>
    </div>
    <div v-if="state.tasks.length > 0">
      <RowComponent
        v-for="task in state.tasks"
        :rowSettings="state.rowSettings"
        :dragBlockSettings="state.dragBlockSettings"
        :task="task"
        :key="'task-' + task.id"
      />
    </div>
  </div>
</template>

<style scoped></style>
