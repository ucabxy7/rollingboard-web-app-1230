"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/shared/button";
import PlusSignIcon from "@/public/svgs/plus-sign.svg";
import { fetchColumns, createColumn, deleteColumn } from "@/services/projects";
import { Column } from "@/models/columns";
import ColumnCard from "@/components/project/columnCard";

interface Props {
  projectId: string;
}

export default function ColumnBoard({ projectId }: Props) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetColumns = useCallback(async () => {
    try {
      const data = await fetchColumns(projectId);
      setColumns(data);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAndSetColumns();
  }, [fetchAndSetColumns]);

  const handleCreateColumn = async () => {
    const name = "To do";
    const order = columns.length + 1;

    await createColumn(projectId, name, order);
    fetchAndSetColumns();
  };

  const handleDeleteColumn = async (columnId: string) => {
    await deleteColumn(columnId);
    fetchAndSetColumns();
  };

  if (isLoading) return null;

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Columns</h2>
        <Button onClick={handleCreateColumn}>
          <PlusSignIcon className="size-4 mr-2 fill-white" />
          New Column
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            onDelete={() => handleDeleteColumn(column.id)}
          />
        ))}
      </div>
    </div>
  );
}
