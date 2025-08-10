function adapterTexteEconomique() {
  const texteElem = document.getElementById("texte-economique");
  if (!texteElem) return;

  const textePC = "jjj";
  const texteMobile = "Voyagez moins cher en partageant les frais. EcoRide, c'est éco et écono ! 💸";

  texteElem.textContent = window.innerWidth <= 768 ? texteMobile : textePC;
}

// Appelle la fonction une fois que le contenu est chargé
document.addEventListener("DOMContentLoaded", () => {
  adapterTexteEconomique();
  window.addEventListener("resize", adapterTexteEconomique);
});

// Si tu utilises un routeur JS, tu peux aussi appeler adapterTexteEconomique()
// juste après avoir injecté le contenu de home.html


