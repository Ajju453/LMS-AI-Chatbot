# Custom Copilot Agents

This project includes custom Copilot agents configured in `.copilot/agents.json` to assist with specific aspects of development.

## Available Agents

### 1. Task Manager Expert
**Specializes in**: Task management features and best practices

Use this agent when:
- Implementing new task features
- Optimizing task operations
- Designing task-related workflows
- Finding best practices for task management systems

Example query:
> "Help me implement a priority-based filtering system for tasks"

**Capabilities**:
- Feature implementation
- Component architecture design
- Service design patterns
- State management with RxJS
- Testing strategies for task features

---

### 2. Angular Architecture Advisor
**Specializes in**: Angular application structure and design patterns

Use this agent when:
- Planning new features or modules
- Refactoring components
- Optimizing performance
- Organizing project structure
- Implementing Angular patterns

Example query:
> "How should I structure the components for a new task analytics feature?"

**Capabilities**:
- Component design and hierarchy
- Service architecture
- Module organization
- Routing strategy planning
- Performance optimization

---

### 3. TypeScript & RxJS Specialist
**Specializes in**: Type-safe code and reactive programming

Use this agent when:
- Writing complex TypeScript types
- Debugging RxJS subscriptions
- Optimizing observable chains
- Handling errors in async operations
- Using proper reactive patterns

Example query:
> "I need to implement a debounced search for tasks with error handling"

**Capabilities**:
- TypeScript interfaces and types
- RxJS observable patterns
- Reactive forms implementation
- Async error handling
- Type inference optimization

---

### 4. Testing & QA Expert
**Specializes in**: Testing strategies and quality assurance

Use this agent when:
- Writing unit tests
- Planning test coverage
- Debugging failing tests
- Setting up test infrastructure
- Testing async operations

Example query:
> "How do I properly test the service with localStorage mocking?"

**Capabilities**:
- Unit test writing with Jasmine
- Service mocking and spying
- Component testing strategies
- Async/await test handling
- Code coverage optimization

---

## How to Use Custom Agents

### In VS Code
1. Open the Copilot chat panel
2. Use the `@` symbol to reference agents
3. Example: `@Task Manager Expert Help me add a priority field to tasks`

### Best Practices
- **Be specific**: Include context about what you're trying to achieve
- **Combine agents**: Use different agents for different aspects of a task
- **Follow recommendations**: Agent suggestions are based on Angular best practices
- **Ask follow-up questions**: Refine guidance with more specific queries

## Agent Workflow Example

Task: "Add due date functionality to tasks"

1. **Start with Architecture Advisor**
   > "@Angular Architecture Advisor How should I structure the due date feature?"

2. **Implement with TypeScript Specialist**
   > "@TypeScript & RxJS Specialist Help me add a due date field to the Task model with validation"

3. **Complete with Task Manager Expert**
   > "@Task Manager Expert Implement filtering by due date in the TaskService"

4. **Test with QA Expert**
   > "@Testing & QA Expert Write tests for the due date filtering functionality"

---

## Extending Agents

To add more agents or modify existing ones:

1. Edit `.copilot/agents.json`
2. Follow the JSON schema for agent definitions
3. Include clear descriptions and capabilities
4. Restart VS Code for changes to take effect

## Resources

- [Copilot Documentation](https://code.visualstudio.com/docs/copilot)
- [Custom Instructions Guide](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [Agent Configuration Tips](https://code.visualstudio.com/docs/copilot/getting-started)

---

For more information about development practices, see [DEVELOPMENT.md](DEVELOPMENT.md).
