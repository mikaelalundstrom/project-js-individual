window.addEventListener("load", () => {
  renderAnimalInfo();
  setupFavoriteButton();
});

// Get animalName from URL params
function getNameFromQueryString() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return decodeURIComponent(urlParams.get("name"));
}

// Get current search items from localStorage
function getCurrentSearchItems() {
  return JSON.parse(localStorage.getItem("currentSearch"));
}

// Display animal info for specific user
function renderAnimalInfo() {
  const animalName = getNameFromQueryString();
  const currentSearchItems = getCurrentSearchItems();

  currentSearchItems.forEach((animal) => {
    // if animal.name matches name from URL params
    if (animal.name === animalName) {
      document.querySelector(".name h1").textContent = animal.name;
      if (animal.taxonomy.scientific_name) {
        document.querySelector(".name h2").textContent = animal.taxonomy.scientific_name;
      } else {
        document.querySelector(".name h2").textContent = "";
      }

      // Loop through object and add the contents of the key value pairs to li items
      for (const property in animal.taxonomy) {
        const taxonomyListRef = document.querySelector(".taxonomy-list");
        if (property === "scientific_name") {
        } else {
          const liRef = document.createElement("li");
          liRef.innerHTML = `<span>${property}:</span>${animal.taxonomy[property]} `;
          taxonomyListRef.appendChild(liRef);
        }
      }

      // Loop through object and add the contents of the key value pairs to li items
      for (const property in animal.characteristics) {
        const characteristicsListRef = document.querySelector(".characteristics-list");

        const liRef = document.createElement("li");
        liRef.innerHTML = `<span>${property.replaceAll("_", " ")}:</span>${
          animal.characteristics[property]
        } `;
        characteristicsListRef.appendChild(liRef);
      }
    }
  });
}

// Get favorites from localStorage
function getFavoriteAnimals() {
  return JSON.parse(localStorage.getItem("favoriteAnimals")) || [];
}

// Set favorites in localStorage
function setFavoriteAnimals(favorites) {
  localStorage.setItem("favoriteAnimals", JSON.stringify(favorites));
}

// Add animal to favorites
function addAnimalToFavorites(animal) {
  const favorites = getFavoriteAnimals();

  // to avoid duplicates
  if (!favorites.find((favorite) => favorite.name === animal.name)) {
    favorites.push(animal);
    setFavoriteAnimals(favorites);
  }
}

// Remove animal from favorites
function removeAnimalFromFavorites(animalName) {
  const favorites = getFavoriteAnimals();
  setFavoriteAnimals(favorites.filter((favorite) => animalName !== favorite.name));
}

// Set up functionality for favorite button
function setupFavoriteButton() {
  const favoriteButtonRef = document.querySelector(".favorite");
  const animalName = getNameFromQueryString();
  checkIfFavorite(favoriteButtonRef, animalName);

  // on click event listener
  favoriteButtonRef.addEventListener("click", () => {
    if (favoriteButtonRef.classList.contains("lar")) {
      const validAnimals = getCurrentSearchItems();
      // make sure item is valid before adding to favorites
      addAnimalToFavorites(validAnimals.find((animal) => animal.name === animalName));
    } else if (favoriteButtonRef.classList.contains("las")) {
      removeAnimalFromFavorites(animalName);
    }

    checkIfFavorite(favoriteButtonRef, animalName);
  });
}

// Check how to display favorite button based on if animal is favorited or not
function checkIfFavorite(buttonRef, animalName) {
  const favoriteAnimals = getFavoriteAnimals();
  const animalIsFavorited = favoriteAnimals.find((animal) => animal.name === animalName);

  if (animalIsFavorited) {
    buttonRef.classList.remove("lar");
    buttonRef.classList.add("las");
  } else {
    buttonRef.classList.remove("las");
    buttonRef.classList.add("lar");
  }
}
