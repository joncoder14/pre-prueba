const form = document.getElementById("form");
const container = document.getElementById("container");
const countentContainer = container.innerHTML;
const client = document.getElementById("client");

let savedUser = JSON.parse(localStorage.getItem("user"));
console.log(savedUser)
if(savedUser?.role === "client") {
  await renderClient()
} else if (savedUser?.role === "seller" || savedUser?.role === "admin") {
  await renderSellerorAdmin(savedUser.role)
  console.log("hola")
}

async function getProducts() {
  try {
    const respone = await fetch("http://localhost:3000/products");
    const data = await respone.json();
    return data;
  } catch (error) {
    console.log("error:", error);
  }
}

async function addNewProduct(product) {
  const respone = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
}

async function editProduct(product, id) {
  const respone = await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stock: Number(product.stock),
      price: Number(product.price),
    }),
  });
}

async function deleteProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  });
}

async function renderClient() {
  const products = await getProducts();
  client.innerHTML = ` <div class="fixed w-full bg-orange-500 flex justify-between items-center p-7  items-center">
    <h1 class="text-3xl">shooping</h1>
    <div class="flex justify-evenly md:justify-between w-35">
       <button>
        <img class="size-8" src="assets/carShop.png" alt="carrito" />
       </button>
      <button type=button id = "btn-logout"
      class="bg-slate-700 p-1 text-neutral-100 rounded-lg"
      >logout</button>
    </div>
  </div>
   `;
  let containerProduct = document.createElement("div");
  containerProduct.className =
    "pt-40 bg-slate-400 grid grid-col-1 md:grid-cols-2 gap-15 p-10 lg:grid-cols-3 ";
  containerProduct.innerHTML = ``;
  for (let product of products) {
    containerProduct.innerHTML += `
    
          <article class="bg-slate-200 flex flex-col border w-full justify-center items-center  p-5 gap-2 rounded-lg">
            <img class="size-50 " src="${product.url}" alt="product">
            <h1 class="text-xl" >${product.type}</h1>
            <div class="flex justify-between w-35">
              <div><p class="text-neutral-600">stock:${product.stock}</p></div>
              <div><p class="text-neutral-600">price:${product.price}</p></div>
            </div>
            <p class="text-justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis illum distinctio vero voluptatem deleniti hic necessitatibus harum nesciunt laudantium neque officiis qui similique aliquid, accusantium veritatis? Beatae maxime enim consequatur.</p>
            <div class="felx flex-col gap-3 flex justify-between w-full pt-4">
              <button class="p-1 rounded bg-blue-300 w-full rounded-lg active:bg-blue-500 active:text-slate-100 active:scale-110 transition  hover:bg-blue-500 hover:text-slate-100 hover:scale-110 transition">add</button>
                <button class="p-1 rounded bg-lime-300 w-full rounded-lg active:bg-lime-500 active:text-slate-100 active:scale-110 transition  hover:bg-lime-500 hover:text-slate-100 hover:scale-110 transition ">shop</button>
            </div>
          </article>
          
         
          `;
  }
  client.appendChild(containerProduct);

  container.classList.toggle("hidden");
  const btnLogout = document.getElementById("btn-logout");
  btnLogout.addEventListener("click", () => {
    container.classList.toggle("hidden");
    client.innerHTML = ` `;
    localStorage.clear()
  });
}

