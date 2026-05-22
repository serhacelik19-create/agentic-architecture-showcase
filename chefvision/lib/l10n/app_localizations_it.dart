// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Italian (`it`).
class AppLocalizationsIt extends AppLocalizations {
  AppLocalizationsIt([String locale = 'it']) : super(locale);

  @override
  String get appTitle => 'ChefVision AI';

  @override
  String get appName => 'ChefVision';

  @override
  String get splashTagline => 'Il tuo chef intelligente basato sull\'IA';

  @override
  String get greetingMorning => 'Buongiorno';

  @override
  String get greetingAfternoon => 'Buon Pomeriggio';

  @override
  String get greetingEvening => 'Buonasera';

  @override
  String get greetingNight => 'Buonanotte';

  @override
  String get whatToCook => 'Cosa vuoi cucinare?';

  @override
  String get scanIngredients => 'Scansiona Ingredienti';

  @override
  String get scanIngredientsSubtitle =>
      'Fotografa il frigo, l\'IA trova le ricette';

  @override
  String get takePhoto => 'Scatta Foto';

  @override
  String get typeYourself => 'Aggiungi Manualmente';

  @override
  String get myPantry => 'I Miei Ingredienti';

  @override
  String get yourIngredients => 'I Tuoi Ingredienti';

  @override
  String get shoppingList => 'Lista della Spesa';

  @override
  String get yourList => 'La Tua Lista';

  @override
  String get popularRecipes => 'Sapori Popolari';

  @override
  String get viewAll => 'Vedi Tutto';

  @override
  String get expiryWarningTitle => 'Scade Presto';

  @override
  String get expiredWarningTitle => 'Scaduto';

  @override
  String itemsExpired(Object count) {
    return '$count prodotti sono scaduti!';
  }

  @override
  String itemsExpiring(Object count) {
    return '$count prodotti scadono presto!';
  }

  @override
  String get dailyTip => 'Consiglio del Giorno';

  @override
  String get discover => 'Scopri';

  @override
  String get discoverSubtitle => 'Nuove ricette e segreti di cucina in arrivo!';

  @override
  String get noFavorites => 'Nessun Preferito';

  @override
  String get noFavoritesSubtitle =>
      'Puoi aggiungere qui le ricette che ti piacciono.';

  @override
  String get favoriteRecipes => 'Le Tue Ricette Preferite';

  @override
  String get profile => 'Profilo';

  @override
  String get editProfile => 'Modifica Profilo';

  @override
  String get home => 'Home';

  @override
  String get search => 'Cerca';

  @override
  String get favorites => 'Preferiti';

  @override
  String get settings => 'Impostazioni';

  @override
  String get language => 'Lingua';

  @override
  String get selectLanguage => 'Seleziona Lingua';

  @override
  String get ingredients => 'Ingredienti';

  @override
  String get instructions => 'Istruzioni';

  @override
  String get prepTime => 'Prep';

  @override
  String get recipe => 'Recipe';

  @override
  String get cookTime => 'Cottura';

  @override
  String get servings => 'Porzioni';

  @override
  String get difficulty => 'Difficoltà';

  @override
  String get calories => 'Calorie';

  @override
  String get startCooking => 'Inizia a Cucinare';

  @override
  String get readAloud => 'Leggi ad Alta Voce';

  @override
  String get stopReading => 'Interrompi Lettura';

  @override
  String get pauseReading => 'Pausa';

  @override
  String get resumeReading => 'Riprendi';

  @override
  String get nextStep => 'Passo Successivo';

  @override
  String get previousStep => 'Passo Precedente';

  @override
  String get finishCooking => 'Termina Cottura';

  @override
  String get cookingCompleted => 'Cottura Completata!';

  @override
  String get cookingCompletedSubtitle =>
      'Buon appetito! Hai preparato un pasto delizioso.';

  @override
  String get bonAppetit => 'Buon Appetito!';

  @override
  String get backToHomeCaps => 'TORNA ALLA HOME';

  @override
  String get backToHome => 'Torna alla Home';

  @override
  String get analyzing => 'Analisi in corso...';

  @override
  String get analyzingSubtitle => 'Identificazione ingredienti con IA';

  @override
  String get addToPantry => 'Aggiungi alla Dispensa';

  @override
  String get retry => 'Riprova';

  @override
  String get error => 'Errore';

  @override
  String get success => 'Successo';

  @override
  String get itemAdded => 'Prodotto aggiunto con successo';

  @override
  String get itemRemoved => 'Prodotto rimosso con successo';

  @override
  String get onboardingTitle1 => 'Scansiona Ingredienti';

  @override
  String get onboardingDesc1 =>
      'Carica i tuoi ingredienti, lascia che l\'IA li identifichi all\'istante';

  @override
  String get onboardingTitle2 => 'Ottieni Ricette';

  @override
  String get onboardingDesc2 =>
      'L\'IA suggerisce le ricette più deliziose con quello che hai';

  @override
  String get onboardingTitle3 => 'Assistente Vocale';

  @override
  String get onboardingDesc3 =>
      'Cucina a mani libere, ottieni ricette e guida passo passo con comandi vocali';

  @override
  String get skip => 'Salta';

  @override
  String get start => 'Inizia';

  @override
  String get continueAction => 'Continua';

  @override
  String iapErrorStarted(Object error) {
    return 'Impossibile avviare l\'acquisto: $error';
  }

  @override
  String get iapErrorVerification =>
      'Verifica fallita (controlla internet). Transazione salvata, riproverà automaticamente.';

  @override
  String iapErrorGeneral(Object error) {
    return 'Errore di acquisto: $error';
  }

  @override
  String trialRemaining(Object current, Object total) {
    return 'Prova: $current/$total';
  }

  @override
  String get darkMode => 'Modalità Scura';

  @override
  String get darkModeSubtitle => 'Cambia tema dell\'app';

  @override
  String get foodWaste => 'Riduci lo Spreco';

  @override
  String get foodWasteSubtitle => 'Dai priorità agli ingredienti in scadenza';

  @override
  String get maxPrepTime => 'Tempo Massimo di Preparazione';

