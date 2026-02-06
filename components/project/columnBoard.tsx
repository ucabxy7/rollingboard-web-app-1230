"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/shared/button";
import PlusSignIcon from "@/public/svgs/plus-sign.svg";
import { fetchColumns, swapColumn, deleteColumn } from "@/services/projects";
import { Column } from "@/models/columns";
import ColumnCard from "@/components/project/columnCard";
import ColumnDialog, {
  ColumnDialogRef,
} from "@/components/project/columnDialog";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  projectId: string;
}

/* swap helper */
function swapColumnsInState(
  columns: Column[],
  idA: string,
  idB: string,
): Column[] {
  const colA = columns.find((c) => c.id === idA);
  const colB = columns.find((c) => c.id === idB);

  if (!colA || !colB) return columns;

  return columns.map((c) => {
    if (c.id === idA) return { ...c, order: colB.order };
    if (c.id === idB) return { ...c, order: colA.order };
    return c;
  });
}

/* sortable wrapper */
function SortableColumnCard({
  column,
  onEdit,
  onDelete,
}: {
  column: Column;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ColumnCard
        column={column}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}

export default function ColumnBoard({ projectId }: Props) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const columnDialogRef = useRef<ColumnDialogRef | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

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

  /* ✅ drag end = swap */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromId = active.id as string;
    const toId = over.id as string;

    // optimistic
    setColumns((prev) => swapColumnsInState(prev, fromId, toId));

    try {
      await swapColumn(projectId, {
        ids: [fromId, toId],
      });
    } catch {
      // rollback
      setColumns((prev) => swapColumnsInState(prev, fromId, toId));
    }
  };

  if (isLoading) return null;

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Columns</h2>
        <Button onClick={() => columnDialogRef.current?.open(null)}>
          <PlusSignIcon className="size-4 mr-2 fill-white" />
          New Column
        </Button>
      </div>

      {/* ✅ DND */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedColumns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto">
            {sortedColumns.map((column) => (
              <SortableColumnCard
                key={column.id}
                column={column}
                onEdit={() => columnDialogRef.current?.open(column)}
                onDelete={() => handleDeleteColumn(column.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            onEdit={() => columnDialogRef.current?.open(column)}
            onDelete={() => handleDeleteColumn(column.id)}
          />
        ))}
      </div> */}
      <ColumnDialog
        ref={columnDialogRef}
        projectId={projectId}
        columns={columns}
        onSuccess={fetchAndSetColumns}
      />
    </div>
  );
}
