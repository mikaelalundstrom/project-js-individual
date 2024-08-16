window.addEventListener("load", () => {
  renderAnimalInfo();
  setupFavoriteButton();
  setupToggleAddRemoveSection();
  setupNewListButton();
  setupNewListForm();
  setupAddToRemoveFromList();
});

/* ------------- GET CURRENT ANIMAL ------------- */

// Get animalName from URL params
function getNameFromQueryString() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return decodeURIComponent(urlParams.get("name"));
}

/* ------------- DISPLAY ANIMAL INFO ------------- */

// Display animal info for specific animal
function renderAnimalInfo() {
  const animalName = getNameFromQueryString();
  const animal = validateAnimal(animalName);

  if (animal) {
    document.querySelector(".name h1").textContent = animal.name;
    if (animal.taxonomy.scientific_name) {
      document
        .querySelector(".name .la-dna")
        .insertAdjacentText("afterend", animal.taxonomy.scientific_name);
    } else {
      document.querySelector(".name h2").textContent = "";
    }
    document
      .querySelector(".name .la-map-marker")
      .insertAdjacentText("afterend", animal.locations.join(", "));

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

    // Display type icon based on taxonomy info
    matchIconToType(animal);
    // Display location icon based on location info
    matchIconToLocation(animal);

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
}

// Decide which type icon to display
function matchIconToType(animal) {
  const typeIconRef = document.querySelector(".type-icon");
  if (animal.taxonomy.phylum === "Arthropoda") {
    typeIconRef.innerHTML = `<i class="las la-bug"></i>`;
  } else if (animal.taxonomy.phylum === "Chordata") {
    switch (animal.taxonomy.class) {
      case "Amphibia":
        typeIconRef.innerHTML = `<i class="las la-frog"></i>`;
        break;
      case "Aves":
        typeIconRef.innerHTML = `<i class="las la-dove"></i>`;
        break;
      case "Mammalia":
        typeIconRef.innerHTML = `<i class="las la-hippo"></i>`;
        break;
      case "Reptilia":
        typeIconRef.innerHTML = `<i class="las la-dragon"></i>`;
        break;

      default:
        typeIconRef.innerHTML = `<i class="las la-fish"></i>`;
        break;
    }
  } else {
    typeIconRef.innerHTML = `<i class="las la-paw"></i>`;
  }
}

// Decide which location icon to display
function matchIconToLocation(animal) {
  const locationIconRef = document.querySelector(".location-icon");
  const firstLocation = animal.locations[0];
  if (firstLocation === "Asia" || firstLocation === "Oceania") {
    locationIconRef.innerHTML = `<i class="las la-globe-asia"></i>`;
  } else if (firstLocation === "Europe" || firstLocation === "Eurasia") {
    locationIconRef.innerHTML = `<i class="las la-globe-europe"></i>`;
  } else if (firstLocation === "Africa") {
    locationIconRef.innerHTML = `<i class="las la-globe-africa"></i>`;
  } else if (
    firstLocation === "Central-America" ||
    firstLocation === "South-America" ||
    firstLocation === "North-America"
  ) {
    locationIconRef.innerHTML = `<i class="las la-globe-americas"></i>`;
  } else {
    locationIconRef.innerHTML = `<i class="las la-globe"></i>`;
  }
}

/* ------------- FAVORITE BUTTON FUNCTIONALITY ------------- */

// Set up functionality for favorite button
function setupFavoriteButton() {
  const favoriteButtonRef = document.querySelector(".favorite");
  const animalName = getNameFromQueryString();
  const validAnimal = validateAnimal(animalName);
  checkIfFavorite(favoriteButtonRef, animalName);

  // on click event listener
  favoriteButtonRef.addEventListener("click", () => {
    if (favoriteButtonRef.classList.contains("lar")) {
      // make sure item is valid before adding to favorites

      if (validAnimal) {
        addItemToCollection("favoriteAnimals", validAnimal);
      }
    } else if (favoriteButtonRef.classList.contains("las")) {
      removeItemFromCollection("favoriteAnimals", animalName);
    }

    checkIfFavorite(favoriteButtonRef, animalName);
  });
}

// Check how to display favorite button based on if animal is favorited or not
function checkIfFavorite(buttonRef, animalName) {
  const favoriteAnimals = getCollection("favoriteAnimals");
  const animalIsFavorited = favoriteAnimals.find((animal) => animal.name === animalName);

  if (animalIsFavorited) {
    buttonRef.classList.remove("lar");
    buttonRef.classList.add("las");
  } else {
    buttonRef.classList.remove("las");
    buttonRef.classList.add("lar");
  }
}

/* ------------- ADD TO/REMOVE FROM LIST FUNCTIONALITY ------------- */

// Set up toggle functionality for buttons in the add/remove section
function setupToggleAddRemoveSection() {
  const buttonRefs = document.querySelectorAll(".list-actions .add, .list-actions .remove");
  buttonRefs.forEach((button) => {
    button.addEventListener("click", (e) => {
      const addRemoveSectionRef = document.querySelector(".add-remove");
      // Show add/remove section
      if (addRemoveSectionRef.classList.contains("d-none")) {
        addRemoveSectionRef.classList.remove("d-none");

        const addSectionRef = document.querySelector(".add-options");
        const addNewSectionRef = document.querySelector(".new-list");
        const removeSectionRef = document.querySelector(".remove-options");

        // Show view to add animal to lists
        if (e.target.classList.contains("add")) {
          addSectionRef.classList.remove("d-none");
          addNewSectionRef.classList.add("d-none");
          removeSectionRef.classList.add("d-none");
        }

        // Show view to remove animal from lists
        if (e.target.classList.contains("remove")) {
          addSectionRef.classList.add("d-none");
          addNewSectionRef.classList.add("d-none");
          removeSectionRef.classList.remove("d-none");
        }
        // Hide add/remove section
      } else {
        addRemoveSectionRef.classList.add("d-none");
        setupAddToRemoveFromList();
      }
    });
  });
}
// Set up button to add to new list
function setupNewListButton() {
  const newListBtnRef = document.querySelector(".new-list-btn");
  const addSectionRef = document.querySelector(".add-options");
  const addNewSectionRef = document.querySelector(".new-list");
  const removeSectionRef = document.querySelector(".remove-options");

  // Show add to new list view
  newListBtnRef.addEventListener("click", () => {
    addSectionRef.classList.add("d-none");
    addNewSectionRef.classList.remove("d-none");
    removeSectionRef.classList.add("d-none");
  });
}

// Set up form to create new list
function setupNewListForm() {
  const newListFormRef = document.querySelector("#new-list-form");
  const animalName = getNameFromQueryString();
  const validAnimal = validateAnimal(animalName);

  newListFormRef.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputRef = document.querySelector("#listname");
    const newListName = e.target.listname.value;
    // Only do if animal is valid
    if (validAnimal) {
      // To avoid duplicate names
      if (!getAllCollectionKeys().find((existingList) => existingList === newListName)) {
        addItemToCollection(newListName, validAnimal);
        // Close add/remove view
        const addRemoveSectionRef = document.querySelector(".add-remove");
        addRemoveSectionRef.classList.add("d-none");
        // Update add/remove options
        setupAddToRemoveFromList();
      } else {
        inputRef.insertAdjacentHTML("afterend", `<p class="error">This name is already taken.</p>`);
      }
    } else {
      inputRef.insertAdjacentHTML("afterend", `<p class="error">Animal is not valid.</p>`);
    }
  });
}

