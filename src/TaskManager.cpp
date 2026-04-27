#include "TaskManager.h"
#include <iostream>
#include <algorithm>
#include <iomanip>
#include <sstream>

TaskManager::TaskManager() {
    loadTasks();
}

TaskManager::~TaskManager() {
    saveTasks();
}

void TaskManager::addTask(const std::string& title, const std::string& description) {
    if (title.empty()) {
        std::cerr << "Error: Task title cannot be empty!" << std::endl;
        return;
    }
    tasks.emplace_back(title, description);
    saveTasks();
    std::cout << "✓ Task added successfully!" << std::endl;
}

void TaskManager::deleteTask(const std::string& id) {
    auto it = std::find_if(tasks.begin(), tasks.end(),
        [&id](const Task& t) { return t.getId() == id; });
    
    if (it != tasks.end()) {
        tasks.erase(it);
        saveTasks();
        std::cout << "✓ Task deleted successfully!" << std::endl;
    } else {
        std::cerr << "Error: Task not found!" << std::endl;
    }
}

void TaskManager::toggleTask(const std::string& id) {
    auto it = std::find_if(tasks.begin(), tasks.end(),
        [&id](Task& t) { return t.getId() == id; });
    
    if (it != tasks.end()) {
        it->setCompleted(!it->isCompleted());
        saveTasks();
        std::cout << "✓ Task toggled successfully!" << std::endl;
    } else {
        std::cerr << "Error: Task not found!" << std::endl;
    }
}

const std::vector<Task>& TaskManager::getAllTasks() const noexcept {
    return tasks;
}

std::vector<Task> TaskManager::getActiveTasks() const {
    return filterTasks(FilterStatus::ACTIVE);
}

std::vector<Task> TaskManager::getCompletedTasks() const {
    return filterTasks(FilterStatus::COMPLETED);
}

std::vector<Task> TaskManager::filterTasks(FilterStatus status) const {
    std::vector<Task> filtered;
    filtered.reserve(tasks.size()); // Reserve space upfront
    
    for (const auto& task : tasks) {
        switch (status) {
            case FilterStatus::ACTIVE:
                if (!task.isCompleted()) {
                    filtered.push_back(task);
                }
                break;
            case FilterStatus::COMPLETED:
                if (task.isCompleted()) {
                    filtered.push_back(task);
                }
                break;
            case FilterStatus::ALL:
            default:
                filtered.push_back(task);
                break;
        }
    }
    return filtered;
}

int TaskManager::getTotalTasks() const noexcept {
    return static_cast<int>(tasks.size());
}

int TaskManager::getActiveTasksCount() const {
    return static_cast<int>(std::count_if(tasks.cbegin(), tasks.cend(),
        [](const Task& t) { return !t.isCompleted(); }));
}

int TaskManager::getCompletedTasksCount() const {
    return static_cast<int>(std::count_if(tasks.cbegin(), tasks.cend(),
        [](const Task& t) { return t.isCompleted(); }));
}

void TaskManager::displayAllTasks() const {
    displayTasks(FilterStatus::ALL);
}

void TaskManager::displayTasks(FilterStatus status) const {
    auto tasksToDisplay = filterTasks(status);
    
    if (tasksToDisplay.empty()) {
        std::cout << "\n📭 No tasks found!\n" << std::endl;
        return;
    }
    
    std::cout << "\n" << std::string(80, '=') << std::endl;
    std::cout << "Tasks: " << tasksToDisplay.size();
    
    if (status == FilterStatus::ACTIVE) {
        std::cout << " (Active)";
    } else if (status == FilterStatus::COMPLETED) {
        std::cout << " (Completed)";
    }
    std::cout << std::endl;
    std::cout << std::string(80, '=') << std::endl;
    
    for (size_t i = 0; i < tasksToDisplay.size(); ++i) {
        std::cout << (i + 1) << ". " << tasksToDisplay[i].toString() << std::endl;
    }
    std::cout << std::string(80, '=') << std::endl << std::endl;
}

void TaskManager::loadTasks() noexcept(false) {
    std::ifstream file(STORAGE_FILE, std::ios::binary);
    if (!file.is_open()) {
        return; // File doesn't exist yet
    }
    
    int count = 0;
    file.read(reinterpret_cast<char*>(&count), sizeof(count));
    
    tasks.reserve(count);
    for (int i = 0; i < count; ++i) {
        // Read ID
        int idLen = 0;
        file.read(reinterpret_cast<char*>(&idLen), sizeof(idLen));
        std::string id(idLen, '\0');
        file.read(id.data(), idLen);
        
        // Read Title
        int titleLen = 0;
        file.read(reinterpret_cast<char*>(&titleLen), sizeof(titleLen));
        std::string title(titleLen, '\0');
        file.read(title.data(), titleLen);
        
        // Read Description
        int descLen = 0;
        file.read(reinterpret_cast<char*>(&descLen), sizeof(descLen));
        std::string description(descLen, '\0');
        if (descLen > 0) {
            file.read(description.data(), descLen);
        }
        
        // Read Completed status
        bool completed = false;
        file.read(reinterpret_cast<char*>(&completed), sizeof(completed));
        
        tasks.emplace_back(id, title, description, completed);
    }
    
    file.close();
}

void TaskManager::saveTasks() const noexcept(false) {
    std::ofstream file(STORAGE_FILE, std::ios::binary | std::ios::trunc);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open file for writing!" << std::endl;
        return;
    }
    
    int count = static_cast<int>(tasks.size());
    file.write(reinterpret_cast<const char*>(&count), sizeof(count));
    
    for (const auto& task : tasks) {
        // Write ID
        const std::string& id = task.getId();
        int idLen = static_cast<int>(id.length());
        file.write(reinterpret_cast<const char*>(&idLen), sizeof(idLen));
        file.write(id.data(), idLen);
        
        // Write Title
        const std::string& title = task.getTitle();
        int titleLen = static_cast<int>(title.length());
        file.write(reinterpret_cast<const char*>(&titleLen), sizeof(titleLen));
        file.write(title.data(), titleLen);
        
        // Write Description
        const std::string& description = task.getDescription();
        int descLen = static_cast<int>(description.length());
        file.write(reinterpret_cast<const char*>(&descLen), sizeof(descLen));
        if (descLen > 0) {
            file.write(description.data(), descLen);
        }
        
        // Write Completed status
        bool completed = task.isCompleted();
        file.write(reinterpret_cast<const char*>(&completed), sizeof(completed));
    }
    
    file.close();
}

bool TaskManager::loadFromFile() noexcept(false) {
    loadTasks();
    return true;
}

bool TaskManager::saveToFile() const noexcept(false) {
    saveTasks();
    return true;
}
