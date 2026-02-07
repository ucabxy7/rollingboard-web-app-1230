"use client";

import { useCallback, useEffect, useRef, useMemo, useState } from "react";
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

/* swap helper - used to change the id of 2 columns*/
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

/* sortable wrapper - used to wrap columnCard (pass props and dragHandleProps ) */
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
  // style: the css when drag and drop (transform + transition)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // setNodeRef: tell dnd this DOM is target (position, hit, css)
  // dragHandleProps - props send to the header of a column.
  // attributes: DOM situationa & attributes
  // listeners: drag and drop event
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
  // Source of truth:
  // Raw columns data from backend.
  // This is the ONLY writable columns state.
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

  // dnd part
  // 1. set up sensors (in Dndcontext)
  // device and action to sense
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );
  // 2. handle drop action: frontend setup new order (swapColumnsInState) -> api call
  // active: column being dragged
  // over: mouse-touched column when you drop active column.
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromId = active.id as string;
    const toId = over.id as string;

    // step 1
    // optimistic update - immediately change the UI ( by sortedColumsn below)
    setColumns((prev) => swapColumnsInState(prev, fromId, toId));

    // step 2
    // change backend according to updated frontend domain info.
    try {
      await swapColumn(projectId, {
        ids: [fromId, toId],
      });
    } catch {
      // rollback - in case backend could not changed accordingly.
      setColumns((prev) => swapColumnsInState(prev, fromId, toId));
    }
  };

  // 3. once columns changed, columns auto render again.
  // View model (read-only derived data from 'columns' )for rendering & dnd.
  // Used for rendering and interaction only.
  // DO NOT mutate or setState based on this directly
  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.order - b.order),
    [columns],
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

      {/* ✅ DND */}
      {/* DndContext - 
      1.listen to mouse 
      2.which (active) element you drag 
      3.which (over) element you drop the active element 
      sensors: listen to drag and drop
      collisionDetection: closestCenter (which item's center is closest, pick it as over.id)
      onDragEnd: when to setColumns*/}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* SortableContext - 
        1. which is re-order-able.
        items: index used for order (must same as useSortable({ id: column.id }'s id))
        strategy: how other columns move.*/}
        <SortableContext
          // IMPORTANT:
          // items order MUST match render order
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

      <ColumnDialog
        ref={columnDialogRef}
        projectId={projectId}
        columns={columns}
        onSuccess={fetchAndSetColumns}
      />
    </div>
  );
}
