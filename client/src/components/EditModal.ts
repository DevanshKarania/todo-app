import { Todo } from "../types/Todo";
export function EditModal(todo: Todo): string {
    return `
        <div id="edit-modal" class="modal">
            <div class="modal-content">
                <h2>Edit Task</h2>
                <label>Title</label>

                <input id="edit-title" type="text" value="${todo.title}">

                <label>Due Date</label>

                <input id="edit-due-date" type="date" value="${todo.dueDate.split("T")[0]}">

                <div class="modal-buttons">
                    <button id="cancel-edit" type="button">
                        Cancel
                    </button>

                    <button id="save-edit" type="button">
                        Save
                    </button>
                </div>
            </div>
        </div>
    `;
}