window.addEventListener("load", () => {
  renderAnimalInfo();
  setupFavoriteButton();
  setupToggleAddRemoveSection();
  setupNewListButton();
  setupNewListForm();
  setupAddToRemoveFromList();
});

// Get animalName from URL params
function getNameFromQueryString() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return decodeURIComponent(urlParams.get("name"));
}

// Display animal info for specific animal
function renderAnimalInfo() {
  const animalName = getNameFromQueryString();
  const animal = validateAnimal(animalName);

  if (animal) {
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
}

// Set up functionality for favorite button
function setupFavoriteButton() {
  const favoriteButtonRef = document.querySelector(".favorite");
  const animalName = getNameFromQueryString();
  checkIfFavorite(favoriteButtonRef, animalName);

  // on click event listener
  favoriteButtonRef.addEventListener("click", () => {
    if (favoriteButtonRef.classList.contains("lar")) {
      // make sure item is valid before adding to favorites
      const validAnimal = validateAnimal(animalName);
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

function setupToggleAddRemoveSection() {
  const buttonRefs = document.querySelectorAll(".list-actions .add, .list-actions .remove");
  buttonRefs.forEach((button) => {
    button.addEventListener("click", (e) => {
      const addRemoveSectionRef = document.querySelector(".add-remove");
      if (addRemoveSectionRef.classList.contains("d-none")) {
        addRemoveSectionRef.classList.remove("d-none");

        const addSectionRef = document.querySelector(".add-options");
        const addNewSectionRef = document.querySelector(".new-list");
        const removeSectionRef = document.querySelector(".remove-options");

        if (e.target.classList.contains("add")) {
          addSectionRef.classList.remove("d-none");
          addNewSectionRef.classList.add("d-none");
          removeSectionRef.classList.add("d-none");
        }

        if (e.target.classList.contains("remove")) {
          addSectionRef.classList.add("d-none");
          addNewSectionRef.classList.add("d-none");
          removeSectionRef.classList.remove("d-none");
        }
      } else {
        addRemoveSectionRef.classList.add("d-none");
        setupAddToRemoveFromList();
      }
    });
  });
}

function setupNewListButton() {
  const newListBtnRef = document.querySelector(".new-list-btn");
  const addSectionRef = document.querySelector(".add-options");
  const addNewSectionRef = document.querySelector(".new-list");
  const removeSectionRef = document.querySelector(".remove-options");

  newListBtnRef.addEventListener("click", () => {
    addSectionRef.classList.add("d-none");
    addNewSectionRef.classList.remove("d-none");
    removeSectionRef.classList.add("d-none");
  });
}

function setupNewListForm() {
  const newListFormRef = document.querySelector("#new-list-form");
  newListFormRef.addEventListener("submit", (e) => {
    e.preventDefault();
    const newListName = e.target.listname.value;
    const animalName = getNameFromQueryString();

    const validAnimal = validateAnimal(animalName);
    if (validAnimal) {
      addItemToCollection(newListName, validAnimal);
      const addRemoveSectionRef = document.querySelector(".add-remove");
      addRemoveSectionRef.classList.add("d-none");
      setupAddToRemoveFromList();
    }
  });
}

function setupAddToRemoveFromList() {
  const removeBtnParentRef = document.querySelector(".existing-lists-remove");

  const addBtnParentRef = document.querySelector(".existing-lists-add");

  const pRef1 = document.createElement("p");
  const pRef2 = document.createElement("p");
  const animalName = getNameFromQueryString();
  const lists = getCollectionKeys();

  removeBtnParentRef.innerHTML = "";
  pRef1.textContent = "This Animal is not added to any lists.";
  removeBtnParentRef.appendChild(pRef1);

  addBtnParentRef.innerHTML = "";
  pRef2.textContent = "There are no lists to add this animal to.";
  addBtnParentRef.appendChild(pRef2);

  lists.forEach((listName) => {
    const list = getCollection(listName);
    if (list.find((animal) => animal.name === animalName)) {
      const pRemoveRef = document.querySelector(".existing-lists-remove p");
      pRemoveRef.textContent = "Remove from:";
      const btnRef = document.createElement("button");
      btnRef.innerText = listName;
      btnRef.classList.add("remove");
      removeBtnParentRef.appendChild(btnRef);
    } else {
      const pAddRef = document.querySelector(".existing-lists-add p");
      pAddRef.textContent = "Add to:";
      const btnRef = document.createElement("button");
      btnRef.innerText = listName;
      btnRef.classList.add("add");
      addBtnParentRef.appendChild(btnRef);
    }
  });

  setupAddButtons();
  setupRemoveButtons();
}

function setupAddButtons() {
  const btnRefs = document.querySelectorAll("button.add");
  const validAnimal = validateAnimal(getNameFromQueryString());
  const validListNames = getCollectionKeys();

  btnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.innerText;
      if (validAnimal && validListNames.find((name) => name === listName)) {
        addItemToCollection(listName, validAnimal);
        e.target.innerText = "Added!";
      }
    });
  });
}

function setupRemoveButtons() {
  const btnRefs = document.querySelectorAll("button.remove");
  const validAnimal = validateAnimal(getNameFromQueryString());
  const validListNames = getCollectionKeys();

  btnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.innerText;

      if (validAnimal && validListNames.find((name) => name === listName)) {
        removeItemFromCollection(listName, getNameFromQueryString());
        e.target.innerText = "Removed!";
      }
    });
  });
}
