document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.getElementById("projects");

  // Load from localStorage or initialize default projects
  let data = JSON.parse(localStorage.getItem("projectData")) || {
    "Classification": [],
    "Segmentation": []
  };

  function saveData() {
    localStorage.setItem("projectData", JSON.stringify(data));
  }

  function render() {
    projectsContainer.innerHTML = "";
    for (let project in data) {
      const projectDiv = document.createElement("div");
      projectDiv.className = "project";

      const h2 = document.createElement("h2");
      h2.textContent = project;
      projectDiv.appendChild(h2);

      const inputSection = document.createElement("div");
      inputSection.className = "task-input-section";
      inputSection.innerHTML = `
        <input type="text" id="input-${project}" placeholder="Add task to ${project}">
        <input type="text" id="note-${project}" placeholder="Add note (optional)">
        <button onclick="addTask('${project}')">Add Task</button>
      `;
      projectDiv.appendChild(inputSection);

      const ul = document.createElement("ul");
      data[project].forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${statusSymbol(task.status)} <strong>${task.name}</strong>
          <span class="note">Note: ${task.note || ''}</span>
          <input type="text" class="note-input" placeholder="Edit note" value="${task.note || ''}" onchange="editNote('${project}', ${index}, this.value)">
          <br>
          <button onclick="deleteTask('${project}', ${index})">Delete</button>
          <button onclick="updateStatus('${project}', ${index})">Update Status</button>
        `;
        ul.appendChild(li);
      });

      projectDiv.appendChild(ul);
      projectsContainer.appendChild(projectDiv);
    }
  }

  function statusSymbol(status) {
    switch (status) {
      case "completed": return "✅";
      case "in progress": return "🟠";
      case "scheduled": return "❌";
      default: return "";
    }
  }

  window.addTask = function(project) {
    const taskInput = document.getElementById(`input-${project}`);
    const noteInput = document.getElementById(`note-${project}`);
    const taskName = taskInput.value.trim();
    const note = noteInput.value.trim();

    if (taskName) {
      data[project].push({ name: taskName, status: "scheduled", note: note });
      taskInput.value = "";
      noteInput.value = "";
      saveData();
      render();
    }
  }

  window.deleteTask = function(project, index) {
    data[project].splice(index, 1);
    saveData();
    render();
  }

  window.updateStatus = function(project, index) {
    const statuses = ["scheduled", "in progress", "completed"];
    const currentIndex = statuses.indexOf(data[project][index].status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    data[project][index].status = statuses[nextIndex];
    saveData();
    render();
  }

  window.editNote = function(project, index, newNote) {
    data[project][index].note = newNote;
    saveData();
  }

  render();
});
