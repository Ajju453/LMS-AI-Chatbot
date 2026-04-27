# Task Manager - C++ Development Guide

Welcome to the Task Manager C++ project! This guide provides everything you need to understand, develop, and extend this console application.

## Quick Start

### Windows
```bash
# Run build script
build.bat
# or with PowerShell
.\build.ps1
```

### macOS / Linux
```bash
mkdir build && cd build
cmake ..
make
./bin/task-manager
```

## Project Overview

The Task Manager is a C++17 console application that allows users to:
- Create tasks with titles and descriptions
- Mark tasks as completed/incomplete
- Delete tasks
- Filter tasks by status (All, Active, Completed)
- View task statistics
- Persist tasks using binary file storage

## Architecture Overview

### Three-Layer Architecture

1. **Model Layer (Task.h/Task.cpp)**
   - Represents a single task entity
   - Handles task properties and state
   - Provides string representation for display

2. **Business Logic Layer (TaskManager.h/TaskManager.cpp)**
   - Manages task collection
   - Implements CRUD operations
   - Handles filtering and statistics
   - Manages persistence

3. **Presentation Layer (main.cpp)**
   - Console user interface
   - Menu system and user interaction
   - Input validation
   - Output formatting

## File Structure

```
task-manager/
├── CMakeLists.txt           # CMake build configuration
├── include/
│   ├── Task.h               # Task model definition
│   └── TaskManager.h        # Task manager definition
├── src/
│   ├── Task.cpp             # Task implementation
│   ├── TaskManager.cpp      # TaskManager implementation
│   └── main.cpp             # Console UI and entry point
├── build/                   # Build directory (created after build)
├── bin/                     # Executables (created after build)
├── tasks.dat               # Binary persistence file (created at runtime)
├── build.bat               # Windows batch build script
├── build.ps1               # Windows PowerShell build script
├── README.md               # User documentation
├── DEVELOPMENT.md          # This file
└── .gitignore             # Git ignore patterns
```

## Class Documentation

### Task Class

**Location**: `include/Task.h`, `src/Task.cpp`

**Purpose**: Represents a single task entity with its properties and behaviors.

**Key Members**:
```cpp
class Task {
private:
    std::string id;                    // Unique identifier
    std::string title;                 // Task title
    std::string description;           // Task description
    bool completed;                    // Completion status
    std::chrono::system_clock::time_point createdAt;  // Creation time
};
```

**Public Methods**:
```cpp
// Constructors
Task();
Task(const std::string& title, const std::string& description = "");
Task(const std::string& id, const std::string& title, 
     const std::string& description, bool completed);

// Getters
const std::string& getId() const;
const std::string& getTitle() const;
const std::string& getDescription() const;
bool isCompleted() const;
std::string getCreatedAtStr() const;

// Setters
void setTitle(const std::string& newTitle);
void setDescription(const std::string& newDesc);
void setCompleted(bool status);

// Utility
std::string toString() const;  // For console display
```

**Key Features**:
- Automatic ID generation using timestamp
- Const-correct design
- String formatting for display
- Encapsulation of task properties

### TaskManager Class

**Location**: `include/TaskManager.h`, `src/TaskManager.cpp`

**Purpose**: Manages collection of tasks, provides CRUD operations, filtering, and persistence.

**Key Members**:
```cpp
class TaskManager {
private:
    std::vector<Task> tasks;           // Task collection
    const std::string STORAGE_FILE = "tasks.dat";
};
```

**Public Methods**:
```cpp
// Operations
void addTask(const std::string& title, const std::string& description = "");
void deleteTask(const std::string& id);
void toggleTask(const std::string& id);

// Queries
const std::vector<Task>& getAllTasks() const;
std::vector<Task> getActiveTasks() const;
std::vector<Task> getCompletedTasks() const;
std::vector<Task> filterTasks(FilterStatus status) const;

// Statistics
int getTotalTasks() const;
int getActiveTasksCount() const;
int getCompletedTasksCount() const;

// I/O
bool loadFromFile();
bool saveToFile();

// Display
void displayAllTasks() const;
void displayTasks(FilterStatus status) const;
```

