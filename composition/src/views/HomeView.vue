<script setup lang="ts">
import { DateTime } from "luxon";

import GroupComponent from "@/components/GroupComponent.vue";
import RowComponent from "../components/RowComponent.vue";
import DragBlock from "../components/DragBlock.vue";
import { state } from "../stores/testStore";

import {
  getPositionDragBlock,
  setPositionDragBlog,
  setTaskData,
} from "../assets/composables/useTasksUtilities";
import { computed } from "@vue/reactivity";

//computed
const minWidth = computed(() => {
  return state.configStyles.defaultPx * state.configStyles.dayWidthEm;
});
</script>

<template>
  <main v-if="state.groups.length > 0">
    <GroupComponent
      v-for="(group, index) in state.groups"
      :key="`${index}-${group.name}`"
      :style="`--width-group: ${group.width};
          --left-group: ${group.left};
          ${group.open ? '' : 'padding-bottom: 0;'}`"
      class="tasks__group"
    >
      <!-- name groups -->
      <template v-slot:name>
        <h4>{{ group.name }}</h4>
      </template>
      <!-- /name groups -->

      <!-- tasks rows -->
      <template v-slot:rows v-if="state.tasks.length > 0">
        <RowComponent
          v-for="task in state.tasks"
          :rowSettings="state.rowSettings"
          :key="'task-' + task.id"
        >
          <template v-slot:content>
            <DragBlock
              :design="state.dragBlockSettings"
              :position="getPositionDragBlock(task)"
              :min-width="minWidth"
              @updateMarginLeft="setPositionDragBlog(task, $event)"
              @handleRightToRight="setTaskData({ task, ...$event })"
              @handleRightToLeft="setTaskData({ task, ...$event })"
              @handleLeftToLeft="setTaskData({ task, ...$event })"
              @handleLeftToRight="setTaskData({ task, ...$event })"
            >
              ></DragBlock
            ></template
          >

          {{ task.name }}
        </RowComponent>
      </template>
      <!-- tasks rows -->
    </GroupComponent>
  </main>
</template>

<style lang="scss"></style>
