<script setup lang="ts">
import TaskComponent from "@/components/TaskComponent.vue";
import { reactive } from "vue";
const state = reactive({
  task: {
    width: 36,
  },
  row: {
    height: 36,
    margin: 0.2,
  },
});
</script>

<template>
  <!--Task Row-->
  <div
    v-for="task in 3"
    :key="task"
    class="tasks__row__task"
    :style="`height: ${state.row.height}px; margin: ${state.row.margin}em 0;`"
  >
    <TaskComponent :width="state.task.width"></TaskComponent>
    <!--/Task Row-->
  </div>
</template>
<style scoped lang="scss"></style>