**Key Features**:
- RAII pattern (automatic load in constructor, save in destructor)
- STL container management
- Efficient filtering with lambda functions
- Binary persistence format for fast I/O

## Data Persistence

### Storage Format (Binary)

The binary format provides efficient storage:

```
File Structure:
┌─────────────────────────────────┐
│ Task Count (int, 4 bytes)       │
├─────────────────────────────────┤
│ Task 1:                         │
│  ├─ ID Length (int)             │
│  ├─ ID Data (variable)          │
│  ├─ Title Length (int)          │
│  ├─ Title Data (variable)       │
│  ├─ Description Length (int)    │
│  ├─ Description Data (variable) │
│  └─ Completed Flag (bool)       │
├─────────────────────────────────┤
│ Task 2, 3, ... (same format)    │
└─────────────────────────────────┘
```

**Advantages**:
- Compact storage (no JSON overhead)
- Fast serialization/deserialization
- No external dependencies
- Human-readable IDs (timestamp-based)

## Development Guidelines

### Code Style

1. **Naming Conventions**
   - Classes: `PascalCase` (e.g., `TaskManager`)
   - Variables: `camelCase` (e.g., `taskCount`)
   - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_TASKS`)
   - Member variables: prefix with `m_` or suffix

2. **Const Correctness**
   ```cpp
   // Good - const for immutable returns
   const Task& getTask(int index) const;
   const std::vector<Task>& getAllTasks() const;
   
   // Good - const references for parameters
   void addTask(const std::string& title);
   ```

3. **Memory Management**
   - Use STL containers (`std::vector`, `std::string`)
   - Avoid raw `new`/`delete`
   - Use RAII pattern
   - No dynamic allocation in this project

4. **Error Handling**
   ```cpp
   // Validate inputs
   if (title.empty()) {
       std::cerr << "Error: Title cannot be empty!" << std::endl;
       return;
   }
   ```

### Adding New Features

#### 1. Add Task Priority

**Step 1**: Update Task Model
```cpp
// In include/Task.h
enum class Priority { LOW, MEDIUM, HIGH };

class Task {
private:
    Priority priority;  // Add this member
    
public:
    Priority getPriority() const;
    void setPriority(Priority p);
};
```

**Step 2**: Update TaskManager
```cpp
// In include/TaskManager.h
std::vector<Task> filterByPriority(Priority p) const;

// In src/TaskManager.cpp
std::vector<Task> TaskManager::filterByPriority(Priority p) const {
    std::vector<Task> filtered;
    for (const auto& task : tasks) {
        if (task.getPriority() == p) {
            filtered.push_back(task);
        }
    }
    return filtered;
}
```

**Step 3**: Update UI (main.cpp)
```cpp
// Add menu option for priority filtering
std::cout << "  9. View High Priority Tasks" << std::endl;

// Handle in switch statement
case 9:
    // Display high priority tasks
    break;
```

#### 2. Add Task Search

```cpp
// In TaskManager.h
std::vector<Task> searchTasks(const std::string& keyword) const;

// In TaskManager.cpp
std::vector<Task> TaskManager::searchTasks(const std::string& keyword) const {
    std::vector<Task> results;
    for (const auto& task : tasks) {
        if (task.getTitle().find(keyword) != std::string::npos ||
            task.getDescription().find(keyword) != std::string::npos) {
            results.push_back(task);
        }
    }
    return results;
}
```

#### 3. Add Task Editing

```cpp
// In TaskManager.h
bool editTask(const std::string& id, const std::string& newTitle, 
              const std::string& newDescription);

