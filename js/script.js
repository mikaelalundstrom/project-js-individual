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

  // Create element for each animal
  data.forEach((animal) => {
    const anchorRef = document.createElement("a");
    // Custom href based on animal name
    anchorRef.href = `./animal.html?name=${encodeURIComponent(animal.name)}`;

    const searchItemRef = document.createElement("article");
    searchItemRef.classList.add("search-result-item");

    const nameRef = document.createElement("div");
    nameRef.classList.add("name");

    const commonNameRef = document.createElement("h2");
    commonNameRef.textContent = animal.name;
    nameRef.appendChild(commonNameRef);

    const scientificNameRef = document.createElement("h3");
    scientificNameRef.textContent = animal.taxonomy.scientific_name;
    nameRef.appendChild(scientificNameRef);

    searchItemRef.appendChild(nameRef);

    const sloganRef = document.createElement("p");
    sloganRef.classList.add("slogan");
    // Only change if there is a slogan
    if (animal.characteristics.slogan) {
      sloganRef.textContent = animal.characteristics.slogan;
    }
    searchItemRef.appendChild(sloganRef);

    const distinctFeatureRef = document.createElement("p");
    distinctFeatureRef.classList.add("distinct-feature");
    distinctFeatureRef.innerHTML = "<span>Recognizing features: </span>";
    // To avoid inconsistencies with distinct features
    if (animal.characteristics.distinctive_feature) {
      distinctFeatureRef.innerHTML += animal.characteristics.distinctive_feature;
    } else if (animal.characteristics.most_distinctive_feature) {
      distinctFeatureRef.innerHTML += animal.characteristics.most_distinctive_feature;
    } else {
      distinctFeatureRef.innerHTML += "-";
    }
    searchItemRef.appendChild(distinctFeatureRef);

    const locationRef = document.createElement("p");
    locationRef.classList.add("location");
    locationRef.innerHTML = `<i class="las la-map-marker"></i>` + animal.locations.join(", ");
    searchItemRef.appendChild(locationRef);

    anchorRef.appendChild(searchItemRef);
    searchResultGridRef.appendChild(anchorRef);
  });
}
