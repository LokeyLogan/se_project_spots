// CSS and JS module imports
import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// 🔽 Image imports
import avatarImg from "../images/avatar.jpg";
import logoImg from "../images/Logo_(1).svg";
import pencilIcon from "../images/Group_2.svg";
import plusIcon from "../images/Group_26.svg";
import closeIcon from "../images/Group_27.svg";

// 🔽 Inject images into the DOM
document.querySelector(".header__logo").src = logoImg;
document.querySelector(".profile__edit-btn img").src = pencilIcon;
document.querySelector(".profile__add-btn img").src = plusIcon;

const closeBtns = document.querySelectorAll(".modal__close-btn img");
closeBtns.forEach((img) => (img.src = closeIcon));

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "b11e468b-3f59-4efb-985e-f8545b79cf07",
    "Content-Type": "application/json",
  },
});

// 🔽 DOM element references
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarImage = document.querySelector(".profile__avatar");

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
const cardForm = document.forms["card__form"];
const cardSubmitButton = cardForm.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

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

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

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

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescription.value;
  closeModal(editProfileModal);
}

document.querySelectorAll(".modal__close-btn").forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescription.value = profileDescription.textContent;
  resetValidation(editFormElement, settings);
  openModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => openModal(cardModal));
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

function handleEscKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
}

enableValidation(settings);

// 🔽 Load cards + user info
api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      renderCard({ name: card.name, link: card.link }, "append");
    });

    avatarImage.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch((err) => {
    console.error("Failed to load cards or user info from API:", err);
  });