// In TaskManager.cpp
bool TaskManager::editTask(const std::string& id, 
                          const std::string& newTitle,
                          const std::string& newDescription) {
    auto it = std::find_if(tasks.begin(), tasks.end(),
        [&id](const Task& t) { return t.getId() == id; });
    
    if (it != tasks.end()) {
        it->setTitle(newTitle);
        it->setDescription(newDescription);
        saveTasks();
        return true;
    }
    return false;
}
```

## Building and Testing

### Build Targets

- **Debug Build** (Development)
  ```bash
  cmake -DCMAKE_BUILD_TYPE=Debug ..
  ```

- **Release Build** (Production)
  ```bash
  cmake -DCMAKE_BUILD_TYPE=Release ..
  ```

### Build Options

Customize build with CMake variables:
```bash
cmake .. -DCMAKE_CXX_STANDARD=17 -DCMAKE_CXX_STANDARD_REQUIRED=ON
```

### Manual Testing

```bash
# Test basic operations
./task-manager

# Test persistence (run twice)
./task-manager
# Add tasks, then exit
./task-manager
# Verify tasks are still there
```

## Common Issues and Solutions

### Issue: Build fails with "CMake not found"
**Solution**: Install CMake from https://cmake.org/download/

### Issue: Compilation errors with MSVC
**Solution**: Ensure Visual Studio 2022 or newer is installed, use Visual Studio command prompt

### Issue: Tasks not saving
**Solution**: Check file permissions in working directory, ensure `tasks.dat` is writable

### Issue: Console output garbled
**Solution**: Ensure terminal supports UTF-8, set console code page to 65001 on Windows:
```cmd
chcp 65001
```

## Performance Considerations

### Current Complexity
- Add Task: O(1)
- Delete Task: O(n)
- Toggle Task: O(n)
- Filter: O(n)
- Load/Save: O(n)

### Optimization Ideas
- Use `unordered_map` for O(1) lookups by ID
- Implement lazy loading for large task lists
- Add caching for filtered results
- Index tasks by status for faster filtering

## Future Enhancements

- [ ] Task due dates
- [ ] Task prioritization
- [ ] Search/filter by keyword
- [ ] Edit existing tasks
- [ ] Task categories/tags
- [ ] Export to CSV/JSON
- [ ] Import from files
- [ ] Multi-user support
- [ ] GUI version (Qt/wxWidgets)

## Resource Management

### Memory
- No memory leaks (verified with modern C++)
- Stack-based allocation preferred
- STL containers handle cleanup

### File I/O
- Binary format for efficiency
- Automatic save on task changes
- Auto-load on startup

## Testing Checklist

- [ ] Add new task with title only
- [ ] Add new task with title and description
- [ ] Delete existing task
- [ ] Toggle task status multiple times
- [ ] View all tasks
- [ ] View active tasks only
- [ ] View completed tasks only
- [ ] Verify tasks persist after restart
- [ ] Test with empty task list
- [ ] Test statistics calculation

## Best Practices

1. **Use Modern C++**: Leverage C++17 features
2. **const Correctness**: Mark methods/parameters const appropriately
3. **RAII**: Use objects for resource management
4. **STL Containers**: Prefer vectors/maps over arrays
5. **Error Handling**: Validate inputs and handle edge cases
6. **Code Comments**: Document complex logic
7. **Consistent Format**: Follow established style

## Compilation Tips

### Windows (Visual Studio)
```bash
cmake .. -G "Visual Studio 17 2022"
cmake --build . --config Release
```

### Windows (MinGW)
```bash
cmake .. -G "MinGW Makefiles"
cmake --build .
```

### macOS (Clang)
```bash
cmake ..
make -j$(nproc)
```

### Linux (GCC)
```bash
cmake ..
make -j$(nproc)
```

## Resources

- [cppreference.com](https://en.cppreference.com/)
- [C++ Standard Library](https://en.cppreference.com/w/cpp/standard)
- [CMake Documentation](https://cmake.org/documentation/)
- [Effective C++](https://en.wikipedia.org/wiki/Effective_C%2B%2B) - Book recommendations

---

Happy coding! 🚀
