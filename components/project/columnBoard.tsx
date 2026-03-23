"use client";

import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { Button } from "@/components/shared/button";
import PlusSignIcon from "@/public/svgs/plus-sign.svg";
import {
  fetchColumns,
  swapColumn,
  deleteColumn,
  fetchProjectMemberships,
} from "@/services/projects";
import { Column } from "@/models/columns";
import ColumnCard from "@/components/project/columnCard";
import ColumnDialog, {
  ColumnDialogRef,
} from "@/components/project/columnDialog";
import TaskDialog, { TaskDialogRef } from "@/components/task/taskDialog";
import { ProjectMember } from "@/models/tasks";
import { Membership } from "@/models/memberships";
import TaskBoard from "@/components/task/taskBoard";
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
import { Loader2 } from "lucide-react";

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
  children,
}: {
  column: Column;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
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
      >
        {children}
      </ColumnCard>
    </div>
  );
}

export function mapMembershipsToProjectMembers(
  memberships: Membership[],
): ProjectMember[] {
  return memberships.map((m) => ({
    id: m.user.id, // userId
    name: m.user.username,
  }));
}

export default function ColumnBoard({ projectId }: Props) {
  // Source of truth:
  // Raw columns data from backend.
  // This is the ONLY writable columns state.
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const columnDialogRef = useRef<ColumnDialogRef | null>(null);
  const taskDialogRef = useRef<TaskDialogRef>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  // Trigger a task refetch (via TaskDialog onSuccess) without refetching columns.
  // Start as null so TaskBoard doesn't immediately "refresh" on initial mount.
  const [taskRefreshCounter, setTaskRefreshCounter] = useState<number | null>(null);
  console.log("ColumnBoard render");

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [columnsData, memberships] = await Promise.all([
        fetchColumns(projectId),
        fetchProjectMemberships(projectId),
      ]);

      setColumns(columnsData);
      setMembers(mapMembershipsToProjectMembers(memberships));
    } catch (error) {
      console.error(error);
      // TODO: Bugsnag
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    console.log(`${projectId}'s ColumnBoard mounted`);
    return () => {
      console.log(`${projectId}'s ColumnBoard unmounted`);
    };
  }, []);

  // remember soft delete tasks when column is delete in future.
  const handleDeleteColumn = useCallback(
    async (columnId: string) => {
      await deleteColumn(columnId);
      fetchInitialData();
    },
    [fetchInitialData],
  );

  const handleTaskSuccess = useCallback(() => {
    // Refresh only tasks for the column whose dialog was submitted.
    setTaskRefreshCounter((c) => (c === null ? 1 : c + 1));
  }, []);

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

  // if (isLoading) return null;
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
              <div key={column.id}>
                <SortableColumnCard
                  column={column}
                  onEdit={() => columnDialogRef.current?.open(column)}
                  onDelete={() => handleDeleteColumn(column.id)}
                >
                  <TaskBoard
                    columnId={column.id}
                    refreshToken={taskRefreshCounter ?? undefined}
                    refreshColumnId={activeColumnId}
                    onAddTask={() => {
                      // Avoid changing state when re-opening the same column.
                      setActiveColumnId((prev) =>
                        prev === column.id ? prev : column.id,
                      );
                      taskDialogRef.current?.open();
                    }}
                    onEditTask={(task) => {
                      // Avoid changing state when re-opening the same column.
                      setActiveColumnId((prev) =>
                        prev === column.id ? prev : column.id,
                      );
                      taskDialogRef.current?.open(task);
                    }}
                  />
                </SortableColumnCard>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {/* ✅ Loading Overlay（加法，不影响存在性） */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-sm text-white/80">Loading columns...</span>
        </div>
      )}
      <TaskDialog
        ref={taskDialogRef}
        columnId={activeColumnId ?? ""}
        members={members}
        onSuccess={handleTaskSuccess}
      />
      <ColumnDialog
        ref={columnDialogRef}
        projectId={projectId}
        columns={columns}
        onSuccess={fetchInitialData}
      />
    </div>
  );
}
