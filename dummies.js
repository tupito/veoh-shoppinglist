const shoppingLists = () => {
  let list = [];
  let item = {
    user: "asdf",
    shoppingLists: [
      {
        id: "1",
        name: "ruokakauppa",
        items: [
          { name: "kurkku", quantity: 2 },
          { name: "tomaatti", quantity: 5 }
        ]
      },
      {
        id: "2",
        name: "muut kaupat",
        items: [
          { name: "paska", quantity: 55 },
          { name: "lapio", quantity: 5 }
        ]
      }
    ]
  };

  let item2 = {
    user: "qwer",
    shoppingLists: [
      {
        id: "3",
        name: "atk-kauppa",
        items: [
          { name: "qwerty", quantity: 5 },
          { name: "wasd", quantity: 4 }
        ]
      }
    ]
  };

  list.push(item);
  list.push(item2);

  return list;
};

const users = () => {
  let users = [];
  shoppingLists().forEach(element => {
    users.push(element.user);
  });
  return users;
};

exports.shoppingLists = shoppingLists;
exports.users = users;
