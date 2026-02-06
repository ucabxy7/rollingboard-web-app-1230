"use client";

import { Button } from "@/components/shared/button";
import Cross from "@/public/svgs/cross.svg";
import { Column } from "@/models/columns";
import { useTranslations } from "next-intl";

interface ColumnCardProps {
  column: Column;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function ColumnCard({
  column,
  onDelete,
  onEdit,
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

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
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
      <div className="flex-1 space-y-2 text-sm text-gray-4">
        <div className="rounded-lg border border-dashed border-white/10 p-3 text-center">
          Tasks will appear here
        </div>
      </div>
    </div>
  );
}
