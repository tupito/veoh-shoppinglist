const shoppinglists_view = ((data) =>{
    let html = `
    <div class = "info">
        Logged in as user: ${data.user_name}
        <form action="/logout" method="POST">
            <button type="submit" class="btn-danger">Log out</button>
        </form>
    </div>

    <div class = "shoppingLists">
    <h1>User's ${data.user_name} shoppingLists</h1>
    
    <div>
      <form action="/add-shoppinglist" method="POST">
          <input type="text" name="name">
          <button type="submit" class="btn-primary">Add shopping list</button>
      </form>
    </div>
    `;

    return html;
});

module.exports.shoppinglists_view = shoppinglists_view;