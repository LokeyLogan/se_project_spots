const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = document.forms["edit-profile"];
const editModalDescription = editProfileModal.querySelector(
  "#profile-description-input"
);
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["card__form"]; // ✅ Matches the actual form name
const cardSubmitButton = cardForm.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// ✅ Ensure `settings` and `disableButton` exist
const settings = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
};

// Dummy function for `disableButton`, make sure it's defined properly
function disableButton(button, settings) {
  button.classList.add(settings.inactiveButtonClass);
  button.disabled = true;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey); // ✅ Add listener when modal opens
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey); // ✅ Remove listener when modal closes
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button-liked");
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

// 🚀 Universal function to render a card with customizable insertion method
function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  if (method === "prepend") {
    cardsList.prepend(cardElement);
  } else {
    cardsList.append(cardElement);
  }
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  disableButton(cardSubmitButton, settings);

  const inputValues = {
    name: cardNameInput.value.trim(),
    link: cardLinkInput.value.trim(),
  };

  if (!inputValues.name || !inputValues.link) {
    alert("Please enter both a name and a valid image URL.");
    return;
  }

  renderCard(inputValues, "prepend");
  cardForm.reset();

  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

// ✅ FIX: Profile Edit Modal Closes After Clicking "Save"
function handleEditFormSubmit(evt) {
  evt.preventDefault();

  // Update profile text
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescription.value;

  // ✅ Reset validation
  resetValidation(editFormElement, settings);

  closeModal(editProfileModal);
}

// 🚀 Universal close button handler
const closeButtons = document.querySelectorAll(".modal__close-btn");
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  if (modal) {
    button.addEventListener("click", () => closeModal(modal));
  }
});

// ✅ Reset validation when opening edit profile modal
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescription.value = profileDescription.textContent;

  resetValidation(editFormElement, settings);
  openModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => openModal(cardModal));

// ✅ Form submissions
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

// 📥 Load initial cards using the new renderCard function
initialCards.forEach((item) => renderCard(item, "append"));

// 🚀 Close modal when clicking on the overlay
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

function handleEscKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}
