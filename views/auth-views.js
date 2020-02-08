const login_view = () => {
    let html = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
            <link rel="stylesheet" type="text/css" href="./style.css">
            <title>ShoppinglistApp</title>
        </head>
        <body>
            <div id="login_reg_container">
                <form action="/login" method="POST">
                    <label for="log_user">Login</label>
                    <input type="text" name="username" id="log_user">
                    <button type="submit" class="btn-primary">Log in</button>
                </form>
                <form action="/register" method="POST">
                    <label for="reg_user">Register</label>
                    <input type="text" name="username" id="reg_user">
                    <button type="submit" class="btn-primary">Register</button>
                </form>
            </div>
        </body>
        </html>
    `;

    return html;
}

module.exports.login_view = login_view;