  @override
  String minutesSuffix(Object minutes) {
    return '$minutes minuti';
  }

  @override
  String get logout => 'Esci';

  @override
  String version(Object version) {
    return 'Versione $version';
  }

  @override
  String get dietaryPreferences => '🥗 Preferenze Alimentari';

  @override
  String get allergies => '⚠️ Allergie';

  @override
  String get appSettings => '⚙️ Impostazioni App';

  @override
  String get editAccountInfo => 'Modifica Info Account';

  @override
  String get editAccountInfoSubtitle => 'Nome, password e foto profilo';

  @override
  String get subscriptionPlans => 'Vedi Piani di Abbonamento';

  @override
  String get manageSubscription => 'Gestisci Abbonamento';

  @override
  String get premiumDiscover => 'Scopri le Funzioni Premium';

  @override
  String get premiumSubtitle =>
      'Ricette illimitate e funzioni speciali con IA.';

  @override
  String subscriptionActive(Object tier) {
    return 'ChefVision $tier Attivo';
  }

  @override
  String get subscriptionActiveSubtitle => 'Goditi i vantaggi del tuo piano.';

  @override
  String get deleteAccount => 'Elimina Account';

  @override
  String get deleteAccountWarning =>
      'Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata e tutti i tuoi dati (dispensa, preferiti) saranno eliminati in modo permanente.';

  @override
  String get deleteAccountConfirm => 'Sì, Elimina Il Mio Account';

  @override
  String get deleteAccountCancel => 'Annulla';

  @override
  String get deleteAccountSuccess =>
      'Il tuo account è stato eliminato con successo.';

  @override
  String get gourmetUser => 'Utente Gourmet';

  @override
  String get chefTitleBeginner => 'Apprendista di Cucina 🌱';

  @override
  String get chefTitleIntermediate => 'Chef Abile 👨‍🍳';

  @override
  String get chefTitleMaster => 'Capo Chef 👑';

  @override
  String get statFavorites => 'Preferiti';

  @override
  String get statPantry => 'I Miei Ingredienti';

  @override
  String get statCooked => 'Cucinati';

  @override
  String get recentSuggestions => '✨ Suggerimenti Recenti';

  @override
  String get clearAction => 'Cancella 🗑️';

  @override
  String get returnToRecipes => 'Torna alle Ricette';

  @override
  String get cameraLocked => 'Fotocamera Bloccata';

  @override
  String get cameraLockedMessage =>
      'Passa a Pro per aggiungere ingredienti con foto.';

  @override
  String get pantryTracking => 'Tracciamento Dispensa';

  @override
  String get pantryTrackingMessage =>
      'Passa a Pro o Premium per tracciare le date di scadenza.';

  @override
  String get shoppingListLocked => 'Lista della Spesa';

  @override
  String get shoppingListLockedMessage =>
      'Passa a Pro o Premium per gestire la tua lista della spesa.';

  @override
  String get loginWelcome => 'Benvenuto';

  @override
  String get loginSubtitle => 'Accedi al tuo account ChefVision';

  @override
  String get loginFailed => 'Accesso fallito';

  @override
  String get emailRequired => 'Email richiesta';

  @override
  String get emailInvalid => 'Inserisci un\'email valida';

  @override
  String get passwordLabel => 'Password';

  @override
  String get passwordRequired => 'Password richiesta';

  @override
  String get passwordMinLength => 'La password deve avere almeno 6 caratteri';

  @override
  String get rememberMe => 'Ricordami';

  @override
  String get forgotPassword => 'Password dimenticata';

  @override
  String get forgotPasswordSubtitle =>
      'Inserisci il tuo indirizzo email per ricevere un link di reimpostazione della password.';

  @override
  String get sendResetLink => 'Invia Link';

  @override
  String get resetLinkSent =>
      'Link di reimpostazione password inviato. Controlla la tua email.';

  @override
  String get loginButton => 'Accedi';

  @override
  String get noAccount => 'Non hai un account? ';

  @override
  String get registerButton => 'Registrati gratis';

  @override
  String get registerTitle => 'Crea Account';

  @override
  String get registerSubtitle => 'Inizia gratis!';

  @override
  String get registerFailed => 'Registrazione fallita';

  @override
  String get continueAsGuest => 'Continua come ospite';

  @override
  String get fullName => 'Nome Completo';

  @override
  String get nameRequired => 'Nome richiesto';

  @override
  String get nameMinLength => 'Minimo 2 caratteri';

  @override
  String get dietPreferencesOptional => 'Preferenze Alimentari (Opzionale)';

  @override
  String get allergiesOptional => 'Allergie (Opzionale)';

  @override
  String get dietVegan => '🌱 Vegano';

  @override
  String get dietVegetarian => '🥗 Vegetariano';

  @override
  String get dietGlutenFree => '🌾 Senza Glutine';

  @override
  String get dietDairyFree => '🥛 Senza Lattosio';

  @override
  String get allergyNuts => '🥜 Frutta a Guscio';

  @override
  String get allergyShellfish => '🦐 Frutti di Mare';

  @override
  String get allergyEggs => '🥚 Uova';

  @override
  String get allergySoy => '🫘 Soia';

  @override
  String get subPackages => 'Pacchetti Abbonamento';

  @override
  String subMaxTierActive(Object tier) {
    return 'Piano $tier Attivo!';
  }

  @override
  String subCurrentTier(Object tier) {
    return 'Sei nel piano $tier';
  }

  @override
  String get subUnlockPotential => 'Sblocca il tuo Potenziale Culinario';

  @override
  String get subMaxTierSubtitle => 'Stai godendo del piano massimo.';

  @override
  String get subUpgradeSubtitle => 'Aggiorna il piano per più funzionalità.';

  @override
  String get subChoosePlan =>
      'Scegli il piano migliore e approfitta dei vantaggi.';

  @override
  String get subMostPopular => 'PIÙ POPOLARE';

  @override
  String subSwitchTo(Object tier) {
    return 'Passa a $tier';
  }

  @override
  String get subAutoRenew =>
      'Abbonamento con rinnovo automatico. Cancella quando vuoi.';

