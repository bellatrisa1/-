document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const selectedCount = document.getElementById("selected-count");
  let postsData = [];

  function renderPosts(posts) {
    app.innerHTML = ""; // Очищаем контейнер
    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <input type="checkbox" class="post-checkbox">
            `;
      const checkbox = postDiv.querySelector(".post-checkbox");
      checkbox.addEventListener("change", () =>
        toggleCheckbox(postDiv, checkbox)
      );
      app.appendChild(postDiv);
    });
    updateSelectedCount();
  }

  // Функция для переключения стиля
  function toggleCheckbox(postDiv, checkbox) {
    if (checkbox.checked) {
      postDiv.classList.add("checked");
    } else {
      postDiv.classList.remove("checked");
    }
    updateSelectedCount();
  }

  // Обновление счетчика выбранных постов
  function updateSelectedCount() {
    const selectedPosts = document.querySelectorAll(
      '.post input[type="checkbox"]:checked'
    ).length;
    selectedCount.textContent = `Selected posts: ${selectedPosts}`;
  }

  // Обработчик кнопки поиска
  searchButton.addEventListener("click", () => {
    const filterValue = searchInput.value.toLowerCase();
    const filteredPosts = postsData.filter((post) =>
      post.title.toLowerCase().includes(filterValue)
    );
    renderPosts(filteredPosts);
    updateURL(filterValue);
  });

  // Обновление URL с состоянием фильтра
  function updateURL(filterValue) {
    const url = new URL(window.location);
    url.searchParams.set("filter", filterValue);
    window.history.pushState({}, "", url);
  }

  // Восстановление состояния фильтра из URL
  function restoreFilterFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterValue = urlParams.get("filter") || "";
    searchInput.value = filterValue;
    return filterValue;
  }

  // Получение данных и первичная отрисовка
  function fetchPosts() {
    app.innerHTML = "Loading...";
    fetch("https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7")
      .then((response) => response.json())
      .then((posts) => {
        postsData = posts;
        const initialFilter = restoreFilterFromURL();
        const filteredPosts = postsData.filter((post) =>
          post.title.toLowerCase().includes(initialFilter)
        );
        renderPosts(filteredPosts);
      })
      .catch((error) => {
        app.innerHTML = "Error loading posts";
        console.error("Error:", error);
      });
  }

  // Загрузка постов при загрузке страницы
  fetchPosts();
});
