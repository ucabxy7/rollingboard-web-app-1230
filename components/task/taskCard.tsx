"use client";

import { DialogUITask } from "@/models/tasks";
import { Button } from "@/components/shared/button";
import { Pencil, X } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface TaskCardProps {
  task: DialogUITask;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const t = useTranslations();
  return (
    <div
      className={clsx(
        "group relative rounded-xl border border-white/10 p-3",
        "bg-dark-8 hover:bg-dark-7 hover:border-white/30",
        "transition-all duration-150",
      )}
    >
      {/* ✅ Header = drag handle */}
      <div
        className="mb-1 flex items-center justify-between gap-2
                   cursor-grab active:cursor-grabbing"
      >
        {/* Title */}
        <div className="text-sm font-medium text-white leading-snug">
          {task.name}
        </div>
        <div className="flex items-center gap-4">
          {onEdit && (
            <Button
              variant="ghost"
              onClick={onEdit}
              className="size-1 opacity-0 group-hover:opacity-100"
              aria-label={t("taskCard.edit")}
            >
              <span className="inline-flex items-center gap-1">
                {t("taskCard.edit")}
                <Pencil className="size-4" />
              </span>
            </Button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="size-4 text-gray-4 hover:text-red-400"
              aria-label={t("taskCard.delete")}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {task.description && (
        <div className="text-xs text-gray-4 truncate">@{task.description}</div>
      )}
    </div>
  );
}
