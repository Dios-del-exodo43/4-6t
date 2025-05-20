"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("moviesContainer");
    const searchInput = document.getElementById("searchInput");
    const genreFilter = document.getElementById("genreFilter");
    const statusFilter = document.getElementById("statusFilter");
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    const closeBtn = document.getElementById("closeBtn");

    let allShows = [];

    async function fetchShows() {
        try {
            const response = await fetch("https://api.tvmaze.com/shows");
            const shows = await response.json();
            allShows = shows.slice(0, 50);
            populateFilters(allShows);
            renderShows(allShows);
        } catch (error) {
            console.error("Помилка при отриманні даних", error);
        }
    }









 //функція для заповнення фільтрів
    function populateFilters(shows) {
        const genres = new Set(); //Кколекція для зберігання жанрів
        const statuses = new Set(); ///////////////////////////////

        shows.forEach(show => {
            show.genres.forEach(g => genres.add(g));
            statuses.add(show.status);
        });

        genres.forEach(g => {
            genreFilter.innerHTML += `<option value="${g}">${g}</option>`;
        });

        statuses.forEach(s => {
            statusFilter.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }

// функція для відображення на сторінці
    function renderShows(shows) {
        container.innerHTML = "";

        const filtered = shows.filter(show => {
            const nameMatch = show.name.toLowerCase().includes(searchInput.value.toLowerCase());
            const genreMatch = !genreFilter.value || show.genres.includes(genreFilter.value);
            const statusMatch = !statusFilter.value || show.status === statusFilter.value;
            return nameMatch && genreMatch && statusMatch;
        });

        if (filtered.length === 0) {
            container.innerHTML = "<p>Нічого не знайдено.</p>";
            return;/////Якщо результатів немає - виводимо повідомлення і виходимо з функції
        }
        filtered.forEach(show => { //////створення картків для  фільмів
            const card = document.createElement("div");
            card.className = "movie-card";
            card.onclick = () => openModal(show);

            card.innerHTML = `
        <img src="${show.image?.medium || ''}" alt="${show.name}" class="poster"/>
        <div class="movie-info">
          <h3>${show.name}</h3>
          <p><strong>Жанр:</strong> ${show.genres.join(", ") || "Невідомо"}</p>
          <p><strong>Статус:</strong> ${show.status}</p>
        </div>
      `;
            container.appendChild(card);//додає елемент до DOM
        });
    }










//відкриває модальне вікно  з інформіцією про фільм
    function openModal(show) {
        modalBody.innerHTML = `
      <h2>${show.name}</h2>
      <img src="${show.image?.original || ''}" alt="${show.name}" />
      <p><strong>Жанри:</strong> ${show.genres.join(", ") || "Невідомо"}</p>
      <p><strong>Статус:</strong> ${show.status}</p>
      <p><strong>Прем'єра:</strong> ${show.premiered || "Невідомо"}</p>
      <p><strong>Опис:</strong> ${show.summary || "Без опису"}</p>
    `;
        modal.style.display = "flex";//Робить модальне вікно видимим
    }
//Закриває модальне вікно
    function closeModal() {
        modal.style.display = "none";
    }
//Обробники подій
    searchInput.addEventListener("input", () => renderShows(allShows));
    genreFilter.addEventListener("change", () => renderShows(allShows));
    statusFilter.addEventListener("change", () => renderShows(allShows));
    closeBtn.addEventListener("click", closeModal);

    fetchShows();////Викликає початкове завантаження даних з API
});
