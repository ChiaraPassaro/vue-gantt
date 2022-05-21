<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { nextTick, reactive, ref } from "vue";

interface Position {
  width: number;
  marginLeft: number;
}

interface Design {
  height: number;
  widthHandles: number;
  minWidth: number;
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
}

interface DragBlock {
  design: Design;
  position: Position;
}

const props = defineProps<DragBlock>();

//component state
interface State {
  drag: boolean;
  styles: CSSStyleDeclaration | null;
  widthDom: number;
  handleActive: boolean;
  cursorDistance: number;
  posX: number;
  newWidth: number;
  newMarginLeft: number;
  mouseDown: string;
}

interface EmitHandle {
  distance: number;
  handle: string;
  vs: string;
}

// dom element accessible only onMounted
let dragBlock = ref<HTMLElement | null>(null);

const state = reactive<State>({
  drag: false,
  styles: null,
  widthDom: 0,
  handleActive: false,
  cursorDistance: 0,
  posX: 0,
  newWidth: 0,
  newMarginLeft: 0,
  mouseDown: "",
});

const marginL = computed({
  get(): number {
    return props.position.marginLeft ?? 0;
  },
  set(value: number) {
    return value;
  },
});

const emit = defineEmits<{
  (e: "handleRightToLeft", event: EmitHandle): void;
  (e: "handleRightToRight", event: EmitHandle): void;
  (e: "handleLeftToLeft", event: EmitHandle): void;
  (e: "handleLeftToRight", event: EmitHandle): void;
  (e: "updateMarginLeft", marginLeft: number): void;
  (e: "updateDistance", distance: number): void;
  (e: "startResize"): void;
  (e: "endResize"): void;
  (e: "startMove"): void;
  (e: "endMove"): void;
}>();

const doDragBlock = (e: MouseEvent) => {
  state.drag = true;

  state.cursorDistance = e.clientX - state.posX;

  if (state.mouseDown == "right") {
    //calculate width block
    state.newWidth = state.widthDom + state.cursorDistance;
    //change width block
    dragBlock.value.style.width = `${state.newWidth}px`;

    // modify cursor
    document.body.style.cursor = "col-resize";
  } else if (state.mouseDown == "left") {
    //calculate width and marginLeft block
    state.newWidth = state.widthDom - state.cursorDistance;
    state.newMarginLeft = marginL.value + state.cursorDistance;

    // change width and marginLeft block
    dragBlock.value.style.marginLeft = `${state.newMarginLeft}px`;
    dragBlock.value.style.width = `${state.newWidth}px`;

    // modify cursor
    document.body.style.cursor = "col-resize";
  }
};

const stopDragBlock = () => {
  dragBlock.value.classList.remove("active");

  const distance = state.cursorDistance / props.design.minWidth;

  if (state.mouseDown == "right") {
    if (state.cursorDistance < 0) {
      emit("handleRightToLeft", {
        distance,
        handle: state.mouseDown,
        vs: "left",
      });
    } else {
      emit("handleRightToRight", {
        distance,
        handle: state.mouseDown,
        vs: "right",
      });
    }
  } else if (state.mouseDown == "left") {
    if (state.cursorDistance < 0) {
      emit("handleLeftToLeft", {
        distance,
        handle: state.mouseDown,
        vs: "left",
      });
    } else {
      emit("handleLeftToRight", {
        distance,
        handle: state.mouseDown,
        vs: "right",
      });
    }
  }

  //reset marginLeft and cursor styles
  dragBlock.value.style.marginLeft = "";
  document.body.style.cursor = "";

  document.documentElement.removeEventListener("mousemove", doDragBlock, true);
  document.documentElement.removeEventListener("mouseup", stopDragBlock, true);

  emit("endResize");

  //delay change state.drag after component updates
  nextTick(() => {
    setTimeout(() => {
      state.drag = false;
    }, 1000);
  });
};

const mouseDown = (handle: string): void => {
  state.mouseDown = handle;
};

const resize = (e: MouseEvent) => {
  emit("startResize");

  //add active dom element
  dragBlock.value.classList.add("active");
  //get styles
  state.styles = window.getComputedStyle(dragBlock.value);
  //get width
  state.widthDom = parseInt(state.styles.width, 10);

  //Send update marginLeft
  emit("updateMarginLeft", parseInt(state.styles.marginLeft, 10));

  //set marginL and cursor distance
  marginL.value = parseInt(state.styles.marginLeft, 10);
  state.newMarginLeft = marginL.value;
  state.cursorDistance = 0;

  //add listeners
  if (!state.drag) {
    state.posX = e.clientX;
    document.documentElement.addEventListener("mousemove", doDragBlock, true);
    document.documentElement.addEventListener("mouseup", stopDragBlock, true);
  }
};

const doMoveBlock = (e: MouseEvent) => {
  console.log("doMove");

  state.cursorDistance = e.clientX - state.posX;
  state.newMarginLeft = Math.floor(marginL.value + state.cursorDistance);
  dragBlock.value.style.marginLeft = `${state.newMarginLeft}px`; // modify margin left
};

const stopMoveBlock = (e: MouseEvent) => {
  console.log("stopMoveBlock");

  dragBlock.value.classList.remove("active");
  document.documentElement.removeEventListener("mousemove", doMoveBlock, true);
  document.documentElement.removeEventListener("mouseup", stopMoveBlock, true);

  state.drag = false;
  if (state.cursorDistance !== 0) {
    emit("updateDistance", state.cursorDistance / props.design.minWidth);

    emit("endMove");
  }
  dragBlock.value.style.marginLeft = ""; // modify margin left
};

const moveBlock = (e: MouseEvent) => {
  emit("startMove");

  dragBlock.value?.classList?.add("active");
  state.styles = window.getComputedStyle(dragBlock.value);
  marginL.value = parseInt(state.styles.marginLeft, 10);
  state.cursorDistance = 0;

  //add listeners
  if (!state.drag) {
    state.posX = e.clientX;
    document.documentElement.addEventListener("mousemove", doMoveBlock, true);
    document.documentElement.addEventListener("mouseup", stopMoveBlock, true);
  }
};
</script>

<template>
  <div
    ref="dragBlock"
    :style="`
         width:${position.width}px;
         --min-width:${design.minWidth}px;
         --left-label: ${position.width + position.marginLeft}px;
         --margin: ${marginL}px;
         --width-resize: ${design.widthHandles}px;
         --height:${design.height}%;
         --font-size: ${design.fontSize}em;
         --background-color: ${design.backgroundColor};
         --text-color: ${design.textColor};
         --border-radius:${design.borderRadius}em
      `"
    class="drag-block drag-block-margin"
  >
    <div
      class="drag-block__handle drag-block__handle--left"
      @mousedown="resize($event), mouseDown('left')"
    ></div>
    <div class="drag-block__drag" @mousedown="moveBlock($event)"></div>
    <div
      class="drag-block__handle drag-block__handle--right"
      @mousedown="resize($event), mouseDown('right')"
    ></div>
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
  --min-width: 0;
}

.drag-block {
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  min-width: var(--min-width);
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

    & + .drag-block__name {
      display: none;
    }
  }

  &.drag-block-margin {
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
}
</style>
