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

    <!-- TODO FOREACH SHOPPINGLISTS -->
    
    <div>
      <form action="/add-shoppinglist" method="POST">
          <label for="shoppinglist_name">New shoppinglist</label>
          <input type="text" name="shoppinglist_name">
          <button type="submit" class="btn-primary">Add</button>
      </form>
    </div>
    `;

    return html;
});

module.exports.shoppinglists_view = shoppinglists_view;