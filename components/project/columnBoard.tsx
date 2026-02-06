"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/shared/button";
import PlusSignIcon from "@/public/svgs/plus-sign.svg";
import { fetchColumns, deleteColumn } from "@/services/projects";
import { Column } from "@/models/columns";
import ColumnCard from "@/components/project/columnCard";
import ColumnDialog, {
  ColumnDialogRef,
} from "@/components/project/columnDialog";

interface Props {
  projectId: string;
}

export default function ColumnBoard({ projectId }: Props) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const columnDialogRef = useRef<ColumnDialogRef | null>(null);

  const fetchAndSetColumns = useCallback(async () => {
    try {
      const data = await fetchColumns(projectId);
      setColumns(data);
      setIsLoading(false);
    } catch (error) {
      // TODO: Bugsnag notify error
      console.error(error);
    }
  }, [projectId]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchAndSetColumns();
  }, [fetchAndSetColumns]);

  const handleDeleteColumn = useCallback(
    async (columnId: string) => {
      await deleteColumn(columnId);
      fetchAndSetColumns();
    },
    [fetchAndSetColumns],
  );

  if (isLoading) return null;

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Columns</h2>
        <Button onClick={() => columnDialogRef.current?.open(null)}>
          <PlusSignIcon className="size-4 mr-2 fill-white" />
          New Column
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            onEdit={() => columnDialogRef.current?.open(column)}
            onDelete={() => handleDeleteColumn(column.id)}
          />
        ))}
      </div>
      <ColumnDialog
        ref={columnDialogRef}
        projectId={projectId}
        columns={columns}
        onSuccess={fetchAndSetColumns}
      />
    </div>
  );
}
