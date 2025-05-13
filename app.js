const container = document.getElementById("moviesContainer");

function renderShows(shows) {
    container.innerHTML = "";

    shows.forEach(show => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
      <img src="${show.image?.medium || ''}" alt="${show.name}" class="poster"/>
      <div class="movie-info">
        <h3>${show.name}</h3>
        <p><strong>Жанр:</strong> ${show.genres.join(", ") || "Невідомо"}</p>
        <p><strong>Статус:</strong> ${show.status}</p>
      </div>
    `;

        container.appendChild(card);
    });
}

fetchShows().then(renderShows);