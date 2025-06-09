// index.js

import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

import avatarImg from "../images/avatar.jpg";
import logoImg from "../images/Logo_(1).svg";
import pencilIcon from "../images/Group_2.svg";
import plusIcon from "../images/Group_26.svg";
import closeIcon from "../images/Group_27.svg";
import avatarPencilIcon from "../images/avatar_pencil.svg";

document.addEventListener("DOMContentLoaded", () => {
  // Inject images
  document.querySelector(".header__logo").src = logoImg;
  document.querySelector(".profile__pencil-icon").src = avatarPencilIcon;
  document.querySelector(".profile__edit-btn img").src = pencilIcon;
  document.querySelector(".profile__add-btn img").src = plusIcon;
  document.querySelectorAll(".modal__close-btn img").forEach((img) => {
    img.src = closeIcon;
  });

  // API
  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "b11e468b-3f59-4efb-985e-f8545b79cf07",
      "Content-Type": "application/json",
    },
  });

  // Elements
  const profileEditButton = document.querySelector(".profile__edit-btn");
  const cardModalButton = document.querySelector(".profile__add-btn");
  const avatarModalButton = document.querySelector(".profile__avatar-btn");

  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");
  const avatarImage = document.querySelector(".profile__avatar");

  const editProfileModal = document.querySelector("#edit-profile-modal");
  const avatarEditModal = document.querySelector("#avatar-modal");
  const cardModal = document.querySelector("#add-card-modal");
  const previewModal = document.querySelector("#preview-modal");

  const editFormElement = document.forms["edit-profile"];
  const editModalNameInput = editProfileModal.querySelector(
    "#profile-name-input"
  );
  const editModalDescription = editProfileModal.querySelector(
    "#profile-description-input"
  );
  const editSubmitButton = editFormElement.querySelector(".modal__submit-btn");

  const cardForm = document.forms["card__form"];
  const cardSubmitButton = cardForm.querySelector(".modal__submit-btn");
  const cardNameInput = cardModal.querySelector("#add-card-name-input");
  const cardLinkInput = cardModal.querySelector("#add-card-link-input");

  const avatarForm = document.forms["edit-avatar"];
  const avatarInput = avatarForm.querySelector("#profile-avatar-input");
  const avatarSubmitButton = avatarForm.querySelector(".modal__submit-btn");

  const previewModalImageEl = previewModal.querySelector(".modal__image");
  const previewModalCaption = previewModal.querySelector(".modal__caption");

  const cardTemplate = document.querySelector("#card-template");
  const cardsList = document.querySelector(".cards__list");

  const deleteModal = document.querySelector("#delete-modal");
  const confirmForm = document.forms["confirm-delete"];
  const deleteConfirmButton = confirmForm.querySelector(
    "button[type='submit']"
  );

  // 🆕 Cancel delete button listener
  const cancelDeleteButton = confirmForm.querySelector(
    ".modal__submit-btn_type_cancel-delete"
  );
  cancelDeleteButton.addEventListener("click", () => closeModal(deleteModal));

  let selectedCard = null;
  let selectedCardId = null;

  function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscKey);
  }

  function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscKey);
  }

  function handleEscKey(event) {
    if (event.key === "Escape") {
      const openModal = document.querySelector(".modal_opened");
      if (openModal) closeModal(openModal);
    }
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
    if (data.isLiked) {
      cardLikeButton.classList.add("card__like-button-liked");
    }

    cardLikeButton.addEventListener("click", () => {
      const isLiked = cardLikeButton.classList.contains(
        "card__like-button-liked"
      );
      const toggleLike = isLiked
        ? api.unlikeCard(data._id)
        : api.likeCard(data._id);

      toggleLike
        .then((updatedCard) => {
          cardLikeButton.classList.toggle(
            "card__like-button-liked",
            updatedCard.isLiked
          );
        })
        .catch((err) => {
          console.error("❌ Like/Unlike failed:", err);
        });
    });

    cardImageElement.addEventListener("click", () => {
      openModal(previewModal);
      previewModalImageEl.src = data.link;
      previewModalImageEl.alt = data.name;
      previewModalCaption.textContent = data.name;
    });

    cardDeleteButton.addEventListener("click", () => {
      selectedCard = cardElement;
      selectedCardId = data._id;
      openModal(deleteModal);
    });

    return cardElement;
  }

  function renderCard(item, method = "prepend") {
    const cardElement = getCardElement(item);
    cardsList[method](cardElement);
  }

  function handleAddCardSubmit(evt) {
    evt.preventDefault();

    const name = cardNameInput.value.trim();
    const link = cardLinkInput.value.trim();

    if (!name || !link) {
      alert("Please enter both a name and a valid image URL.");
      return;
    }

    cardSubmitButton.disabled = true;
    cardSubmitButton.textContent = "Saving...";

    api
      .addCard({ name, link })
      .then((cardData) => {
        renderCard(cardData, "prepend");
        cardForm.reset();
        closeModal(cardModal);
      })
      .catch((err) => console.error("❌ Error adding card:", err))
      .finally(() => {
        cardSubmitButton.disabled = false;
        cardSubmitButton.textContent = "Save";
      });
  }

  function handleEditFormSubmit(evt) {
    evt.preventDefault();
    const newName = editModalNameInput.value;
    const newAbout = editModalDescription.value;

    editSubmitButton.textContent = "Saving...";

    api
      .editUserInfo({ name: newName, about: newAbout })
      .then((data) => {
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        closeModal(editProfileModal);
      })
      .catch((err) => console.error("❌ Error updating user:", err))
      .finally(() => {
        editSubmitButton.textContent = "Save";
      });
  }

  function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const newAvatarLink = avatarInput.value.trim();

    if (!newAvatarLink) {
      alert("Please enter a valid image URL.");
      return;
    }

    avatarSubmitButton.textContent = "Saving...";

    api
      .updateAvatar({ avatar: newAvatarLink })
      .then((data) => {
        avatarImage.src = data.avatar;
        closeModal(avatarEditModal);
        avatarForm.reset();
      })
      .catch((err) => {
        console.error("❌ Error updating avatar:", err);
      })
      .finally(() => {
        avatarSubmitButton.textContent = "Save";
      });
  }

  confirmForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    if (!selectedCardId) return;

    deleteConfirmButton.textContent = "Deleting...";

    api
      .removeCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModal(deleteModal);
      })
      .catch((err) => {
        console.error("❌ Delete failed:", err);
      })
      .finally(() => {
        deleteConfirmButton.textContent = "Yes, Delete";
      });
  });

  document.querySelectorAll(".modal__close-btn").forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  profileEditButton.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescription.value = profileDescription.textContent;
    resetValidation(editFormElement, settings);
    openModal(editProfileModal);
  });

  cardModalButton.addEventListener("click", () => openModal(cardModal));
  avatarModalButton.addEventListener("click", () => openModal(avatarEditModal));

  editFormElement.addEventListener("submit", handleEditFormSubmit);
  cardForm.addEventListener("submit", handleAddCardSubmit);
  avatarForm.addEventListener("submit", handleAvatarFormSubmit);

  api
    .getAppInfo()
    .then(([cards, user]) => {
      cards.forEach((card) => {
        renderCard(card, "append");
      });
      avatarImage.src = user.avatar;
      profileName.textContent = user.name;
      profileDescription.textContent = user.about;
    })
    .catch((err) => {
      console.error("Failed to load cards or user info from API:", err);
    });

  enableValidation(settings);
});
