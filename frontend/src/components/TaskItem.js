import React from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`shadow-sm h-100 ${task.completed ? 'bg-light' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className={task.completed ? 'text-muted text-decoration-line-through' : ''}>
            {task.title}
          </h5>
          <Badge bg={getPriorityColor(task.priority)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>

        {task.description && (
          <p className={`text-muted mb-3 ${task.completed ? 'text-decoration-line-through' : ''}`}>
            {task.description}
          </p>
        )}

        <div className="task-actions">
          <Form.Check
            type="checkbox"
            label={task.completed ? 'Completed' : 'Mark as complete'}
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mb-2"
          />

          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="w-100"
          >
            <i className="fas fa-trash"></i> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskItem;
