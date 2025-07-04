document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const statusInput = document.getElementById("status-input");
  const table = document.getElementById("task-table");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks() {
    // Clear existing rows except header
    table.innerHTML = `
      <tr>
        <th>Task</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    `;
    tasks.forEach((task, index) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = task.name;
      row.insertCell(1).textContent = statusSymbol(task.status);
      const actionCell = row.insertCell(2);
      const updateButton = document.createElement("button");
      updateButton.textContent = "Update Status";
      updateButton.onclick = () => updateStatus(index);
      actionCell.appendChild(updateButton);
    });
  }

  function statusSymbol(status) {
    switch (status) {
      case "completed": return "✅";
      case "in progress": return "🟠";
      case "scheduled": return "❌";
    }
  }

  function updateStatus(index) {
    const current = tasks[index].status;
    const statuses = ["completed", "in progress", "scheduled"];
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    tasks[index].status = next;
    saveAndRender();
  }

  function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const newTask = {
      name: taskInput.value.trim(),
      status: statusInput.value
    };
    tasks.push(newTask);
    taskInput.value = "";
    saveAndRender();
  });

  renderTasks();
});
