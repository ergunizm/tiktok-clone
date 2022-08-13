//////
const changeParentStyle = function () {
  const child = document.querySelector(".input-fs");
  const parent = document.querySelector(".cont-center");

  child.addEventListener("focus", function () {
    parent.style.borderColor = "grey";
    parent.style.backgroundColor = `rgb(${197},${184} ,${184} )`;
  });
  child.addEventListener("focusout", function () {
    parent.style.borderColor = "white";
    parent.style.backgroundColor = "white";
  });
};

changeParentStyle();

//////
const nav = document.querySelector(".navbar");
const header = document.querySelector(".f-container");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `0px`,
});
headerObserver.observe(header);

const imgContainer = document.querySelector(".center-section");
/////
const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
});

//////

const state = {
  photos: [],
  likes: [],
};

const getData = async function () {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/photos");
    const data = await res.json();
    state.photos = data;
  } catch (err) {
    console.error(`${err}❤️❤️`);
  }
};
//////

const scrollToImage = function (scrollId) {
  const it = Array.from(this.document.querySelectorAll("img")).find((img) => {
    return +img.dataset.id === scrollId;
  });
  it.scrollIntoView({
    behavior: "auto",
  });
};

//////

const renderBeginningLikeIcon = function (id) {
  if (state.likes.find((lk) => lk.id === id)) {
    const liked = document.querySelector(`.sl${id}`);
    liked.classList.replace("span-like", "span-dislike");
    liked.textContent = "👍🏿";
  }
};

//////

const getImage = function (row = 0) {
  const choosen = state.photos.at(row);
  const markup = `
       <div class="img img${choosen.id}">
          <img
            data-id="${choosen.id}"
            src="${choosen.url}"
            alt="Image"
            width="100%"
            class="setmargin"
          />
          <p class="hideMore">${choosen.title}</p>
          <span class="span-sh">${
            choosen.title.length > 30 ? "Show" : ""
          }</span>
            <button class="btn-ts btn-none span-like"><span class="span-like sl${
              choosen.id
            }">👍🏻</span></button>
      </div>
      `;
  imgContainer.insertAdjacentHTML("beforeend", markup);

  renderBeginningLikeIcon(choosen.id);
};

//////

let lastId = 2; // id of last uploaded img
let curId = 1; // id of current img
window.addEventListener("keyup", function (e) {
  try {
    if (e.key !== "ArrowDown") return;

    if (curId + 1 === lastId && lastId < state.photos.length) {
      lastId++;
      getImage(lastId);
      curId++;
      scrollToImage(curId);
    } else if (curId <= state.photos.length) {
      curId++;
      scrollToImage(curId);
    }
  } catch (err) {
    console.error(`${err}❤️❤️`);
  }
});
//////
window.addEventListener("keyup", function (e) {
  try {
    if (e.key !== "ArrowUp" || curId <= 0) return;
    curId--;
    scrollToImage(curId);
  } catch (err) {
    console.error(`${err}❤️❤️`);
  }
});

document
  .querySelector(".center-section")
  .addEventListener("click", function (e) {
    if (!e.target.classList.contains("span-sh")) return;
    const span = e.target;

    span.parentNode.querySelector("p").classList.toggle("showMore");
    span.parentNode.querySelector("p").classList.toggle("hideMore");

    span.textContent = span.textContent == "Hide" ? "Show" : "Hide";
  });

//////

//preview
const previewContainer = document.querySelector(".likes__list");

const renderLikes = function () {
  if (state.likes.length === 0) {
    previewContainer.innerHTML =
      "To save an image, click 👍🏻at the bottom of the image";
    return;
  }
  previewContainer.innerHTML = "";
  state.likes.forEach((lk) => {
    const markup = `
          <a class="liked liked${lk.id}" href="${lk.url}">
             <li class="preview">              
                <figure class="preview__fig">
                  <img
                    src="${lk.url}"
                    alt="img${lk.id}"
                  />
                </figure>
                <h4 class="preview__title">${lk.title}</h4>
              </li>
          </a>
    `;
    previewContainer.insertAdjacentHTML("beforeend", markup);
  });
};

//////
const saveLikes = function () {
  localStorage.setItem("likes", JSON.stringify(state.likes));
};

//////
const like = function (elem) {
  elem.textContent = "👍🏿";
  elem.classList.replace("span-like", "span-dislike");

  const selectedId = elem.closest(".img").querySelector(".setmargin")
    .dataset.id;
  const newLk = state.photos.find((img) => img.id === +selectedId);
  state.likes.push(newLk);

  saveLikes();
  renderLikes();
};

const dislike = function (elem) {
  elem.textContent = "👍🏻";
  elem.classList.replace("span-dislike", "span-like");

  const deletedId = elem.closest(".img").querySelector(".setmargin").dataset.id;
  const index = state.likes.findIndex((lk) => lk.id === +deletedId);
  state.likes.splice(index, 1);

  saveLikes();
  renderLikes();
};

//////

imgContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("span-like")) {
    like(e.target);
  } else if (e.target.classList.contains("span-dislike")) {
    dislike(e.target);
  }
});

//////

const getLikesFromStorage = function () {
  const likes = localStorage.getItem("likes");
  if (likes) {
    state.likes = JSON.parse(likes);
    renderLikes();
  }
};

const parent = document.querySelector(".center-section");
const init = async function () {
  getLikesFromStorage();

  await getData();
  getImage(0);
  getImage(1);
  renderBeginningLikeIcon();
};
init();

//////
/*
const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
       <img id="loading-image" src="./src/img/loading.gif" alt="Loading..." />
    </div>
    `;
  parentEl.insertAdjacentHTML("beforeend", markup);
};
*/

/*const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};*/
