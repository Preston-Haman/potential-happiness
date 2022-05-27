
class Task {
	name: string;
	desc: string;
	completed: boolean;
	
	constructor(name: string, desc: string, completed: boolean = false) {
		this.name = name;
		this.desc = desc;
		this.completed = completed;
	}
	
	public isCompleted(): boolean {
		return this.completed;
	}
	
	public getDiv(taskList: DoublyLinkedTaskList, taskListNode: DoublyLinkedTaskNode): HTMLDivElement {
		let div: HTMLDivElement = document.createElement("div");
		let taskName: HTMLHeadingElement = document.createElement("h2");
		let taskDesc: HTMLParagraphElement = document.createElement("p");
		
		taskName.innerText = this.name;
		taskDesc.innerText = this.desc;
		
		div.appendChild(taskName);
		div.appendChild(taskDesc);
		div.classList.add("task");
		div.classList.add(this.completed ? "complete" : "incomplete");
		
		const thisTask = this;
		div.onclick = function() {
			thisTask.completed = !thisTask.completed;
			let thisDiv: HTMLDivElement = <HTMLDivElement> this;
			
			thisDiv.parentElement.removeChild(thisDiv);
			taskList.removeFromLink(taskListNode);
			//Do I have to delete thisDiv, now?
			
			displayTaskOnPage(thisTask);
		}
		return div;
	}
}

class DoublyLinkedTaskNode {
	prev: DoublyLinkedTaskNode = null;
	next: DoublyLinkedTaskNode = null;
	task: Task;
	
	constructor(task: Task, prev: DoublyLinkedTaskNode = null, next: DoublyLinkedTaskNode = null) {
		this.task = task;
		this.prev = prev;
		this.next = next;
	}
}

class DoublyLinkedTaskList {
	head: DoublyLinkedTaskNode = null;
	tail: DoublyLinkedTaskNode = null;
	
	public addTask(task: Task): DoublyLinkedTaskNode {
		let node: DoublyLinkedTaskNode = new DoublyLinkedTaskNode(task, this.tail);
		if (!this.head) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail.next = node;
			this.tail = node;
		}
		
		return node;
	}
	
	public removeFromLink(node: DoublyLinkedTaskNode): DoublyLinkedTaskNode {
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
	}
	
	public forEach(action: (this: DoublyLinkedTaskNode, task: Task) => any): void {
		if (this.head) {
			let currentNode: DoublyLinkedTaskNode = this.head;
			while (currentNode) {
				action.apply(currentNode, [currentNode.task]);
				currentNode = currentNode.next;
			}
		}
	}
}

let tasks: DoublyLinkedTaskList = new DoublyLinkedTaskList();

window.onload = function() {
	loadTasks();
	let enterListener: (this: GlobalEventHandlers, e: KeyboardEvent) => any = function(e: KeyboardEvent) {
		if (e.key === "Enter") {
			addTask();
			document.getElementById("task-name").focus();
		}
	};
	document.getElementById("task-name").onkeyup = enterListener;
	document.getElementById("desc").onkeyup = enterListener;
	
	document.getElementById("add-btn").onclick = addTask;
	document.getElementById("clear-btn").onclick = clearTaskInput;
}

function addTask(): void {
	let task: Task = getTaskFromPage();
	
	if (task) {
		displayTaskOnPage(task);
		clearTaskInput();
	}
}

function displayTaskOnPage(task: Task, saveTask: boolean = true): void {
	if (task.isCompleted()) {
		let completedItems: HTMLDivElement = <HTMLDivElement> document.getElementById("completed-items");
		completedItems.appendChild(task.getDiv(tasks, tasks.addTask(task)));
	} else {
		let incompleteItems: HTMLDivElement = <HTMLDivElement> document.getElementById("incomplete-items");
		incompleteItems.appendChild(task.getDiv(tasks, tasks.addTask(task)));
	}
	
	if (saveTask) {
		saveTasks();
	}
}

function clearTaskInput(): void {
	let name = <HTMLInputElement> document.getElementById("task-name");
	name.value = "";
	
	let desc = <HTMLInputElement> document.getElementById("desc");
	desc.value = "";
	
	(<HTMLSpanElement> document.getElementById("name-err")).innerText = "";
	(<HTMLSpanElement> document.getElementById("desc-err")).innerText = "";
}

function getTaskFromPage(): Task {
	let name: string = (<HTMLInputElement> document.getElementById("task-name")).value;
	let desc: string = (<HTMLInputElement> document.getElementById("desc")).value;
	
	if (!name) {
		let errSpan: HTMLSpanElement = <HTMLSpanElement> document.getElementById("name-err");
		errSpan.innerText = "*Task name is required";
	}
	
	if (!desc) {
		let errSpan: HTMLSpanElement = <HTMLSpanElement> document.getElementById("desc-err");
		errSpan.innerText = "*Task description is required";
	}
	
	if (name && desc)
		return new Task(name, desc);
	return null;
}

const TASK_STORAGE_KEY: string = "tasks";

function loadTasks(): void {
	if (typeof (Storage) !== "undefined") {
		let tasksString: string = localStorage.getItem(TASK_STORAGE_KEY);
		if (tasksString) {
			let taskArray: Task[] = JSON.parse(tasksString);
			taskArray.forEach(function(task: Task) {
				let newTask: Task = new Task(task.name, task.desc, task.completed);
				displayTaskOnPage(newTask, false);
			});
		}
	}
	//Consider adding else case via cookies
}

function saveTasks(): void {
	if (typeof (Storage) !== "undefined") {
		let taskArray: Task[] = [];
		tasks.forEach(function(task: Task) {
			taskArray.push(task);
		});
		
		localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskArray));
	}
	//Consider adding else case via cookies
}
