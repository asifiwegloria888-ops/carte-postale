/* ==========================================================================
   CARTE D'ANNIVERSAIRE - PETIT PROGRAMME (JavaScript)
   Il fait deux choses :
     1. faire monter des coeurs sur l'ecran ;
     2. tourner les pages : avec les boutons, les fleches du clavier,
        ou en glissant le doigt sur le telephone.
   ========================================================================== */

/* ---------- 1. LES COEURS QUI MONTENT ---------- */
(function () {
  var conteneur = document.querySelector(".coeurs");          // la boite vide prevue dans chaque page
  if (!conteneur) return;

  // combien de coeurs ? On lit le reglage ecrit dans la page : <body data-coeurs="16">
  var nombre = parseInt(document.body.getAttribute("data-coeurs"), 10) || 16;
  var formes = ["♥", "♡", "♥", "✦"];                            // les petits dessins utilises

  for (var i = 0; i < nombre; i++) {
    var c = document.createElement("span");
    c.className = "coeur-flottant";
    c.textContent = formes[Math.floor(Math.random() * formes.length)];
    c.style.left = Math.random() * 100 + "%";                                  // position de depart
    c.style.fontSize = 14 + Math.random() * 22 + "px";                         // taille
    c.style.animationDuration = 9 + Math.random() * 9 + "s";                   // vitesse
    c.style.animationDelay = -Math.random() * 14 + "s";                        // ils ne partent pas tous ensemble
    c.style.setProperty("--opacite", (0.25 + Math.random() * 0.35).toFixed(2));
    c.style.setProperty("--derive", ((Math.random() * 2 - 1) * 60).toFixed(0) + "px");
    conteneur.appendChild(c);
  }
})();


/* ---------- 2. TOURNER LES PAGES ---------- */
(function () {
  var suivant = document.querySelector("[data-suivant]");        // le lien marque data-suivant dans la page
  var precedent = document.querySelector("[data-precedent]");    // le lien marque data-precedent

  // la carte "s'envole" un instant, puis on ouvre la page demandee
  function aller(adresse) {
    var carte = document.querySelector(".carte");
    if (carte) carte.classList.add("sortie");
    setTimeout(function () { window.location.href = adresse; }, 320);
  }

  // 2a. un clic sur un bouton
  Array.prototype.forEach.call(document.querySelectorAll(".bouton[href]"), function (lien) {
    lien.addEventListener("click", function (e) {
      e.preventDefault();
      aller(lien.getAttribute("href"));
    });
  });

  // 2b. les fleches du clavier (sur ordinateur)
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" && suivant) aller(suivant.getAttribute("href"));
    if (e.key === "ArrowLeft" && precedent) aller(precedent.getAttribute("href"));
  });

  // 2c. glisser le doigt (sur telephone) : vers la gauche = page suivante
  var departX = 0, departY = 0;
  document.addEventListener("touchstart", function (e) {
    departX = e.touches[0].clientX;
    departY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - departX;
    var dy = e.changedTouches[0].clientY - departY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;   // trop court, ou plutot vertical
    if (dx < 0 && suivant) aller(suivant.getAttribute("href"));
    if (dx > 0 && precedent) aller(precedent.getAttribute("href"));
  }, { passive: true });

  // quand on revient en arriere avec le bouton du telephone, la carte doit reapparaitre
  window.addEventListener("pageshow", function () {
    var carte = document.querySelector(".carte");
    if (carte) carte.classList.remove("sortie");
  });
})();
