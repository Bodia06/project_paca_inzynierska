import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks } from '../store/slices/taskSlice';
import { getMyGrades } from '../store/slices/submissionSlice';
import { TaskContext } from './Contexts';
import CONSTANTS from '../constants';

export const TaskProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { allTasks = [], refreshCounter } = useSelector(
    (state) => state.task || {}
  );

  const {
    myGrades = [],
    isFetching: gradesLoading = false,
    error,
  } = useSelector((state) => state.submissions || {});
  const { user } = useSelector((state) => state.user || {});

  const [manualSelectedId, setManualSelectedId] = useState(null);
  const [manualExpandedModules, setManualExpandedModules] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && user?.role) {
      dispatch(getTasks({ all: true }));

      if (user.role === CONSTANTS.BEGINNER_ROLE) {
        dispatch(getMyGrades());
      }
    }
  }, [dispatch, user?.role, refreshCounter]);

  const gradedTaskIds = useMemo(() => {
    return new Set(
      myGrades
        .filter((sub) => sub.grade !== null && sub.grade !== undefined)
        .map((sub) => Number(sub.taskId))
    );
  }, [myGrades]);

  const sortedTasks = useMemo(() => {
    return [...allTasks].sort((a, b) => {
      const modA = String(a.modul || '').toLowerCase();
      const modB = String(b.modul || '').toLowerCase();
      if (modA < modB) return -1;
      if (modA > modB) return 1;
      return Number(a.id) - Number(b.id);
    });
  }, [allTasks]);

  const groupedTasks = useMemo(() => {
    return sortedTasks.reduce((acc, task) => {
      const moduleName = (task.modul || 'Module').trim();

      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }

      acc[moduleName].push({
        ...task,
        isCompleted: gradedTaskIds.has(Number(task.id)),
      });

      return acc;
    }, {});
  }, [sortedTasks, gradedTaskIds]);

  const selectedTask = useMemo(() => {
    if (sortedTasks.length === 0) return null;
    const found = sortedTasks.find(
      (t) => Number(t.id) === Number(manualSelectedId)
    );
    const task = found || sortedTasks[0];
    return {
      ...task,
      isCompleted: gradedTaskIds.has(Number(task.id)),
    };
  }, [sortedTasks, manualSelectedId, gradedTaskIds]);

  const currentSubmission = useMemo(() => {
    if (!selectedTask) return null;
    return myGrades.find(
      (sub) => Number(sub.taskId) === Number(selectedTask.id)
    );
  }, [selectedTask, myGrades]);

  const progressPercentage = useMemo(() => {
    if (sortedTasks.length === 0) return 0;
    const completedCount = sortedTasks.filter((t) =>
      gradedTaskIds.has(Number(t.id))
    ).length;
    return Math.round((completedCount / sortedTasks.length) * 100);
  }, [sortedTasks, gradedTaskIds]);

  const handleTaskSelect = useCallback((taskId, moduleName) => {
    setManualSelectedId(taskId);
    setManualExpandedModules((prev) => ({
      ...prev,
      [String(moduleName)]: true,
    }));
  }, []);

  const toggleModule = useCallback((moduleName) => {
    setManualExpandedModules((p) => ({ ...p, [moduleName]: !p[moduleName] }));
  }, []);

  const expandedModules = useMemo(() => {
    const baseState = selectedTask
      ? { [String(selectedTask.modul)]: true }
      : {};
    return { ...baseState, ...manualExpandedModules };
  }, [selectedTask, manualExpandedModules]);

  const isAllTasksCompleted = useMemo(() => {
    return (
      sortedTasks.length > 0 &&
      sortedTasks.every((t) => gradedTaskIds.has(Number(t.id)))
    );
  }, [sortedTasks, gradedTaskIds]);

  const contextValue = useMemo(
    () => ({
      tasks: sortedTasks,
      groupedTasks,
      selectedTask,
      currentSubmission,
      progressPercentage,
      isAllTasksCompleted,
      expandedModules,
      gradesLoading,
      error,
      user,
      handleTaskSelect,
      toggleModule,
    }),
    [
      sortedTasks,
      groupedTasks,
      selectedTask,
      currentSubmission,
      progressPercentage,
      isAllTasksCompleted,
      expandedModules,
      gradesLoading,
      error,
      user,
      handleTaskSelect,
      toggleModule,
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