  @override
  String get subPurchaseStarted =>
      'Acquisto avviato... Segui la schermata dello store.';

  @override
  String get subPurchaseError => 'Si è verificato un errore.';

  @override
  String subYourPlan(Object tier) {
    return 'Sei nel piano $tier';
  }

  @override
  String get subEnjoyPerks => 'Goditi tutti i vantaggi.';

  @override
  String get subManage => 'Gestisci Abbonamento';

  @override
  String get subPerMonth => '/ mese';

  @override
  String subRecipesPerDay(Object count) {
    return '$count Ricerche Ricette / Giorno';
  }

  @override
  String get subManualAdd => 'Aggiunta Manuale Ingredienti';

  @override
  String get subAdFree => 'Senza Pubblicità';

  @override
  String get subNoPhoto => 'Nessun Caricamento Foto';

  @override
  String get subNoPantry => 'Nessun Tracciamento Dispensa';

  @override
  String get subNoAssistant => 'Nessun Accesso Assistente';

  @override
  String get subPhotoAdd => '📸 Aggiungi per Foto';

  @override
  String get subPantryTracking => '🏠 Dispensa e Spesa';

  @override
  String get subNoChat => 'Nessun Chat Assistente';

  @override
  String get subNoVoice => 'Nessun Assistente Vocale';

  @override
  String get subChatAssistant => '💬 Chat Assistente';

  @override
  String get subVoiceAssistant => '🎙️ Assistente Vocale';

  @override
  String get subVideoAdd => '📹 Caricamento Video (In arrivo)';

  @override
  String get subPrioritySupport => '⚡ Supporto Prioritario';

  @override
  String get editProfileTitle => 'Modifica Profilo';

  @override
  String get saveChanges => 'Salva Modifiche';

  @override
  String get profileUpdated => 'Profilo aggiornato! ✅';

  @override
  String get personalInfo => 'Informazioni Personali';

  @override
  String get changePassword => 'Cambia Password';

  @override
  String get currentPassword => 'Password Attuale';

  @override
  String get newPassword => 'Nuova Password';

  @override
  String get confirmNewPassword => 'Conferma Nuova Password';

  @override
  String get passwordMismatch => 'Le password non corrispondono!';

  @override
  String get passwordUpdated => 'Password aggiornata! ✅';

  @override
  String get updatePassword => 'Aggiorna Password';

  @override
  String get emailAddress => 'Indirizzo Email';

  @override
  String get changeEmail => 'Cambia Email';

  @override
  String get changeEmailDescription =>
      'Per sicurezza, inserisci la tua password attuale e il nuovo indirizzo email.';

  @override
  String get newEmail => 'Nuova Email';

  @override
  String get cancel => 'Annulla';

  @override
  String get update => 'Aggiorna';

  @override
  String get emailUpdated => 'Email aggiornata! ✅';

  @override
  String get emailUpdateFailed => 'Impossibile cambiare l\'email.';

  @override
  String get prefVegan => 'Vegano';

  @override
  String get prefVegetarian => 'Vegetariano';

  @override
  String get prefGlutenFree => 'Senza Glutine';

  @override
  String get prefKeto => 'Keto';

  @override
  String get prefPaleo => 'Paleo';

  @override
  String get prefLowCarb => 'Basso in Carboidrati';

  @override
  String get prefMediterranean => 'Dieta Mediterranea';

  @override
  String get prefIntermittentFasting => 'Digiuno Intermittente';

  @override
  String get prefLowFat => 'Basso in Grassi';

  @override
  String get prefPescatarian => 'Pescetariano';

  @override
  String get prefDiabeticFriendly => 'Adatto ai Diabetici';

  @override
  String get prefHighProtein => 'Alto in Proteine';

  @override
  String get allergyNutsName => 'Frutta a Guscio';

  @override
  String get allergyMilk => 'Latte';

  @override
  String get allergyEgg => 'Uovo';

  @override
  String get allergySeafood => 'Frutti di Mare';

  @override
  String get allergyGluten => 'Glutine';

  @override
  String get allergySoyName => 'Soia';

  @override
  String get allergyPeanuts => 'Arachidi';

  @override
  String get allergyMushroom => 'Funghi';

  @override
  String get allergyMustard => 'Senape';

  @override
  String get allergySesame => 'Sesamo';

  @override
  String get allergyStrawberry => 'Fragola';

  @override
  String get allergyKiwi => 'Kiwi';

  @override
  String get allergyCelery => 'Sedano';

  @override
  String get notifProductExpired => 'Prodotto Scaduto!';

  @override
  String get notifTimeLow => 'Tempo in Esaurimento!';

  @override
  String notifProductExpiredMessage(Object name) {
    return '$name è scaduto.';
  }

  @override
  String notifTimeLowMessage(Object name) {
    return '$name sta per scadere.';
  }

  @override
  String get maintenanceTitle => 'Cucina in Manutenzione!';

  @override
  String get maintenanceSubtitle =>
      'I nostri chef stanno aggiornando il sistema per servirvi meglio. Torneremo presto con ricette fantastiche.';

  @override
  String get maintenanceRetry => 'Riprova';

  @override
  String get lowCalorie => 'Basso in Calorie';

  @override
  String get resumeCooking => 'Continua a Cucinare 🍳';

  @override
  String get timerFinishedTitle => 'Tempo scaduto!';

  @override
  String timerFinishedMessage(Object recipe) {
    return 'Il timer per la ricetta $recipe è terminato.';
  }

  @override
  String get timerNotificationAction => 'Vai all\'App';

  @override
  String get tipWaste =>
      'Usa prima gli ingredienti in scadenza per evitare sprechi! ♻️';

  @override
  String get tipSalt => 'Aggiungi il sale alla fine, ne userai meno 🧂';

  @override
  String get tipOnion =>
      'Raffredda le cipolle in frigo 10 min prima di tagliarle 🧅';

  @override
  String get tipPasta => 'Aggiungi un pizzico di sale quando bolli la pasta 🍝';

  @override
  String get tipBread => 'Trasforma il pane avanzato in pangrattato 🍞';

