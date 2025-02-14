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

// Select necessary DOM elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Select modal and its elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = document.forms["edit-profile"];
const editModalDescription = editProfileModal.querySelector(
  "#profile-description-input"
);
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  //TODO - Make image appear when adding card
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(cardModal);
}

function getCardElement(data) {
  console.log(data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
  });
  //TODO - set the listener on delete button

  return cardElement;
}

const editModalCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);

// Function to open the modal
function openModal(modal) {
  modal.classList.add("modal_opened");
}

// Function to close the modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescription.value;
  closeModal(editProfileModal);
}

// Add event listeners to buttons
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescription.value = profileDescription.textContent;
  openModal(editProfileModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn?.addEventListener("click", () => {
  closeModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
  console.log(item);
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
