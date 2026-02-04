"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/button";

type Column = {
  id: string;
  name: string;
  order: number;
  tasks: []; // manually set tasks empty for MVP
};

interface ColumnBoardProps {
  projectId: string;
}

const ColumnBoard = ({ projectId }: ColumnBoardProps) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MVP：firstly mock column data, later fetch from API
    const mockColumns: Column[] = [
      { id: "1", name: "To Do", order: 0, tasks: [] },
      { id: "2", name: "In Progress", order: 1, tasks: [] },
      { id: "3", name: "Done", order: 2, tasks: [] },
    ];

    setColumns(mockColumns);
    setLoading(false);
  }, [projectId]);

  if (loading) {
    return <div className="text-gray-6">Loading board...</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns
        .sort((a, b) => a.order - b.order)
        .map((column) => (
          <div
            key={column.id}
            className="min-w-64 bg-gray-9 rounded-lg p-4 flex-shrink-0"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white font-semibold">{column.name}</h3>
            </div>

            {/* Tasks placeholder */}
            <div className="flex flex-col gap-2 min-h-24">
              {column.tasks.length === 0 && (
                <div className="text-gray-6 text-sm italic">No tasks</div>
              )}
            </div>
          </div>
        ))}

      {/* Add column (MVP 占位) */}
      <div className="min-w-64 shrink-0">
        <Button
          variant="ghost"
          className="h-full w-full border border-dashed border-gray-7 text-gray-6"
        >
          + Add column
        </Button>
      </div>
    </div>
  );
};

export default ColumnBoard;
