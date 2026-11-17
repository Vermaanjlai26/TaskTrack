
const API_URL = "http://localhost:8080/api/tasks";

// LOAD ALL TASKS
async function loadTasks() {
    const taskList = document.getElementById("taskList");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();

        // Update dashboard counters
        updateDashboardStats(tasks);

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            taskList.textContent = "No tasks available.";
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "task-card";

            const title = document.createElement("h3");
            title.textContent = task.title;

            const description = document.createElement("p");
            description.textContent =
                task.description || "No description";

            const status = document.createElement("p");
            status.textContent = "Status: " + task.status;

            const dueDate = document.createElement("p");
            dueDate.textContent =
                "Due Date: " + (task.dueDate || "Not set");

            // UPDATE BUTTON
            const updateButton = document.createElement("button");
            updateButton.textContent = "Update Status";

            updateButton.addEventListener("click", () => {
                updateTask(task);
            });

            // DELETE BUTTON
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(status);
            card.appendChild(dueDate);
            card.appendChild(updateButton);
            card.appendChild(deleteButton);

            taskList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        alert("Unable to load tasks. Check Spring Boot.");
    }
}


// DASHBOARD STATISTICS
function updateDashboardStats(tasks) {
    const total = tasks.length;

    const pending = tasks.filter(
        task => task.status === "PENDING"
    ).length;

    const completed = tasks.filter(
        task => task.status === "COMPLETED"
    ).length;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completedTasks").textContent = completed;
}


// ADD NEW TASK
async function addTask() {
    const title = document.getElementById("title").value.trim();
    const description =
        document.getElementById("description").value.trim();
    const dueDate = document.getElementById("dueDate").value;

    if (!title) {
        alert("Please enter task title.");
        return;
    }

    const task = {
        title: title,
        description: description,
        status: "PENDING",
        dueDate: dueDate || null
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error("Unable to add task");
        }

        alert("Task added successfully!");

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("dueDate").value = "";

        await loadTasks();

    } catch (error) {
        console.error(error);
        alert("Error adding task.");
    }
}


// UPDATE TASK STATUS
async function updateTask(task) {
    const updatedStatus =
        task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    const updatedTask = {
        title: task.title,
        description: task.description,
        status: updatedStatus,
        dueDate: task.dueDate
    };

    try {
        const response = await fetch(`${API_URL}/${task.id}`, {
method: "PUT",
    headers: {
    "Content-Type": "application/json"
},
body: JSON.stringify(updatedTask)
});

if (!response.ok) {
    throw new Error("Unable to update task");
}

alert("Task updated successfully!");

await loadTasks();

} catch (error) {
    console.error(error);
    alert("Error updating task.");
}
}


// DELETE TASK
async function deleteTask(id) {
    const confirmation = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete task");
        }

        alert("Task deleted successfully!");

        await loadTasks();

    } catch (error) {
        console.error(error);
        alert("Error deleting task.");
    }
}


// LOAD TASKS WHEN PAGE OPENS
document.addEventListener("DOMContentLoaded", loadTasks);
