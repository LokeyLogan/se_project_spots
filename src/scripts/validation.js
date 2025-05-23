export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) errorElement.textContent = errorMessage;
  inputElement.classList.add(settings.inputErrorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) errorElement.textContent = "";
  inputElement.classList.remove(settings.inputErrorClass);
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
  if (!buttonElement) return;
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (!buttonElement) return;
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, settings);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
};

const resetValidation = (formElement, settings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  inputList.forEach((inputElement) =>
    hideInputError(formElement, inputElement, settings)
  );
  toggleButtonState(inputList, buttonElement, settings);
};

const setEventListener = (formElement, settings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

export const enableValidation = (settings) => {
  const formList = document.querySelectorAll(settings.formSelector);
  formList.forEach((formElement) => setEventListener(formElement, settings));
};

export { resetValidation };
