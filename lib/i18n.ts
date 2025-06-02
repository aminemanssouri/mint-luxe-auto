export type Language = "en" | "ar" | "fr"

export interface Translations {
  // Navigation
  nav: {
    home: string
    collection: string
    about: string
    services: string
    contact: string
    login: string
    signup: string
    dashboard: string
    logout: string
  }
  // Common
  common: {
    loading: string
    backToHome: string
    backToDashboard: string
    back: string
    next: string
    previous: string
    submit: string
    cancel: string
    save: string
    edit: string
    delete: string
    view: string
    details: string
    close: string
    search: string
    filter: string
    sort: string
    price: string
    year: string
    location: string
    features: string
    specifications: string
    description: string
    contactOwner: string
    bookService: string
    reserve: string
    share: string
    like: string
    viewMore: string
    learnMore: string
  }
  // Collection page
  collection: {
    title: string
    subtitle: string
    searchPlaceholder: string
    filters: string
    clearAll: string
    vehicleType: string
    allTypes: string
    luxuryCars: string
    motorcycles: string
    yachtsBoats: string
    brand: string
    allBrands: string
    category: string
    allCategories: string
    priceRange: string
    allPrices: string
    under100k: string
    range100k500k: string
    range500k1m: string
    over1m: string
    sortBy: string
    featuredFirst: string
    priceLowHigh: string
    priceHighLow: string
    newestFirst: string
    nameAZ: string
    vehiclesAvailable: string
    noVehiclesFound: string
    noVehiclesDesc: string
    loadMore: string
    featured: string
    car: string
    bike: string
    yacht: string
  }
  // Home page
  home: {
    heroTitle: string
    heroSubtitle: string
    exploreCollection: string
    bookTestDrive: string
    featuredTitle: string
    featuredSubtitle: string
    aboutTitle: string
    aboutSubtitle: string
    aboutDescription: string
    servicesTitle: string
    servicesSubtitle: string
    testimonialsTitle: string
    testimonialsSubtitle: string
    contactTitle: string
    contactSubtitle: string
    needCustomService: string
    needCustomServiceDesc: string
    contactSpecialists: string
  }
  // Authentication
  auth: {
    welcomeBack: string
    signInSubtitle: string
    createAccount: string
    signUpSubtitle: string
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    phone: string
    rememberMe: string
    forgotPassword: string
    signIn: string
    signUp: string
    orContinueWith: string
    google: string
    apple: string
    dontHaveAccount: string
    alreadyHaveAccount: string
    agreeToTerms: string
    subscribeNewsletter: string
    termsOfService: string
    privacyPolicy: string
  }
  // Dashboard
  dashboard: {
    welcomeBack: string
    manageCollection: string
    totalCars: string
    activeServices: string
    completed: string
    nextService: string
    myCars: string
    addCar: string
    recentBookings: string
    latestAppointments: string
    bookNewService: string
    active: string
    inService: string
    scheduled: string
    inProgress: string
    viewCar: string
  }
  // Services
  services: {
    premiumMaintenance: string
    customPersonalization: string
    conciergeProtection: string
    whiteGloveDelivery: string
    expressService: string
    vipMembership: string
    maintenanceDesc: string
    personalizationDesc: string
    protectionDesc: string
    deliveryDesc: string
    expressDesc: string
    vipDesc: string
    bookService: string
    selectService: string
    selectServiceDesc: string
    selectDateTime: string
    selectDateTimeDesc: string
    preferredDate: string
    preferredTime: string
    contactInfo: string
    contactInfoDesc: string
    carModel: string
    specialRequests: string
    bookingSummary: string
    estimatedPrice: string
    confirmBooking: string
  }
  // Car details
  carDetails: {
    keySpecs: string
    fuelTank: string
    range: string
    acceleration: string
    horsepower: string
    fullSpecs: string
    engine: string
    power: string
    torque: string
    topSpeed: string
    transmission: string
    drivetrain: string
    fuelEconomy: string
    seating: string
    dimensions: string
    weight: string
    messageOwner: string
    requestCallback: string
    usuallyResponds: string
    reviews: string
    similarVehicles: string
    contactOwnerTitle: string
    sendMessage: string
    yourName: string
    emailAddress: string
    phoneNumber: string
    message: string
    agreePrivacy: string
  }
  // Features
  features: {
    exclusiveLimited: string
    personalizedCustomization: string
    whiteGloveDelivery: string
    lifetimeMaintenance: string
    globalConcierge: string
    membersEvents: string
    starlightHeadliner: string
    bespokeAudio: string
    rearTheater: string
    picnicTables: string
    champagneCooler: string
    umbrellaStorage: string
    selfClosingDoors: string
    activeCruise: string
    nightVision: string
    panoramicSky: string
    massageSeats: string
    lambswoolMats: string
  }
  // Footer
  footer: {
    description: string
    quickLinks: string
    services: string
    newsletter: string
    newsletterDesc: string
    subscribe: string
    yourEmail: string
    allRightsReserved: string
    privacyPolicy: string
    termsOfService: string
    cookiePolicy: string
    carSales: string
    customOrders: string
    financing: string
    maintenance: string
    concierge: string
  }
  // Testimonials
  testimonials: {
    testimonial1: string
    testimonial2: string
    testimonial3: string
    client1Name: string
    client2Name: string
    client3Name: string
    client1Position: string
    client2Position: string
    client3Position: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      collection: "Collection",
      about: "About",
      services: "Services",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      dashboard: "Dashboard",
      logout: "Logout",
    },
    common: {
      loading: "Loading...",
      backToHome: "Back to Home",
      backToDashboard: "Back to Dashboard",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      details: "Details",
      close: "Close",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      price: "Price",
      year: "Year",
      location: "Location",
      features: "Features",
      specifications: "Specifications",
      description: "Description",
      contactOwner: "Contact Owner",
      bookService: "Book Service",
      reserve: "Reserve Now",
      share: "Share",
      like: "Like",
      viewMore: "View More",
      learnMore: "Learn More",
    },
    collection: {
      title: "Luxury Collection",
      subtitle: "Discover our exclusive selection of luxury vehicles",
      searchPlaceholder: "Search vehicles...",
      filters: "Filters",
      clearAll: "Clear All",
      vehicleType: "Vehicle Type",
      allTypes: "All Types",
      luxuryCars: "Luxury Cars",
      motorcycles: "Motorcycles",
      yachtsBoats: "Yachts & Boats",
      brand: "Brand",
      allBrands: "All Brands",
      category: "Category",
      allCategories: "All Categories",
      priceRange: "Price Range",
      allPrices: "All Prices",
      under100k: "Under $100K",
      range100k500k: "$100K - $500K",
      range500k1m: "$500K - $1M",
      over1m: "Over $1M",
      sortBy: "Sort By",
      featuredFirst: "Featured First",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      newestFirst: "Newest First",
      nameAZ: "Name A-Z",
      vehiclesAvailable: "vehicles available",
      noVehiclesFound: "No vehicles found",
      noVehiclesDesc: "Try adjusting your filters or search terms to find what you're looking for.",
      loadMore: "Load More Vehicles",
      featured: "Featured",
      car: "Car",
      bike: "Bike",
      yacht: "Yacht",
    },
    home: {
      heroTitle: "Experience Luxury Like Never Before",
      heroSubtitle:
        "Discover our exclusive collection of the world's finest automobiles, crafted for those who demand nothing but perfection.",
      exploreCollection: "Explore Collection",
      bookTestDrive: "Book a Test Drive",
      featuredTitle: "Featured Collection",
      featuredSubtitle:
        "Explore our handpicked selection of the most exclusive automobiles, each representing the pinnacle of engineering and design.",
      aboutTitle: "Redefining Luxury Automotive Experience",
      aboutSubtitle:
        "For over two decades, we have been curating the world's most exclusive collection of luxury automobiles.",
      aboutDescription:
        "Our passion for perfection and attention to detail ensures that every vehicle in our collection represents the pinnacle of automotive excellence.",
      servicesTitle: "Premium Services",
      servicesSubtitle:
        "Experience unparalleled service excellence with our comprehensive range of luxury automotive services, designed to exceed your expectations at every touchpoint.",
      testimonialsTitle: "Client Testimonials",
      testimonialsSubtitle:
        "Hear from our distinguished clients about their experience with our exclusive collection and services.",
      contactTitle: "Contact Us",
      contactSubtitle:
        "Our luxury automotive specialists are ready to assist you with personalized service and expertise.",
      needCustomService: "Need Custom Service?",
      needCustomServiceDesc:
        "Our team of specialists can create a bespoke service package tailored specifically to your luxury vehicle's needs.",
      contactSpecialists: "Contact Our Specialists",
    },
    auth: {
      welcomeBack: "Welcome Back",
      signInSubtitle: "Sign in to access your luxury car collection",
      createAccount: "Create Account",
      signUpSubtitle: "Join our exclusive luxury car community",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      signUp: "Create Account",
      orContinueWith: "Or continue with",
      google: "Google",
      apple: "Apple",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
      subscribeNewsletter: "Subscribe to our newsletter for exclusive offers and updates",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
    },
    dashboard: {
      welcomeBack: "Welcome back, John",
      manageCollection: "Manage your luxury car collection and services",
      totalCars: "Total Cars",
      activeServices: "Active Services",
      completed: "Completed",
      nextService: "Next Service",
      myCars: "My Cars",
      addCar: "Add Car",
      recentBookings: "Recent Bookings",
      latestAppointments: "Your latest service appointments",
      bookNewService: "Book New Service",
      active: "Active",
      inService: "In Service",
      scheduled: "Scheduled",
      inProgress: "In Progress",
      viewCar: "View",
    },
    services: {
      premiumMaintenance: "Premium Maintenance",
      customPersonalization: "Custom Personalization",
      conciergeProtection: "Concierge Protection",
      whiteGloveDelivery: "White Glove Delivery",
      expressService: "Express Service",
      vipMembership: "VIP Membership",
      maintenanceDesc: "Comprehensive maintenance services by certified technicians using only genuine parts.",
      personalizationDesc: "Transform your vehicle with bespoke customization options tailored to your preferences.",
      protectionDesc: "24/7 comprehensive protection and support services for your luxury vehicle.",
      deliveryDesc: "Premium delivery and pickup services with complete care and attention to detail.",
      expressDesc: "Fast-track maintenance and repair services for busy luxury car owners.",
      vipDesc: "Exclusive membership program with premium benefits and priority access.",
      bookService: "Book Service",
      selectService: "Select Service",
      selectServiceDesc: "Choose the service you need for your vehicle",
      selectDateTime: "Select Date & Time",
      selectDateTimeDesc: "Choose your preferred appointment slot",
      preferredDate: "Preferred Date",
      preferredTime: "Preferred Time",
      contactInfo: "Contact Information",
      contactInfoDesc: "Provide your details for the appointment",
      carModel: "Car Model",
      specialRequests: "Special Requests (Optional)",
      bookingSummary: "Booking Summary",
      estimatedPrice: "Estimated Price",
      confirmBooking: "Confirm Booking",
    },
    carDetails: {
      keySpecs: "Key Specifications",
      fuelTank: "Fuel Tank",
      range: "Range",
      acceleration: "0-60 mph",
      horsepower: "Horsepower",
      fullSpecs: "Full Specifications",
      engine: "Engine",
      power: "Power",
      torque: "Torque",
      topSpeed: "Top Speed",
      transmission: "Transmission",
      drivetrain: "Drivetrain",
      fuelEconomy: "Fuel Economy",
      seating: "Seating",
      dimensions: "Dimensions",
      weight: "Weight",
      messageOwner: "Message Owner",
      requestCallback: "Request Call Back",
      usuallyResponds: "Usually responds within 2 hours",
      reviews: "reviews",
      similarVehicles: "Similar Vehicles",
      contactOwnerTitle: "Contact Owner",
      sendMessage: "Send Message",
      yourName: "Your Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      message: "Message",
      agreePrivacy: "I agree to the privacy policy and terms of service",
    },
    features: {
      exclusiveLimited: "Exclusive limited editions",
      personalizedCustomization: "Personalized customization",
      whiteGloveDelivery: "White glove delivery service",
      lifetimeMaintenance: "Lifetime maintenance program",
      globalConcierge: "Global concierge support",
      membersEvents: "Members-only events",
      starlightHeadliner: "Starlight Headliner",
      bespokeAudio: "Bespoke Audio System",
      rearTheater: "Rear Theater Configuration",
      picnicTables: "Picnic Tables",
      champagneCooler: "Champagne Cooler",
      umbrellaStorage: "Umbrella Storage",
      selfClosingDoors: "Self-Closing Doors",
      activeCruise: "Active Cruise Control",
      nightVision: "Night Vision",
      panoramicSky: "Panoramic Sky Lounge",
      massageSeats: "Massage Seats",
      lambswoolMats: "Lambswool Floor Mats",
    },
    footer: {
      description: "Redefining the luxury automotive experience with exclusive collections and personalized service.",
      quickLinks: "Quick Links",
      services: "Services",
      newsletter: "Newsletter",
      newsletterDesc: "Subscribe to receive updates on our latest collections and exclusive events.",
      subscribe: "Subscribe",
      yourEmail: "Your email",
      allRightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      cookiePolicy: "Cookie Policy",
      carSales: "Car Sales",
      customOrders: "Custom Orders",
      financing: "Financing",
      maintenance: "Maintenance",
      concierge: "Concierge",
    },
    testimonials: {
      testimonial1:
        "The attention to detail and personalized service exceeded all my expectations. Truly a remarkable experience from start to finish.",
      testimonial2:
        "Their collection of rare automobiles is unmatched. The team's knowledge and passion for luxury cars made the purchase process exceptional.",
      testimonial3:
        "As someone who appreciates craftsmanship, I found their attention to detail remarkable. The customization options truly make each car unique.",
      client1Name: "Alexander Wright",
      client2Name: "Sophia Chen",
      client3Name: "James Harrington",
      client1Position: "CEO, Global Ventures",
      client2Position: "Tech Entrepreneur",
      client3Position: "Art Collector",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      collection: "Collection",
      about: "À propos",
      services: "Services",
      contact: "Contact",
      login: "Connexion",
      signup: "S'inscrire",
      dashboard: "Tableau de bord",
      logout: "Déconnexion",
    },
    common: {
      loading: "Chargement...",
      backToHome: "Retour à l'accueil",
      backToDashboard: "Retour au tableau de bord",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      submit: "Soumettre",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir",
      details: "Détails",
      close: "Fermer",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      price: "Prix",
      year: "Année",
      location: "Emplacement",
      features: "Caractéristiques",
      specifications: "Spécifications",
      description: "Description",
      contactOwner: "Contacter le propriétaire",
      bookService: "Réserver un service",
      reserve: "Réserver maintenant",
      share: "Partager",
      like: "J'aime",
      viewMore: "Voir plus",
      learnMore: "En savoir plus",
    },
    collection: {
      title: "Collection de Luxe",
      subtitle: "Découvrez notre sélection exclusive de véhicules de luxe",
      searchPlaceholder: "Rechercher des véhicules...",
      filters: "Filtres",
      clearAll: "Tout effacer",
      vehicleType: "Type de véhicule",
      allTypes: "Tous les types",
      luxuryCars: "Voitures de luxe",
      motorcycles: "Motos",
      yachtsBoats: "Yachts et bateaux",
      brand: "Marque",
      allBrands: "Toutes les marques",
      category: "Catégorie",
      allCategories: "Toutes les catégories",
      priceRange: "Gamme de prix",
      allPrices: "Tous les prix",
      under100k: "Moins de 100K$",
      range100k500k: "100K$ - 500K$",
      range500k1m: "500K$ - 1M$",
      over1m: "Plus de 1M$",
      sortBy: "Trier par",
      featuredFirst: "En vedette d'abord",
      priceLowHigh: "Prix: Bas à élevé",
      priceHighLow: "Prix: Élevé à bas",
      newestFirst: "Plus récent d'abord",
      nameAZ: "Nom A-Z",
      vehiclesAvailable: "véhicules disponibles",
      noVehiclesFound: "Aucun véhicule trouvé",
      noVehiclesDesc: "Essayez d'ajuster vos filtres ou termes de recherche pour trouver ce que vous cherchez.",
      loadMore: "Charger plus de véhicules",
      featured: "En vedette",
      car: "Voiture",
      bike: "Moto",
      yacht: "Yacht",
    },
    home: {
      heroTitle: "Découvrez le luxe comme jamais auparavant",
      heroSubtitle:
        "Découvrez notre collection exclusive des plus belles automobiles du monde, conçues pour ceux qui n'exigent que la perfection.",
      exploreCollection: "Explorer la collection",
      bookTestDrive: "Réserver un essai",
      featuredTitle: "Collection vedette",
      featuredSubtitle:
        "Explorez notre sélection triée sur le volet des automobiles les plus exclusives, chacune représentant le summum de l'ingénierie et du design.",
      aboutTitle: "Redéfinir l'expérience automobile de luxe",
      aboutSubtitle:
        "Depuis plus de deux décennies, nous organisons la collection d'automobiles de luxe la plus exclusive au monde.",
      aboutDescription:
        "Notre passion pour la perfection et notre attention aux détails garantissent que chaque véhicule de notre collection représente le summum de l'excellence automobile.",
      servicesTitle: "Services premium",
      servicesSubtitle:
        "Découvrez une excellence de service inégalée avec notre gamme complète de services automobiles de luxe, conçus pour dépasser vos attentes à chaque point de contact.",
      testimonialsTitle: "Témoignages clients",
      testimonialsSubtitle:
        "Écoutez nos clients distingués parler de leur expérience avec notre collection exclusive et nos services.",
      contactTitle: "Nous contacter",
      contactSubtitle:
        "Nos spécialistes automobiles de luxe sont prêts à vous aider avec un service personnalisé et une expertise.",
      needCustomService: "Besoin d'un service personnalisé ?",
      needCustomServiceDesc:
        "Notre équipe de spécialistes peut créer un forfait de service sur mesure spécialement adapté aux besoins de votre véhicule de luxe.",
      contactSpecialists: "Contacter nos spécialistes",
    },
    auth: {
      welcomeBack: "Bon retour",
      signInSubtitle: "Connectez-vous pour accéder à votre collection de voitures de luxe",
      createAccount: "Créer un compte",
      signUpSubtitle: "Rejoignez notre communauté exclusive de voitures de luxe",
      email: "Adresse e-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Numéro de téléphone",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié ?",
      signIn: "Se connecter",
      signUp: "Créer un compte",
      orContinueWith: "Ou continuer avec",
      google: "Google",
      apple: "Apple",
      dontHaveAccount: "Vous n'avez pas de compte ?",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      agreeToTerms: "J'accepte les conditions de service et la politique de confidentialité",
      subscribeNewsletter: "Abonnez-vous à notre newsletter pour des offres exclusives et des mises à jour",
      termsOfService: "Conditions de service",
      privacyPolicy: "Politique de confidentialité",
    },
    dashboard: {
      welcomeBack: "Bon retour, John",
      manageCollection: "Gérez votre collection de voitures de luxe et vos services",
      totalCars: "Total des voitures",
      activeServices: "Services actifs",
      completed: "Terminé",
      nextService: "Prochain service",
      myCars: "Mes voitures",
      addCar: "Ajouter une voiture",
      recentBookings: "Réservations récentes",
      latestAppointments: "Vos derniers rendez-vous de service",
      bookNewService: "Réserver un nouveau service",
      active: "Actif",
      inService: "En service",
      scheduled: "Programmé",
      inProgress: "En cours",
      viewCar: "Voir",
    },
    services: {
      premiumMaintenance: "Maintenance premium",
      customPersonalization: "Personnalisation sur mesure",
      conciergeProtection: "Protection conciergerie",
      whiteGloveDelivery: "Livraison gants blancs",
      expressService: "Service express",
      vipMembership: "Adhésion VIP",
      maintenanceDesc:
        "Services de maintenance complets par des techniciens certifiés utilisant uniquement des pièces d'origine.",
      personalizationDesc:
        "Transformez votre véhicule avec des options de personnalisation sur mesure adaptées à vos préférences.",
      protectionDesc: "Services de protection et de support complets 24h/24 et 7j/7 pour votre véhicule de luxe.",
      deliveryDesc: "Services de livraison et de collecte premium avec un soin et une attention aux détails complets.",
      expressDesc:
        "Services de maintenance et de réparation accélérés pour les propriétaires de voitures de luxe occupés.",
      vipDesc: "Programme d'adhésion exclusif avec des avantages premium et un accès prioritaire.",
      bookService: "Réserver un service",
      selectService: "Sélectionner un service",
      selectServiceDesc: "Choisissez le service dont vous avez besoin pour votre véhicule",
      selectDateTime: "Sélectionner la date et l'heure",
      selectDateTimeDesc: "Choisissez votre créneau de rendez-vous préféré",
      preferredDate: "Date préférée",
      preferredTime: "Heure préférée",
      contactInfo: "Informations de contact",
      contactInfoDesc: "Fournissez vos coordonnées pour le rendez-vous",
      carModel: "Modèle de voiture",
      specialRequests: "Demandes spéciales (facultatif)",
      bookingSummary: "Résumé de la réservation",
      estimatedPrice: "Prix estimé",
      confirmBooking: "Confirmer la réservation",
    },
    carDetails: {
      keySpecs: "Spécifications clés",
      fuelTank: "Réservoir de carburant",
      range: "Autonomie",
      acceleration: "0-100 km/h",
      horsepower: "Puissance",
      fullSpecs: "Spécifications complètes",
      engine: "Moteur",
      power: "Puissance",
      torque: "Couple",
      topSpeed: "Vitesse maximale",
      transmission: "Transmission",
      drivetrain: "Transmission",
      fuelEconomy: "Économie de carburant",
      seating: "Places assises",
      dimensions: "Dimensions",
      weight: "Poids",
      messageOwner: "Message au propriétaire",
      requestCallback: "Demander un rappel",
      usuallyResponds: "Répond généralement dans les 2 heures",
      reviews: "avis",
      similarVehicles: "Véhicules similaires",
      contactOwnerTitle: "Contacter le propriétaire",
      sendMessage: "Envoyer un message",
      yourName: "Votre nom",
      emailAddress: "Adresse e-mail",
      phoneNumber: "Numéro de téléphone",
      message: "Message",
      agreePrivacy: "J'accepte la politique de confidentialité et les conditions de service",
    },
    features: {
      exclusiveLimited: "Éditions limitées exclusives",
      personalizedCustomization: "Personnalisation personnalisée",
      whiteGloveDelivery: "Service de livraison gants blancs",
      lifetimeMaintenance: "Programme de maintenance à vie",
      globalConcierge: "Support conciergerie mondial",
      membersEvents: "Événements réservés aux membres",
      starlightHeadliner: "Ciel étoilé",
      bespokeAudio: "Système audio sur mesure",
      rearTheater: "Configuration théâtre arrière",
      picnicTables: "Tables de pique-nique",
      champagneCooler: "Refroidisseur à champagne",
      umbrellaStorage: "Rangement parapluie",
      selfClosingDoors: "Portes à fermeture automatique",
      activeCruise: "Régulateur de vitesse actif",
      nightVision: "Vision nocturne",
      panoramicSky: "Salon panoramique",
      massageSeats: "Sièges massants",
      lambswoolMats: "Tapis en laine d'agneau",
    },
    footer: {
      description:
        "Redéfinir l'expérience automobile de luxe avec des collections exclusives et un service personnalisé.",
      quickLinks: "Liens rapides",
      services: "Services",
      newsletter: "Newsletter",
      newsletterDesc:
        "Abonnez-vous pour recevoir des mises à jour sur nos dernières collections et événements exclusifs.",
      subscribe: "S'abonner",
      yourEmail: "Votre e-mail",
      allRightsReserved: "Tous droits réservés.",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions de service",
      cookiePolicy: "Politique des cookies",
      carSales: "Vente de voitures",
      customOrders: "Commandes personnalisées",
      financing: "Financement",
      maintenance: "Maintenance",
      concierge: "Conciergerie",
    },
    testimonials: {
      testimonial1:
        "L'attention aux détails et le service personnalisé ont dépassé toutes mes attentes. Vraiment une expérience remarquable du début à la fin.",
      testimonial2:
        "Leur collection d'automobiles rares est inégalée. Les connaissances et la passion de l'équipe pour les voitures de luxe ont rendu le processus d'achat exceptionnel.",
      testimonial3:
        "En tant que personne qui apprécie l'artisanat, j'ai trouvé leur attention aux détails remarquable. Les options de personnalisation rendent vraiment chaque voiture unique.",
      client1Name: "Alexandre Wright",
      client2Name: "Sophie Chen",
      client3Name: "Jacques Harrington",
      client1Position: "PDG, Global Ventures",
      client2Position: "Entrepreneur technologique",
      client3Position: "Collectionneur d'art",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      collection: "المجموعة",
      about: "حولنا",
      services: "الخدمات",
      contact: "اتصل بنا",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      logout: "تسجيل الخروج",
    },
    common: {
      loading: "جاري التحميل...",
      backToHome: "العودة للرئيسية",
      backToDashboard: "العودة للوحة التحكم",
      back: "رجوع",
      next: "التالي",
      previous: "السابق",
      submit: "إرسال",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      view: "عرض",
      details: "التفاصيل",
      close: "إغلاق",
      search: "بحث",
      filter: "تصفية",
      sort: "ترتيب",
      price: "السعر",
      year: "السنة",
      location: "الموقع",
      features: "المميزات",
      specifications: "المواصفات",
      description: "الوصف",
      contactOwner: "اتصل بالمالك",
      bookService: "احجز خدمة",
      reserve: "احجز الآن",
      share: "مشاركة",
      like: "إعجاب",
      viewMore: "عرض المزيد",
      learnMore: "اعرف المزيد",
    },
    collection: {
      title: "مجموعة الفخامة",
      subtitle: "اكتشف مجموعتنا الحصرية من المركبات الفاخرة",
      searchPlaceholder: "البحث عن المركبات...",
      filters: "المرشحات",
      clearAll: "مسح الكل",
      vehicleType: "نوع المركبة",
      allTypes: "جميع الأنواع",
      luxuryCars: "السيارات الفاخرة",
      motorcycles: "الدراجات النارية",
      yachtsBoats: "اليخوت والقوارب",
      brand: "العلامة التجارية",
      allBrands: "جميع العلامات التجارية",
      category: "الفئة",
      allCategories: "جميع الفئات",
      priceRange: "نطاق السعر",
      allPrices: "جميع الأسعار",
      under100k: "أقل من 100 ألف دولار",
      range100k500k: "100 ألف - 500 ألف دولار",
      range500k1m: "500 ألف - مليون دولار",
      over1m: "أكثر من مليون دولار",
      sortBy: "ترتيب حسب",
      featuredFirst: "المميز أولاً",
      priceLowHigh: "السعر: من الأقل للأعلى",
      priceHighLow: "السعر: من الأعلى للأقل",
      newestFirst: "الأحدث أولاً",
      nameAZ: "الاسم أ-ي",
      vehiclesAvailable: "مركبة متاحة",
      noVehiclesFound: "لم يتم العثور على مركبات",
      noVehiclesDesc: "حاول تعديل المرشحات أو مصطلحات البحث للعثور على ما تبحث عنه.",
      loadMore: "تحميل المزيد من المركبات",
      featured: "مميز",
      car: "سيارة",
      bike: "دراجة",
      yacht: "يخت",
    },
    home: {
      heroTitle: "اختبر الفخامة كما لم تختبرها من قبل",
      heroSubtitle: "اكتشف مجموعتنا الحصرية من أرقى السيارات في العالم، المصنوعة لأولئك الذين لا يطلبون سوى الكمال.",
      exploreCollection: "استكشف المجموعة",
      bookTestDrive: "احجز قيادة تجريبية",
      featuredTitle: "المجموعة المميزة",
      featuredSubtitle: "استكشف مجموعتنا المختارة بعناية من أكثر السيارات حصرية، كل منها تمثل قمة الهندسة والتصميم.",
      aboutTitle: "إعادة تعريف تجربة السيارات الفاخرة",
      aboutSubtitle: "لأكثر من عقدين من الزمن، كنا ننظم أكثر مجموعة حصرية من السيارات الفاخرة في العالم.",
      aboutDescription:
        "شغفنا بالكمال واهتمامنا بالتفاصيل يضمن أن كل مركبة في مجموعتنا تمثل قمة التميز في صناعة السيارات.",
      servicesTitle: "الخدمات المميزة",
      servicesSubtitle:
        "اختبر تميز الخدمة الذي لا مثيل له مع مجموعتنا الشاملة من خدمات السيارات الفاخرة، المصممة لتتجاوز توقعاتك في كل نقطة تواصل.",
      testimonialsTitle: "شهادات العملاء",
      testimonialsSubtitle: "استمع من عملائنا المميزين حول تجربتهم مع مجموعتنا الحصرية وخدماتنا.",
      contactTitle: "اتصل بنا",
      contactSubtitle: "متخصصو السيارات الفاخرة لدينا مستعدون لمساعدتك بخدمة شخصية وخبرة.",
      needCustomService: "تحتاج خدمة مخصصة؟",
      needCustomServiceDesc: "يمكن لفريق المتخصصين لدينا إنشاء حزمة خدمة مخصصة مصممة خصيصاً لاحتياجات مركبتك الفاخرة.",
      contactSpecialists: "اتصل بمتخصصينا",
    },
    auth: {
      welcomeBack: "مرحباً بعودتك",
      signInSubtitle: "سجل الدخول للوصول إلى مجموعة سياراتك الفاخرة",
      createAccount: "إنشاء حساب",
      signUpSubtitle: "انضم إلى مجتمع السيارات الفاخرة الحصري",
      email: "عنوان البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phone: "رقم الهاتف",
      rememberMe: "تذكرني",
      forgotPassword: "نسيت كلمة المرور؟",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      orContinueWith: "أو تابع مع",
      google: "جوجل",
      apple: "آبل",
      dontHaveAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      agreeToTerms: "أوافق على شروط الخدمة وسياسة الخصوصية",
      subscribeNewsletter: "اشترك في نشرتنا الإخبارية للحصول على عروض حصرية وتحديثات",
      termsOfService: "شروط الخدمة",
      privacyPolicy: "سياسة الخصوصية",
    },
    dashboard: {
      welcomeBack: "مرحباً بعودتك، جون",
      manageCollection: "إدارة مجموعة سياراتك الفاخرة والخدمات",
      totalCars: "إجمالي السيارات",
      activeServices: "الخدمات النشطة",
      completed: "مكتمل",
      nextService: "الخدمة التالية",
      myCars: "سياراتي",
      addCar: "إضافة سيارة",
      recentBookings: "الحجوزات الأخيرة",
      latestAppointments: "مواعيد الخدمة الأخيرة",
      bookNewService: "احجز خدمة جديدة",
      active: "نشط",
      inService: "في الخدمة",
      scheduled: "مجدول",
      inProgress: "قيد التنفيذ",
      viewCar: "عرض",
    },
    services: {
      premiumMaintenance: "الصيانة المميزة",
      customPersonalization: "التخصيص المخصص",
      conciergeProtection: "حماية الكونسيرج",
      whiteGloveDelivery: "التوصيل الفاخر",
      expressService: "الخدمة السريعة",
      vipMembership: "العضوية المميزة",
      maintenanceDesc: "خدمات صيانة شاملة من قبل فنيين معتمدين باستخدام قطع أصلية فقط.",
      personalizationDesc: "حول مركبتك بخيارات تخصيص مخصصة مصممة حسب تفضيلاتك.",
      protectionDesc: "خدمات حماية ودعم شاملة على مدار الساعة طوال أيام الأسبوع لمركبتك الفاخرة.",
      deliveryDesc: "خدمات توصيل واستلام مميزة مع عناية كاملة واهتمام بالتفاصيل.",
      expressDesc: "خدمات صيانة وإصلاح سريعة لأصحاب السيارات الفاخرة المشغولين.",
      vipDesc: "برنامج عضوية حصري مع مزايا مميزة ووصول أولوي.",
      bookService: "احجز خدمة",
      selectService: "اختر خدمة",
      selectServiceDesc: "اختر الخدمة التي تحتاجها لمركبتك",
      selectDateTime: "اختر التاريخ والوقت",
      selectDateTimeDesc: "اختر موعدك المفضل",
      preferredDate: "التاريخ المفضل",
      preferredTime: "الوقت المفضل",
      contactInfo: "معلومات الاتصال",
      contactInfoDesc: "قدم تفاصيلك للموعد",
      carModel: "موديل السيارة",
      specialRequests: "طلبات خاصة (اختياري)",
      bookingSummary: "ملخص الحجز",
      estimatedPrice: "السعر المقدر",
      confirmBooking: "تأكيد الحجز",
    },
    carDetails: {
      keySpecs: "المواصفات الرئيسية",
      fuelTank: "خزان الوقود",
      range: "المدى",
      acceleration: "0-100 كم/س",
      horsepower: "القوة الحصانية",
      fullSpecs: "المواصفات الكاملة",
      engine: "المحرك",
      power: "القوة",
      torque: "عزم الدوران",
      topSpeed: "السرعة القصوى",
      transmission: "ناقل الحركة",
      drivetrain: "نظام الدفع",
      fuelEconomy: "اقتصاد الوقود",
      seating: "المقاعد",
      dimensions: "الأبعاد",
      weight: "الوزن",
      messageOwner: "راسل المالك",
      requestCallback: "اطلب معاودة الاتصال",
      usuallyResponds: "يرد عادة خلال ساعتين",
      reviews: "تقييم",
      similarVehicles: "مركبات مشابهة",
      contactOwnerTitle: "اتصل بالمالك",
      sendMessage: "إرسال رسالة",
      yourName: "اسمك",
      emailAddress: "عنوان البريد الإلكتروني",
      phoneNumber: "رقم الهاتف",
      message: "الرسالة",
      agreePrivacy: "أوافق على سياسة الخصوصية وشروط الخدمة",
    },
    features: {
      exclusiveLimited: "إصدارات محدودة حصرية",
      personalizedCustomization: "تخصيص شخصي",
      whiteGloveDelivery: "خدمة التوصيل الفاخر",
      lifetimeMaintenance: "برنامج صيانة مدى الحياة",
      globalConcierge: "دعم الكونسيرج العالمي",
      membersEvents: "فعاليات الأعضاء فقط",
      starlightHeadliner: "سقف النجوم",
      bespokeAudio: "نظام صوتي مخصص",
      rearTheater: "تكوين المسرح الخلفي",
      picnicTables: "طاولات النزهة",
      champagneCooler: "مبرد الشمبانيا",
      umbrellaStorage: "تخزين المظلة",
      selfClosingDoors: "أبواب الإغلاق الذاتي",
      activeCruise: "نظام التحكم النشط في السرعة",
      nightVision: "الرؤية الليلية",
      panoramicSky: "صالة السماء البانورامية",
      massageSeats: "مقاعد التدليك",
      lambswoolMats: "سجاد صوف الحمل",
    },
    footer: {
      description: "إعادة تعريف تجربة السيارات الفاخرة مع مجموعات حصرية وخدمة شخصية.",
      quickLinks: "روابط سريعة",
      services: "الخدمات",
      newsletter: "النشرة الإخبارية",
      newsletterDesc: "اشترك لتلقي تحديثات حول أحدث مجموعاتنا والفعاليات الحصرية.",
      subscribe: "اشتراك",
      yourEmail: "بريدك الإلكتروني",
      allRightsReserved: "جميع الحقوق محفوظة.",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      cookiePolicy: "سياسة ملفات تعريف الارتباط",
      carSales: "مبيعات السيارات",
      customOrders: "طلبات مخصصة",
      financing: "التمويل",
      maintenance: "الصيانة",
      concierge: "الكونسيرج",
    },
    testimonials: {
      testimonial1: "الاهتمام بالتفاصيل والخدمة الشخصية تجاوزت كل توقعاتي. تجربة رائعة حقاً من البداية إلى النهاية.",
      testimonial2:
        "مجموعتهم من السيارات النادرة لا مثيل لها. معرفة الفريق وشغفهم بالسيارات الفاخرة جعل عملية الشراء استثنائية.",
      testimonial3: "كشخص يقدر الحرفية، وجدت اهتمامهم بالتفاصيل رائعاً. خيارات التخصيص تجعل كل سيارة فريدة حقاً.",
      client1Name: "ألكسندر رايت",
      client2Name: "صوفيا تشين",
      client3Name: "جيمس هارينغتون",
      client1Position: "الرئيس التنفيذي، Global Ventures",
      client2Position: "رائد أعمال تقني",
      client3Position: "جامع فنون",
    },
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en
}
