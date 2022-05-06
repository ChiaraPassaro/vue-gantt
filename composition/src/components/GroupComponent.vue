<script setup lang="ts"></script>

<template>
  <div class="tasks__group__title">
    <slot name="name"></slot>
  </div>
  <div class="tasks__group__rows">
    <slot name="rows"></slot>
  </div>
</template>

<style scoped></style>
