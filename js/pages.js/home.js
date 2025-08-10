const textes = {
  "texte-economique": {
    pc: "EcoRide, ce n’est pas seulement se déplacer, c’est aussi rencontrer de nouvelles personnes. Chaque trajet est une opportunité d’échanger, de partager des histoires, ou même de créer de nouvelles amitiés. Le covoiturage rapproche les gens et transforme vos voyages en moments agréables. Avec nous, la route devient un espace de convivialité et de bonne humeur.",
    mobile: "Voyagez moins cher en partageant les frais. EcoRide, c'est éco et écono ! 💸"
  },
  "texte-ecologique": {
    pc: "Voyager avec EcoRide, c’est contribuer directement à la réduction des émissions de CO₂. En partageant vos trajets avec d’autres voyageurs, vous diminuez le nombre de voitures sur les routes, réduisez la pollution de l’air et participez à la protection de notre planète. Chaque kilomètre partagé est un geste concret pour un avenir plus vert. Ensemble, faisons du covoiturage un moteur de changement écologique.",
    mobile: "Moins de CO₂, plus de planète 🌍"
  },
  "texte-convivial": {
    pc: "EcoRide, ce n’est pas seulement se déplacer, c’est aussi rencontrer de nouvelles personnes. Chaque trajet est une opportunité d’échanger, de partager des histoires, ou même de créer de nouvelles amitiés. Le covoiturage rapproche les gens et transforme vos voyages en moments agréables. Avec nous, la route devient un espace de convivialité et de bonne humeur.",
    mobile: "Des trajets sympas, des gens cool 😄"
  }
};

function adapterTexte(id) {
  const elem = document.getElementById(id);
  if (!elem) return;
  const isMobile = window.innerWidth <= 768;
  const contenu = textes[id];
  if (contenu) {
    elem.textContent = isMobile ? contenu.mobile : contenu.pc;
  }
}

function observerTexte(id) {
  const observer = new MutationObserver(() => {
    const elem = document.getElementById(id);
    if (elem) {
      adapterTexte(id);
      window.addEventListener("resize", () => adapterTexte(id));
      observer.disconnect();
    }
  });

  const mainPage = document.getElementById("main-page");
  if (mainPage) {
    observer.observe(mainPage, {
      childList: true,
      subtree: true
    });
  }
}

// Lance l’observation pour chaque id
Object.keys(textes).forEach(id => observerTexte(id));
