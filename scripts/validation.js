function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
  inputElement.classList.add(settings.inputErrorClass);
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = "";
  }
  inputElement.classList.remove(settings.inputErrorClass);
}

function checkInputValidity(inputElement, settings) {
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
}

function hasInvalidInput(inputList) {
  return inputList.some((input) => !input.validity.valid);
}

function disableButton(buttonElement, settings) {
  if (!buttonElement) return;
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (!buttonElement) return;

  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, settings);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

function resetValidation(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  toggleButtonState(inputList, buttonElement, settings);
}

// ✅ Attach resetValidation to window for global use
window.resetValidation = resetValidation;

function enableValidation(settings) {
  const formList = document.querySelectorAll(settings.formSelector);
  formList.forEach((formElement) => {
    formElement.addEventListener("reset", () => {
      disableButton(
        formElement.querySelector(settings.submitButtonSelector),
        settings
      );
    });

    formElement
      .querySelectorAll(settings.inputSelector)
      .forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
          checkInputValidity(inputElement, settings);
          toggleButtonState(
            [...formElement.querySelectorAll(settings.inputSelector)],
            formElement.querySelector(settings.submitButtonSelector),
            settings
          );
        });
      });
  });
}

enableValidation(settings);
