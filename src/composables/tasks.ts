import { createTask, fetchAllTasks } from "@/services/taskService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchAllTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}