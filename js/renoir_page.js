async function fetchRenoirPaintings() {
  const loadingContainer = document.querySelector(".loading-container");
  const resultsDiv = document.getElementById("results");

  loadingContainer.style.display = "flex";

  try {
    // Hämta data om målningar av Auguste Renoir med medium "Paintings"
    const searchResponse = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/search?q=Auguste Renoir&medium=Paintings"
    );
    const searchData = await searchResponse.json();

    if (searchData.total === 0) {
      resultsDiv.innerHTML = "<p>No paintings found.</p>";
      return;
    }

    // Välj ID för målningar mellan index ...
    const paintingIDs = searchData.objectIDs.slice(7, 17);

    // Skapa en array av asynkrona promiser för varje målning med felhantering
    const paintings = paintingIDs.map(async (id) => {
      try {
        return await fetchPaintingDetails(id);
      } catch (error) {
        console.error(`Error fetching painting with ID ${id}:`, error);
        return null;
      }
    });

    // Vänta tills alla målningar har hämtats och filtrera bort null-värden
    const validPaintings = await Promise.all(paintings);
    const filteredPaintings = validPaintings.filter(Boolean);

    // Dölj laddningsanimation efter att alla data har hämtats
    loadingContainer.style.display = "none";

    if (filteredPaintings.length === 0) {
      resultsDiv.innerHTML = "<p>No paintings found matching the criteria.</p>";
    } else {
      resultsDiv.innerHTML = ""; // Rensa innehållet i resultsDiv och visa målningar
      filteredPaintings.forEach((painting) => resultsDiv.appendChild(painting));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    resultsDiv.innerHTML = "<p>An error occurred while loading data.</p>";
  }
}

// Funktion för att hämta detaljer om en viss målning baserat på dess ID
async function fetchPaintingDetails(id) {
  const response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  );
  const data = await response.json();

  // Kontrollera om målningen har en bild och att den är "oil on canvas"
  if (
    !data.primaryImageSmall ||
    !data.medium.toLowerCase().includes("oil on canvas")
  ) {
    return null;
  }

  // Skapa HTML-element för att visa information om målningen
  const paintingDiv = document.createElement("div");
  paintingDiv.classList.add("masonry-grid-item");

  const img = document.createElement("img");
  img.src = data.primaryImageSmall;
  img.alt = data.title;

  const overlay = document.createElement("div");
  overlay.classList.add("hover-overlay");

  const title = document.createElement("h2");
  title.textContent = data.title;

  const date = document.createElement("p");
  date.textContent = `Date: ${data.objectDate}`;

  const medium = document.createElement("p");
  medium.textContent = `Medium: ${data.medium}`;

  overlay.appendChild(title);
  overlay.appendChild(date);
  overlay.appendChild(medium);

  paintingDiv.appendChild(img);
  paintingDiv.appendChild(overlay);

  return paintingDiv;
}

// Starta funktionen efter att innehållet har laddats
document.addEventListener("DOMContentLoaded", fetchRenoirPaintings);