async function renderSellerorAdmin(isAdmin) {
  const products = await getProducts();
  client.innerHTML = ` <div class="fixed w-full bg-orange-500 flex justify-between items-center p-7  items-center">
    <h1 class="text-3xl">shooping</h1>
    <div class="flex justify-between w-35 md:w-60">
    ${isAdmin === "admin" ? '<button type=button id="show-users"class="bg-slate-900 text-white p-1 w-15  rounded ">show users </button>' : ""}
       <button id="add-product"
       type=button
        class="rounded bg-slate-100 p-1 w-18 md:w-30">
       add product
       </button>
      <button type=button id = "btn-logout"
      class="bg-slate-700 p-1 text-neutral-100 rounded-lg"
      >logout</button>
    </div>
  </div>
    <div id="overlay" class=" hidden fixed inset-0 bg-black/50">
    </div>
    <div id="form-add" class=" hidden fixed size-50 h-100 md:size-100 bg-white flex justify-self-center m-35">
    <form id=form-product class="flex flex-col items-center w-full p-7"  >
    <input name="type" class="rounded border w-full mt-2 p-2" placeholder="type" required/>
    <input name="stock" class="rounded border w-full mt-2 p-2" placeholder="stock" required/>
      <input name="price" class="rounded border w-full mt-2 p-2" placeholder="price" required/>
      <input name="url" class="rounded border w-full mt-2 p-2" placeholder="url" required/>
      <div class="flex  w-full gap-5 mt-15">
        <button id = "add-button"
        type=button
         class="bg-lime-300 rounded w-full p-1">
          add
        </button>
        <button id = "exit-btn"
        type=button
        class="rounded bg-red-500 w-full p-1">
        exit
        </button>
        </div>
   
    </form>
     </div class="w-full">
     <div id="overlay-users" class="hidden fixed inset-0 bg-black/50">    </div>
    <div id="users-modal" class=" hidden flex flex-col items-center gap-5 bg-slate-200 fixed  h-100  bg-white flex justify-self-center m-35"> 
    <div id="data" class="w-full p-4"></div>
    <button type=button id="exit-user" class="rounded bg-red-500 w-40 p-1">exit</button>
    </div>
   `;
  const addProduct = document.getElementById("add-product");
  const overlay = document.getElementById("overlay");
  const formAdd = document.getElementById("form-add");
  const addButton = document.getElementById("add-button");
  const exitBtn = document.getElementById("exit-btn");
  const formProduct = document.getElementById("form-product");
  const showUsers = document.getElementById("show-users");
  const usersModal = document.getElementById("users-modal");
  const exitUser = document.getElementById("exit-user");

  const usersData = document.getElementById("data");

  const overlayUsers = document.getElementById("overlay-users");
  exitUser.addEventListener("click", ()=> {
    overlayUsers.classList.toggle("hidden");
    usersModal.classList.toggle("hidden");
  })
  if(isAdmin === "admin") {


    showUsers.addEventListener("click", async () => {
      const users = await getUsers();
      console.log(users);
      let mensaje = ``;
      users.forEach((user) => {
        const { name, role, email, password } = user;
        mensaje += `name: ${name}
        role: ${role}
        email:  ${email}
        password: ${password}<br>
        `;
      });
      usersData.innerHTML = mensaje
      overlayUsers.classList.toggle("hidden");
      usersModal.classList.toggle("hidden");
    });
  }


  addButton.addEventListener("click", async () => {
    const newProduct = await Object.fromEntries(new FormData(formProduct));
    await addNewProduct(newProduct);
    alert("added");
  });

  addProduct.addEventListener("click", () => {
    overlay.classList.toggle("hidden");
    formAdd.classList.toggle("hidden");
  });
  exitBtn.addEventListener("click", () => {
    overlay.classList.toggle("hidden");
    formAdd.classList.toggle("hidden");
  });

  let containerProduct = document.createElement("div");
  containerProduct.className =
    "pt-40 bg-slate-400 grid grid-col-1 md:grid-cols-2 gap-15 p-10 lg:grid-cols-3  ";
  containerProduct.innerHTML = `
    <div id="overlay-edit" class=" hidden fixed inset-0 bg-black/50">
</div>
<div id="container-edit" class=" hidden fixed size-50 h-100 md:size-100 bg-white flex justify-self-center m-35">
<form id=form-edit class="flex flex-col items-center w-full p-7"  >
<input name="stock" class="rounded border w-full mt-2 p-2" placeholder="stock" />
<input name="price" class="rounded border w-full mt-2 p-2" placeholder="price" />
  <div class="flex  w-full gap-5 mt-15">
    <button id = "edit-button"
    type=button
     class="bg-lime-300 rounded w-full p-1">
     add
     </button>
     <button id = "exit-edit"
    type=button
    class="rounded bg-red-500 w-full p-1">
    exit
    </button>
    </div>
    
    </form>
    </div>
    
    
    `;
  for (let product of products) {
    containerProduct.innerHTML += `
      
      <article class="bg-slate-200 flex flex-col border w-full justify-center items-center  p-5 gap-2 rounded-lg">
      <img class="size-50 " src="${product.url}" alt="product">
      <h1 class="text-xl" >${product.type}</h1>
      <div class="flex justify-between w-35">
      <div><p class="text-neutral-600">stock:${product.stock}</p></div>
      <div><p class="text-neutral-600">price:${product.price}</p></div>
      </div>
      <p class="text-justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis illum distinctio vero voluptatem deleniti hic necessitatibus harum nesciunt laudantium neque officiis qui similique aliquid, accusantium veritatis? Beatae maxime enim consequatur.</p>
      <div  class="felx flex-col gap-3 md:flex justify-between w-full pt-4">
      <button type=button
       data-id="${product.id}"
       class="edit p-1 rounded bg-blue-300 w-full rounded-lg active:bg-blue-500 active:text-slate-100 active:scale-110 transition  hover:bg-blue-500 hover:text-slate-100 hover:scale-110 transition">edit</button>
      <button type=button
       data-id="${product.id}"
       class="delete p-1 rounded bg-red-500 w-full rounded-lg active:bg-red-600 active:text-slate-100 active:scale-110 transition  hover:bg-red-600 hover:text-slate-100 hover:scale-110 transition">delete</button>
      
      </div>
      </article>
          </div>
          
          
          
          `;
  }
  client.appendChild(containerProduct);
  const editButtons = document.querySelectorAll(".edit");
  const btnEdit = document.getElementById("edit-button");
  const formEdit = document.getElementById("form-edit");
  const exitEdit = document.getElementById("exit-edit");
  const containerEdit = document.getElementById("container-edit");
  const overlayEdit = document.getElementById("overlay-edit");
  const deletButtons = document.querySelectorAll(".delete");

  deletButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let id = btn.dataset.id;
      await deleteProduct(id);
    });
  });

  let currentId = null;

  btnEdit.addEventListener("click", async () => {
    const product = Object.fromEntries(new FormData(formEdit));
    await editProduct(product, currentId);
  });

  editButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      overlayEdit.classList.toggle("hidden");
      containerEdit.classList.toggle("hidden");
      currentId = btn.dataset.id;
    });
  });
  exitEdit.addEventListener("click", () => {
    overlayEdit.classList.toggle("hidden");
    containerEdit.classList.toggle("hidden");
  });

  container.classList.toggle("hidden");
  const btnLogout = document.getElementById("btn-logout");
  btnLogout.addEventListener("click", () => {
    container.classList.toggle("hidden");
    client.innerHTML = ` `;
    localStorage.clear()
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { email, password } = Object.fromEntries(new FormData(form));
  const users = await getUsers();
  const foundUser = users.find((user) => {
    return user.email === email && user.password === password;
  });
  if (foundUser) {
    if (foundUser?.role === "client") {
      renderClient()
      localStorage.setItem("user", JSON.stringify({name:foundUser.name,role:foundUser.role}));
    } else if (foundUser?.role) {
      renderSellerorAdmin(foundUser?.role);
      localStorage.setItem("user", JSON.stringify({name:foundUser.name,role:foundUser.role}));
    }
  } else {
    alert("incorrecto");
  }
});

async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error:", error);
  }
}
