(() => {
  // Données mock (remplace par un fetch plus tard)
  const trajets = [
    {
      id: 1,
      depart: "Bayonne",
      arrivee: "Pau",
      date: "2025-08-12",
      conducteur: "Jean Dupont",
      prix: 8,
      duree: 90,
      note: 4,
      ecologique: true,
      places: 2,
      heure: "08:30"
    },
    {
      id: 2,
      depart: "Biarritz",
      arrivee: "Bordeaux",
      date: "2025-08-12",
      conducteur: "Clara Martin",
      prix: 15,
      duree: 135,
      note: 3,
      ecologique: false,
      places: 3,
      heure: "10:15"
    }
  ];

  // Utils
  const pad2 = n => String(n).padStart(2, "0");
  const formatDuree = min => `${Math.floor(min/60)}h${pad2(min%60)}`;
  const etoiles = n => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

  // Affichage des trajets
  function afficherTrajets(list, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!list.length) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning mb-0">Aucun trajet ne correspond à votre recherche.</div>
        </div>`;
      return;
    }

    const cards = list.map(t => `
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title mb-2">${t.depart} ➡️ ${t.arrivee}</h5>
              ${t.ecologique ? '<span class="badge bg-success">ÉCO</span>' : ''}
            </div>
            <p class="text-muted mb-2">${t.date} • ${t.heure ?? ""}</p>
            <p class="card-text mb-2">
              🚗 Conducteur : ${t.conducteur}<br>
              🪑 Places dispo : ${t.places}<br>
              ⏱️ Durée : ${formatDuree(t.duree)}
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${t.prix}€</strong>
                <span class="ms-2" aria-label="note">${etoiles(t.note)}</span>
              </div>
              <a href="trajet-detail.html?id=${encodeURIComponent(t.id)}" class="btn btn-primary">
                Voir le trajet
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    container.innerHTML = cards;
  }

  // Filtres
  function filtrerTrajets() {
    console.log("→ filtrage lancé");

    const depart = document.getElementById("inputDepart").value.trim().toLowerCase();
    const arrivee = document.getElementById("inputArrivee").value.trim().toLowerCase();
    const date = document.getElementById("inputDate").value || "2025-08-12";
    const prixMax = parseInt(document.getElementById("filtrePrix").value, 10);
    const dureeMax = parseInt(document.getElementById("filtreDuree").value, 10);
    const noteMin = parseInt(document.getElementById("filtreNote").value, 10);
    const eco = document.getElementById("filtreEco").value;

    const res = trajets.filter(t => {
      return (
        (!depart || t.depart.toLowerCase().includes(depart)) &&
        (!arrivee || t.arrivee.toLowerCase().includes(arrivee)) &&
        (!date || t.date === date) &&
        (!prixMax || t.prix <= prixMax) &&
        (!dureeMax || t.duree <= dureeMax) &&
        (!noteMin || t.note >= noteMin) &&
        (!eco || (eco === "oui" ? t.ecologique : !t.ecologique))
      );
    });

    console.log("→ Résultats trouvés :", res);
    afficherTrajets(res, "resultatsTrajets");
  }

  // Recommandations
  function recommanderTrajets() {
    const topNotes = [...trajets].sort((a, b) => b.note - a.note).slice(0, 2);
    const moinsChers = [...trajets].sort((a, b) => a.prix - b.prix).slice(0, 2);
    const eco = trajets.filter(t => t.ecologique).slice(0, 2);

    afficherTrajets(topNotes, "recommendNote");
    afficherTrajets(moinsChers, "recommendCheap");
    afficherTrajets(eco, "recommendEco");
  }

  // Initialisation
  function init() {
    recommanderTrajets();
    afficherTrajets(trajets, "resultatsTrajets");

    const form = document.getElementById("rechercheForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      filtrerTrajets();
    });

    ["filtrePrix", "filtreDuree", "filtreNote", "filtreEco"].forEach(id => {
      document.getElementById(id).addEventListener("change", filtrerTrajets);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
