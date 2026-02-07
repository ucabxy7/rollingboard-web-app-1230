"use client";

import { Button } from "@/components/shared/button";
import Cross from "@/public/svgs/cross.svg";
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
      {/* Delete */}
      <button
        className="absolute top-3 right-3 size-4 z-10 opacity-0 group-hover:opacity-100"
        onClick={onDelete}
      >
        <Cross className="text-white size-4" />
      </button>
      <div
        className="mb-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
      >
        <h3 className="text-white font-semibold">{column.name}</h3>

        {onEdit && (
          <Button
            variant="ghost"
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100"
          >
            {t("columnCard.edit")}
          </Button>
        )}
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
