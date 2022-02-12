<template>
  <div
      ref="task"
      :style="`
         width:${widthTask}px;
         --left-label: ${widthTask + marginL}px;
         --margin: ${marginL}px;
         --width-resize: ${widthHandles}px;
         --height:${height}%;
         --font-size: ${fontSize}em;
         --background-color: ${backgroundColor};
         --text-color: ${textColor};
         --border-radius:${borderRadius}em
      `"
      class="task task-margin"
  >
    <div
        class="task__handle task__handle--left"
        @mousedown="resize($event, 'left')">
    </div>
    <div
        class="task__drag"
        @mousedown="moveTask($event)">
    </div>
    <div
        class="task__handle task__handle--right"
        @mousedown="resize($event, 'right')">
    </div>

  </div>
  <div :style="`--margin-name: ${marginL + widthTask}px;`"
       class="task__name">
    {{ name }}
  </div>
</template>

<script>

export default {
  name: "Task",
  props: {
    index: {
      type: String,
    },
    width: {
      type: Number,
      default: 36
    },
    height: {
      type: Number,
      default: 100
    },
    widthHandles: {
      type: Number,
      default: 8
    },
    marginLeft: {
      type: Number,
      default: 0
    },
    minWidth: {
      type: Number,
      default: 36
    },
    name: {
      type: String,
      default: 'Task'
    },
    fontSize: {
      type: Number,
      default: 1
    },
    backgroundColor: {
      type: String,
      default: '75, 75, 126'
    },
    textColor: {
      type: String,
      default: '75, 75, 126'
    },
    borderRadius: {
      type: Number,
      default: 0.6
    }
  },
  emits: [
    'handleRightToLeft',
    'handleRightToRight',
    'handleLeftToLeft',
    'handleLeftToRight',
    'updateMargin',
    'updateDate',
    'initUpdateTask',
    'endUpdateTask'
  ],
  data() {
    return {
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
      newMarginLeft: 0
    }
  },
  computed: {
    widthTask: {
      get() {
        return this.width;
      },
      set(value) {
        return value
      }
    },
    marginL: {
      get() {
        return this.marginLeft;
      },
      set(value) {
        return value
      }
    }
  },
  methods: {
    /**
     * moveTask
     * @param e
     */
    moveTask(e) {
      this.$emit('initUpdateTask', this.index);
      this.taskDom = this.$refs.task;
      this.taskDom.classList.add('active');
      this.styles = window.getComputedStyle(this.taskDom);
      this.marginL = parseInt(this.styles.marginLeft, 10);
      this.cursorDistance = 0;
      this.posX = e.clientX;

      document.documentElement.addEventListener('mousemove', this.doMoveTask, true);
      document.documentElement.addEventListener('mouseup', this.stopMoveTask, true);
    },
    /**
     * doMoveTask
     * @param e
     */
    doMoveTask(e) {
      this.cursorDistance = e.clientX - this.posX;
      this.newMarginLeft = Math.floor(this.marginL + this.cursorDistance);
      this.taskDom.style.marginLeft = `${this.newMarginLeft}px`; //modify margin left
    },
    /**
     * stopMoveTask
     * @param e
     */
    stopMoveTask(e) {
      this.taskDom.classList.remove('active');
      if (this.cursorDistance === 0) {
        document.documentElement.removeEventListener('mousemove', this.doMoveTask, true);
        document.documentElement.removeEventListener('mouseup', this.stopMoveTask, true);
        this.$emit('endUpdateTask');
      } else {
        let decimal = this.newMarginLeft / this.minWidth - Math.floor(this.newMarginLeft / this.minWidth);

        this.$emit('updateMargin',
            (decimal > 0.5) ? Math.ceil(this.newMarginLeft / this.minWidth) : Math.floor(this.newMarginLeft / this.minWidth)
        );

        this.$emit('updateDate', (decimal > 0.5) ? Math.ceil(this.cursorDistance / this.minWidth) : Math.floor(this.cursorDistance / this.minWidth));

        this.$emit('endUpdateTask');

        this.taskDom.style.marginLeft = ''; //modify margin left

        document.documentElement.removeEventListener('mousemove', this.doMoveTask, true);
        document.documentElement.removeEventListener('mouseup', this.stopMoveTask, true);
      }
    },
    /**
     * resize tasks
     * @param index
     * @param e
     */
    resize(e, handle) {
      this.$emit('initUpdateTask', this.index);
      this.taskDom = this.$refs.task;
      this.taskDom.classList.add('active');
      this.clickOnBorderRight = handle === 'right';
      this.clickOnBorderLeft = handle === 'left';

      this.styles = window.getComputedStyle(this.taskDom);
      this.widthDom = parseInt(this.styles.width, 10);
      this.marginL = parseInt(this.styles.marginLeft, 10);
      this.newMarginLeft = this.marginL;
      this.cursorDistance = 0;

      if (!this.drag) {
        this.posX = e.clientX;
        document.documentElement.addEventListener('mousemove', this.doDragTask, true);
        document.documentElement.addEventListener('mouseup', this.stopDragTask, true);
      }
    },
    /**
     * doDragTask check handle clicked and modify css style
     * @param e
     */
    doDragTask(e) {
      this.drag = true;
      this.cursorDistance = e.clientX - this.posX;

      if (this.clickOnBorderRight) {
        this.newWidth = this.widthTask + this.cursorDistance;
        this.taskDom.style.width = `${this.newWidth}px`; //modify width task
        document.body.style.cursor = 'col-resize'; //modify cursor
      } else if (this.clickOnBorderLeft) {
        this.newWidth = this.widthTask - this.cursorDistance;
        this.newMarginLeft = this.marginL + this.cursorDistance;

        this.taskDom.style.marginLeft = `${this.newMarginLeft}px`; //modify margin left
        this.taskDom.style.width = `${this.newWidth}px`;
        document.body.style.cursor = 'col-resize';
      }
    },
    /**
     * stopDragTask
     * calc date and modify selected task
     */
    stopDragTask() {
      this.taskDom.classList.remove('active');

      let distance = this.cursorDistance / this.minWidth;

      if (this.clickOnBorderRight) {
        if (this.cursorDistance < 0) { //vado a sinistra
          this.$emit('handleRightToLeft', distance);
        } else {// vado a destra
          this.$emit('handleRightToRight', distance);
        }

      } else if (this.clickOnBorderLeft) {
        if (this.cursorDistance < 0) { //vado a sinistra
          this.$emit('handleLeftToLeft', distance);
        } else { // vado a destra
          this.$emit('handleLeftToRight', distance);
        }
      }

      this.taskDom.style.marginLeft = '';
      document.body.style.cursor = '';

      document.documentElement.removeEventListener('mousemove', this.doDragTask, true);
      document.documentElement.removeEventListener('mouseup', this.stopDragTask, true);

      this.$emit('endUpdateTask');

      this.$nextTick(() => {
        setTimeout(() => {
          this.drag = false;
        }, 1000)
      });
    },
  }
}
</script>

<style lang="scss" scoped>

:root {
  --width-resize: 4px;
  --height: 100%;
  --margin: 0;
  --font-size: 0;
  --background-color: '20, 20, 20';
  --text-color: '0, 0, 0';
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
  font-size: var(--font-size);
  font-weight: bold;
  border-radius: var(--border-radius);
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
    content: '';
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