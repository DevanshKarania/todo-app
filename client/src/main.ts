import "./styles/animations.css"
import "./styles/components.css"
import "./styles/main.css"
import "./styles/variables.css"

import { App } from "./App";
import { Todo } from "./types/Todo";
import { getTodos, addTodo as addTodoAPI, updateTodo as updateTodoAPI, deleteTodo as deleteTodoAPI, patchTodo as patchTodoAPI } from "./services/todoService";
import { renderPieChart } from "./components/PieChart";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { login as loginAPI, register as registerAPI } from "./services/authService";
import { EditModal } from "./components/EditModal";

const root = document.querySelector<HTMLDivElement>("#app");

let todos: Todo[] = [];
let currentFilter = "all";
let searchQuery = "";
let currentPage: "login" | "register" = "login";
let editingTodo: Todo | null = null;

function renderAuth(): void {
  if (!root) return;

  if (currentPage === "login") {
    root.innerHTML = Login();
  } else {
    root.innerHTML = Register();
  }

  attachAuthEvents();
}

function attachAuthEvents(): void {
  const showRegister = document.querySelector("#show-register");

  showRegister?.addEventListener("click", (event) => {
    event.preventDefault();
    currentPage = "register";
    renderAuth();
  });

  const showLogin = document.querySelector("#show-login");

  showLogin?.addEventListener("click", (event) => {
    event.preventDefault();
    currentPage = "login";
    renderAuth();
  });

  const loginButton = document.querySelector<HTMLButtonElement>("#login-btn");
  console.log(loginButton);
  loginButton?.addEventListener("click", login);

  const registerButton = document.querySelector<HTMLButtonElement>("#register-btn");
  registerButton?.addEventListener("click", register);
}

function render(): void {
  if (!root) return;
  root.innerHTML =
    App(
      todos,
      searchQuery,
      currentFilter
    ) +
    (editingTodo
      ? EditModal(editingTodo)
      : "");

  attachEvents();

  const today = new Date().toISOString().split("T")[0];

  const filteredTodos = todos
    .filter(todo =>
      todo.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim())
    )
    .filter(todo => {

      if (currentFilter === "active")
        return !todo.completed;

      if (currentFilter === "completed")
        return todo.completed;

      if (currentFilter === "overdue")
        return !todo.completed &&
          todo.dueDate < today;

      return true;

    });

  renderPieChart(filteredTodos);

  const searchInput = document.querySelector<HTMLInputElement>("#search-task");

  if (searchInput) {
    searchInput.focus();
    searchInput.selectionStart = searchInput.value.length;
    searchInput.selectionEnd = searchInput.value.length;
  }
}

function attachEvents(): void {
  const addButton = document.querySelector<HTMLButtonElement>("#add-task");
  addButton?.addEventListener("click", addTodo);

  document.querySelectorAll<HTMLInputElement>(".complete-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const id = Number(checkbox.dataset.id);
      toggleTodo(id);
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      deleteTodo(id);
    });
  });

  const searchInput = document.querySelector<HTMLInputElement>("#search-task");

  searchInput?.addEventListener("input", (event) => {
    searchQuery = (event.target as HTMLInputElement).value;
    render();
  });

  const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      editTodo(id);
    });
  });

  const filterSelect = document.querySelector<HTMLSelectElement>("#filter-status");
  filterSelect?.addEventListener("change", (event) => {
    currentFilter = (event.target as HTMLSelectElement).value;
    render();
  });

  const logoutButton = document.querySelector<HTMLButtonElement>("#logout-btn");
  logoutButton?.addEventListener("click", logout);

  const cancel = document.querySelector("#cancel-edit");
  cancel?.addEventListener("click", () => {
    editingTodo = null;
    render();
  });

  const save = document.querySelector("#save-edit");
  save?.addEventListener("click", saveEdit);
}

function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  todos = [];
  searchQuery = "";
  currentFilter = "all";
  currentPage = "login";
  renderAuth();
}

async function addTodo(): Promise<void> {
  const taskInput = document.querySelector<HTMLInputElement>("#task-input");
  const dueDateInput = document.querySelector<HTMLInputElement>("#due-date");

  if (!taskInput || !dueDateInput) return;

  const title = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (title == "") {
    alert("Enter a task");
    return;
  }
  if (dueDate == "") {
    alert("Enter a due-date");
    return;
  }

  const todo: Todo = {
    id: 0,
    title,
    completed: false,
    dueDate
  };

  try {
    await addTodoAPI(todo);

    taskInput.value = "";
    dueDateInput.value = "";

    await loadTodos();
  }
  catch (error) {
    console.log(error);
    alert("Failed to add task");
  }
}

async function toggleTodo(id: number): Promise<void> {
  const todo = todos.find(t => t.id === id);

  if (!todo) return;

  const updatedTodo: Todo = {
    ...todo,
    completed: !todo.completed
  };

  try {
    await updateTodoAPI(updatedTodo);
    await loadTodos();
  } catch (error) {
    console.error(error);
    alert("Failed to update task.");
  }
}

async function deleteTodo(id: number): Promise<void> {
  try {
    await deleteTodoAPI(id);
    await loadTodos();
  } catch (error) {
    console.error(error);
    alert("Failed to delete task.");
  }
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

async function loadTodos(): Promise<void> {
  try {
    todos = await getTodos();
    render();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      currentPage = "login";
      renderAuth();
      return;
    }

    console.error(error);
    alert("Failed to load todos");
  }
}

async function editTodo(id: number): Promise<void> {
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return;
  }
  editingTodo = todo;
  render();
}

async function login(): Promise<void> {
  try {
    const username = document.querySelector<HTMLInputElement>("#login-username");
    const password = document.querySelector<HTMLInputElement>("#login-password");

    if (!username || !password) {
      return;
    }

    if (username.value.trim() === "" || password.value.trim() === "") {
      alert("Please enter both username and password.");
      return;
    }

    const result = await loginAPI(username.value, password.value);

    if (!result.success) {
      alert(result.message);
      return;
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.user.username);

    await loadTodos();
  } catch (error) {
    console.error(error);
    alert("Login failed. Please try again.");
  }
}

async function register(): Promise<void> {
  const username = document.querySelector<HTMLInputElement>("#register-username");
  const password = document.querySelector<HTMLInputElement>("#register-password");

  if (!username || !password) return;

  if (username.value.trim() === "" || password.value.trim() === "") {
    alert("Please enter both username and password.");
    return;
  }

  const result = await registerAPI(username.value, password.value);

  if (!result.success) {
    alert(result.message);
    return;
  }

  alert("Registration successful!");
  currentPage = "login";
  renderAuth();
}

function initializeApp(): void {
  const token = localStorage.getItem("token");
  if (token) {
    loadTodos();
  } else {
    renderAuth();
  }
}

async function saveEdit(): Promise<void> {

  if (!editingTodo) return;

  const title =
    document.querySelector<HTMLInputElement>(
      "#edit-title"
    );

  const dueDate =
    document.querySelector<HTMLInputElement>(
      "#edit-due-date"
    );

  if (!title || !dueDate) return;

  await patchTodoAPI(
    editingTodo.id,
    title.value,
    dueDate.value
  );

  editingTodo = null;
  await loadTodos();
}

initializeApp();