window.addEventListener("load", () => {
  renderFavorites(getCollection("favoriteAnimals"));
  renderLists();
});

function renderFavorites(data) {
  const listGridRef = document.querySelector(".list-item-grid");
  if (data.length > 0) {
    createGridItems(data, listGridRef);
  } else {
    document.querySelector(".message").classList.remove("d-none");
  }
}

function renderLists() {
  const lists = getCollectionKeys();
  const listsContainerRef = document.querySelector(".custom-lists");
  listsContainerRef.innerHTML = "";

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
      const messageRef = document.createElement("section");
      messageRef.classList.add("message");
      messageRef.innerHTML = `<p>This list is empty.</p>`;
      listRef.appendChild(messageRef);
    }
    listRef.appendChild(listGridRef);
    listsContainerRef.appendChild(listRef);
  });

  setupRemoveListButtons();
  setupEditListButtons();
}

function setupRemoveListButtons() {
  const removeBtnRefs = document.querySelectorAll(".la-trash-alt");
  removeBtnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.parentElement.parentElement.textContent;
      removeCollection(listName);
      renderLists();
    });
  });
}

function setupEditListButtons() {
  const editBtnRefs = document.querySelectorAll(".la-pen");
  editBtnRefs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const listName = e.target.parentElement.parentElement.textContent;
      e.target.parentElement.parentElement.innerHTML = `<form class="edit">
                <div><label for="editlistname">Edit list name:</label>
                  <input type="text" id="editlistname" value="${listName}" required />
                </div>
                <div><button>Update</button><i class="las la-times"></i></div></form>`;

      setupEditListForms(listName);
    });
  });
}

function setupEditListForms(listName) {
  const formsRef = document.querySelectorAll(".edit");
  formsRef.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const newListName = e.target.editlistname.value;
      const listItems = getCollection(listName);
      setCollection(newListName, listItems);
      removeCollection(listName);
      renderLists();
    });
  });
  setupCloseButton();
}

function setupCloseButton() {
  const closeBtnRefs = document.querySelectorAll(".la-times");
  closeBtnRefs.forEach((btn) => {
    btn.addEventListener("click", () => renderLists());
  });
}
