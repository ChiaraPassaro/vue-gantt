<script setup lang="ts">
import { reactive } from "vue";

interface Position {
  width: number;
  marginLeft?: number;
}

interface Design {
  height?: number;
  widthHandles?: number;
  minWidth?: number;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}

interface DragBlock {
  design: Design;
  position: Position;
}

defineProps<DragBlock>();

const state = reactive({
  drag: false,
  taskDom: null,
  styles: null,
  widthDom: null,
  handleActive: null,
  cursorDistance: null,
  posX: 0,
  clickOnBorderRight: false,
  clickOnBorderLeft: false,
  newWidth: 0,
  newMarginLeft: 0,
});
</script>

<template>
  <div
    ref="task"
    :style="`
         width:${position.width}px;
         --left-label: ${position.width + position.marginLeft}px;
         --margin: ${position.marginLeft}px;
         --width-resize: ${design.widthHandles}px;
         --height:${design.height}%;
         --font-size: ${design.fontSize}em;
         --background-color: ${design.backgroundColor};
         --text-color: ${design.textColor};
         --border-radius:${design.borderRadius}em
      `"
    class="task task-margin"
  >
    <div class="task__handle task__handle--left"></div>
    <div class="task__drag"></div>
    <div class="task__handle task__handle--right"></div>
  </div>
</template>

<style lang="scss" scoped>
:root {
  --width-resize: 4px;
  --height: 100%;
  --margin: 0;
  --font-size: 0;
  --background-color: "20, 20, 20";
  --text-color: "0, 0, 0";
  --border-radius: 0.6em;
  --border-color: grey;
  --left-label: 0;
  --margin-name: 0;
}

.task {
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: var(--height);
  margin-left: 0;
  background-color: rgba(var(--background-color), 0.8);
  border-radius: var(--border-radius);
  font-size: var(--font-size);
  font-weight: bold;
  transition: all 0.25s;

  &:hover,
  &.active {
    background-color: rgba(var(--background-color), 1);
    filter: drop-shadow(0.1em 0.1em 0.2em rgba(0, 0, 0, 0.2));

    & + .task__name {
      display: none;
    }
  }

  &.task-margin {
    margin-left: var(--margin);
  }

  &__drag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    user-select: none;
    cursor: move;
  }

  &__handle {
    content: "";
    display: block;
    width: var(--width-resize);
    height: 100%;
    cursor: col-resize;

    &:hover {
      background-color: rgb(var(--background-color));
      filter: brightness(0.7);
    }

    &--left {
      border-right: 1px solid var(--background-color);
    }

    &--right {
      border-left: 1px solid var(--background-color);
    }
  }

  &__name {
    z-index: 2;
    position: absolute;
    left: calc(var(--margin-name) + 20px);
  }
}
</style>
