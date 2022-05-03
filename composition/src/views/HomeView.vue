<script setup lang="ts">
import TaskComponent from "@/components/TaskComponent.vue";
import { reactive } from "vue";
const state = reactive({
  width: 36,
});
</script>

<template>
  <main>
    <button @click="state.width = state.width + 36">Add Width</button>
    <TaskComponent :width="state.width"></TaskComponent>
  </main>
</template>

<style lang="scss">
main {
  height: 36px;
}
</style>
