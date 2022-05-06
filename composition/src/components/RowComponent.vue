<script setup lang="ts">
import DragBlock from "../components/DragBlock.vue";

interface Props {
  taskData: {
    width: number;
    marginLeft: number;
  };
  dragBlockSettings: {
    name?: string;
    height?: number;
    widthHandles?: number;
    minWidth?: number;
    fontSize?: number;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
  };
  rowSettings: {
    height: number;
    margin: number;
  };
}

defineProps<Props>();
</script>

<template>
  <!--Task Row-->
  <div
    class="tasks__row"
    :style="`height: ${rowSettings.height}px; margin: ${rowSettings.margin}em 0;`"
  >
    <DragBlock :design="dragBlockSettings" :position="taskData"></DragBlock>
    <div class="task__name">
      <slot></slot>
    </div>
    <!--/Task Row-->
  </div>
</template>
<style scoped lang="scss">
.tasks__row {
  display: flex;
  gap: 1em;
}
</style>
