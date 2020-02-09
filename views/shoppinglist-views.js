const html_shared = require('./shared-html')

const img_url_list = () => {
    let html = `
    <div class='example-urls'>
        <p>copy-paste-urleja kuville</p>
        <ul>
            <li>https://upload.wikimedia.org/wikipedia/commons/a/a1/Tux2.png</li>
            <li>https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/200px-Adobe_Systems_logo_and_wordmark.svg.png</li>
            <li>https://upload.wikimedia.org/wikipedia/commons/9/94/Logo_oracle.jpg</li>
        </ul>
    </div>
    `
    html += html_shared.html_footer;
    return html;
}

const user_info_view = ((data) => {

    let html = html_shared.html_head;
    
    html += `
    <div class = "logged_in_container">
    <form action="/logout" method="POST">
        Logged in as user: ${data.user_name}
        <button type="submit" class="btn btn-danger">Log out</button></div>
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
        html += `<li><a href="/shoppinglist/${shoppinglist._id}">${shoppinglist.name}</a>
            <form action="delete-shoppinglist" method="POST">
                <input type="hidden" name="shoppinglist_id" value="${shoppinglist._id}">
                <button type="submit">Delete</button>
            </form>
        </li>`
    });

    html += `</div>`;
    html += html_shared.html_footer;
    
    return html;
});

const shoppinglist_items_view = ((data) => {
    let html = html_shared.html_head
    html += `
    <div>
    <div class = "shoppingListItems">
    <h1>Shopping list ${data.name} items, id ${data._id}</h1>

        <div>
            <form action="/add-shoppinglist-item" method="POST">
                <label for="item_name">Item name </label>
                <input type="text" name="item_name">
                
                <label for="item_quantity">Item quantity</label>
                <input type="number" name="item_quantity">

                <label for="item_image_url">Item image url</label>
                <input type="text" name="item_image_url">                
                
                <input type="hidden" name="shoppinglist_id" value="${data._id}">
                <button type="submit" class="btn-primary">Add</button>
            </form>
        </div>
    `;

     data.shoppinglist_items.forEach(item => {
         html += `
         <li>item: ${item.name} quantity: ${item.quantity} image: <img src="${item.image}" width="50px">
            <form action="/delete-shoppinglist-item" method="POST">
                <input type="hidden" name="shoppinglist_id" value="${data._id}">
                <input type="hidden" name="shoppinglist_item_id" value="${item._id}">
                <button type="submit">Delete</button>
            </form>
        </li>
        `
    });  

    html += `</div>`;
    html += img_url_list();

    return html;
})

module.exports.shoppinglists_view = shoppinglists_view;
module.exports.shoppinglist_items_view = shoppinglist_items_view;