document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-button");
  const taskList = document.getElementById("task-list");

  // Load tasks from localStorage or initialize as empty array
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    // Clear current list
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${statusSymbol(task.status)} ${task.name}
        <button onclick="deleteTask(${index})">Delete</button>
        <button onclick="updateStatus(${index})">Update Status</button>
      `;
      taskList.appendChild(li);
    });
  }

  function statusSymbol(status) {
    switch (status) {
      case "completed": return "✅";
      case "in progress": return "🟠";
      case "scheduled": return "❌";
      default: return "";
    }
  }

  addButton.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    if (taskName) {
      tasks.push({ name: taskName, status: "scheduled" }); // default status
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }
  });

  // Make deleteTask globally accessible
  window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  window.updateStatus = function(index) {
    const statuses = ["scheduled", "in progress", "completed"];
    const currentIndex = statuses.indexOf(tasks[index].status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    tasks[index].status = statuses[nextIndex];
    saveTasks();
    renderTasks();
  }

  renderTasks();
});
