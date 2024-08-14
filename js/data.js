// Create grid items
function createGridItems(data, parentElemRef) {
  // Create element for each animal
  data.forEach((animal) => {
    const anchorRef = document.createElement("a");
    // Custom href based on animal name
    anchorRef.href = `./animal.html?name=${encodeURIComponent(animal.name)}`;

    const searchItemRef = document.createElement("article");
    searchItemRef.classList.add("grid-item");

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
    parentElemRef.appendChild(anchorRef);
  });
}

// Check if animal is valid
function validateAnimal(animalName) {
  let lists = { ...localStorage };
  let validAnimal = false;
  for (const property in lists) {
    animalList = JSON.parse(lists[property]);
    animalList.forEach((animal) => {
      if (animal.name === animalName) {
        validAnimal = animal;
      }
    });
  }
  return validAnimal;
}

// Get keys from localStorage (only includes user-made collections)
function getCollectionKeys() {
  let keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) !== "currentSearch" && localStorage.key(i) !== "favoriteAnimals")
      keys.push(localStorage.key(i));
  }
  return keys;
}

// Get items from localStorage
function getCollection(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Set collection
function setCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Remove collection
function removeCollection(key) {
  localStorage.removeItem(key);
}

// Add animal to collection
function addItemToCollection(key, animal) {
  const collection = getCollection(key);

  if (!collection.find((item) => item.name === animal.name)) {
    collection.push(animal);
    setCollection(key, collection);
  }
}

// Remove animal from collection
function removeItemFromCollection(key, animalName) {
  const collection = getCollection(key);
  setCollection(
    key,
    collection.filter((item) => animalName !== item.name)
  );
}
