export function Login(): string {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h1>Todo Manager</h1>
                <h2>Login</h2>

                <input id="login-username" type="text" placeholder="Username">

                <input id="login-password" type="password" placeholder="Password">

                <button id="login-btn">
                    Login
                </button>

                <p class="auth-text">
                    Don't have an account?
                    <a href="#" id="show-register">
                        Register
                    </a>
                </p>
            </div>
        </div>
    `;
}