  @override
  String get tipLemon => 'Rotola i limoni prima di spremerli per più succo 🍋';

  @override
  String get tipGreens =>
      'Avvolgi le verdure in carta assorbente per farle durare di più 🥬';

  @override
  String get tipGarlic =>
      'Schiaccia l\'aglio con un coltello per sbucciarlo facilmente 🧄';

  @override
  String get tipEgg =>
      'Metti le uova sode in acqua fredda per sbucciarle facilmente 🥚';

  @override
  String get tipRice =>
      'Risciacqua il riso prima di cucinare per ridurre l\'amido 🍚';

  @override
  String get tipPan =>
      'Non sovraccaricare la padella, gli ingredienti cuoceranno a vapore 🍳';

  @override
  String get tipMeat =>
      'Non girare troppo la carne, una volta basta per una bella crosta 🥩';

  @override
  String get tipYogurt =>
      'Togli lo yogurt 10 min prima, è più buono a temperatura ambiente 🥛';

  @override
  String get tipSteam =>
      'Cuoci le verdure a vapore per conservare meglio le vitamine 🥦';

  @override
  String get tipSpices =>
      'Tosta leggermente le spezie in padella per sprigionare gli aromi 🌶️';

  @override
  String get tipParmesan =>
      'Aggiungi la crosta di parmigiano alla zuppa per un sapore incredibile 🧀';

  @override
  String get tipAvocado =>
      'Matura gli avocado mettendoli in un sacchetto con una banana 🥑';

  @override
  String get tipBroth => 'Conserva l\'acqua di cottura come brodo vegetale 🍲';

  @override
  String get tipTomato =>
      'Aggiungi un cucchiaino di zucchero alla salsa di pomodoro per ridurre l\'acidità 🍅';

  @override
  String get tipHerbs =>
      'Congela le erbe fresche nell\'olio d\'oliva con le vaschette del ghiaccio 🌿';

  @override
  String get tipDishes =>
      'Lava i piatti subito, le macchie secche sono più difficili 🍽️';

  @override
  String get tipCake =>
      'Assicurati che gli ingredienti siano a temperatura ambiente quando infornate 🎂';

  @override
  String get tipSalad => 'Prepara il condimento in anticipo e refrigera 🥗';

  @override
  String get tipOliveOil =>
      'Usa l\'olio d\'oliva a fuoco basso, ad alta temperatura perde nutrienti 🫒';

  @override
  String get tipRosemary =>
      'Fai un infuso di rosmarino fresco, aiuta la digestione 🫖';

  @override
  String get tipBeans =>
      'Metti in ammollo i legumi secchi la sera prima per dimezzare i tempi 🫘';

  @override
  String get tipBrothCubes =>
      'Congela il brodo in cubetti di ghiaccio per aggiungere sapore facilmente 🧊';

  @override
  String get tipFries =>
      'Immergi le patate in acqua prima di friggerle per più croccantezza 🍟';

  @override
  String get tipFreshEgg =>
      'Testa la freschezza dell\'uovo immergendolo in acqua 💧';

  @override
  String get tipCoffee =>
      'Usa i fondi di caffè come fertilizzante per le piante ☕';

  @override
  String personServings(Object count) {
    return '$count Person';
  }

  @override
  String get howManyPeople => 'How many people?';

  @override
  String get sixPlus => '6+';

  @override
  String get kitchen => 'Cuisine';

  @override
  String get meal => 'Meal';

  @override
  String get diet => 'Diet';

  @override
  String get preventWaste => 'Prevent Waste';

  @override
  String get clearList => 'Clear All';

  @override
  String get clearIngredientsTitle => 'Clear All Ingredients?';

  @override
  String get clearIngredientsMsg =>
      'All ingredients in your list will be deleted. This cannot be undone.';

  @override
  String get yesDelete => 'Yes, Delete';

  @override
  String get addIngredientTitle => 'Add Ingredient';

  @override
  String get editIngredientTitle => 'Edit Ingredient';

  @override
  String get newIngredientHint => 'New ingredient name';

  @override
  String get add => 'Aggiungi';

  @override
  String get edit => 'Edit';

  @override
  String get suggestRecipes => 'Suggest Recipes';

  @override
  String get recipeSuggestions => 'Recipe Suggestions';

  @override
  String get suggestDifferent => 'Suggest Different Recipes';

  @override
  String get noRecipesFound => 'No Recipes Found';

  @override
  String get noRecipesFoundMsg => 'No recipes found for these filters.';

  @override
  String get tryDifferentIngredients => 'Try different ingredients';

  @override
  String get match => 'match';

  @override
  String get loadingMixing => 'Mixing flavors...';

  @override
  String get loadingChef => 'Chef is putting on the hat...';

  @override
  String get loadingSelecting => 'Selecting best recipes...';

  @override
  String get loadingIngredients => 'Checking ingredients...';

  @override
  String get loadingSecret => 'Searching secret recipes...';

  @override
  String get loadingAI => 'Please wait, AI is working...';

  @override
  String get ingredientsSearchHint => 'Type ingredient name... (e.g. Milk)';

  @override
  String get noIngredients => 'No ingredients yet';

  @override
  String get addIngredientsHint => 'Add ingredients by taking a photo';

  @override
  String get kitchenCustomTitle => 'Or Type a Specific Cuisine:';

  @override
  String get kitchenCustomHint => 'Ex: Korean, Aegean...';

  @override
  String get clearSelection => 'Clear Selection';

  @override
  String get selected => 'Selected';

  @override
  String get delete => 'Elimina';

  @override
  String get worldCuisineSelection => 'Selezione Cucina Internazionale';

  @override
  String get pantryTitle => 'I Miei Ingredienti';

  @override
  String get addIngredient => 'Aggiungi Ingrediente';

  @override
  String get manualAdd => 'Aggiungi Manualmente';

  @override
  String get manualAddSubtitle => 'Digita il nome dell\'ingrediente';

  @override
  String get scanReceipt => 'Scansiona Scontrino';

  @override
  String get scanReceiptSubtitle => 'Importazione automatica dallo scontrino';

