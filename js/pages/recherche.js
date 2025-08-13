document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rechercheForm');
  const input = document.getElementById('queryInput');
  const button = document.getElementById('searchBtn');

  // Désactive le bouton au départ
  button.disabled = true;

  // Active ou désactive le bouton selon la saisie
  input.addEventListener('input', () => {
    const valeur = input.value.trim();
    button.disabled = valeur === '';
  });

  // Empêche la soumission si le champ est vide ou contient juste des espaces
  form.addEventListener('submit', (e) => {
    const valeur = input.value.trim();
    if (valeur === '') {
      e.preventDefault();
      alert('Veuillez entrer une recherche avant de valider.');
    }
  });
});
