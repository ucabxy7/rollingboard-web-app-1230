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
import { Column, ColumnFormData, columnFormSchema } from "@/models/columns";
import { createColumn, updateColumn } from "@/services/projects";
import { Button } from "@/components/shared/button";

export interface ColumnDialogRef {
  open: (column?: Column | null) => void;
  close: () => void;
}

interface ColumnDialogProps {
  projectId: string;
  columns: Column[];
  onSuccess?: () => void;
}

const ColumnDialog = forwardRef<ColumnDialogRef, ColumnDialogProps>(
  ({ projectId, columns, onSuccess }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);

    const form = useForm<ColumnFormData>({
      resolver: zodResolver(columnFormSchema),
      defaultValues: {
        name: "",
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        open: (column?: Column | null) => {
          if (column) {
            setEditingColumn(column);
            form.reset({
              name: column.name,
            });
          } else {
            setEditingColumn(null);
            form.reset({
              name: "",
            });
          }
          setIsOpen(true);
        },
        close: () => setIsOpen(false),
      }),
      [form],
    );

    const handleSubmit = useCallback(
      async (data: ColumnFormData) => {
        if (editingColumn) {
          // edit: only change name. order is updated by swapping columns
          const isChanged = data.name !== editingColumn.name;
          if (isChanged) {
            await updateColumn(editingColumn.id, { name: data.name });
          }
        } else {
          // create: order is auto-calculated.
          // order could be 1,5,6,not continuous but all unique. So we just find the max order and add 1.
          const nextOrder =
            columns.length === 0
              ? 0
              : Math.max(...columns.map((c) => c.order)) + 1;
          await createColumn(projectId, { name: data.name, order: nextOrder });
        }

        setIsOpen(false);
        onSuccess?.();
      },
      [editingColumn, projectId, columns, onSuccess],
    );

    return (
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-sm rounded-xl bg-dark-9 p-6">
            <DialogTitle className="text-lg font-semibold text-white mb-4">
              {editingColumn ? "Edit Column" : "Create Column"}
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

              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit">
                  {editingColumn ? "Save" : "Create"}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    );
  },
);
export default ColumnDialog;
