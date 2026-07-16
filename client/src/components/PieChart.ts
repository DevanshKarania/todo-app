import Chart from "chart.js/auto";
import { Todo } from "../types/Todo";

let chart: Chart | null = null;

export function renderPieChart(todos: Todo[]): void {
    const canvas = document.querySelector<HTMLCanvasElement>(".todo-chart");
    if (!canvas) return;

    if (chart) {
        chart.destroy();
    }

    const today = new Date().toISOString().split("T")[0];

    const completed = todos.filter(todo => todo.completed).length;
    const pending = todos.length - completed;
    const overdue = todos.filter(todo => !todo.completed && todo.dueDate < today).length;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Could not get canvas context");
        return;
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Completed", "Pending", "Overdue"],
            datasets: [{
                data: [completed, pending, overdue],
                backgroundColor: ["#4CAF50", "#f35f09", "#ff0000"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}