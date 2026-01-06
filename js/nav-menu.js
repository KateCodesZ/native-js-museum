function loadMenu() {
  fetch("nav-menu.html")
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById("menu-container");

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      container.replaceChildren(...doc.body.children);

      const menu = document.querySelector(".menu");
      const btn = menu.querySelector(".nav-tgl");

      btn.addEventListener("click", () => {
        menu.classList.toggle("active");
      });
    })
    .catch((error) => console.error("Error loading menu:", error));
}

document.addEventListener("DOMContentLoaded", loadMenu);
