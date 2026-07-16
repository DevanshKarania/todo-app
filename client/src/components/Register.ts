export function Register(): string {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h1>Todo Manager</h1>
                <h2>Create Account</h2>

                <input id="register-username" type="text" placeholder="Username">

                <input id="register-password" type="password" placeholder="Password">

                <button id="register-btn">
                    Register
                </button>

                <p class="auth-text">
                    Already have an account?
                    <a href="#" id="show-login">
                        Login
                    </a>
                </p>

            </div>

        </div>
    `;
}