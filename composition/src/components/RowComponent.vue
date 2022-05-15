<script setup lang="ts">
interface Props {
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
    class="row"
    :style="`height: ${rowSettings.height}px; margin: ${rowSettings.margin}em 0;`"
  >
    <slot name="content"></slot>
    <div class="row__name">
      <slot name="text"></slot>
    </div>
  </div>
  <!--/Task Row-->
</template>
<style scoped lang="scss">
.row {
  display: flex;
  gap: 1em;
}
</style>
