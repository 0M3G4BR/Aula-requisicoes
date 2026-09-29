const URL_API = "https://jsonplaceholder.typicode.com";

const tbody = document.querySelector("tbody");
const form = document.getElementById("form-post");
const titleInput = document.querySelector('input[name="title"]');
const bodyInput = document.querySelector('textarea[name="body"]');


function loadPosts() {
  const request = new XMLHttpRequest();
  const url = URL_API + "/posts";

  request.open("GET", url);
  request.onreadystatechange = () => {
    if (request.readyState !== XMLHttpRequest.DONE) return;

    if (request.status >= 200 && request.status < 300) {
      const result = JSON.parse(request.responseText);
      renderPosts(result);
    } else {
      console.log("DEU ERRO ao carregar os posts!");
    }
  };
  request.send();
}

function renderPosts(posts) {
  tbody.replaceChildren();
  posts.forEach((post) => tbody.appendChild(createElement(post)));
}


function createElement(post) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${post.id}</td>
    <td>${post.title}</td>
    <td>${post.body}</td>
    <td><button type="button" class="btn btn-danger btn-sm">Apagar</button></td>
  `;

  tr.querySelector("button").addEventListener("click", () => deletePost(post.id, tr));
  return tr;
}


function createPost(event) {
  event.preventDefault(); 

  const newPost = {
    title: titleInput.value,
    body: bodyInput.value,
    userId: 1,
  };

  const request = new XMLHttpRequest();
  const url = URL_API + "/posts";

  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.onreadystatechange = () => {
    if (request.readyState !== XMLHttpRequest.DONE) return;

    if (request.status >= 200 && request.status < 300) {
      const postCriado = JSON.parse(request.responseText); 
      console.log("Post criado:", postCriado);

     
      if (tbody.querySelector(".alert")) tbody.replaceChildren();

     
      tbody.prepend(createElement(postCriado));

      form.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById("staticBackdrop"));
      modal.hide();
    } else {
      console.log("DEU ERRO ao criar o post!");
    }
  };
  request.send(JSON.stringify(newPost));
}

function deletePost(id, tr) {
  const request = new XMLHttpRequest();
  const url = URL_API + "/posts/" + id;

  request.open("DELETE", url);
  request.onreadystatechange = () => {
    if (request.readyState !== XMLHttpRequest.DONE) return;

    if (request.status >= 200 && request.status < 300) {
      tr.remove(); 
      console.log("Post " + id + " apagado");
    } else {
      console.log("DEU ERRO ao apagar o post!");
    }
  };
  request.send();
}

document.getElementById("btn-load").addEventListener("click", loadPosts);
form.addEventListener("submit", createPost);

loadPosts();