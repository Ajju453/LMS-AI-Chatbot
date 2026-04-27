#include "TaskManager.h"
#include <iostream>
#include <string>
#include <string_view>
#include <cctype>
#include <limits>
#include <iomanip>

// Clear screen function
void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

// Display menu
void displayMenu() {
    static constexpr std::string_view separator = "==================================================";
    std::cout << "\n" << separator << std::endl;
    std::cout << "          ✓ TASK MANAGER - Main Menu" << std::endl;
    std::cout << separator << std::endl;
    std::cout << "  1. Add Task" << std::endl;
    std::cout << "  2. View All Tasks" << std::endl;
    std::cout << "  3. View Active Tasks" << std::endl;
    std::cout << "  4. View Completed Tasks" << std::endl;
    std::cout << "  5. Toggle Task Status" << std::endl;
    std::cout << "  6. Delete Task" << std::endl;
    std::cout << "  7. View Statistics" << std::endl;
    std::cout << "  8. Exit" << std::endl;
    std::cout << separator << std::endl;
    std::cout << "Choose an option: ";
}

// Get valid integer input
int getIntInput(int min, int max) {
    int choice;
    while (!(std::cin >> choice) || choice < min || choice > max) {
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Invalid input! Please enter a number between " << min << " and " << max << ": ";
    }
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return choice;
}

// Get string input
std::string getStringInput(std::string_view prompt) {
    std::string input;
    input.reserve(256); // Reserve space for typical input
    std::cout << prompt;
    std::getline(std::cin, input);
    return input;
}

// Add task function
void addTaskMenu(TaskManager& manager) {
    clearScreen();
    std::cout << "\n--- Add New Task ---\n" << std::endl;
    
    std::string title = getStringInput("Enter task title: ");
    if (title.empty()) {
        std::cerr << "Error: Title cannot be empty!" << std::endl;
        return;
    }
    
    std::string description = getStringInput("Enter task description (optional): ");
    manager.addTask(title, description);
    
    std::cout << "\nPress Enter to return to main menu...";
    std::cin.get();
}

// Toggle task menu
void toggleTaskMenu(TaskManager& manager) {
    clearScreen();
    std::cout << "\n--- Toggle Task Status ---\n" << std::endl;
    
    manager.displayAllTasks();
    
    std::string id = getStringInput("Enter task ID to toggle (or press Enter to cancel): ");
    if (!id.empty()) {
        manager.toggleTask(id);
    }
    
    std::cout << "\nPress Enter to return to main menu...";
    std::cin.get();
}

// Delete task menu
void deleteTaskMenu(TaskManager& manager) {
    clearScreen();
    std::cout << "\n--- Delete Task ---\n" << std::endl;
    
    manager.displayAllTasks();
    
    std::string id = getStringInput("Enter task ID to delete (or press Enter to cancel): ");
    if (!id.empty()) {
        manager.deleteTask(id);
    }
    
    std::cout << "\nPress Enter to return to main menu...";
    std::cin.get();
}

// Display statistics
void displayStatistics(const TaskManager& manager) {
    clearScreen();
    std::cout << "\n--- Task Statistics ---\n" << std::endl;
    
    const int totalTasks = manager.getTotalTasks();
    const int activeTasks = manager.getActiveTasksCount();
    const int completedTasks = manager.getCompletedTasksCount();
    
    std::cout << "Total Tasks:      " << totalTasks << std::endl;
    std::cout << "Active Tasks:     " << activeTasks << std::endl;
    std::cout << "Completed Tasks:  " << completedTasks << std::endl;
    
    if (totalTasks > 0) {
        double completionRate = (static_cast<double>(completedTasks) / totalTasks) * 100.0;
        std::cout << "Completion Rate:  " << std::fixed << std::setprecision(1) 
                 << completionRate << "%" << std::endl;
    }
    
    std::cout << "\nPress Enter to return to main menu...";
    std::cin.get();
}

// Main function
int main() {
    TaskManager manager;
    bool running = true;

    static constexpr std::string_view welcome =
        "\n╔════════════════════════════════════════════════════════════╗\n"
        "║         Welcome to Task Manager v1.0 (C++)            ║\n"
        "╚════════════════════════════════════════════════════════════╝\n";
    std::cout << welcome << std::endl;

    while (running) {
        displayMenu();
        int choice = getIntInput(1, 8);

        switch (choice) {
            case 1:
                addTaskMenu(manager);
                break;
            case 2:
                clearScreen();
                manager.displayAllTasks();
                std::cout << "Press Enter to return to main menu...";
                std::cin.get();
                break;
            case 3:
                clearScreen();
                manager.displayTasks(FilterStatus::ACTIVE);
                std::cout << "Press Enter to return to main menu...";
                std::cin.get();
                break;
            case 4:
                clearScreen();
                manager.displayTasks(FilterStatus::COMPLETED);
                std::cout << "Press Enter to return to main menu...";
                std::cin.get();
                break;
            case 5:
                toggleTaskMenu(manager);
                break;
            case 6:
                deleteTaskMenu(manager);
                break;
            case 7:
                displayStatistics(manager);
                break;
            case 8:
                std::cout << "\n✓ Thank you for using Task Manager! Goodbye!\n" << std::endl;
                running = false;
                break;
            default:
                std::cerr << "Invalid choice! Please try again." << std::endl;
        }
    }

    return 0;
}
