<script setup lang="ts">
defineProps<{
  status: string
  icon: any
  statusCount: number
  borderColor: string
  textColor: string
  backgroundColor: string
}>()
</script>

<template>
  <div class="flex gap-2 py-3 px-4 border-t border-l border-r rounded-t-md bg-white">
    <div :class="`py-1 px-3 border ${borderColor} rounded-md ${backgroundColor}`">
      <span :class="`flex items-center gap-2 text-sm ${textColor}`">
        <component :is="icon" class="scale-90" />
        <strong>{{ status }}</strong>
      </span>
    </div>
    <div class="py-1 px-3 border rounded-md">
      <span class="text-sm">{{ statusCount }}</span>
    </div>
  </div>
</template>
