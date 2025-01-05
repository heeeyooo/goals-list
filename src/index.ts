import { v4 as uuidV4 } from "uuid";

type Task = {
    slice(index: any, arg1: number): unknown;
    id: string;
    title: string;
    completed: boolean;
    notCompleted: boolean;
    createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");

let tasks: Task[] = loadTasks();

tasks.forEach(addListItem);

// tasks.forEach((task) => {
//     addListItem(task);
// });

form?.addEventListener("submit", () => {
    // e.preventDefault();

    if (input?.value == "" || input?.value == null) return;

    const newTask: Task = {
        id: uuidV4(),
        title: input.value,
        completed: false,
        notCompleted: false,
        createdAt: new Date(),
        slice: function (index: any, arg1: number): unknown {
            throw new Error("Function not implemented.");
        },
    };
    tasks.unshift(newTask);
    saveTasks();

    addListItem(newTask);

    input.value = "";
});
function addListItem(task: Task) {
    const item = document.createElement("li");
    const checkbox = document.createElement("input");
    const checkboxX = document.createElement("input");
    const div = document.createElement("div");
    const label = document.createElement("label");
    const labelX = document.createElement("label");
    const span = document.createElement("span");
    const spanX = document.createElement("span");
    item.classList.add("item");
    checkbox.classList.add("checkbox");
    checkboxX.classList.add("checkbox-x");

    function refreshColor() {
        tasks.forEach((task) => {
            if (task.notCompleted) {
                item.classList.add("item--not-completed");
            } else if (task.completed) {
                item.classList.add("item--completed");
            } else if (!task.notCompleted && !task.completed) {
                item.classList.remove("item--not-completed");
                item.classList.remove("item--completed");
            }
        });
    }

    refreshColor();

    // checkbox.addEventListener('click', () => {
    //         const target: EventTarget | null = event.target;
    //         const outer: HTMLLIElement | null = target?.closest(".item");
    //         outer?.remove();
    //         saveTasks();
    // })

    span.classList.add("custom-check");
    spanX.classList.add("custom-check-x");

    const spanText = document.createElement("span");

    spanText.classList.add("span-text");

    div.classList.add("checkbox-container");

    label.classList.add("label");
    labelX.classList.add("label-x");

    // removeBtn.addEventListener("click", (event) => {
    //     const target: EventTarget | null = event.target;
    //     const outer: HTMLLIElement | null = target?.closest(".item");
    //     outer?.remove();
    //     saveTasks();
    // });

    // document.querySelectorAll(".remove-btn").forEach((btn, index) => {
    //     btn.addEventListener("click", () => {
    //         tasks.splice(index, 1);
    //         saveTasks();
    //         console.log("hello");
    //     });
    // });

    document.querySelectorAll(".checkbox").forEach((check) => {
        check.addEventListener("change", () => {
            task.completed = check.checked;
            saveTasks();
            refreshColor();
        });
    });

    // checkbox.addEventListener("change", () => {
    //     // tasks.forEach((task) => {
    //     //     if (task.completed) {
    //     //         item.classList.remove("item--not-completed");
    //     //     } else {
    //     //         item.classList.remove("item--completed");
    //     //     }
    //     // });
    //     task.completed = checkbox.checked;
    //     saveTasks();
    //     refreshColor();
    // });
    checkboxX.addEventListener("change", () => {
        // tasks.forEach((task) => {
        //     if (task.notCompleted) {
        //     }
        // });

        task.notCompleted = checkboxX.checked;

        saveTasks();
        refreshColor();
    });
    checkbox.type = "checkbox";
    checkboxX.type = "checkbox";
    label.append(checkbox, span);
    labelX.append(checkboxX, spanX);
    checkbox.checked = task.completed;
    checkboxX.checked = task.notCompleted;
    div.append(label, labelX);
    spanText.append(task.title);
    item.append(spanText, div);
    list?.append(item);
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS");
    if (taskJSON == null) return [];
    return JSON.parse(taskJSON);
}
