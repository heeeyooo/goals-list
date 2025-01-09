// import { v4 as uuidV4 } from "uuid";
import dayjs from "dayjs";

const today = dayjs();

const formatDate = today.format("D/M/YY");

console.log(typeof formatDate);

type Task = {
    // id: string;
    title: string;
    completed: boolean;
    notCompleted: boolean;
    createdAt: string;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");

let tasks: Task[] = loadTasks();

form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input?.value == "" || input?.value == null) return;

    const newTask: Task = {
        // id: uuidV4(),
        title: input.value,
        completed: false,
        notCompleted: false,
        createdAt: formatDate,
    };
    tasks.unshift(newTask);
    saveTasks();

    renderData();
    // addListItem(newTask);

    input.value = "";
});

function renderData() {
    let listHTML = "";

    tasks.forEach((taskItem) => {
        const { title, completed, notCompleted, createdAt } = taskItem;
        let HTML = `
<li class="item"><span class="span-text">${title}</span>
<span class="created-at">${createdAt}</span>
<div class="checkbox-container">
<label class="label"><input class="checkbox" type="checkbox" ${
            completed == true ? "checked" : ""
        }"><span class="custom-check"></span></label>
<label class="label-x"><input class="checkbox-x" type="checkbox" ${
            notCompleted == true ? "checked" : ""
        }"><span class="custom-check-x"></span></label>
</div>
</li>
    `;
        listHTML += HTML;
    });

    list!.innerHTML = listHTML;

    document
        .querySelectorAll<HTMLInputElement>(".checkbox")
        .forEach((el, index) => {
            el.addEventListener("change", () => {
                tasks[index].notCompleted = false;
                el.closest(".item")?.classList.remove("item--not-completed");

                if (!tasks[index].completed) {
                    tasks[index].completed = el.checked;

                    el.closest(".item")?.classList.add("item--completed");
                } else {
                    tasks[index].completed = el.checked;

                    el.closest(".item")?.classList.remove("item--completed");
                }
                saveTasks();
            });
        });

    document
        .querySelectorAll<HTMLInputElement>(".checkbox-x")
        .forEach((el, index) => {
            el.addEventListener("change", () => {
                tasks[index].completed = false;
                el.closest(".item")?.classList.remove("item--completed");

                if (!tasks[index].notCompleted) {
                    tasks[index].notCompleted = el.checked;

                    el.closest(".item")?.classList.add("item--not-completed");
                } else {
                    tasks[index].notCompleted = el.checked;

                    el.closest(".item")?.classList.remove(
                        "item--not-completed"
                    );
                }
                saveTasks();
            });
        });

    document
        .querySelectorAll<HTMLInputElement>(".checkbox")
        .forEach((el, index) => {
            if (tasks[index].completed) {
                el.closest(".item")?.classList.add("item--completed");
            } else {
                el.closest(".item")?.classList.remove("item--completed");
            }
        });

    document
        .querySelectorAll<HTMLInputElement>(".checkbox-x")
        .forEach((el, index) => {
            if (tasks[index].notCompleted) {
                el.closest(".item")?.classList.add("item--not-completed");
            } else {
                el.closest(".item")?.classList.remove("item--not-completed");
            }
        });
}

renderData();

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS");
    if (taskJSON == null) return [];
    return JSON.parse(taskJSON);
}
