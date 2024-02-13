function attachSignupFormListener() {
  const signupForm = document.querySelector(".signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitSignupForm();
    });
  }
}

function submitSignupForm() {
  const formData = new FormData(document.querySelector(".signup-form"));
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}
