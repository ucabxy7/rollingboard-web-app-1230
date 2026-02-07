"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import Cross from "@/public/svgs/cross.svg";
import {
  Task,
  TaskFormData,
  taskFormSchema,
  ProjectMember,
} from "@/models/tasks";
import { createTask, updateTask } from "@/services/projects";
import { Button } from "@/components/shared/button";
import { TaskApiResponse, DialogUITask } from "@/models/tasks";

export interface TaskDialogRef {
  open: (task?: DialogUITask | null) => void;
  close: () => void;
}

interface TaskDialogProps {
  columnId: string;
  members: ProjectMember[];
  onSuccess?: () => void;
}

const getChangedFields = (data: TaskFormData, task: Task) => {
  const changed: Partial<TaskFormData> = {};

  if (data.name !== task.name) changed.name = data.name;
  if (data.description !== task.description)
    changed.description = data.description;
  if ((data.assignedToId ?? null) !== (task.assignedToId ?? null))
    changed.assignedToId = data.assignedToId;

  return changed;
};

const TaskDialog = forwardRef<TaskDialogRef, TaskDialogProps>(
  ({ columnId, members, onSuccess }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<DialogUITask | null>(null);

    const form = useForm<TaskFormData>({
      resolver: zodResolver(taskFormSchema),
      defaultValues: {
        name: "",
        description: "",
        assignedToId: undefined,
      },
    });

    const {
      formState: { isSubmitting },
    } = form;

    useImperativeHandle(
      ref,
      () => ({
        open: (task?: DialogUITask | null) => {
          if (task) {
            setEditingTask(task);
            form.reset({
              name: task.name,
              description: task.description,
              assignedToId: task.assignedToId,
            });
          } else {
            setEditingTask(null);
            form.reset({
              name: "",
              description: "",
              assignedToId: undefined,
            });
          }
          setIsOpen(true);
        },
        close: () => setIsOpen(false),
      }),
      [form],
    );

    const handleSubmit = useCallback(
      async (data: TaskFormData) => {
        if (editingTask) {
          // isChanged(any of : name, description, assignedToId)
          const changedFields = getChangedFields(data, editingTask);

          if (Object.keys(changedFields).length > 0) {
            await updateTask(editingTask.id, changedFields);
          }
        } else {
          await createTask({
            ...data,
            columnId,
          });
        }

        setIsOpen(false);
        onSuccess?.();
      },
      [editingTask, columnId, onSuccess],
    );

    return (
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingTask(null);
          form.reset();
        }}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-sm rounded-xl bg-dark-9 p-6">
            <DialogTitle className="text-lg font-semibold text-white mb-4">
              {editingTask ? "Edit task" : "Create task"}
            </DialogTitle>

            <button
              className="absolute top-4 right-4 size-4"
              onClick={() => setIsOpen(false)}
            >
              <Cross className="text-white size-4" />
            </button>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm text-gray-4 mb-1">Name</label>
                <input
                  {...form.register("name")}
                  className="w-full rounded-md bg-dark-8 border border-white/10 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-4 mb-1">
                  Description
                </label>
                <textarea {...form.register("description")} rows={3} />
              </div>
              <div>
                <label className="block text-sm text-gray-4 mb-1">
                  Assigned to
                  {editingTask?.assignedToName && (
                    <span className="ml-2 text-xs text-gray-5">
                      (Current: {editingTask.assignedToName})
                    </span>
                  )}
                </label>
                <select
                  {...form.register("assignedToId")}
                  className="w-full rounded-md bg-dark-8 border border-white/10 px-3 py-2 text-white"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {editingTask ? "Save" : "Create"}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    );
  },
);
export default TaskDialog;