// Create add/remove buttons based on what lists animal belongs to
function setupAddToRemoveFromList() {
  const removeBtnParentRef = document.querySelector(".existing-lists-remove");
  const addBtnParentRef = document.querySelector(".existing-lists-add");
  const pRef1 = document.createElement("p");
  const pRef2 = document.createElement("p");
  const animalName = getNameFromQueryString();
  const lists = getCollectionKeys();
  // Reset
  removeBtnParentRef.innerHTML = "";
  // Show if no  options
  pRef1.textContent = "This Animal is not added to any lists.";
  removeBtnParentRef.appendChild(pRef1);
  // Reset
  addBtnParentRef.innerHTML = "";
  // Show if no options
  pRef2.textContent = "There are no lists to add this animal to.";
  addBtnParentRef.appendChild(pRef2);

  // Go through all lists to look for animal
  lists.forEach((listName) => {
    const list = getCollection(listName);
    // If animal found in list, add that list as a remove option
    if (list.find((animal) => animal.name === animalName)) {
      const pRemoveRef = document.querySelector(".existing-lists-remove p");
      pRemoveRef.textContent = "Remove from:";
      const btnRef = document.createElement("button");
      btnRef.innerText = listName;
      btnRef.classList.add("remove");
      removeBtnParentRef.appendChild(btnRef);
      // If animal not found in list, add that list as an add option
    } else {
      const pAddRef = document.querySelector(".existing-lists-add p");
      pAddRef.textContent = "Add to:";
      const btnRef = document.createElement("button");
      btnRef.innerText = listName;
      btnRef.classList.add("add");
      addBtnParentRef.appendChild(btnRef);
    }
  });

  // Set up specific functionality for add/remove options
  setupAddButtons();
  setupRemoveButtons();
}

// Set up functionality for add options
function setupAddButtons() {
  const btnRefs = document.querySelectorAll("button.add");
  const validAnimal = validateAnimal(getNameFromQueryString());
  const validListNames = getCollectionKeys();

  btnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.innerText;
      // Check if both animal and list are valid before adding
      if (validAnimal && validListNames.find((name) => name === listName)) {
        addItemToCollection(listName, validAnimal);
        // Display message to user
        e.target.innerText = "Added!";
      }
    });
  });
}

// Set up functionality for remove options
function setupRemoveButtons() {
  const btnRefs = document.querySelectorAll("button.remove");
  const validAnimal = validateAnimal(getNameFromQueryString());
  const validListNames = getCollectionKeys();

  btnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.innerText;
      // Check if both animal and list are valid before adding
      if (validAnimal && validListNames.find((name) => name === listName)) {
        removeItemFromCollection(listName, getNameFromQueryString());
        // Display message to user
        e.target.innerText = "Removed!";
      }
    });
  });
}
