(() => {
  const DB_KEY = 'covoit_db';
  const ROLE_KEY = 'roleChoisi';

  // --- Helpers DB (localStorage) ---
  const uid = (p='id') => p + '_' + Math.random().toString(36).slice(2, 9);
  const loadDB = () => {
    const db = JSON.parse(localStorage.getItem(DB_KEY)) || null;
    if (db) return db;
    const seed = {
      user: { id: 'u1', pseudo: 'JB', email: 'jb@example.com', credits: 20, roles: [], prefs: { fumeur: 'non', animal: 'non', custom: [] } },
      vehicles: [],
      trips: [],
      bookings: [], // {id, tripId, userId, places, status}
      reviews: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  };
  const saveDB = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

  let db = loadDB();

  // --- Sélecteurs ---
  const roleButtons = document.querySelectorAll('.role-btn');
  const sections = document.querySelectorAll('.form-section');
  const infoRole = document.getElementById('info-role');

  const secPassager = document.getElementById('section-passager');
  const secChauffeur = document.getElementById('section-chauffeur');

  // Passager
  const creditsPassager = document.getElementById('credits-passager');
  const listeReservations = document.getElementById('liste-reservations');

  // Chauffeur - prefs
  const formPrefs = document.getElementById('form-prefs');
  const prefFumeur = document.getElementById('pref-fumeur');
  const prefAnimal = document.getElementById('pref-animal');
  const prefCustomInput = document.getElementById('pref-custom-input');
  const prefCustomList = document.getElementById('pref-custom-list');
  const addPrefCustomBtn = document.getElementById('add-pref-custom');

  // Chauffeur - véhicules
  const formVehicule = document.getElementById('form-vehicule');
  const vImmat = document.getElementById('v-immat');
  const vFirstDate = document.getElementById('v-firstdate');
  const vMarque = document.getElementById('v-marque');
  const vModele = document.getElementById('v-modele');
  const vCouleur = document.getElementById('v-couleur');
  const vEnergie = document.getElementById('v-energie');
  const listeVehicules = document.getElementById('liste-vehicules');

  // Chauffeur - trajets
  const formTrajet = document.getElementById('form-trajet');
  const tDepart = document.getElementById('t-depart');
  const tArrivee = document.getElementById('t-arrivee');
  const tDate = document.getElementById('t-date');
  const tPlaces = document.getElementById('t-places');
  const tPrix = document.getElementById('t-prix');
  const tVehicule = document.getElementById('t-vehicule');
  const listeTrajets = document.getElementById('liste-trajets');

  // Déconnexion
  document.getElementById('signout-btn')?.addEventListener('click', () => {
    localStorage.removeItem(ROLE_KEY);
    // Ici, tu pourras aussi supprimer un token/session côté API plus tard
    window.location.href = '/'; // Redirection vers la page d'acceuil
  });

  // --- Rôles & affichage sections ---
  function afficherSection(role) {
    sections.forEach(s => s.classList.add('d-none'));
    const active = document.getElementById(`section-${role}`);
    active?.classList.remove('d-none');
    infoRole.textContent = `Vous êtes sur l’espace ${role}`;
    localStorage.setItem(ROLE_KEY, role);
    if (!db.user.roles.includes(role)) {
      db.user.roles.push(role);
      saveDB(db);
    }
    render(); // re-render contextuel
  }

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => afficherSection(btn.dataset.role.toLowerCase()));
  });

  const roleSauvegarde = localStorage.getItem(ROLE_KEY);
  afficherSection(roleSauvegarde || 'passager');

  // --- Render global (selon section visible) ---
  function render() {
    db = loadDB();

    // Passager
    if (!secPassager.classList.contains('d-none')) {
      creditsPassager.textContent = `${db.user.credits} crédits`;
      renderReservations();
    }

    // Chauffeur
    if (!secChauffeur.classList.contains('d-none')) {
      // Prefs
      prefFumeur.value = db.user.prefs?.fumeur || 'non';
      prefAnimal.value = db.user.prefs?.animal || 'non';
      renderCustomPrefs();

      // Véhicules
      renderVehicules();
      fillVehiculesSelect();

      // Trajets
      renderTrajets();
    }
  }

  // --- Passager: réservations (mock) ---
  function renderReservations() {
    listeReservations.innerHTML = '';
    const mine = db.bookings.filter(b => b.userId === db.user.id);
    if (mine.length === 0) {
      listeReservations.innerHTML = `<li class="list-group-item">Aucune réservation pour le moment.</li>`;
      return;
    }
    mine.forEach(b => {
      const trip = db.trips.find(t => t.id === b.tripId);
      if (!trip) return;
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${trip.depart} → ${trip.arrivee}</div>
          <div class="text-muted small">${new Date(trip.dateDepart).toLocaleString()} — ${b.places} place(s) — ${b.status}</div>
        </div>
        <button class="btn btn-outline-danger btn-sm" ${b.status==='annule'?'disabled':''} data-cancel="${b.id}">Annuler</button>
      `;
      listeReservations.appendChild(li);
    });

    listeReservations.addEventListener('click', (e) => {
      const id = e.target?.dataset?.cancel;
      if (!id) return;
      const booking = db.bookings.find(b => b.id === id);
      if (!booking) return;
      const trip = db.trips.find(t => t.id === booking.tripId);
      if (!trip) return;
      booking.status = 'annule';
      trip.placesRestantes = Math.min(trip.placesTotal, (trip.placesRestantes || 0) + booking.places);
      db.user.credits += booking.places * (trip.prix); // simple refund mock
      saveDB(db);
      render();
    }, { once: true }); // évite double rattachement
  }

  // --- Chauffeur: préférences ---
  function renderCustomPrefs() {
    prefCustomList.innerHTML = '';
    const items = db.user.prefs?.custom || [];
    if (items.length === 0) {
      prefCustomList.innerHTML = `<span class="text-muted small">Aucune préférence personnalisée</span>`;
      return;
    }
    items.forEach((txt, idx) => {
      const badge = document.createElement('span');
      badge.className = 'badge text-bg-secondary';
      badge.innerHTML = `${txt} <button type="button" class="btn-close btn-close-white btn-sm ms-1" data-remove="${idx}" aria-label="Supprimer"></button>`;
      prefCustomList.appendChild(badge);
    });
  }

  addPrefCustomBtn?.addEventListener('click', () => {
    const val = prefCustomInput.value.trim();
    if (!val) return;
    db.user.prefs.custom = db.user.prefs.custom || [];
    db.user.prefs.custom.push(val);
    saveDB(db);
    prefCustomInput.value = '';
    renderCustomPrefs();
  });

  prefCustomList?.addEventListener('click', (e) => {
    const idx = e.target?.dataset?.remove;
    if (idx === undefined) return;
    db.user.prefs.custom.splice(Number(idx), 1);
    saveDB(db);
    renderCustomPrefs();
  });

  formPrefs?.addEventListener('submit', (e) => {
    e.preventDefault();
    db.user.prefs = {
      fumeur: prefFumeur.value,
      animal: prefAnimal.value,
      custom: db.user.prefs.custom || []
    };
    saveDB(db);
    alert('Préférences enregistrées');
  });

  // --- Chauffeur: véhicules ---
  function renderVehicules() {
    listeVehicules.innerHTML = '';
    if (db.vehicles.length === 0) {
      listeVehicules.innerHTML = `<li class="list-group-item">Aucun véhicule</li>`;
      return;
    }
    db.vehicles.forEach(v => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${v.marque} ${v.modele} — ${v.couleur || '—'}</div>
          <div class="small text-muted">${v.immat} • ${v.energie} • 1ère immat: ${v.firstRegDate}</div>
        </div>
        <button class="btn btn-outline-danger btn-sm" data-del="${v.id}">Supprimer</button>
      `;
      listeVehicules.appendChild(li);
    });

    listeVehicules.addEventListener('click', (e) => {
      const id = e.target?.dataset?.del;
      if (!id) return;
      db.vehicles = db.vehicles.filter(v => v.id !== id);
      // supprimer trajets associés au véhicule supprimé (optionnel)
      db.trips = db.trips.filter(t => t.vehicleId !== id);
      saveDB(db);
      render();
    }, { once: true });
  }

  formVehicule?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = {
      id: uid('veh'),
      ownerId: db.user.id,
      immat: vImmat.value.trim(),
      firstRegDate: vFirstDate.value,
      marque: vMarque.value.trim(),
      modele: vModele.value.trim(),
      couleur: vCouleur.value.trim(),
      energie: vEnergie.value
    };
    if (!v.immat || !v.firstRegDate || !v.marque || !v.modele) {
      alert('Champs obligatoires manquants');
      return;
    }
    db.vehicles.push(v);
    saveDB(db);
    formVehicule.reset();
    render();
  });

  function fillVehiculesSelect() {
    tVehicule.innerHTML = '';
    if (db.vehicles.length === 0) {
      tVehicule.innerHTML = `<option value="">Ajoute un véhicule d’abord</option>`;
      return;
    }
    db.vehicles.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.marque} ${v.modele} (${v.immat})`;
      tVehicule.appendChild(opt);
    });
  }

  // --- Chauffeur: trajets ---
  function renderTrajets() {
    listeTrajets.innerHTML = '';
    const mine = db.trips.filter(t => t.driverId === db.user.id);
    if (mine.length === 0) {
      listeTrajets.innerHTML = `<li class="list-group-item">Aucun trajet pour le moment.</li>`;
      return;
    }

    mine.sort((a,b) => new Date(a.dateDepart) - new Date(b.dateDepart));

    mine.forEach(t => {
      const badgeEco = t.eco ? '<span class="badge text-bg-success ms-2">Éco</span>' : '';
      const status = t.status || 'programme';
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-semibold">${t.depart} → ${t.arrivee} ${badgeEco}</div>
            <div class="small text-muted">
              ${new Date(t.dateDepart).toLocaleString()}
              • ${t.placesRestantes}/${t.placesTotal} places
              • ${t.prix} crédits
              • Statut: ${status.replace('_', ' ')}
            </div>
          </div>
          <div class="btn-group">
            ${status==='programme' ? `<button class="btn btn-outline-primary btn-sm" data-start="${t.id}">Démarrer</button>` : ''}
            ${status==='en_cours' ? `<button class="btn btn-outline-success btn-sm" data-stop="${t.id}">Arrivée à destination</button>` : ''}
            <button class="btn btn-outline-danger btn-sm" data-cancel-trip="${t.id}" ${status!=='programme'?'disabled':''}>Annuler</button>
          </div>
        </div>
      `;
      listeTrajets.appendChild(li);
    });

    listeTrajets.addEventListener('click', (e) => {
      const startId = e.target?.dataset?.start;
      const stopId = e.target?.dataset?.stop;
      const cancelId = e.target?.dataset?.cancelTrip;

      if (startId) {
        const trip = db.trips.find(t => t.id === startId);
        if (trip) {
          trip.status = 'en_cours';
          saveDB(db);
          render();
        }
      }
      if (stopId) {
        const trip = db.trips.find(t => t.id === stopId);
        if (trip) {
          trip.status = 'termine';
          // Créditer le chauffeur (prix − 2 crédits) × places vendues (mock)
          const placesVendues = (trip.placesTotal - (trip.placesRestantes ?? trip.placesTotal));
          const gain = Math.max(0, (trip.prix - 2)) * placesVendues;
          db.user.credits += gain;
          saveDB(db);
          render();
          alert(`Trajet terminé. Gain crédité: ${gain} crédits.`);
        }
      }
      if (cancelId) {
        const trip = db.trips.find(t => t.id === cancelId);
        if (trip && (trip.status || 'programme') === 'programme') {
          // Notifier passagers (placeholder), rembourser (mock)
          const bookings = db.bookings.filter(b => b.tripId === trip.id && b.status !== 'annule');
          bookings.forEach(b => { b.status = 'annule'; /* rembourser mock côté passager si on gérait multi-users */ });
          db.trips = db.trips.filter(t => t.id !== cancelId);
          saveDB(db);
          render();
        }
      }
    }, { once: true });
  }

  formTrajet?.addEventListener('submit', (e) => {
    e.preventDefault();
    const vehId = tVehicule.value;
    const veh = db.vehicles.find(v => v.id === vehId);
    if (!veh) {
      alert('Ajoute un véhicule avant de publier un trajet.');
      return;
    }
    const placesTot = Number(tPlaces.value);
    const trip = {
      id: uid('trip'),
      driverId: db.user.id,
      vehicleId: vehId,
      depart: tDepart.value.trim(),
      arrivee: tArrivee.value.trim(),
      dateDepart: new Date(tDate.value).toISOString(),
      prix: Number(tPrix.value),
      placesTotal: placesTot,
      placesRestantes: placesTot,
      eco: veh.energie === 'electrique',
      status: 'programme'
    };
    if (!trip.depart || !trip.arrivee || !trip.dateDepart || !trip.prix || !placesTot) {
      alert('Champs obligatoires manquants');
      return;
    }
    db.trips.push(trip);
    saveDB(db);
    formTrajet.reset();
    render();
    alert('Trajet publié ✅');
  });

  // Initial render
  render();
})();



