
/* ======================================
   DREAMCORE TO-DO TRACKER
====================================== */


/* ---------- VARIABLES ---------- */

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");

const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const taskCount = document.getElementById("taskCount");

const themeButton = document.getElementById("themeButton");

const filters = document.querySelectorAll(".filter");


/* ---------- DATA ---------- */

let tasks = JSON.parse(localStorage.getItem("dreamTasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


/* ---------- SAVE TASKS ---------- */

function saveTasks() {

    localStorage.setItem(
        "dreamTasks",
        JSON.stringify(tasks)
    );
}


/* ---------- ADD TASK ---------- */

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {

        taskInput.focus();

        taskInput.placeholder =
            "Write a little dream first ✨";

        return;
    }


    const newTask = {

        id: Date.now(),

        title: title,

        date: dateInput.value,

        priority: priorityInput.value,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

    updateProgress();


    /* Clear inputs */

    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value = "medium";


    taskInput.focus();
}


/* ---------- ENTER KEY ---------- */

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


/* ---------- ADD BUTTON ---------- */

addButton.addEventListener("click", addTask);


/* ---------- RENDER TASKS ---------- */

function renderTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    updateProgress();
}


/* ---------- CREATE TASK ---------- */

function createTaskElement(task) {

    const taskDiv = document.createElement("div");

    taskDiv.className = "task";


    if (task.completed) {

        taskDiv.classList.add("completed");

    }


    /* Checkbox */

    const checkbox = document.createElement("div");

    checkbox.className = "check";

    checkbox.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    /* Content */

    const content = document.createElement("div");

    content.className = "task-content";


    const title = document.createElement("div");

    title.className = "task-title";

    title.textContent = task.title;


    const details = document.createElement("div");

    details.className = "task-details";


    /* Date */

    if (task.date) {

        const date = document.createElement("span");

        date.textContent = "📅 " + formatDate(task.date);

        details.appendChild(date);

    }


    /* Priority */

    const priority = document.createElement("span");

    priority.className =
        `priority ${task.priority}`;

    priority.textContent =
        getPriorityText(task.priority);

    details.appendChild(priority);


    content.appendChild(title);

    content.appendChild(details);


    /* Action buttons */

    const actions = document.createElement("div");

    actions.className = "task-actions";


    /* Edit */

    const editButton =
        document.createElement("button");

    editButton.innerHTML = "✏️";

    editButton.title = "Edit task";

    editButton.addEventListener(
        "click",
        () => openEditModal(task.id)
    );


    /* Delete */

    const deleteButton =
        document.createElement("button");

    deleteButton.innerHTML = "🗑️";

    deleteButton.title = "Delete task";

    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    /* Put everything together */

    taskDiv.appendChild(checkbox);

    taskDiv.appendChild(content);

    taskDiv.appendChild(actions);


    return taskDiv;
}


/* ---------- COMPLETE TASK ---------- */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();
}


/* ---------- DELETE TASK ---------- */

function deleteTask(id) {

    const confirmed =
        confirm("Remove this little dream? 🌙");


    if (!confirmed) return;


    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();
}


/* ---------- EDIT MODAL ---------- */

const editModal =
    document.getElementById("editModal");

const editInput =
    document.getElementById("editInput");

const saveEdit =
    document.getElementById("saveEdit");

const closeModal =
    document.getElementById("closeModal");


function openEditModal(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) return;


    editingTaskId = id;

    editInput.value = task.title;

    editModal.classList.add("show");

    editInput.focus();
}


/* ---------- SAVE EDIT ---------- */

saveEdit.addEventListener("click", function() {

    const newTitle =
        editInput.value.trim();


    if (newTitle === "") return;


    tasks = tasks.map(task => {

        if (task.id === editingTaskId) {

            return {
                ...task,
                title: newTitle
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    closeEditModal();
});


/* ---------- CLOSE MODAL ---------- */

function closeEditModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


/* Close when clicking outside */

editModal.addEventListener(
    "click",
    function(event) {

        if (event.target === editModal) {

            closeEditModal();

        }

    }
);


/* ---------- FILTERS ---------- */

filters.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            filters.forEach(btn =>
                btn.classList.remove("active")
            );


            this.classList.add("active");


            currentFilter =
                this.dataset.filter;


            renderTasks();

        }
    );

});


/* ---------- PROGRESS ---------- */

function updateProgress() {

    const total = tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    if (total === 0) {

        progressText.textContent = "0%";

        progressFill.style.width = "0%";

        taskCount.textContent =
            "0 of 0 tasks completed";

        return;
    }


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    progressText.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    taskCount.textContent =
        `${completed} of ${total} tasks completed`;
}


/* ---------- DATE FORMAT ---------- */

function formatDate(date) {

    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );
}


/* ---------- PRIORITY TEXT ---------- */

function getPriorityText(priority) {

    if (priority === "low") {

        return "🌱 Low";

    }


    if (priority === "high") {

        return "⭐ High";

    }


    return "🌸 Medium";
}


/* ---------- THEME ---------- */

themeButton.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            themeButton.textContent = "☀️";

            localStorage.setItem(
                "dreamTheme",
                "dark"
            );

        } else {

            themeButton.textContent = "🌙";

            localStorage.setItem(
                "dreamTheme",
                "light"
            );

        }

    }
);


/* ---------- LOAD THEME ---------- */

const savedTheme =
    localStorage.getItem("dreamTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";

}


/* ---------- INITIAL LOAD ---------- */

renderTasks();
updateProgress();
