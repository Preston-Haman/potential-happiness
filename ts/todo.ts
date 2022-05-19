
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
	
	public getDiv(): HTMLDivElement {
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
			//Do I have to delete thisDiv, now?
			
			displayTaskOnPage(thisTask);
		}
		return div;
	}
}

let tasks: Task[] = [];

window.onload = function() {
	loadTasks();
	let enterListener: (this: GlobalEventHandlers, e: KeyboardEvent) => any = function(e: KeyboardEvent) {
		if (e.key === "Enter") {
			addTask();
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
		tasks.push(task);
		displayTaskOnPage(task);
		clearTaskInput();
	}
}

function displayTaskOnPage(task: Task): void {
	if (task.isCompleted()) {
		let completedItems: HTMLDivElement = <HTMLDivElement> document.getElementById("completed-items");
		completedItems.appendChild(task.getDiv());
	} else {
		let incompleteItems: HTMLDivElement = <HTMLDivElement> document.getElementById("incomplete-items");
		incompleteItems.appendChild(task.getDiv());
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

function loadTasks(): void {
	//TODO: Load tasks from local storage and place into tasks array
	tasks.forEach(displayTaskOnPage);
}

function saveTasks(): void {
	//TODO: Save tasks to local storage
}
