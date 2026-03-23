"use client";

import { Button } from "@/components/shared/button";
import { Pencil, X } from "lucide-react";
import { Column } from "@/models/columns";
import { useTranslations } from "next-intl";

/* columnCard do not know dnd-kit, just put props on header div to make sure header draggable.*/
interface ColumnCardProps {
  column: Column;
  onDelete?: () => void;
  onEdit?: () => void;
  onAddTask?: () => void; // ✅ 新增
  children?: React.ReactNode;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function ColumnCard({
  column,
  onDelete,
  onEdit,
  onAddTask,
  children,
  dragHandleProps,
}: ColumnCardProps) {
  const t = useTranslations();

  return (
    <div
      className="group relative flex flex-col rounded-2xl p-4
        w-[280px] shrink-0
        bg-linear-to-b from-dark-9 to-transparent
        border border-white/10 hover:border-white/30
        transition-all duration-200"
    >
      <div
        className="mb-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
      >
        <h3 className="text-white font-semibold">{column.name}</h3>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100"
              aria-label={t("columnCard.edit")}
            >
              <span className="inline-flex items-center gap-1">
                {t("columnCard.edit")}
                <Pencil className="size-4" />
              </span>
            </Button>
          )}
          {/* Delete */}
          {onDelete && (
            <button
              onClick={onDelete}
              title={t("columnCard.delete")}
              className="size-4 text-gray-4 hover:text-red-400"
              aria-label={t("columnCard.delete")}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body – task placeholder */}
      {/* ✅ Body – Tasks */}
      <div className="flex-1 space-y-2">
        {children ?? (
          <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-sm text-gray-4">
            Tasks will appear here
          </div>
        )}
      </div>

      {/* ✅ Footer – Add Task */}
      {onAddTask && (
        <button
          onClick={onAddTask}
          className="mt-3 text-sm text-gray-4 hover:text-white"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
