/*const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};*/

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

const imgs = document.querySelectorAll(".img");
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
  console.log(it.dataset.id);
  it.scrollIntoView({
    behavior: "auto",
  });
};
//////

const getImage = function (row = 0) {
  const choosen = state.photos.at(row);
  console.log(choosen);
  const markup = `
       <div class="img${choosen.id}">
          <img
            data-id="${choosen.id}"
            src="${choosen.url}"
            alt="Image"
            title="${choosen.title}"
            width="100%"
            class="setmargin"
          />
      </div>
      `;
  imgContainer.insertAdjacentHTML("beforeend", markup);
};

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

const init = async function () {
  await getData();
  getImage(0);
  getImage(1);
};
init();
//////
