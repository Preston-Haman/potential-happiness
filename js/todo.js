var Task = (function () {
    function Task(name, desc, completed) {
        if (completed === void 0) { completed = false; }
        this.name = name;
        this.desc = desc;
        this.completed = completed;
    }
    Task.prototype.isCompleted = function () {
        return this.completed;
    };
    Task.prototype.getDiv = function () {
        var div = document.createElement("div");
        var taskName = document.createElement("h2");
        var taskDesc = document.createElement("p");
        taskName.innerText = this.name;
        taskDesc.innerText = this.desc;
        div.appendChild(taskName);
        div.appendChild(taskDesc);
        div.classList.add("task");
        div.classList.add(this.completed ? "complete" : "incomplete");
        var thisTask = this;
        div.onclick = function () {
            thisTask.completed = !thisTask.completed;
            var thisDiv = this;
            thisDiv.parentElement.removeChild(thisDiv);
            displayTaskOnPage(thisTask);
        };
        return div;
    };
    return Task;
}());
var tasks = [];
window.onload = function () {
    loadTasks();
    var enterListener = function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    };
    document.getElementById("task-name").onkeyup = enterListener;
    document.getElementById("desc").onkeyup = enterListener;
    document.getElementById("add-btn").onclick = addTask;
    document.getElementById("clear-btn").onclick = clearTaskInput;
};
function addTask() {
    var task = getTaskFromPage();
    if (task) {
        tasks.push(task);
        displayTaskOnPage(task);
        clearTaskInput();
    }
}
function displayTaskOnPage(task) {
    if (task.isCompleted()) {
        var completedItems = document.getElementById("completed-items");
        completedItems.appendChild(task.getDiv());
    }
    else {
        var incompleteItems = document.getElementById("incomplete-items");
        incompleteItems.appendChild(task.getDiv());
    }
}
function clearTaskInput() {
    var name = document.getElementById("task-name");
    name.value = "";
    var desc = document.getElementById("desc");
    desc.value = "";
    document.getElementById("name-err").innerText = "";
    document.getElementById("desc-err").innerText = "";
}
function getTaskFromPage() {
    var name = document.getElementById("task-name").value;
    var desc = document.getElementById("desc").value;
    if (!name) {
        var errSpan = document.getElementById("name-err");
        errSpan.innerText = "*Task name is required";
    }
    if (!desc) {
        var errSpan = document.getElementById("desc-err");
        errSpan.innerText = "*Task description is required";
    }
    if (name && desc)
        return new Task(name, desc);
    return null;
}
function loadTasks() {
    tasks.forEach(displayTaskOnPage);
}
function saveTasks() {
}
