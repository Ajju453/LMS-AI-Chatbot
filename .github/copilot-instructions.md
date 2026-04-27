# Copilot Instructions - Angular Task Manager

## Project Overview
This is an Angular-based task manager web application with the ability to add, delete, and mark tasks as completed.

## Development Guidelines

### Code Style
- Follow Angular style guide and best practices
- Use TypeScript for type safety
- Use reactive forms for task input
- Implement RxJS for state management

### Component Structure
- Keep components focused and single-responsibility
- Use smart (container) and dumb (presentational) components
- Share data between components using services
- Use dependency injection for service management

### Testing
- Write unit tests for services using Jasmine/Karma
- Test component logic and user interactions
- Aim for at least 80% code coverage

### Features to Implement
- Add new tasks with title and description
- Delete tasks from the list
- Mark tasks as completed/incomplete
- Filter tasks by status (all, active, completed)
- Persistent storage using localStorage
- Responsive design using Bootstrap or Angular Material

### File Structure
```
src/
├── app/
│   ├── components/
│   │   ├── task-list/
│   │   ├── task-form/
│   │   └── task-item/
│   ├── services/
│   │   └── task.service.ts
│   ├── models/
│   │   └── task.model.ts
│   ├── app.component.ts
│   └── app.module.ts
├── index.html
└── styles.css
```

### Copilot Preferences
- Ask for clarification if requirements are ambiguous
- Suggest implementations following Angular best practices
- Recommend using Angular Material for UI components
- Provide TypeScript interfaces for type safety
- Suggest RxJS operators for async operations

### Common Commands
- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng generate` - Generate new components/services