  @override
  String get photoAdd => 'Aggiungi con Foto';

  @override
  String get photoAddSubtitle => 'Riconoscimento automatico con IA';

  @override
  String get photoIngredientAdd => 'Aggiungi Ingrediente con Foto';

  @override
  String get ingredientAdded => 'Ingrediente aggiunto';

  @override
  String ingredientsAddedCount(Object count) {
    return '$count ingredienti aggiunti!';
  }

  @override
  String get ingredientNotDetected => 'Ingrediente non rilevato';

  @override
  String get aiAnalyzing => 'IA in Analisi...';

  @override
  String get ingredientName => 'Nome Ingrediente';

  @override
  String get quantity => 'Quantità';

  @override
  String get unitLabel => 'Unità';

  @override
  String get expiryDateOptional => 'Data di Scadenza (Opzionale)';

  @override
  String expiryDateLabel(Object day, Object month, Object year) {
    return 'Scad: $day/$month/$year';
  }

  @override
  String get save => 'Salva';

  @override
  String get deleteConfirmTitle => 'Sei sicuro di voler eliminare?';

  @override
  String deleteConfirmMessage(Object name) {
    return '$name verrà rimosso dalla tua dispensa.';
  }

  @override
  String get allIngredients => 'Tutti gli Ingredienti';

  @override
  String expiringSoonCount(Object count) {
    return 'In Scadenza ($count)';
  }

  @override
  String get pantryEmpty => 'La tua dispensa è vuota';

  @override
  String get pantryEmptySubtitle => 'Inizia aggiungendo ingredienti';

  @override
  String get noExpiringItems => 'Nessun prodotto in scadenza!';

  @override
  String get allItemsFresh => 'Tutti i prodotti sono freschi!';

  @override
  String get addToList => 'Aggiungi alla Lista';

  @override
  String addedToShoppingList(Object name) {
    return '$name aggiunto alla lista della spesa';
  }

  @override
  String get ok => 'OK';

  @override
  String get loginRequired => 'Devi accedere per utilizzare questa funzione';

  @override
  String get pantryEmptyAddFirst =>
      'La tua dispensa è vuota, aggiungi prima gli ingredienti';

  @override
  String errorGeneric(Object error) {
    return 'Errore: $error';
  }

  @override
  String get notifications => 'Notifiche';

  @override
  String get markAllRead => 'Segna Tutto Letto';

  @override
  String get noNotifications => 'Nessuna notifica';

  @override
  String get noNotificationsSubtitle =>
      'Gli aggiornamenti importanti appariranno qui';

  @override
  String get justNow => 'Proprio ora';

  @override
  String minutesAgo(Object minutes) {
    return '$minutes min fa';
  }

  @override
  String hoursAgo(Object hours) {
    return '$hours ore fa';
  }

  @override
  String get yesterdayLabel => 'Ieri';

  @override
  String get shoppingListTitle => 'Lista della Spesa';

  @override
  String get addIngredientHint => 'Aggiungi ingrediente...';

  @override
  String get itemAlreadyExists => 'Questo prodotto è già nella tua lista!';

  @override
  String get deleteCheckedTitle => 'Elimina Selezionati';

  @override
  String deleteCheckedMessage(Object count) {
    return '$count prodotti selezionati verranno eliminati. Sei sicuro?';
  }

  @override
  String get deleteSelectedTitle => 'Elimina Selezionati';

  @override
  String deleteSelectedMessage(Object count) {
    return 'Sei sicuro di voler eliminare $count prodotti?';
  }

  @override
  String selectedCount(Object count) {
    return '$count selezionati';
  }

  @override
  String get selectAll => 'Seleziona Tutto';

  @override
  String get shareLabel => 'Condividi';

  @override
  String get shareList => 'Condividi Lista';

  @override
  String get multiSelect => 'Selezione Multipla';

  @override
  String get deleteChecked => 'Elimina Selezionati';

  @override
  String get shoppingListEmpty => 'Lista della Spesa Vuota';

  @override
  String get shoppingListEmptySubtitle =>
      'Inizia aggiungendo ciò che devi comprare';

  @override
  String purchasedCount(Object count) {
    return 'Acquistato ($count)';
  }

  @override
  String get listCopied => 'Lista copiata!';

  @override
  String get selectedItems => 'Selezionati:';

  @override
  String get itemsToBuy => 'Da Comprare:';

  @override
  String get editItem => 'Modifica articolo';

  @override
  String get itemName => 'Nome articolo';

  @override
  String get editLabel => 'Modifica';

  @override
  String get smartStockAnalysis => 'Analisi Intelligente dello Stock';

  @override
  String get statsLoadError => 'Impossibile caricare le statistiche';

  @override
  String get tryAgain => 'Riprova';

  @override
  String get totalProducts => 'Prodotti Totali';

  @override
  String get expiringSoonLabel => 'In Scadenza';

  @override
  String get expiredLabel => 'Scaduti';

  @override
  String get categoriesLabel => 'Categorie';

  @override
  String get categoryDistribution => 'Distribuzione per Categorie';

  @override
  String get noData => 'Nessun dato';

  @override
  String get wastePreventionScore => 'Punteggio Anti-Spreco';

  @override
  String get scoreGreat => 'Stai andando alla grande!';

  @override
  String get scoreWarning => 'Attenzione! Alto rischio di spreco.';

  @override
  String get scoreBetter => 'Potrebbe andare meglio.';

  @override
  String get wastePreventionSubtitle =>
      'Stai prevenendo lo spreco alimentare usando la tua dispensa in modo efficiente.';

  @override
  String productsCount(Object count) {
    return '$count prodotti';
  }

  @override
  String get manageSubscriptionTitle => 'Gestisci Abbonamento';

  @override
  String get activeStatus => 'Attivo';

  @override
  String get startDate => 'Data di Inizio';

  @override
  String get statusLabel => 'Stato';

  @override
  String get autoRenews => 'Rinnovo Automatico';

  @override
  String get changePlan => 'Cambia o Annulla Piano';

