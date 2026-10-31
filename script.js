






const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || password.length < 8) {
    message.textContent = "Please enter valid details.";
    message.style.color = "red";
    return;
  }

  try {
    const response = await fetch(
      `${"http://localhost:5000"}/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      }
    );

    const result = await response.json();

    message.textContent = result.message;
    message.style.color = response.ok ? "green" : "red";

    if (response.ok) {
      registerForm.reset();
    }
  } catch (error) {
    message.textContent =
      "Backend connect avvaledu. Backend server run avutundo check cheyyi.";
    message.style.color = "red";
  }
});
