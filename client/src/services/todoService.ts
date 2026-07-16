import { Todo } from "../types/Todo";

const API_URL = `${import.meta.env.VITE_API_URL}/todos`;

function getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

export async function getTodos(): Promise<Todo[]> {
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }

    const result = await response.json();

    return result.data.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        completed: Boolean(todo.completed),
        dueDate: todo.due_date
    }));
}

export async function addTodo(todo: Todo): Promise<void> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            title: todo.title,
            completed: todo.completed,
            due_date: todo.dueDate.split("T")[0]
        })
    });

    if (!response.ok) {
        throw new Error("Failed to Create Todos");
    }
}

export async function updateTodo(todo: Todo): Promise<void> {
    const response = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
            title: todo.title,
            completed: todo.completed,
            due_date: todo.dueDate.split("T")[0]
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update Todo");
    }
}

export async function deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to Delete Todo");
    }
}

export async function patchTodo(id: number, title: string, dueDate: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
            title,
            due_date: dueDate
        })
    });

    if (!response.ok) {
        throw new Error("Failed to edit task");
    }
}