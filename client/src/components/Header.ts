import { ThemeToggle } from "./ThemeToggle";

export function Header(username: string): string {
    return `
        <header class="header">
            <h1 class="title">Todo Manager</h1>

            <div class="header-actions">
                <span class="username">Welcome, ${username}</span>
                <button id="logout-btn" class="logout-btn">Logout</button>
                ${ThemeToggle()}
            </div>
        </header>
    `;
}