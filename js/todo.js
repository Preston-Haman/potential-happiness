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
    Task.prototype.getDiv = function (taskList, taskListNode) {
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
            taskList.removeFromLink(taskListNode);
            displayTaskOnPage(thisTask);
        };
        return div;
    };
    return Task;
}());
var DoublyLinkedTaskNode = (function () {
    function DoublyLinkedTaskNode(task, prev, next) {
        if (prev === void 0) { prev = null; }
        if (next === void 0) { next = null; }
        this.prev = null;
        this.next = null;
        this.task = task;
        this.prev = prev;
        this.next = next;
    }
    return DoublyLinkedTaskNode;
}());
var DoublyLinkedTaskList = (function () {
    function DoublyLinkedTaskList() {
        this.head = null;
        this.tail = null;
    }
    DoublyLinkedTaskList.prototype.addTask = function (task) {
        var node = new DoublyLinkedTaskNode(task, this.tail);
        if (!this.head) {
            this.head = node;
            this.tail = node;
        }
        else {
            this.tail.next = node;
            this.tail = node;
        }
        return node;
    };
    DoublyLinkedTaskList.prototype.removeFromLink = function (node) {
        if (node === this.head) {
            this.head = node.next;
        }
        if (node === this.tail) {
            this.tail = node.prev;
        }
        if (node.prev) {
            node.prev.next = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
        node.prev = null;
        node.next = null;
        return node;
    };
    DoublyLinkedTaskList.prototype.forEach = function (action) {
        if (this.head) {
            var currentNode = this.head;
            while (currentNode) {
                action.apply(currentNode, [currentNode.task]);
                currentNode = currentNode.next;
            }
        }
    };
    return DoublyLinkedTaskList;
}());
var tasks = new DoublyLinkedTaskList();
window.onload = function () {
    loadTasks();
    var enterListener = function (e) {
        if (e.key === "Enter") {
            addTask();
            document.getElementById("task-name").focus();
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
        displayTaskOnPage(task);
        clearTaskInput();
    }
}
function displayTaskOnPage(task, saveTask) {
    if (saveTask === void 0) { saveTask = true; }
    if (task.isCompleted()) {
        var completedItems = document.getElementById("completed-items");
        completedItems.appendChild(task.getDiv(tasks, tasks.addTask(task)));
    }
    else {
        var incompleteItems = document.getElementById("incomplete-items");
        incompleteItems.appendChild(task.getDiv(tasks, tasks.addTask(task)));
    }
    if (saveTask) {
        saveTasks();
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
var TASK_STORAGE_KEY = "tasks";
function loadTasks() {
    if (typeof (Storage) !== "undefined") {
        var tasksString = localStorage.getItem(TASK_STORAGE_KEY);
        if (tasksString) {
            var taskArray = JSON.parse(tasksString);
            taskArray.forEach(function (task) {
                var newTask = new Task(task.name, task.desc, task.completed);
                displayTaskOnPage(newTask, false);
            });
        }
    }
}
function saveTasks() {
    if (typeof (Storage) !== "undefined") {
        var taskArray_1 = [];
        tasks.forEach(function (task) {
            taskArray_1.push(task);
        });
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskArray_1));
    }
}