  @override
  String get changePlanDescription =>
      'Verrai reindirizzato alle impostazioni dello store per annullare o modificare il tuo abbonamento. I pagamenti e i rinnovi sono gestiti direttamente dallo store.';

  @override
  String get platformLabel => 'Piattaforma';

  @override
  String get filterEasy => 'Facile';

  @override
  String get filterFast => 'Veloce (<30min)';

  @override
  String get filterLowCal => 'Bassa Caloria';

  @override
  String get minuteAbbr => 'min';

  @override
  String get stockAnalysis => 'Analisi dello Stock';

  @override
  String get suggestRecipe => 'Suggerisci Ricetta';

  @override
  String get categoryVegetables => 'Verdure';

  @override
  String get categoryFruits => 'Frutta';

  @override
  String get categoryMeat => 'Carne e Pollame';

  @override
  String get categorySeafood => 'Frutti di Mare';

  @override
  String get categoryDairy => 'Latticini';

  @override
  String get categoryEggs => 'Uova';

  @override
  String get categoryGrains => 'Cereali';

  @override
  String get categoryLegumes => 'Legumi';

  @override
  String get categoryPasta => 'Pasta e Spaghetti';

  @override
  String get categoryBakery => 'Pane e Panetteria';

  @override
  String get categorySpices => 'Spezie';

  @override
  String get categorySauces => 'Salse e Condimenti';

  @override
  String get categoryOils => 'Oli';

  @override
  String get categoryBeverages => 'Bevande';

  @override
  String get categorySnacks => 'Snack';

  @override
  String get categoryNuts => 'Frutta Secca';

  @override
  String get categoryFrozen => 'Surgelati';

  @override
  String get categoryCanned => 'Conserve';

  @override
  String get categorySweets => 'Dolci e Zucchero';

  @override
  String get categoryOther => 'Altro';

  @override
  String get expiryUnknown => 'Sconosciuto';

  @override
  String get expiryExpired => 'Scaduto';

  @override
  String get expiryToday => 'Oggi!';

  @override
  String get expiryTomorrow => 'Domani';

  @override
  String expiryDays(Object days) {
    return '$days giorni';
  }

  @override
  String get unitAdet => 'pz';

  @override
  String get unitKg => 'kg';

  @override
  String get unitG => 'g';

  @override
  String get unitL => 'L';

  @override
  String get unitMl => 'ml';

  @override
  String get unitDemet => 'mazzo';

  @override
  String get unitPaket => 'confezione';

  @override
  String get unitKavanoz => 'barattolo';

  @override
  String get errorImageAnalysisFailed => 'Analisi dell\'immagine fallita';

  @override
  String get errorFeatureLocked =>
      'Questa funzionalità non è disponibile nel tuo piano.';

  @override
  String get errorLimitExceeded => 'Limite giornaliero superato.';

  @override
  String get errorNoIngredients => 'Seleziona almeno un ingrediente.';

  @override
  String get errorConnectionTimeout => 'Timeout della connessione. Riprova.';

  @override
  String errorServerConnection(Object error) {
    return 'Impossibile connettersi al server: $error';
  }

  @override
  String get errorRecipeSuggestionFailed => 'Suggerimento ricetta fallito';

  @override
  String get errorTrialExpired => 'La tua prova gratuita è scaduta.';

  @override
  String get errorRecipeLimitExceeded =>
      'Limite giornaliero di ricerca ricette superato.';

  @override
  String get errorDetailedRecipeLocked =>
      'Le ricette dettagliate sono esclusive del piano Pro.';

  @override
  String errorRecipeDetailFailed(Object error) {
    return 'Impossibile ottenere i dettagli della ricetta: $error';
  }

  @override
  String get errorVerifyFailed => 'Verifica fallita: Risposta imprevista.';

  @override
  String errorSubscriptionVerifyFailed(Object error) {
    return 'Impossibile verificare l\'abbonamento: $error';
  }

  @override
  String get verifyEmailTitle => 'Verifica La Tua Email';

  @override
  String verifyEmailSubtitle(Object email) {
    return 'Abbiamo inviato un link di verifica a $email. Controlla la tua casella di posta e la cartella spam.';
  }

  @override
  String get verifiedButton => 'Email Verificata, Accedi';

  @override
  String get scanIngredientTitle => 'Scansiona Ingredienti';

  @override
  String get analyzeIngredients => 'Analizza Ingredienti';

  @override
  String get uploadIngredients => 'Carica Ingredienti';

  @override
  String get aiWillRecognize => 'L\'IA riconoscerà tutti gli ingredienti';

  @override
  String get cameraLabel => 'Fotocamera';

  @override
  String get takePhotoAction => 'Scatta una foto';

  @override
  String get galleryLabel => 'Galleria';

  @override
  String get selectPhoto => 'Seleziona una foto';

  @override
  String get ensureVisible =>
      'Assicurati che tutti gli ingredienti siano visibili';

  @override
  String get selectDifferentPhoto => 'Seleziona un\'Altra Foto';

  @override
  String imageCouldNotBeSelected(Object error) {
    return 'L\'immagine non può essere selezionata: $error';
  }

  @override
  String get photoReady => 'Foto pronta';

  @override
  String get identifyingIngredients => 'Identificazione ingredienti';

  @override
  String get stepsLoading => 'Preparazione Passi della Ricetta...';

  @override
  String get pleaseWaitOrRetry => 'Attendere o riprovare più tardi.';

  @override
  String get timerLabel => 'Timer';

  @override
  String get stopTimerQuestion => 'Vuoi fermare il timer?';

  @override
  String get noLabel => 'No';

  @override
  String get yesStop => 'Sì, Ferma';

  @override
  String stepProgress(Object completed, Object current, Object total) {
    return 'PASSO $current / $total  ($completed completati)';
  }

  @override
  String stepCompletedLabel(Object number) {
    return 'PASSO $number ✓';
  }

  @override
  String stepNumberLabel(Object number) {
    return 'PASSO $number';
  }

  @override
  String get readStepAloud => 'Leggi il Passo ad Alta Voce';

  @override
  String get completedLabel => 'Completato';

