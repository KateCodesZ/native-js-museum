function loadMenu() {
  fetch("nav-menu.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("menu-container").innerHTML = data;

      const menu = document.querySelector(".menu");
      const btn = menu.querySelector(".nav-tgl");
      btn.addEventListener("click", () => {
        menu.classList.toggle("active");
      });
    })
    .catch((error) => console.error("Error loading menu:", error));
}

document.addEventListener("DOMContentLoaded", loadMenu);
