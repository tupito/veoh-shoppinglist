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
    <div class = "shoppinglist-list-container">
    <h2>User's ${data.user_name} shopping lists</h2>

    <form action="/add-shoppinglist" method="POST">
    <div class="list-grid-2-col">
        <div class="grid-item">
            <input type="text" name="shoppinglist_name" placeholder="New shoppinglist...">
        </div>
        <div class="grid-item">
            <button type="submit" class="btn btn-primary">Add</button>
        </div>
    </div>
    </form>
    `;

    data.shoppinglists.forEach(shoppinglist => {
        html += `
        <form action="delete-shoppinglist" method="POST">
        <div class="list-grid-2-col">
            <input type="hidden" name="shoppinglist_id" value="${shoppinglist._id}">
            <div class="grid-item">
                <a href="/shoppinglist/${shoppinglist._id}">${shoppinglist.name}</a>
            </div>
            <div class="grid-item">
                <button type="submit" class="btn btn-danger">Delete</button>
            </div>
        </div>
        </form>`
    });

    html += `</div>`;
    html += html_shared.html_footer;
    
    return html;
});

const shoppinglist_items_view = ((data) => {
    let html = html_shared.html_head
    html += `
    <div class = "shoppinglist-list-container">
    <h2>Shoppinglist: ${data.name}</h2>
    <h3>New item</h3>
    <form action="/add-shoppinglist-item" method="POST">
    <input type="hidden" name="shoppinglist_id" value="${data._id}">
        <div class="list-grid-2-col">
            <div class="grid-item">
                <label for="item_name">Item name </label>
            </div>

            <div class="grid-item"> 
                <input type="text" name="item_name">
            </div>
                
            <div class="grid-item">
                <label for="item_quantity">Item quantity</label>
            </div>

            <div class="grid-item">
                <input type="number" name="item_quantity">
            </div>

            <div class="grid-item">
                <label for="item_image_url">Item image url</label>
            </div>

            <div class="grid-item">
                <input type="text" name="item_image_url">
            </div>
                
            <div class="grid-item">
                <button type="submit" class="btn btn-primary">Add</button>
            </div>
        </div>
    </form>
    <hr>
    <h3>items</h3>
    `;

     data.shoppinglist_items.forEach(item => {
        html += `
        <form action="/delete-shoppinglist-item" method="POST">
        <input type="hidden" name="shoppinglist_id" value="${data._id}">
        <input type="hidden" name="shoppinglist_item_id" value="${item._id}">

        <div class="list-grid-4-col">
            <div class="grid-item"><img src="${item.image}" height="30px"></div>
            <div class="grid-item">${item.name}</div>
            <div class="grid-item">${item.quantity}</div>
            <div class="grid-item">
                <button class="btn btn-primary">+</button>
                <button class="btn btn-primary">-</button>
                <button type="submit" class="btn btn-danger">Delete</button>
            </div>
        </div>
        </form>
        `
    });  

    html += `</div>`;
    html += img_url_list();

    return html;
})

module.exports.shoppinglists_view = shoppinglists_view;
module.exports.shoppinglist_items_view = shoppinglist_items_view;