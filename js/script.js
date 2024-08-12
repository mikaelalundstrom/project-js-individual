window.addEventListener("load", () => {
  setupSearchForm();
});

async function getAnimalsbySearch(search) {
  try {
    const response = await fetch("https://api.api-ninjas.com/v1/animals?name=" + search, {
      method: "GET",
      headers: { "X-Api-Key": "sPv6eb3ivmt8RzDw8lEGPg==LOxs4Mxqj97XaOl4" },
    });

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function setupSearchForm() {
  const searchFormRef = document.querySelector("#search-form");
  searchFormRef.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    console.log(search);

    //getAnimalsbySearch(search);
  });
}

function renderSearchResults(data) {
  const searchResultGridRef = document.querySelector(".search-result");
  const searchMessageRef = document.querySelector(".search-message");
  searchMessageRef.classList.remove("d-none");

  if (data.length === 0) {
    searchMessageRef.innerHTML = "<h4>No animals matching your search was found!<h4>";
  }
}
