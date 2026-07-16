export function TodoForm(searchQuery = "", currentFilter = "all"): string {
    return `
        <section class="todo-form">
            <input id="task-input" type="text" placeholder="enter your task">

            <input id="due-date" type="date">

            <button class="add-buttons" id="add-task" type="button">Add Task</button>
        </section>

        <section class="toolbar">
            <input id="search-task" class="search-input" type="text" placeholder="Search Tasks" value="${searchQuery}">

            <select id="filter-status">
                <option value="all" ${currentFilter === "all" ? "selected" : ""} >All</option>
                <option value="active" ${currentFilter === "active" ? "selected" : ""}>Active</option>
                <option value="completed" ${currentFilter === "completed" ? "selected" : ""}>Completed</option>
            </select>
        </section>
    `;
}