  @override
  String get finishCookingAction => 'Termina la Cottura';

  @override
  String get listeningLabel => 'In ascolto...';

  @override
  String get thinkingLabel => 'Sto pensando...';

  @override
  String get errorOccurred => 'Si è verificato un errore.';

  @override
  String get askSomething => 'Chiedi qualcosa...';

  @override
  String get chefAssistant => 'Assistente Chef';

  @override
  String get chatEmptyHint =>
      'Puoi chiedere informazioni sulla ricetta.\nEs: \"Rileggi il passo 2\" o \"A che temperatura il forno?\"';

  @override
  String get timerFinished => 'Tempo Scaduto! 🍽️';

  @override
  String timerFinishedBody(Object title) {
    return 'Il timer impostato per $title è terminato.';
  }

  @override
  String get timeUpCheckFood => 'Tempo scaduto! Controlla il tuo piatto.';

  @override
  String get detailedRecipe => 'Ricetta Dettagliata';

  @override
  String detailedRecipeLoadFailed(Object error) {
    return 'Impossibile caricare la ricetta dettagliata: $error';
  }

  @override
  String get turkishCuisine => 'Cucina Turca';

  @override
  String get optionalLabel => 'opzionale';

  @override
  String get instructionsNotFound => 'Istruzioni non trovate.';

  @override
  String get viewDetails => 'Vedi Dettagli e Preparazione';

  @override
  String get ingredientsLoading => 'Caricamento informazioni ingredienti...';

  @override
  String get addToShoppingList => 'Aggiungi alla Lista della Spesa';

  @override
  String get addingToList => 'Aggiunta ingredienti alla lista...';

  @override
  String ingredientsAddedToList(Object count) {
    return '$count ingredienti aggiunti alla lista della spesa!';
  }

  @override
  String get errorOrEmptyList =>
      'Si è verificato un errore o la lista è vuota.';

  @override
  String get chefIngredientTip => 'Consiglio Ingredienti dello Chef';

  @override
  String chefTipDescription(Object ingredients) {
    return 'Abbiamo preparato questa ricetta con i tuoi ingredienti disponibili ma nota: Se hai $ingredients, aggiungerli migliorerebbe molto il sapore! ✨';
  }

  @override
  String get tipsPlaceholder =>
      'I consigli speciali dello chef appariranno qui con la ricetta dettagliata.';

  @override
  String get quickLabel => 'Veloce';

  @override
  String get detailedLabel => 'Dettagliato';

  @override
  String get preparingLabel => 'Preparazione...';

  @override
  String get requestDetailedRecipe => 'Richiedi Ricetta Dettagliata';

  @override
  String get requestQuickRecipe => 'Ricetta Veloce';

  @override
  String caloriesPerServing(Object calories) {
    return '$calories kcal / porzione';
  }

  @override
  String get personSuffix => 'persona';

  @override
  String get receiptScanTitle => 'Scansiona Scontrino';

  @override
  String get tapToSelectReceipt =>
      'Tocca per selezionare la foto dello scontrino';

  @override
  String get openCamera => 'Apri Fotocamera';

  @override
  String get analyzingReceipt =>
      'Analisi dello scontrino...\nPotrebbe richiedere alcuni secondi.';

  @override
  String foundProducts(Object count) {
    return 'Prodotti Trovati ($count)';
  }

  @override
  String totalAmount(Object amount) {
    return 'Totale: $amount TL';
  }

  @override
  String get noProductsFound => 'Nessun prodotto trovato.';

  @override
  String get addAllToPantry => 'Aggiungi Tutto alla Dispensa';

  @override
  String get receiptAnalysisFailed =>
      'Analisi scontrino fallita o nessun prodotto trovato.';

  @override
  String productsAddedToPantry(Object count) {
    return '$count prodotti aggiunti alla dispensa.';
  }

  @override
  String get voiceAssistantTitle => 'Assistente Vocale';

  @override
  String get clearChat => 'Cancella Chat';

  @override
  String get chatCleared => 'Chat cancellata. Come posso aiutarti?';

  @override
  String get tapMicAndSpeak => 'Tocca il microfono e parla';

  @override
  String get recipesStepsNotLoaded =>
      'Impossibile caricare i passi della ricetta.';

  @override
  String get speechNotAvailable => 'Riconoscimento vocale non disponibile';

  @override
  String get welcomeMessage =>
      'Ciao! Sono il tuo assistente chef. Come posso aiutarti?';

  @override
  String get speakingLabel => 'Parlando...';

  @override
  String get quickItemBread => 'Pane';

  @override
  String get quickItemMilk => 'Latte';

  @override
  String get quickItemEgg => 'Uovo';

  @override
  String get quickItemWater => 'Acqua';

  @override
  String get quickItemTomato => 'Pomodoro';

  @override
  String get quickItemCheese => 'Formaggio';

  @override
  String get quickItemYogurt => 'Yogurt';

  @override
  String get quickItemPasta => 'Pasta';

  @override
  String get suitablePlans => 'Piani Adatti';

  @override
  String get reviewPlans => 'Vedi Piani';

  @override
  String get later => 'Più Tardi';

  @override
  String get dietType => 'Tipo di Dieta';

  @override
  String get otherAllergyHint => 'Altro (es. Funghi)';

  @override
  String get apply => 'Applica';

  @override
  String get cuisineTurkish => 'Turco';

  @override
  String get cuisineItalian => 'Italiano';

  @override
  String get cuisineAsian => 'Asiatico';

  @override
  String get cuisineMexican => 'Messicano';

  @override
  String get mealBreakfast => 'Colazione';

  @override
  String get mealDinner => 'Cena';

  @override
  String get mealSnack => 'Spuntino';

  @override
  String get statTotal => 'Totale';

  @override
  String get errorLoginFailed => 'Accesso fallito. Controlla email e password.';

  @override
  String get errorConnection =>
      'Impossibile connettersi al server. Controlla la tua connessione internet.';

  @override
  String get errorTimeout => 'Connessione scaduta. Riprova.';

  @override
  String get errorServer => 'Errore del server. Riprova più tardi.';

