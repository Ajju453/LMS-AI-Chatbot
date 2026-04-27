cmake_minimum_required(VERSION 3.16)
project(TaskManager)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add include directories
include_directories(${PROJECT_SOURCE_DIR}/include)

# Add source files
set(SOURCES
    src/Task.cpp
    src/TaskManager.cpp
    src/main.cpp
)

# Create executable
add_executable(task-manager ${SOURCES})

# Set output directory
set_target_properties(task-manager PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)

# For Windows, add a flag to use UTF-8 encoding
if(MSVC)
    target_compile_options(task-manager PRIVATE /utf-8)
endif()
