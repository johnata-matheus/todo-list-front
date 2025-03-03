<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="border rounded-b-md bg-white overflow-x-auto">
    <Table class="w-full">
      <TableHeader class="bg-gray-50">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead class="px-4 py-2">Título</TableHead>
          <TableHead class="px-4 py-2 hidden md:table-cell">Descrição</TableHead>
          <TableHead class="px-4 py-2">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            class="border-b"
          >
            <TableCell class="p-3">
              <FlexRender :render="row.getValue('title')" />
            </TableCell>
            <TableCell class="p-3 hidden md:table-cell">
              <FlexRender :render="row.getValue('description')" />
            </TableCell>
            <TableCell class="p-3">
              <FlexRender :render="row.getValue('status')" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="3" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
