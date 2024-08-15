window.addEventListener("load", () => {
  renderFavorites(getCollection("favoriteAnimals"));
  renderLists();
});

// Render favorites to user
function renderFavorites(data) {
  const listGridRef = document.querySelector(".list-item-grid");
  // Do if there are favorites
  if (data.length > 0) {
    createGridItems(data, listGridRef);
    // Else show message to user about how to add favorites
  } else {
    document.querySelector(".message").classList.remove("d-none");
  }
}

// Render user created lists to user
function renderLists() {
  const lists = getCollectionKeys();
  const listsContainerRef = document.querySelector(".custom-lists");
  listsContainerRef.innerHTML = "";

  // Do for each user created list
  lists.forEach((listName) => {
    const list = getCollection(listName);
    const listRef = document.createElement("section");
    listRef.classList.add("list");

    const listTitleRef = document.createElement("h2");
    listTitleRef.classList.add("list-title");
    listTitleRef.innerHTML = `<span>${listName}</span><span class="list-actions"><i class="las la-pen"></i><i class="las la-trash-alt"></i></span>`;
    listRef.appendChild(listTitleRef);
    const listGridRef = document.createElement("section");
    listGridRef.classList.add("list-item-grid");

    if (list.length > 0) {
      createGridItems(list, listGridRef);
    } else {
      // Show message if list is empty
      const messageRef = document.createElement("section");
      messageRef.classList.add("message");
      messageRef.innerHTML = `<p>This list is empty.</p>`;
      listRef.appendChild(messageRef);
    }
    listRef.appendChild(listGridRef);
    listsContainerRef.appendChild(listRef);
  });

  // Set up buttons to remove/edit lists
  setupRemoveListButtons();
  setupEditListButtons();
}

// Set up remove list functionality
function setupRemoveListButtons() {
  const removeBtnRefs = document.querySelectorAll(".la-trash-alt");
  removeBtnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.parentElement.parentElement.textContent;
      // to avoid multiple edit/remove views open at once
      if (document.querySelector("form.edit") || document.querySelector("div.delete-list-view")) {
        renderLists();
        const listTitleRefs = document.querySelectorAll(".list-title");
        listTitleRefs.forEach((elem) => {
          if (listName === elem.textContent) {
            elem.innerHTML = `<div class="delete-list-view">
            <div><p>Are you sure you want to delete this list? </p></div>
            <div><button class="delete-list">Delete</button><i class="las la-times"></i></div></div>`;

            setupConfirmRemoveList(listName);
          }
        });
      } else {
        e.target.parentElement.parentElement.innerHTML = `<div class="delete-list-view">
        <div><p>Are you sure you want to delete "${listName}"? </p></div>
        <div><button class="delete-list">Delete</button><i class="las la-times"></i></div></div>`;

        setupConfirmRemoveList(listName);
      }
    });
  });
}

// Set up functionality for confirm list delete
function setupConfirmRemoveList(listName) {
  const confirmRemoveBtnRef = document.querySelectorAll("button.delete-list");
  confirmRemoveBtnRef.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeCollection(listName);
      // Refresh lists
      renderLists();
    });
  });
  setupCloseButton();
}

// Set up functionality to display edit view
function setupEditListButtons() {
  const editBtnRefs = document.querySelectorAll(".la-pen");
  editBtnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.parentElement.parentElement.textContent;
      // to avoid multiple edit/remove views open at once
      if (document.querySelector("form.edit") || document.querySelector("div.delete-list-view")) {
        renderLists();
        const listTitleRefs = document.querySelectorAll(".list-title");
        listTitleRefs.forEach((elem) => {
          if (listName === elem.textContent) {
            elem.innerHTML = `<form class="edit">
            <div><label for="editlistname">Edit list name:</label>
              <input type="text" id="editlistname" value="${listName}" required />
            </div>
            <div><button>Update</button><i class="las la-times"></i></div></form>`;

            setupEditListForms(listName);
          }
        });
      } else {
        // Edit view template
        e.target.parentElement.parentElement.innerHTML = `<form class="edit">
                <div><label for="editlistname">Edit list name:</label>
                  <input type="text" id="editlistname" value="${listName}" required />
                </div>
                <div><button>Update</button><i class="las la-times"></i></div></form>`;

        setupEditListForms(listName);
      }
    });
  });
}

// Set up form to change list name
function setupEditListForms(listName) {
  const formsRef = document.querySelectorAll(".edit");
  formsRef.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // New name
      const newListName = e.target.editlistname.value;
      if (
        !getAllCollectionKeys().find((existingList) => existingList === newListName) ||
        listName === newListName
      ) {
        // Get animals for the list
        const listItems = getCollection(listName);
        // Remove the list with the old name
        removeCollection(listName);

        // Create list with same animals but new name
        setCollection(newListName, listItems);

        // Refresh lists
        renderLists();
      } else {
        document
          .querySelector("#editlistname")
          .insertAdjacentHTML("afterend", `<p class="error">This name is already taken.</p>`);
      }
    });
  });
  setupCloseButton();
}

// Set up close button functionality
function setupCloseButton() {
  const closeBtnRefs = document.querySelectorAll(".la-times");
  closeBtnRefs.forEach((btn) => {
    // Refresh lists on click (will get rid of edit/remove view)
    btn.addEventListener("click", () => renderLists());
  });
}
