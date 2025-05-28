import { useState, useEffect } from 'react';
import './index.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === 'alphabetical') {
      return a.text.localeCompare(b.text);
    }
    return 0;
  });

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          maxLength="100"
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="controls">
        <div className="filter-controls">
          <span>Filter: </span>
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="sort-controls">
          <span>Sort by: </span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>

        <button 
          className="clear-btn"
          onClick={handleClearCompleted}
          disabled={!tasks.some(task => task.completed)}
        >
          Clear Completed
        </button>
      </div>

      <ul className="task-list">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              <span className="task-text">{task.text}</span>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="empty-message">No tasks found</li>
        )}
      </ul>

      <div className="stats">
        <span>Total: {tasks.length}</span>
        <span>Completed: {tasks.filter(task => task.completed).length}</span>
        <span>Active: {tasks.filter(task => !task.completed).length}</span>
      </div>
    </div>
  );
};

export default ToDoList;