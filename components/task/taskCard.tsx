"use client";

import { Task, DialogUITask } from "@/models/tasks";
import clsx from "clsx";

interface TaskCardProps {
  task: DialogUITask;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "group cursor-pointer rounded-xl border border-white/10 p-3",
        "bg-dark-8 hover:bg-dark-7 hover:border-white/30",
        "transition-all duration-150",
      )}
    >
      {/* Title */}
      <div className="text-sm font-medium text-white">{task.name}</div>

      {/* Meta */}
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-4">
        {task.description && (
          <span className="truncate">@{task.description}</span>
        )}
      </div>
    </div>
  );
}
