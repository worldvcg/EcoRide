import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/",  "Accueil", "/pages/home.html", "/js/pages/recherche.js"),
    new Route("/covoiturages", "Covoiturages", "/pages/covoiturages.html", "/js/pages/covoiturages.js"),
    new Route("/trajetdetail", "trajet-detail" ,"/pages/trajet-detail.html"),
    new Route("/contact", "contact", "/pages/contact.html"),
    new Route("/signin", "Connexion", "/pages/signin.html", "/js/pages/signin.js" ),
    new Route("/monespace", "Mon espace", "/pages/mon-espace.html", "/js/pages/mon-espace.js"),
    new Route("/signup", "Inscrition", "/pages/signup.html", "/js/pages/signup.js"),
];


//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";