document.addEventListener('DOMContentLoaded', function () {
  const roleButtons = document.querySelectorAll('.role-btn');
  const sections = {
    chauffeur: document.getElementById('section-chauffeur'),
    passager: document.getElementById('section-passager'),
    'les-deux': document.getElementById('section-les-deux')
  };

  roleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedRole = button.getAttribute('data-role');

      // Toggle active button style
      roleButtons.forEach(btn => btn.classList.remove('btn-light', 'active'));
      button.classList.add('btn-light', 'active');

      // Hide all sections
      Object.values(sections).forEach(section => section.classList.add('d-none'));

      // Show selected section
      if (sections[selectedRole]) {
        sections[selectedRole].classList.remove('d-none');
      }
    });
  }); 
}); 




