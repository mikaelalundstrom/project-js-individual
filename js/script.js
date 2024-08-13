window.addEventListener("load", () => {
  setupSearchForm();
  // renderCurrentSearchResults();
});

// get animals based on search input from API
async function getAnimalsbySearch(search) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/animals?name=${search}`, {
      method: "GET",
      headers: { "X-Api-Key": "sPv6eb3ivmt8RzDw8lEGPg==LOxs4Mxqj97XaOl4" },
    });

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    const data = await response.json();
    console.log(data);
    // clears currentSearch localStorage
    removePreviousSearch();
    // adds fecthed data to localStorage
    saveCurrentSearch(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// set up Search Form
function setupSearchForm() {
  const searchFormRef = document.querySelector("#search-form");
  searchFormRef.addEventListener("submit", async (e) => {
    // to prevent reloading of page
    e.preventDefault();
    const search = e.target.search.value;

    // Render data from API based on user search input
    renderSearchResults(await getAnimalsbySearch(search));
  });
}

// Save the current search in localStorage
function saveCurrentSearch(data) {
  localStorage.setItem("currentSearch", JSON.stringify(data));
}

// Remove current search from localStorage
function removePreviousSearch() {
  localStorage.removeItem("currentSearch");
}

// function getCurrentSearchItems() {
//   return JSON.parse(localStorage.getItem("currentSearch"));
// }

// function renderCurrentSearchResults() {
//   const currentSearchItems = getCurrentSearchItems();
//   if (currentSearchItems.length > 0) {
//     renderSearchResults(currentSearchItems);
//   }
// }

// Render the search results for the user
function renderSearchResults(data) {
  const searchResultGridRef = document.querySelector(".search-result");

  // Clear grid after every search
  searchResultGridRef.innerHTML = "";

  // Display message to user
  const searchMessageRef = document.querySelector(".search-message");
  searchMessageRef.classList.remove("d-none");
  searchMessageRef.innerHTML =
    "<h4>Didn't find what you where looking for?</h4><p>Try making your search more or less exact!</p>";

  // Display if no results
  if (data.length === 0) {
    searchMessageRef.innerHTML = "<h4>No animals matching your search was found!</h4>";
  }

  createGridItems(data, searchResultGridRef);
}
