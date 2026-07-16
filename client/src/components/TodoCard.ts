import { Todo } from "../types/Todo";

export function TodoCard(todo: Todo): string {
    const today = new Date().toISOString().split("T")[0];
    const overdue = !todo.completed && todo.dueDate < today;

    return `
        <article class="todo-card ${todo.completed ? "completed" : ""} ${overdue ? "overdue" : ""}">
            <div class="left">
                <input class="complete-checkbox" data-id="${todo.id}" type="checkbox" ${todo.completed ? "checked" : ""}>
                <div>
                    <h3>${todo.title}</h3>
                    <div>
                        <span class="badge">${todo.dueDate}</span>

                        ${todo.completed
            ? `<span class="status completed-badge">completed</span>`
            : `<span class="status active-badge">active</span>`
        }
                    </div>
                </div>
            </div>

            <div class="todo-actions">
                <button class="edit-btn" data-id="${todo.id}">Edit</button>
                <button class="delete-btn" data-id="${todo.id}">Delete</button>
            </div>
        </article>
    `;
}