"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HubConnectionBuilder } from "@microsoft/signalr";

const TaskBoard = () => {
    const [tasks, setTasks] = useState([
        { id: "1", name: "Task 1", position: 1 },
        { id: "2", name: "Task 2", position: 2 },
        { id: "3", name: "Task 3", position: 3 },
    ]);

    const [connection, setConnection] = useState<any>(null);

    // Establish SignalR connection
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7086/project", { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                console.log("Connected to SignalR");

                // Listen for task movement from other users
                connection.on("TaskPosition", (taskId: any, newPosition: any) => {
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task.id === taskId ? { ...task, position: newPosition } : task
                        )
                    );
                });
            });

            return () => {
                connection.stop();
            };
        }
    }, [connection]);

    // Handle drag-and-drop logic
    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        // Update the local task order
        const updatedTasks = Array.from(tasks);
        const [movedTask] = updatedTasks.splice(sourceIndex, 1);
        updatedTasks.splice(destinationIndex, 0, movedTask);

        // Update positions
        const reorderedTasks = updatedTasks.map((task, index) => ({
            ...task,
            position: index + 1,
        }));

        setTasks(reorderedTasks);

        // Notify the backend about the move
        if (connection) {
            try {
                await connection.invoke(
                    "MoveTask",
                    movedTask.id,
                    destinationIndex + 1
                );
            } catch (error) {
                console.error("Failed to notify the server:", error);
            }
        }
    };

    const addTask = () => {
        if (connection) {
            const task = {
                TaskName: "ahmed",
                Assignees: "ahmed",
                Description: "sti",
                Priority: "High", // Assuming "Priority" and "Status" are strings
            };
            const ProjectId = "6743a438e41cfe9d477c323a"


            connection
                .invoke("addTask", ProjectId, task)
                .then(() => {
                    console.log("Task added successfully!");
                })
                .catch((error: any) => {
                    console.error("Error adding task:", error);
                });
        }
    };


    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Real-Time Task Board</h1>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="taskList">
                    {(provided: any) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                            }}
                        >
                            {tasks
                                .sort((a, b) => a.position - b.position)
                                .map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id}
                                        index={index}
                                    >
                                        {(provided: any) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="text-black"
                                                style={{
                                                    padding: "10px 20px",
                                                    margin: "10px 0",
                                                    backgroundColor: "#f4f4f4",
                                                    borderRadius: "5px",
                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                    ...provided.draggableProps.style,
                                                }}
                                            >
                                                {task.name}
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <button onClick={addTask}>addTassk</button>
        </div>
    );
};

export default TaskBoard;
