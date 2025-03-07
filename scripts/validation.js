const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    // ✅ Added null check
    errorElement.textContent = errorMessage;
  }
  inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    // ✅ Added null check
    errorElement.textContent = "";
  }
  inputElement.classList.remove("modal__input_type_error");
};

const checkInputValidity = (inputElement) => {
  // ✅ Removed unnecessary formElement parameter
  if (!inputElement.validity.valid) {
    showInputError(
      inputElement.form,
      inputElement,
      inputElement.validationMessage
    );
  } else {
    hideInputError(inputElement.form, inputElement);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const disableButton = (buttonElement) => {
  // ✅ Moved before use
  buttonElement.disabled = true;
  buttonElement.classList.add("modal__submit-btn_disabled");
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("modal__submit-btn_disabled");
  }
};

const resetValidation = (formElement, inputList, buttonElement) => {
  // ✅ Added buttonElement parameter
  inputList.forEach((input) => hideInputError(formElement, input));
  toggleButtonState(inputList, buttonElement); // ✅ Reset button state
};

const setEventListener = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__submit-btn");

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(inputElement); // ✅ Removed formElement parameter
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formElement) => setEventListener(formElement));
};

enableValidation();
