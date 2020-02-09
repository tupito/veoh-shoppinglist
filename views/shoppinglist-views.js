const user_info_view = ((data) => {
    let html = `
    <div class = "info">
    Logged in as user: ${data.user_name}
    <form action="/logout" method="POST">
        <button type="submit" class="btn-danger">Log out</button>
    </form>
    </div>
    `
    return html;
})

const shoppinglists_view = ((data) =>{
    let html = user_info_view(data)
    
    html += `
    <div>
      <form action="/add-shoppinglist" method="POST">
          <label for="shoppinglist_name">New shoppinglist</label>
          <input type="text" name="shoppinglist_name">
          <button type="submit" class="btn-primary">Add</button>
      </form>
    </div>

    <div class = "shoppingLists">
    <h1>User's ${data.user_name} shoppingLists</h1>
    `;

    data.shoppinglists.forEach(shoppinglist => {
        console.log(shoppinglist)
        html += `<li><a href="/shoppinglist/${shoppinglist._id}">${shoppinglist.name}</a>
            <form action="delete-shoppinglist" method="POST">
                <input type="hidden" name="shoppinglist_id" value="${shoppinglist._id}">
                <button type="submit">Delete</button>
            </form>
        </li>`
    });

    html += `</div>`;
    
    return html;
});

const shoppinglist_items_view = ((data) => {

    console.log(data)

    let html = `
    <div>
    <div class = "shoppingListItems">
    <h1>Shopping list ${data.name} items, id ${data._id}</h1>

        <div>
            <form action="/add-shoppinglist-item" method="POST">
                <label for="item_name">Item name </label>
                <input type="text" name="item_name">
                
                <label for="item_quantity">Item quantity</label>
                <input type="number" name="item_quantity">
                
                <input type="hidden" name="shoppinglist_id" value="${data._id}">
                <button type="submit" class="btn-primary">Add</button>
            </form>
        </div>
    `;

     data.shoppinglist_items.forEach(item => {
        console.log(item)
         html += `
         <li>item: ${item.name} quantity: ${item.quantity}
            <form action="delete-shoppinglist" method="POST">
                <input type="hidden" name="shoppinglist_id" value="${item._id}">
                <button type="submit">Delete</button>
            </form>
        </li>`
    });  

    html += `</div>`;

    return html;
})

module.exports.shoppinglists_view = shoppinglists_view;
module.exports.shoppinglist_items_view = shoppinglist_items_view;