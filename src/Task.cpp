#include "Task.h"
#include <sstream>
#include <iomanip>
#include <ctime>

static std::string generateId() noexcept {
    auto now = std::chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
    return std::to_string(millis);
}

Task::Task() noexcept
    : id(generateId()), title(), description(), completed(false),
      createdAt(std::chrono::system_clock::now()) {}

Task::Task(const std::string& title, const std::string& description)
    : id(generateId()), title(title), description(description), completed(false),
      createdAt(std::chrono::system_clock::now()) {}

Task::Task(const std::string& id, const std::string& title,
           const std::string& description, bool completed) noexcept
    : id(id), title(title), description(description), completed(completed),
      createdAt(std::chrono::system_clock::now()) {}

const std::string& Task::getId() const noexcept {
    return id;
}

const std::string& Task::getTitle() const noexcept {
    return title;
}

const std::string& Task::getDescription() const noexcept {
    return description;
}

bool Task::isCompleted() const noexcept {
    return completed;
}

std::string Task::getCreatedAtStr() const {
    auto time = std::chrono::system_clock::to_time_t(createdAt);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

long long Task::getTimestamp() const noexcept {
    return std::chrono::system_clock::to_time_t(createdAt);
}

void Task::setTitle(const std::string& newTitle) {
    title = newTitle;
}

void Task::setDescription(const std::string& newDesc) {
    description = newDesc;
}

void Task::setCompleted(bool status) noexcept {
    completed = status;
}

std::string Task::toString() const {
    std::stringstream ss;
    ss << "[" << (completed ? "X" : " ") << "] " << title;
    if (!description.empty()) {
        ss << " - " << description;
    }
    ss << " (ID: " << id << ", Created: " << getCreatedAtStr() << ")";
    return ss.str();
}
