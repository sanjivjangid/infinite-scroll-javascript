// api to get random users. Thanks for providing us api to test our use case.
// https://randomuser.me/api/?page=1&results=10

let page = 1;
let limit = 10;
let observer;
let count = 0;

const fetchRandomUsers = async (page, limit) => {
  const res = await fetch(
    `https://randomuser.me/api/?page=${page}&results=${limit}`
  );
  const jsonResult = await res.json();
  return jsonResult;
};

const updateList = (data) => {
  const ul = document.getElementById("list");
  data.forEach((l, index) => {
    count += 1;
    const el = document.createElement("li");
    el.setAttribute("id", `list-user-${count}`);
    el.innerHTML = `<div class="list-user">${count}. ${l.name.last}, ${l.name.first}<span>${l.location.country}</span></div>`;
    ul.appendChild(el);
  });

  if (observer) {
    observer.observe(ul.lastChild);
  }
};

const getUsers = async () => {
  const usersData = await fetchRandomUsers(page, limit);
  const list = usersData?.results || [];
  updateList(list);
};

const handleObseverCallback = (entries, observer) => {
  console.log("load more!!");
  if (entries[0].isIntersecting) {
    page += 1;
    getUsers();
    // unobserve previous
    observer.unobserve(entries[0].target);
  }
};

const onDocumentLoad = async () => {
  console.log("hello world!");
  // intersection observer
  const options = {
    root: document.querySelector("#list"),
    rootMargin: "0px",
    scrollMargin: "50px",
    threshold: 1.0,
    // delay: 2000,
  };

  observer = new IntersectionObserver(handleObseverCallback, options);
  getUsers();
};

window.addEventListener("load", onDocumentLoad);
