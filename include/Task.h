#ifndef TASK_H
#define TASK_H

#include <string>
#include <chrono>

class Task {
private:
    std::string id;
    std::string title;
    std::string description;
    bool completed;
    std::chrono::system_clock::time_point createdAt;

public:
    // Constructors
    Task() noexcept;
    Task(const std::string& title, const std::string& description = "");
    Task(const std::string& id, const std::string& title, 
         const std::string& description, bool completed) noexcept;
    
    // Move semantics
    Task(Task&& other) noexcept = default;
    Task& operator=(Task&& other) noexcept = default;

    // Getters
    [[nodiscard]] const std::string& getId() const noexcept;
    [[nodiscard]] const std::string& getTitle() const noexcept;
    [[nodiscard]] const std::string& getDescription() const noexcept;
    [[nodiscard]] bool isCompleted() const noexcept;
    [[nodiscard]] std::string getCreatedAtStr() const;
    [[nodiscard]] long long getTimestamp() const noexcept;

    // Setters
    void setTitle(const std::string& newTitle);
    void setDescription(const std::string& newDesc);
    void setCompleted(bool status) noexcept;

    // Utility
    [[nodiscard]] std::string toString() const;
};

#endif // TASK_H
