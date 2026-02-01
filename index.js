let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
};

function saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isOverdue(task) {
    const today = new Date().toISOString().split("T")[0];
    return task.dueDate < today && task.status !== "done";
}

function addTask() {
    const text = document.getElementById("taskText").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!text || !dueDate) {
        alert("Field tidak boleh kosong!");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        dueDate,
        priority,
        submitDate: new Date().toLocaleDateString(),
        status: "todo",
        checked: false
    };

    tasks.push(task);
    saveToStorage();
    renderTasks();
}

function renderTasks() {
    document.getElementById("todo").innerHTML = "";
    document.getElementById("inprogress").innerHTML = "";
    document.getElementById("done").innerHTML = "";
    document.getElementById("overdue").innerHTML = "";

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.status === "todo" && b.status === "todo") {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
    });

    sortedTasks.forEach(task => {
        let column = task.status;
        if (isOverdue(task)) column = "overdue";

        const div = document.createElement("div");
        div.className = `task ${task.priority} 
      ${task.status === "done" ? "done" : ""} 
      ${column === "overdue" ? "overdue" : ""}`;

        div.innerHTML = `
      <input type="checkbox" ${task.checked ? "checked" : ""} onchange="toggleCheck(${task.id})">
      <b>${task.text}</b>
      <div class="task-meta">
        <span>Submit: ${task.submitDate}</span>
        <span>Due: ${task.dueDate}</span>
        <span>Priority: ${task.priority}</span>
        </div>
    <button class="icon-btn icon-edit" onclick="editTask(${task.id})">edit</button>
    <button class="icon-btn icon-delete" onclick="deleteTask(${task.id})">delete</button>
    `;

        document.getElementById(column).appendChild(div);
    });
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);

    const newText = prompt("Edit tugas:", task.text);
    if (newText === null || newText.trim() === "") return;

    const newDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate);
    if (newDate === null || newDate === "") return;

    const newPriority = prompt("Priority (high/medium/low):", task.priority);
    if (!["high", "medium", "low"].includes(newPriority)) {
        alert("Priority tidak valid");
        return;
    }

    task.text = newText;
    task.dueDate = newDate;
    task.priority = newPriority;

    saveToStorage();
    renderTasks();
}

function toggleCheck(id) {
    tasks = tasks.map(task => {
        if (task.id === id) task.checked = !task.checked;
        return task;
    });
    saveToStorage();
}

function proceedSelected() {
    let moved = false;

    tasks = tasks.map(task => {
        if (task.checked && task.status === "todo") {
            task.status = "inprogress";
            task.checked = false;
            moved = true;
        }
        return task;
    });

    if (!moved) {
        alert("Pilih task dari To Do!");
        return;
    }

    saveToStorage();
    renderTasks();
}

function doneSelected() {
    let moved = false;

    tasks = tasks.map(task => {
        if (task.checked && task.status === "inprogress") {
            task.status = "done";
            task.checked = false;
            moved = true;
        }
        return task;
    });

    if (!moved) {
        alert("Pilih task dari In Progress!");
        return;
    }

    saveToStorage();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToStorage();
    renderTasks();
}

function deleteAll() {
    if (tasks.length === 0) {
        alert("Tidak ada tugas!");
        return;
    }

    if (confirm("Yakin hapus semua tugas?")) {
        tasks = [];
        saveToStorage();
        renderTasks();
    }
}

renderTasks();