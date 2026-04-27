import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { taskAPI } from '../services/api';
import { UserContext } from '../context/UserContext';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const TaskManagerComponent = () => {
  const { userId } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskAPI.getUserTasks(userId);
      setTasks(response.data.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(userId, taskData);
      setTasks([...tasks, response.data.data]);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskAPI.toggleTask(taskId);
      setTasks(tasks.map(t => t.id === taskId ? response.data.data : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <Container className="mt-5 pb-5">
      <h1 className="mb-4">
        <i className="fas fa-tasks"></i> Task Manager
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={8}>
          <TaskForm onAddTask={handleAddTask} />
        </Col>
      </Row>

      {tasks.length > 0 && (
        <Row className="mb-4">
          <Col md={12}>
            <div className="btn-group" role="group">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('all')}
              >
                <i className="fas fa-list"></i> All <Badge bg="secondary">{tasks.length}</Badge>
              </Button>
              <Button
                variant={filter === 'active' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('active')}
              >
                <i className="fas fa-spinner"></i> Active <Badge bg="secondary">{tasks.filter(t => !t.completed).length}</Badge>
              </Button>
              <Button
                variant={filter === 'completed' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('completed')}
              >
                <i className="fas fa-check-circle"></i> Completed <Badge bg="secondary">{tasks.filter(t => t.completed).length}</Badge>
              </Button>
            </div>
          </Col>
        </Row>
      )}

      <Row>
        {loading && <p>Loading tasks...</p>}
        {!loading && filteredTasks.length === 0 && (
          <Col md={12}>
            <Card className="text-center p-5">
              <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }}></i>
              <p className="text-muted">
                {tasks.length === 0 ? 'No tasks yet. Add one to get started!' : 'No tasks in this filter.'}
              </p>
            </Card>
          </Col>
        )}
        {!loading && filteredTasks.map(task => (
          <Col md={6} lg={4} key={task.id} className="mb-3">
            <TaskItem
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TaskManagerComponent;
