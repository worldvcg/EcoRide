import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/",  "Accueil", "/pages/home.html"),
    new Route("/covoiturages", "Covoiturages", "/pages/covoiturages.html"),
    new Route("/trajetdetail", "trajet-detail" ,"/pages/trajet-detail.html"),
    new Route("/contact", "contact", "/pages/contact.html"),
    new Route("/signin", "Connexion", "/pages/signin.html" ),
    new Route("/monespace", "Mon espace", "/pages/mon-espace.html"),
    new Route("/signup", "Inscrition", "/pages/signup.html"),
];


//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";