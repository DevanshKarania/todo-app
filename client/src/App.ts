import { Header } from "./components/Header";
import { ProgressBar } from "./components/ProgressBar";
import { TodoForm } from "./components/TodoForm";
import { Todo } from "./types/Todo";
import { TodoCard } from "./components/TodoCard";

export function App(todos: Todo[], searchQuery = "", currentFilter = "all"): string {
    const completed = todos.filter(todo => todo.completed).length;
    const username = localStorage.getItem("username") ?? "User";
    
    const filteredTodos = todos.filter(todo => todo.title.toLowerCase().includes(searchQuery.toLowerCase().trim())).filter(todo => {
        if (currentFilter === "active") {
            return !todo.completed;
        }
        if (currentFilter === "completed") {
            return todo.completed;
        }
        if(currentFilter === "overdue"){
            return !todo.completed && todo.dueDate < today;
        }
        return true;
    });

    const today = new Date().toISOString().split("T")[0];

    filteredTodos.sort((a, b) => {
        if (a.completed !== b.completed) {
            return Number(a.completed) - Number(b.completed);
        }

        const overdueA = !a.completed && a.dueDate < today;
        const overdueB = !b.completed && b.dueDate < today;

        if (overdueA !== overdueB) {
            return overdueA ? -1 : 1;
        }

        return a.dueDate.localeCompare(b.dueDate);
    });

    return `
        <div class="app">
            ${Header(username)}
            ${ProgressBar(completed, todos.length)}
            <section class="chart-section">
                <canvas class="todo-chart"></canvas>
            </section>
            ${TodoForm(searchQuery, currentFilter)}

             <section id="todo-list" class="todo-list">
                ${filteredTodos.length === 0
            ? `
                            <div class="empty-state">
                                <h2>No Tasks to be shown</h2>
                                <p>Try another search or filter.</p>
                            </div>
                          `
            : filteredTodos.map(todo => TodoCard(todo)).join("")
        }
            </section>
        </div>
    `;
}