  @override
  String get errorUnknown => 'Si è verificato un errore sconosciuto.';

  @override
  String get errorAccessDenied => 'Accesso negato.';

  @override
  String get restrictedAccessTitle => 'Accesso Limitato';

  @override
  String get restrictedAccessMessage =>
      'Troppi cambi di dispositivo rilevati nel tuo account.';

  @override
  String get restrictedAccessDescription =>
      'Per motivi di sicurezza, questo account è stato limitato (Modalità Limitata). Contatta il supporto per procedere.';

  @override
  String get getSupport => 'Ottieni Supporto';

  @override
  String get close => 'Chiudi';

  @override
  String get accountRestrictionTopic => 'Restrizione Account';

  @override
  String get liveSupportTitle => 'Supporto Live';

  @override
  String get liveSupportSubtitle => 'Scrivici le tue domande';

  @override
  String get helpQuestion => 'Come possiamo aiutarti?';

  @override
  String get topicTechnical => 'Supporto Tecnico';

  @override
  String get topicPayment => 'Pagamento & Abbonamento';

  @override
  String get topicSuggestion => 'Suggerimenti & Richieste';

  @override
  String get topicOther => 'Altri Argomenti';

  @override
  String get adminPanelTitle => 'Pannello Admin (Chat)';

  @override
  String get adminPanelSubtitle => 'Gestisci messaggi in arrivo';

  @override
  String servingsCount(int count) {
    return '$count porzioni';
  }

  @override
  String get chatUserTitle => 'Chat Utente';

  @override
  String get chatLiveSupportTitle => 'Supporto Live';

  @override
  String get chatEndButtonTooltip => 'Termina Chat';

  @override
  String get chatEndDialogTitle => 'Termina Chat';

  @override
  String get chatEndDialogContext =>
      'Il tuo problema è risolto? Sei sicuro di voler terminare la chat?';

  @override
  String get chatEndDialogCancel => 'Annulla';

  @override
  String get chatEndDialogConfirm => 'Sì, Termina Chat';

  @override
  String get chatNoMessagesHello => 'Nessun messaggio ancora. Saluta! 👋';

  @override
  String get chatHistoryClearedInfo => 'Cronologia chat cancellata. 👋';

  @override
  String get chatInputHint => 'Scrivi il tuo messaggio...';

  @override
  String get adminSupportRequestsTitle => 'Richieste di Supporto';

  @override
  String get adminNoSupportRequests => 'Ancora nessuna richiesta di supporto.';

  @override
  String get adminUserPrefix => 'Utente: ';

  @override
  String get customTimerChannelName => 'Timer Attivo';

  @override
  String get customTimerChannelDescription => 'Stato del timer di cottura';

  @override
  String get timerCookingDescription =>
      'In cottura...\nSarai avvisato quando è pronto.';

  @override
  String get chefVisionActiveTimer => 'Timer Attivo ChefVision';

  @override
  String timerCookingTitle(Object title) {
    return '$title è in cottura...';
  }

  @override
  String get guestChefName => 'Chef Ospite';

  @override
  String get unregisteredAccount => 'Account Non Registrato';

  @override
  String get guestSignUpDesc =>
      'Crea il tuo account gratuito per salvare ricette personalizzate, effettuare scansioni IA illimitate e costruire la tua Dispensa Virtuale.';

  @override
  String get usageLimitsTitle => 'Limiti di Utilizzo Rimanenti';

  @override
  String get usageLimitCamera => 'Scansione con Fotocamera';

  @override
  String get usageLimitAiRecipe => 'Richiesta Ricetta IA';

  @override
  String get loginOrRegister => 'Accedi o Registrati';

  @override
  String get err_user_not_found =>
      'Utente non trovato - per favore accedi di nuovo';

  @override
  String get err_session_expired_other_device =>
      'La tua sessione è stata interrotta perché hai effettuato l\'accesso da un altro dispositivo.';

  @override
  String get err_receipt_missing => 'Mancano i dati della ricevuta.';

  @override
  String get err_receipt_used_by_another_user =>
      'Questo acquisto è collegato a un altro account.';

  @override
  String get err_already_pro_other_platform =>
      'Hai già un abbonamento attivo da un\'altra piattaforma.';

  @override
  String get err_subscription_expired => 'Il tuo abbonamento è scaduto.';

  @override
  String get err_google_credentials_missing =>
      'Credenziali Google configurate in modo errato sul server.';

  @override
  String get err_google_receipt_invalid =>
      'Risposta di verifica Google non valida.';

  @override
  String get err_google_verification_failed => 'Verifica Google fallita.';

  @override
  String get err_apple_receipt_failed =>
      'La ricevuta Apple non può essere decodificata o è stata respinta dall\'App Store.';

  @override
  String get err_platform_not_supported => 'Piattaforma non supportata.';

  @override
  String get err_verification_service => 'Errore del servizio di verifica.';

  @override
  String get err_verification_failed => 'Verifica fallita.';

  @override
  String get err_database_update =>
      'Si è verificato un errore del database durante l\'aggiornamento dell\'abbonamento.';

  @override
  String get warning_subscription_active_delete =>
      'Il tuo account è stato eliminato con successo. Tuttavia, il tuo abbonamento attivo al negozio potrebbe essere ancora in corso! Ricordati di annullarlo manualmente dalle impostazioni del tuo telefono.';

  @override
  String get success_account_deleted =>
      'Il tuo account è stato eliminato con successo.';

  @override
  String get err_usage_limit_reached =>
      'Hai raggiunto il limite della prova gratuita. Iscriviti per ottenere ricette avanzate e altre funzioni.';

  @override
  String cuisineLabel(Object cuisine) {
    return 'Cucina $cuisine';
  }

  @override
  String get subExpiredTitle => 'Il tuo abbonamento è scaduto';

  @override
  String get subExpiredSubtitle =>
      'Rinnova per continuare a goderti le funzionalità premium.';

  @override
  String get subRenew => 'Rinnova abbonamento';

  @override
  String get subExpiredBanner => 'Abbonamento scaduto — Tocca per rinnovare';
}
