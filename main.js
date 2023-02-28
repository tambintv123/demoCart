let productList = [];
let cartList = [];
getProduct();

// Hàm call API từ data
function getProduct() {
  axios({
    method: "GET",
    url: "https://63f2d93b4f17278c9a2cedf5.mockapi.io/api/products",
  }).then((response) => {
    productList = response.data;
    console.log(productList);
    console.log(response.data);
    renderProducts(response.data);
  });
}

const getEle = (id) => document.getElementById(id);

const renderProducts = (array) => {
  let html = array.reduce((res, val) => {
    return (
      res +
      `
        <div class="col-4">
          <div class="card" style="width: 18rem">
            <div class="card-body">
              <h5 class="card-title">${val.name}</h5>
              <p class="card-text">
               ${val.price}
              </p>
              <button class="btn btn-success" data-toggle="modal" data-target="#myModal" onclick="addToCart('${val.id}')">Add to Cart</button>
            </div>
          </div>
        </div>
        `
    );
  }, "");
  getEle("renderProduct").innerHTML = html;
};

// render gio hang
const renderCartItem = () => {
  if (cartList.length > 0) {
    const res = cartList.reduce((res, val) => {
      return (
        res +
        `
              <tr>
      
                  <td>${val.name}</td>
                  <td>
                    <div style="width:100px">
                        <button type='button' class='btn decrease' onclick="decrease('${
                          val.id
                        }')">-</button>
                            <span> ${val.quantity < 1 ? 1 : val.quantity}</span>
                        <button type='button' class='btn increase' onclick="increase('${
                          val.id
                        }')">+</button>
                    </div>
                  </td>
                  <td>$${val.price.toLocaleString()}</td>
    
                  <td>$${(val.quantity < 1
                    ? val.price
                    : val.quantity * val.price
                  ).toLocaleString()}</td>
                  <td>
                      <button class='btn btn-danger' onclick="removeProduct('${
                        val.id
                      }')">Remove</button>
                  </td>
              </tr>
              `
      );
    }, "");
    getEle("itemList").innerHTML = res;
  } else {
    getEle("itemList").innerHTML = "";
  }
};

// add item vao gio hang
function addToCart(id) {
  const cartItem = productList.filter((item) => item.id === id);
  console.log(cartItem[0].id);
  let item = new CartItem(
    cartItem[0].id,
    cartItem[0].name,
    cartItem[0].price,
    1
  );

  // check xem item them vao co trong mang cua gio hang chua.
  // neu chua thi add vao
  // neu roi thi tang so luong
  if (!cartList.some((val) => val.id === id)) {
    cartList.push(item);
  } else {
    let index = cartList.findIndex((val) => val.id === id);
    cartList[index].quantity += 1;
  }

  setLocal();
  renderCartItem();
  getCount();
}

// luu vao localStorage
function setLocal() {
  localStorage.setItem("listCart", JSON.stringify(cartList));
}

// lay item tu localStorage
function getLocal() {
  let cartList = localStorage.getItem("listCart");
  if (cartList === null) return;
  return cartList;
}

/// giam so luong
function decrease(id) {
  let index = cartList.findIndex((item) => item.id === id);
  if (index === -1) return;

  cartList[index].quantity -= 1;
  renderCartItem();
  getCount();
}

// tang so luong
function increase(id) {
  let index = cartList.findIndex((item) => item.id === id);
  if (index === -1) return;
  cartList[index].quantity += 1;
  renderCartItem();
  getCount();
}

// xoa khoi gio hang
function removeProduct(id) {
  cartList = cartList.filter((item) => item.id !== id);
  setLocal();
  renderCartItem();
  getCount();
}

// dem so luong trong gio hang hien thi len UI
function getCount() {
  let count = cartList.reduce((res, val) => res + val.quantity, 0);
  getEle("count").innerHTML = count <= 0 ? 0 : count;
}

getCount();
