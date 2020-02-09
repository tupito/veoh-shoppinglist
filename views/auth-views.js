const html_shared = require('./shared-html')

const login_view = () => {

    let html = html_shared.html_head;
    html += `
    <div class="login_container">
        <form action="/login" method="POST">
            <div class="login_grid">
                <div class="grid-item">
                    <label for="log_user">Login</label>
                </div>
                <div class="grid-item">
                    <input type="text" name="username" id="log_user">
                </div>
                <div class="grid-item">
                    <button type="submit" class="btn btn-primary">Log in</button>
                </div>
            </div>
        </form>
        <form action="/register" method="POST">
            <div class="login_grid">
                <div class="grid-item">
                    <label for="reg_user">Register</label>
                </div>
                <div class="grid-item">
                    <input type="text" name="username" id="reg_user">
                </div>
                <div class="grid-item">                   
                    <button type="submit" class="btn btn-primary">Register</button>
                </div>
            </div>
        </form>
    </div>
    `;

    return html;
}

module.exports.login_view = login_view;