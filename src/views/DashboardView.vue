<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { z } from 'zod'
import DataTable from '@/components/DataTable.vue'
import TitleBar from '@/components/TitleBar.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { LoaderIcon, CaseSensitiveIcon, FlagIcon, CheckIcon, XOctagonIcon } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
import type { ITask } from '@/interfaces/Itask'
import { useCreateTask, useTasks } from '@/composables/tasks'
import { useToast } from '@/components/ui/toast'
import StatusCard from '@/components/StatusCard.vue'

const { data: tasks, isLoading } = useTasks()
const { mutate: createTask, isPending } = useCreateTask()
const { toast } = useToast()

const taskSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  description: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres.'),
  status: z.enum(['pending', 'in_progress', 'completed'], {
    errorMap: () => ({ message: 'Selecione um status válido.' }),
  }),
})

const newTask = ref<Partial<ITask>>({
  title: '',
  description: '',
  status: 'pending',
})

const isFormValid = computed(() => {
  const result = taskSchema.safeParse(newTask.value);
  return  result.success; 
})

const touchedFields = ref<Record<string, boolean>>({})

const errors = computed(() => {
  const result = taskSchema.safeParse(newTask.value);
  if (result.success) return {}

  const allErrors = Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [
      key,
      value?.[0] || '',
    ]),
  );

  return Object.fromEntries(Object.entries(allErrors).filter(([key]) => touchedFields.value[key]))
})

const handleCreateTask = () => {
  touchedFields.value = { title: true, description: true, status: true }

  if (!isFormValid.value) return;

  createTask(newTask.value as ITask, {
    onSuccess: () => {
      closeDialog()
      toast({
        title: 'Tarefa criada com sucesso!',
        description: h('div', { class: 'flex items-center gap-2' }, [
          h(CheckIcon, { class: 'text-green-500 w-5 h-5' }),
          h('span', 'A nova tarefa foi adicionada.'),
        ]),
        variant: 'default',
        duration: 4000,
      })
    },
    onError: (_) => {
      toast({
        title: 'Erro ao criar tarefa',
        description: h('div', { class: 'flex items-center gap-2' }, [
          h(XOctagonIcon, { class: 'w-5 h-5 text-white' }),
          h('span', 'Ocorreu um erro inesperado.'),
        ]),
        variant: 'destructive',
        duration: 4000,
      })
    },
  })
}

const safeTasks = computed(() => tasks.value ?? [])
const totalTasks = computed(() => tasks.value?.length ?? 0)

const defaultTask: Partial<ITask> = {
  title: '',
  description: '',
  status: 'pending',
}

const isDialogOpen = ref(false)
const openDialog = () => {
  isDialogOpen.value = true
}
const closeDialog = () => {
  isDialogOpen.value = false
}

watch(isDialogOpen, (isOpen) => {
  if (!isOpen) {
    newTask.value = { ...defaultTask }
    touchedFields.value = {}
  }
})

const columns: ColumnDef<ITask>[] = [
  {
    accessorKey: 'checkbox',
    header: () =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(Checkbox, {
          checked: true,
          disabled: true,
        }),
      ]),
    cell: () => h('div', h(Checkbox)),
  },
  {
    accessorKey: 'title',
    header: () =>
      h('div', { class: 'flex items-center gap-2' }, [h(CaseSensitiveIcon), h('div', 'Titulo')]),
    cell: ({ row }) => h('div', row.getValue('title')),
  },
  {
    accessorKey: 'description',
    header: () =>
      h('div', { class: 'flex items-center gap-2' }, [h(CaseSensitiveIcon), h('div', 'Descrição')]),
    cell: ({ row }) => h('div', row.getValue('description')),
  },
  {
    accessorKey: 'status',
    header: () =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(FlagIcon, { class: 'scale-90' }),
        h('div', h('strong', 'Status')),
      ]),
    cell: ({ row }) => {
      const status = row.getValue('status') as ITask['status']
      const statusColor =
        status === 'completed'
          ? 'text-green-500'
          : status === 'pending'
            ? 'text-yellow-500'
            : 'text-blue-500'
      return h('div', { class: `font-semibold ${statusColor}` }, status)
    },
  },
]
</script>

<template>
  <div
    class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
  >
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <TitleBar
        title="Tasks"
        subtitle="Testando o subtitulo se está funcionando"
        text-button="Criar Tarefa"
        @button-click="openDialog"
      />

      <div class="mx-auto grid w-full max-w-6xl">
        <StatusCard
          status="Em progresso"
          :icon="LoaderIcon"
          :status-count="totalTasks"
          background-color="bg-yellow-100"
          text-color="text-yellow-600"
          border-color="border-yellow-500"
        />
        <DataTable :columns="columns" :data="safeTasks" />
      </div>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>Preencha os campos abaixo com os detalhes da tarefa</DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div>
            <Label for="title"> Título </Label>
            <Input
              id="title"
              v-model="newTask.title"
              class="mb-1"
              @blur="touchedFields.title = true"
            />
            <span v-if="errors.title" class="text-red-500 text-sm">{{
              errors.title
            }}</span>
          </div>
          <div>
            <Label for="description"> Descrição </Label>
            <Input
              id="description"
              v-model="newTask.description"
              class="mb-1"
              @blur="touchedFields.description = true"
            />
            <span v-if="errors.description" class="text-red-500 text-sm">{{
              errors.description
            }}</span>
          </div>
          <div>
            <Label for="status"> Status </Label>
            <Select v-model="newTask.status" class="mb-1" @blur="touchedFields.status = true">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="pending"> Pendente </SelectItem>
                  <SelectItem value="in_progress"> Em progresso </SelectItem>
                  <SelectItem value="completed"> Concluído </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span v-if="errors.status" class="text-red-500 text-sm">{{
              errors.status
            }}</span>
          </div>
        </div>
        <DialogFooter>
          <Button @click="handleCreateTask()">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
