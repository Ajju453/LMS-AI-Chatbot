#ifndef TASKMANAGER_H
#define TASKMANAGER_H

#include "Task.h"
#include <vector>
#include <string>
#include <fstream>

enum class FilterStatus {
    ALL,
    ACTIVE,
    COMPLETED
};

class TaskManager {
private:
    std::vector<Task> tasks;
    static constexpr const char* STORAGE_FILE = "tasks.dat";

    // Private helper methods
    void loadTasks() noexcept(false);
    void saveTasks() const noexcept(false);
    [[nodiscard]] std::vector<Task> getFilteredTasks(FilterStatus status) const;

public:
    TaskManager();
    ~TaskManager();

    // Deleted copy operations for safety
    TaskManager(const TaskManager&) = delete;
    TaskManager& operator=(const TaskManager&) = delete;

    // Task operations
    void addTask(const std::string& title, const std::string& description = "");
    void deleteTask(const std::string& id);
    void toggleTask(const std::string& id);

    // Get tasks\n    [[nodiscard]] const std::vector<Task>& getAllTasks() const noexcept;\n    [[nodiscard]] std::vector<Task> getActiveTasks() const;\n    [[nodiscard]] std::vector<Task> getCompletedTasks() const;\n    [[nodiscard]] std::vector<Task> filterTasks(FilterStatus status) const;

    // Statistics
    [[nodiscard]] int getTotalTasks() const noexcept;\n    [[nodiscard]] int getActiveTasksCount() const;\n    [[nodiscard]] int getCompletedTasksCount() const;

    // File operations
    [[nodiscard]] bool loadFromFile() noexcept(false);\n    [[nodiscard]] bool saveToFile() const noexcept(false);

    // Display
    void displayAllTasks() const;
    void displayTasks(FilterStatus status) const;
};

#endif // TASKMANAGER_H
