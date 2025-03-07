const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
  inputElement.classList.add(settings.inputErrorClass); // ✅ Now using settings object
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = "";
  }
  inputElement.classList.remove(settings.inputErrorClass); // ✅ Now using settings object
};

const checkInputValidity = (inputElement, settings) => {
  if (!inputElement.validity.valid) {
    showInputError(
      inputElement.form,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  } else {
    hideInputError(inputElement.form, inputElement, settings);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const disableButton = (buttonElement, settings) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass); // ✅ Now using settings object
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (!buttonElement) {
    console.warn("toggleButtonState: buttonElement is undefined");
    return;
  }

  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, settings);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass); // ✅ Now using settings object
  }
};

const resetValidation = (formElement, inputList, settings) => {
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );
  if (!buttonElement) {
    console.warn(
      "resetValidation: No submit button found for form",
      formElement
    );
    return;
  }

  inputList.forEach((input) => hideInputError(formElement, input, settings));
  toggleButtonState(inputList, buttonElement, settings);
};

const setEventListener = (formElement, settings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  if (!buttonElement) {
    console.warn(
      "setEventListener: No submit button found in form",
      formElement
    );
    return;
  }

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const enableValidation = (settings) => {
  const formList = document.querySelectorAll(settings.formSelector);
  formList.forEach((formElement) => setEventListener(formElement, settings));
};

enableValidation(settings);
