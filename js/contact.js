const contactForm = document.querySelector("#contactForm");
const messageBox = document.querySelector(".messageBox");
const contactFormSubmitButton = document.querySelector(".contactFormSubmitButton");

//////////////////////////////////////

const contactName = document.querySelector("#contactName");
const contactNameError = document.querySelector(".contactNameError");

const contactEmail = document.querySelector("#contactEmail");
const contactEmailError = document.querySelector(".contactEmailError");

const contactSubject = document.querySelector("#contactSubject");
const contactSubjectError = document.querySelector(".contactSubjectError");

const contactContent = document.querySelector("#contactContent");
const contactContentError = document.querySelector(".contactContentError");

//////////////////////////////////////

const submitFormApiLink = "https://ehtoday.one/assignments/dand/wp-json/contact-form-7/v1/contact-forms/77/feedback";

contactName.addEventListener("focusout", validateName);
contactEmail.addEventListener("focusout", validateEmail);
contactSubject.addEventListener("focusout", validateSubject);
contactContent.addEventListener("focusout", validateContent);
contactForm.addEventListener("submit", postContactForm);

async function postContactForm(Event) {

    Event.preventDefault();

    const contactFormData = new FormData();

    contactFormData.append("your-name", contactName.value.trim());
    contactFormData.append("your-email", contactEmail.value.trim());
    contactFormData.append("your-subject", contactSubject.value.trim());
    contactFormData.append("your-message", contactContent.value.trim());

    const contactFormPostRequest = await fetch(submitFormApiLink, {
            method: 'POST',
            headers: {
            },
            body: contactFormData
        });

    const postResponse = await contactFormPostRequest.json();
    console.log(postResponse);

    messageBox.style.display = "flex";
    messageBox.innerHTML = `<p>${postResponse.message}</p>`;
    setTimeout(function() {
        messageBox.style.display = "none";
        }, 1500);
}

// Main Validation Functions

function emailValidator(email) {
    const regularExpression = /\S+@\S+\.\S+/;
    const checkIfValid = regularExpression.test(email.value.trim());
    return checkIfValid;
}

function characterValidatorMainFunction(valueToCheck, requiredValue) {
    if (valueToCheck.value.trim().length >= requiredValue) {
        return true;
    } else {
        return false;
    }
}

// Input Validation Functions

function validateName() {
    if (characterValidatorMainFunction(contactName, 5) === true) {
        contactNameError.style.display = "none";
    } else {
        contactNameError.style.display = "flex";
    }

}

function validateEmail() {
    if (emailValidator(contactEmail) === true) {
        contactEmailError.style.display = "none";
    } else {
        contactEmailError.style.display = "flex";
    }
}

function validateSubject() {
    if (characterValidatorMainFunction(contactSubject, 15) === true) {
        contactSubjectError.style.display = "none";
    } else {
        contactSubjectError.style.display = "flex";
    }

}

function validateContent() {
    if (characterValidatorMainFunction(contactContent, 25) === true) {
        contactContentError.style.display = "none";
    } else {
        contactContentError.style.display = "flex";
    }

}