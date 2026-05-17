import React from 'react';
import Card from '../Card';
import Button from '../Button';
import styles from '../../pages/BuddyPage.module.css';

const BuddyChecklistSection = ({
  selectedBuddy,
  taskTitle,
  onTaskTitleChange,
  onAddTask,
  tasks,
  loadingTasks,
  loadingAction,
  onToggleTask,
}) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2>Buddy Checklist</h2>
      <span>Shared daily tasks.</span>
    </div>
    <Card className={styles.card}>
      {!selectedBuddy && <div className={styles.note}>Choose a buddy to view tasks.</div>}
      {selectedBuddy && (
        <>
          <form className={styles.formRow} onSubmit={onAddTask}>
            <input
              type="text"
              placeholder="Add a task for today"
              value={taskTitle}
              onChange={onTaskTitleChange}
              className={styles.input}
            />
            <Button
              text={loadingAction ? 'Adding...' : 'Add Task'}
              className={styles.primaryButton}
              type="submit"
              disabled={loadingAction}
            />
          </form>

          {loadingTasks && <div className={styles.note}>Loading tasks...</div>}
          {!loadingTasks && tasks.length === 0 && (
            <div className={styles.note}>No tasks yet. Add the first one.</div>
          )}
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <label className={styles.taskLabel}>
                  <input
                    type="checkbox"
                    checked={task.completed_by_me}
                    onChange={() => onToggleTask(task)}
                  />
                  <span className={task.completed_by_me ? styles.taskCompleted : ''}>
                    {task.title}
                  </span>
                </label>
                <span className={styles.taskStatus}>
                  Buddy: {task.completed_by_buddy ? 'Done' : 'Open'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  </section>
);

export default BuddyChecklistSection;
