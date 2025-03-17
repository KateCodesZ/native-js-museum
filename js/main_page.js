// Animering vid hero rullning
window.onscroll = () => {
  const scrollY = window.scrollY;
  const textElement = document.querySelector(".text");
  const heroElement = document.querySelector(".hero");

  if (scrollY < 500) {
    textElement.style.top = -scrollY + "px";
    heroElement.style.backgroundPositionY = scrollY * 0.5 + "px";
  }
};


// Initialisera karusellen - utställningar
const myCarouselElement = document.querySelector("#carouselExampleCaptions");

const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: 3000,
  touch: true,
  wrap: true,
});
