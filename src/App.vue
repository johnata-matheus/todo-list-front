<script setup lang="ts">
import { RouterView } from 'vue-router'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import Header from '@/components/layout/Header.vue'
import { Toaster } from '@/components/ui/toast';
</script>

<template>
  <div>
    <Header />
    <main>
      <RouterView />
    </main>
    <Toaster />
  </div>
  <VueQueryDevtools />
</template>

