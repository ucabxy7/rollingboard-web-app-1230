"use client";

import { useEffect, useState, useCallback } from "react";
import { getTasksByColumn } from "@/services/projects";
import { Task } from "@/models/tasks";
import TaskCard from "@/components/task/taskCard";
import { TaskApiResponse, DialogUITask } from "@/models/tasks";

interface TaskBoardProps {
  columnId: string;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export default function TaskBoard({
  columnId,
  onAddTask,
  onEditTask,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<DialogUITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: TaskApiResponse[] = await getTasksByColumn(columnId);
      const uiTasks: DialogUITask[] = data.map((task: TaskApiResponse) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        assignedToId: task.assignedTo?.id,
        assignedToName: task.assignedTo?.username,
      }));

      setTasks(uiTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [columnId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-4 text-center py-2">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <button
          onClick={onAddTask}
          className="w-full rounded-lg border border-dashed border-white/10 p-3
                     text-sm text-gray-4 hover:text-white hover:border-white/30"
        >
          + Add first task
        </button>
      ) : (
        <>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onEditTask(task)}
            />
          ))}

          <button
            onClick={onAddTask}
            className="w-full text-left text-sm text-gray-4 hover:text-white mt-1"
          >
            + Add Task
          </button>
        </>
      )}
    </div>
  );
}
