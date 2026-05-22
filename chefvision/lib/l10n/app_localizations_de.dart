// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for German (`de`).
class AppLocalizationsDe extends AppLocalizations {
  AppLocalizationsDe([String locale = 'de']) : super(locale);

  @override
  String get appTitle => 'ChefVision AI';

  @override
  String get appName => 'ChefVision';

  @override
  String get splashTagline => 'Ihr KI-gestützter smarter Koch';

  @override
  String get greetingMorning => 'Guten Morgen';

  @override
  String get greetingAfternoon => 'Guten Tag';

  @override
  String get greetingEvening => 'Guten Abend';

  @override
  String get greetingNight => 'Gute Nacht';

  @override
  String get whatToCook => 'Was möchten Sie kochen?';

  @override
  String get scanIngredients => 'Zutaten Scannen';

  @override
  String get scanIngredientsSubtitle =>
      'Kühlschrank fotografieren, KI findet Rezepte';

  @override
  String get takePhoto => 'Foto Machen';

  @override
  String get typeYourself => 'Manuell Hinzufügen';

  @override
  String get myPantry => 'Meine Zutaten';

  @override
  String get yourIngredients => 'Deine Zutaten';

  @override
  String get shoppingList => 'Einkaufsliste';

  @override
  String get yourList => 'Deine Liste';

  @override
  String get popularRecipes => 'Beliebte Rezepte';

  @override
  String get viewAll => 'Alle Anzeigen';

  @override
  String get expiryWarningTitle => 'Läuft Bald Ab';

  @override
  String get expiredWarningTitle => 'Abgelaufen';

  @override
  String itemsExpired(Object count) {
    return '$count Produkte sind abgelaufen!';
  }

  @override
  String itemsExpiring(Object count) {
    return '$count Produkte laufen bald ab!';
  }

  @override
  String get dailyTip => 'Tipp des Tages';

  @override
  String get discover => 'Entdecken';

  @override
  String get discoverSubtitle =>
      'Neue Rezepte und Küchengeheimnisse kommen bald!';

  @override
  String get noFavorites => 'Noch Keine Favoriten';

  @override
  String get noFavoritesSubtitle =>
      'Hier können Sie Rezepte hinzufügen, die Sie mögen.';

  @override
  String get favoriteRecipes => 'Deine Lieblingsrezepte';

  @override
  String get profile => 'Profil';

  @override
  String get editProfile => 'Profil Bearbeiten';

  @override
  String get home => 'Startseite';

  @override
  String get search => 'Suche';

  @override
  String get favorites => 'Favoriten';

  @override
  String get settings => 'Einstellungen';

  @override
  String get language => 'Sprache';

  @override
  String get selectLanguage => 'Sprache Wählen';

  @override
  String get ingredients => 'Zutaten';

  @override
  String get instructions => 'Anleitung';

  @override
  String get prepTime => 'Vorb.';

  @override
  String get recipe => 'Recipe';

  @override
  String get cookTime => 'Kochen';

  @override
  String get servings => 'Portionen';

  @override
  String get difficulty => 'Schwierigkeit';

  @override
  String get calories => 'Kalorien';

  @override
  String get startCooking => 'Kochen Starten';

  @override
  String get readAloud => 'Vorlesen';

  @override
  String get stopReading => 'Vorlesen Stoppen';

  @override
  String get pauseReading => 'Pause';

  @override
  String get resumeReading => 'Fortsetzen';

  @override
  String get nextStep => 'Nächster Schritt';

  @override
  String get previousStep => 'Vorheriger Schritt';

  @override
  String get finishCooking => 'Kochen Beenden';

  @override
  String get cookingCompleted => 'Kochen Abgeschlossen!';

  @override
  String get cookingCompletedSubtitle =>
      'Guten Appetit! Du hast ein leckeres Essen zubereitet.';

  @override
  String get bonAppetit => 'Guten Appetit!';

  @override
  String get backToHomeCaps => 'ZUR STARTSEITE';

  @override
  String get backToHome => 'Zur Startseite';

  @override
  String get analyzing => 'Analysiere...';

  @override
  String get analyzingSubtitle => 'Identifiziere Zutaten mit KI';

  @override
  String get addToPantry => 'Zum Vorrat Hinzufügen';

  @override
  String get retry => 'Wiederholen';

  @override
  String get error => 'Fehler';

  @override
  String get success => 'Erfolg';

  @override
  String get itemAdded => 'Produkt erfolgreich hinzugefügt';

  @override
  String get itemRemoved => 'Produkt erfolgreich entfernt';

  @override
  String get onboardingTitle1 => 'Zutaten Scannen';

  @override
  String get onboardingDesc1 =>
      'Lade deine Zutaten hoch, lass KI sie sofort identifizieren';

  @override
  String get onboardingTitle2 => 'Rezepte Erhalten';

  @override
  String get onboardingDesc2 =>
      'KI schlägt die leckersten Rezepte mit dem vor, was du hast';

  @override
  String get onboardingTitle3 => 'Sprachassistent';

  @override
  String get onboardingDesc3 =>
      'Freihändiges Kochen, Rezepte und Schritt-für-Schritt-Anleitung per Sprachbefehl';

  @override
  String get skip => 'Überspringen';

  @override
  String get start => 'Starten';

  @override
  String get continueAction => 'Weiter';

  @override
  String iapErrorStarted(Object error) {
    return 'Kauf konnte nicht gestartet werden: $error';
  }

  @override
  String get iapErrorVerification =>
      'Überprüfung fehlgeschlagen (Internet prüfen). Transaktion gespeichert, automatischer erneuter Versuch.';

  @override
  String iapErrorGeneral(Object error) {
    return 'Kauffehler: $error';
  }

  @override
  String trialRemaining(Object current, Object total) {
    return 'Testversion: $current/$total';
  }

  @override
  String get darkMode => 'Dunkelmodus';

  @override
  String get darkModeSubtitle => 'App-Theme ändern';

  @override
  String get foodWaste => 'Lebensmittelverschwendung Reduzieren';

  @override
  String get foodWasteSubtitle => 'Zutaten priorisieren, die bald ablaufen';

  @override
  String get maxPrepTime => 'Maximale Vorbereitungszeit';

  @override
  String minutesSuffix(Object minutes) {
    return '$minutes Minuten';
  }

  @override
  String get logout => 'Abmelden';

  @override
  String version(Object version) {
    return 'Version $version';
  }

  @override
  String get dietaryPreferences => '🥗 Ernährungspräferenzen';

  @override
  String get allergies => '⚠️ Allergien';

  @override
  String get appSettings => '⚙️ App-Einstellungen';

  @override
  String get editAccountInfo => 'Kontoinformationen Bearbeiten';

  @override
  String get editAccountInfoSubtitle => 'Name, Passwort und Profilbild';

  @override
  String get subscriptionPlans => 'Abonnementpläne Anzeigen';

  @override
  String get manageSubscription => 'Abonnement Verwalten';

  @override
  String get premiumDiscover => 'Premium-Funktionen Entdecken';

  @override
  String get premiumSubtitle =>
      'Unbegrenzte Rezepte und Sonderfunktionen mit KI.';

  @override
  String subscriptionActive(Object tier) {
    return 'ChefVision $tier Aktiv';
  }

  @override
  String get subscriptionActiveSubtitle => 'Genieße die Vorteile deines Plans.';

  @override
  String get deleteAccount => 'Konto Löschen';

  @override
  String get deleteAccountWarning =>
      'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und alle Ihre Daten (Vorrat, Favoriten) werden dauerhaft gelöscht.';

  @override
  String get deleteAccountConfirm => 'Ja, Mein Konto Löschen';

  @override
  String get deleteAccountCancel => 'Abbrechen';

  @override
  String get deleteAccountSuccess => 'Ihr Konto wurde erfolgreich gelöscht.';

  @override
  String get gourmetUser => 'Gourmet-Benutzer';

  @override
  String get chefTitleBeginner => 'Küchenlehrling 🌱';

  @override
  String get chefTitleIntermediate => 'Erfahrener Koch 👨‍🍳';

  @override
  String get chefTitleMaster => 'Chefkoch 👑';

  @override
  String get statFavorites => 'Favoriten';

  @override
  String get statPantry => 'Meine Zutaten';

  @override
  String get statCooked => 'Gekocht';

  @override
  String get recentSuggestions => '✨ Letzte Vorschläge';

  @override
  String get clearAction => 'Löschen 🗑️';

  @override
  String get returnToRecipes => 'Zurück zu Rezepten';

  @override
  String get cameraLocked => 'Kamera Gesperrt';

  @override
  String get cameraLockedMessage =>
      'Upgrade auf Pro, um Zutaten per Foto hinzuzufügen.';

  @override
  String get pantryTracking => 'Vorratsverfolgung';

  @override
  String get pantryTrackingMessage =>
      'Upgrade auf Pro oder Premium zur Verfolgung der Ablaufdaten.';

  @override
  String get shoppingListLocked => 'Einkaufsliste';

  @override
  String get shoppingListLockedMessage =>
      'Upgrade auf Pro oder Premium zur intelligenten Verwaltung deiner Einkaufsliste.';

  @override
  String get loginWelcome => 'Willkommen';

  @override
  String get loginSubtitle => 'Melde dich bei deinem ChefVision-Konto an';

  @override
  String get loginFailed => 'Anmeldung fehlgeschlagen';

  @override
  String get emailRequired => 'E-Mail erforderlich';

  @override
  String get emailInvalid => 'Gib eine gültige E-Mail ein';

  @override
  String get passwordLabel => 'Passwort';

  @override
  String get passwordRequired => 'Passwort erforderlich';

  @override
  String get passwordMinLength => 'Passwort muss mindestens 6 Zeichen haben';

  @override
  String get rememberMe => 'Angemeldet bleiben';

  @override
  String get forgotPassword => 'Passwort vergessen';

  @override
  String get forgotPasswordSubtitle =>
      'Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen des Passworts zu erhalten.';

  @override
  String get sendResetLink => 'Link Senden';

  @override
  String get resetLinkSent =>
      'Link zum Zurücksetzen des Passworts gesendet. Bitte überprüfen Sie Ihre E-Mail.';

  @override
  String get loginButton => 'Anmelden';

  @override
  String get noAccount => 'Noch kein Konto? ';

  @override
  String get registerButton => 'Kostenlos registrieren';

  @override
  String get registerTitle => 'Konto erstellen';

  @override
  String get registerSubtitle => 'Jetzt kostenlos starten!';

  @override
  String get registerFailed => 'Registrierung fehlgeschlagen';

  @override
  String get continueAsGuest => 'Als Gast fortfahren';

  @override
  String get fullName => 'Vollständiger Name';

  @override
  String get nameRequired => 'Name erforderlich';

  @override
  String get nameMinLength => 'Mindestens 2 Zeichen';

  @override
  String get dietPreferencesOptional => 'Ernährungspräferenzen (Optional)';

  @override
  String get allergiesOptional => 'Allergien (Optional)';

  @override
  String get dietVegan => '🌱 Vegan';

  @override
  String get dietVegetarian => '🥗 Vegetarisch';

  @override
  String get dietGlutenFree => '🌾 Glutenfrei';

  @override
  String get dietDairyFree => '🥛 Laktosefrei';

  @override
  String get allergyNuts => '🥜 Nüsse';

  @override
  String get allergyShellfish => '🦐 Meeresfrüchte';

  @override
  String get allergyEggs => '🥚 Eier';

  @override
  String get allergySoy => '🫘 Soja';

  @override
  String get subPackages => 'Abonnement-Pakete';

  @override
  String subMaxTierActive(Object tier) {
    return '$tier-Paket Aktiv!';
  }

  @override
  String subCurrentTier(Object tier) {
    return 'Du bist im $tier-Paket';
  }

  @override
  String get subUnlockPotential => 'Entfessle dein Küchenpotenzial';

  @override
  String get subMaxTierSubtitle => 'Du genießt das höchste Paket.';

  @override
  String get subUpgradeSubtitle => 'Upgrade für mehr Funktionen.';

  @override
  String get subChoosePlan =>
      'Wähle das beste Paket und sichere dir die Vorteile.';

  @override
  String get subMostPopular => 'AM BELIEBTESTEN';

  @override
  String subSwitchTo(Object tier) {
    return 'Zu $tier wechseln';
  }

  @override
  String get subAutoRenew =>
      'Automatisch verlängerndes Abo. Jederzeit kündbar.';

  @override
  String get subPurchaseStarted => 'Kauf gestartet... Bitte dem Shop folgen.';

  @override
  String get subPurchaseError => 'Ein Fehler ist aufgetreten.';

  @override
  String subYourPlan(Object tier) {
    return 'Du bist im $tier-Paket';
  }

  @override
  String get subEnjoyPerks => 'Genieße alle Vorteile.';

  @override
  String get subManage => 'Mitgliedschaft verwalten';

  @override
  String get subPerMonth => '/ Monat';

  @override
  String subRecipesPerDay(Object count) {
    return '$count Rezeptsuchen / Tag';
  }

  @override
  String get subManualAdd => 'Manuelle Zutateneingabe';

  @override
  String get subAdFree => 'Werbefrei';

  @override
  String get subNoPhoto => 'Kein Foto-Upload';

  @override
  String get subNoPantry => 'Keine Vorrats-/Einkaufsverfolgung';

  @override
  String get subNoAssistant => 'Kein Assistenten-Zugang';

  @override
  String get subPhotoAdd => '📸 Zutaten per Foto hinzufügen';

  @override
  String get subPantryTracking => '🏠 Vorrats- & Einkaufsverfolgung';

  @override
  String get subNoChat => 'Kein Chat-Assistent';

  @override
  String get subNoVoice => 'Kein Sprachassistent';

  @override
  String get subChatAssistant => '💬 Chat-Assistent';

  @override
  String get subVoiceAssistant => '🎙️ Sprachassistent';

  @override
  String get subVideoAdd => '📹 Video-Upload (Bald verfügbar)';

  @override
  String get subPrioritySupport => '⚡ Prioritäts-Support';

  @override
  String get editProfileTitle => 'Profil bearbeiten';

  @override
  String get saveChanges => 'Änderungen speichern';

  @override
  String get profileUpdated => 'Profil aktualisiert! ✅';

  @override
  String get personalInfo => 'Persönliche Informationen';

  @override
  String get changePassword => 'Passwort ändern';

  @override
  String get currentPassword => 'Aktuelles Passwort';

  @override
  String get newPassword => 'Neues Passwort';

  @override
  String get confirmNewPassword => 'Neues Passwort bestätigen';

  @override
  String get passwordMismatch => 'Passwörter stimmen nicht überein!';

  @override
  String get passwordUpdated => 'Passwort aktualisiert! ✅';

  @override
  String get updatePassword => 'Passwort aktualisieren';

  @override
  String get emailAddress => 'E-Mail-Adresse';

  @override
  String get changeEmail => 'E-Mail ändern';

  @override
  String get changeEmailDescription =>
      'Bitte gib zur Sicherheit dein aktuelles Passwort und deine neue E-Mail ein.';

  @override
  String get newEmail => 'Neue E-Mail';

  @override
  String get cancel => 'Abbrechen';

  @override
  String get update => 'Aktualisieren';

  @override
  String get emailUpdated => 'E-Mail aktualisiert! ✅';

  @override
  String get emailUpdateFailed => 'E-Mail konnte nicht geändert werden.';

  @override
  String get prefVegan => 'Vegan';

  @override
  String get prefVegetarian => 'Vegetarisch';

  @override
  String get prefGlutenFree => 'Glutenfrei';

  @override
  String get prefKeto => 'Keto';

  @override
  String get prefPaleo => 'Paleo';

  @override
  String get prefLowCarb => 'Low Carb';

  @override
  String get prefMediterranean => 'Mittelmeerdiät';

  @override
  String get prefIntermittentFasting => 'Intervallfasten';

  @override
  String get prefLowFat => 'Fettarm';

  @override
  String get prefPescatarian => 'Pescetarisch';

  @override
  String get prefDiabeticFriendly => 'Diabetikerfreundlich';

  @override
  String get prefHighProtein => 'Proteinreich';

  @override
  String get allergyNutsName => 'Nüsse';

  @override
  String get allergyMilk => 'Milch';

  @override
  String get allergyEgg => 'Ei';

  @override
  String get allergySeafood => 'Meeresfrüchte';

  @override
  String get allergyGluten => 'Gluten';

  @override
  String get allergySoyName => 'Soja';

  @override
  String get allergyPeanuts => 'Erdnüsse';

  @override
  String get allergyMushroom => 'Pilze';

  @override
  String get allergyMustard => 'Senf';

  @override
  String get allergySesame => 'Sesam';

  @override
  String get allergyStrawberry => 'Erdbeere';

  @override
  String get allergyKiwi => 'Kiwi';

  @override
  String get allergyCelery => 'Sellerie';

  @override
  String get notifProductExpired => 'Produkt abgelaufen!';

  @override
  String get notifTimeLow => 'Zeit wird knapp!';

  @override
  String notifProductExpiredMessage(Object name) {
    return '$name ist abgelaufen.';
  }

  @override
  String notifTimeLowMessage(Object name) {
    return '$name läuft bald ab.';
  }

  @override
  String get maintenanceTitle => 'Küche in Wartung!';

  @override
  String get maintenanceSubtitle =>
      'Unsere Köche aktualisieren das System, um Ihnen besser zu dienen. Wir sind bald mit tollen Rezepten zurück.';

  @override
  String get maintenanceRetry => 'Erneut Versuchen';

  @override
  String get lowCalorie => 'Kalorienarm';

  @override
  String get resumeCooking => 'Weiterkochen 🍳';

  @override
  String get timerFinishedTitle => 'Zeit abgelaufen!';

  @override
  String timerFinishedMessage(Object recipe) {
    return 'Der Timer für $recipe ist abgelaufen.';
  }

  @override
  String get timerNotificationAction => 'Zur App gehen';

  @override
  String get tipWaste =>
      'Verwende zuerst Zutaten, die bald ablaufen, um Verschwendung zu vermeiden! ♻️';

  @override
  String get tipSalt => 'Füge das Salz zuletzt hinzu, du brauchst weniger 🧂';

  @override
  String get tipOnion =>
      'Kühle Zwiebeln 10 Min. im Kühlschrank vor dem Schneiden, keine Tränen 🧅';

  @override
  String get tipPasta => 'Füge beim Kochen der Pasta eine Prise Salz hinzu 🍝';

  @override
  String get tipBread => 'Mache aus altem Brot Paniermehl 🍞';

  @override
  String get tipLemon => 'Rolle Zitronen vor dem Auspressen für mehr Saft 🍋';

  @override
  String get tipGreens =>
      'Wickle Grünzeug in Küchenpapier für längere Frische 🥬';

  @override
  String get tipGarlic =>
      'Drücke Knoblauch mit dem Messer, dann lässt er sich leicht schälen 🧄';

  @override
  String get tipEgg =>
      'Lege gekochte Eier in kaltes Wasser, die Schale löst sich leicht 🥚';

  @override
  String get tipRice =>
      'Wasche Reis vor dem Kochen, um Stärke zu reduzieren 🍚';

  @override
  String get tipPan =>
      'Überlade die Pfanne nicht, sonst dampfen die Zutaten statt zu braten 🍳';

  @override
  String get tipMeat =>
      'Wende Fleisch nicht zu oft, einmal reicht für eine schöne Kruste 🥩';

  @override
  String get tipYogurt =>
      'Nimm Joghurt 10 Min. vorher raus, bei Zimmertemperatur schmeckt er besser 🥛';

  @override
  String get tipSteam => 'Dämpfe Gemüse, um Vitamine besser zu erhalten 🥦';

  @override
  String get tipSpices =>
      'Röste Gewürze leicht in der Pfanne für mehr Aroma 🌶️';

  @override
  String get tipParmesan =>
      'Gib Parmesanrinde in die Suppe für erstaunlichen Geschmack 🧀';

  @override
  String get tipAvocado =>
      'Reife Avocados in einer Papiertüte mit einer Banane 🥑';

  @override
  String get tipBroth => 'Bewahre Kochwasser als Gemüsebrühe auf 🍲';

  @override
  String get tipTomato =>
      'Füge einen Teelöffel Zucker zur Tomatensauce hinzu, um Säure zu reduzieren 🍅';

  @override
  String get tipHerbs =>
      'Friere frische Kräuter in Olivenöl in Eiswürfelformen ein 🌿';

  @override
  String get tipDishes =>
      'Spüle Geschirr sofort, getrocknete Flecken sind schwerer zu entfernen 🍽️';

  @override
  String get tipCake =>
      'Achte darauf, dass Zutaten beim Backen Zimmertemperatur haben 🎂';

  @override
  String get tipSalad => 'Bereite Salatdressing im Voraus zu und kühle es 🥗';

  @override
  String get tipOliveOil =>
      'Verwende Olivenöl bei niedriger Hitze, hohe Hitze mindert den Nährwert 🫒';

  @override
  String get tipRosemary =>
      'Brühe frischen Rosmarin als Tee auf, gut für die Verdauung 🫖';

  @override
  String get tipBeans =>
      'Weiche Hülsenfrüchte über Nacht ein, die Kochzeit halbiert sich 🫘';

  @override
  String get tipBrothCubes =>
      'Friere Brühe in Eiswürfelformen ein für einfache Geschmackszugabe 🧊';

  @override
  String get tipFries =>
      'Weiche Kartoffeln vor dem Frittieren in Wasser ein für mehr Knusprigkeit 🍟';

  @override
  String get tipFreshEgg =>
      'Teste die Frische eines Eis, indem du es in Wasser legst 💧';

  @override
  String get tipCoffee => 'Verwende Kaffeesatz als Dünger für Topfpflanzen ☕';

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
  String get add => 'Hinzufügen';

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
  String get delete => 'Löschen';

  @override
  String get worldCuisineSelection => 'Weltküche Auswahl';

  @override
  String get pantryTitle => 'Meine Zutaten';

  @override
  String get addIngredient => 'Zutat Hinzufügen';

  @override
  String get manualAdd => 'Manuell Hinzufügen';

  @override
  String get manualAddSubtitle => 'Zutatenname eingeben';

  @override
  String get scanReceipt => 'Beleg Scannen';

  @override
  String get scanReceiptSubtitle => 'Automatischer Import vom Beleg';

  @override
  String get photoAdd => 'Mit Foto Hinzufügen';

  @override
  String get photoAddSubtitle => 'KI-automatische Erkennung';

  @override
  String get photoIngredientAdd => 'Zutat per Foto Hinzufügen';

  @override
  String get ingredientAdded => 'Zutat hinzugefügt';

  @override
  String ingredientsAddedCount(Object count) {
    return '$count Zutaten hinzugefügt!';
  }

  @override
  String get ingredientNotDetected => 'Zutat nicht erkannt';

  @override
  String get aiAnalyzing => 'KI Analysiert...';

  @override
  String get ingredientName => 'Zutatenname';

  @override
  String get quantity => 'Menge';

  @override
  String get unitLabel => 'Einheit';

  @override
  String get expiryDateOptional => 'Verfallsdatum (Optional)';

  @override
  String expiryDateLabel(Object day, Object month, Object year) {
    return 'MHD: $day/$month/$year';
  }

  @override
  String get save => 'Speichern';

  @override
  String get deleteConfirmTitle => 'Möchten Sie wirklich löschen?';

  @override
  String deleteConfirmMessage(Object name) {
    return '$name wird aus Ihrem Vorrat entfernt.';
  }

  @override
  String get allIngredients => 'Alle Zutaten';

  @override
  String expiringSoonCount(Object count) {
    return 'Bald Ablaufend ($count)';
  }

  @override
  String get pantryEmpty => 'Ihr Vorrat ist leer';

  @override
  String get pantryEmptySubtitle =>
      'Beginnen Sie mit dem Hinzufügen von Zutaten';

  @override
  String get noExpiringItems => 'Keine bald ablaufenden Produkte!';

  @override
  String get allItemsFresh => 'Alle Produkte sind frisch!';

  @override
  String get addToList => 'Zur Liste Hinzufügen';

  @override
  String addedToShoppingList(Object name) {
    return '$name zur Einkaufsliste hinzugefügt';
  }

  @override
  String get ok => 'OK';

  @override
  String get loginRequired =>
      'Sie müssen sich anmelden, um diese Funktion zu nutzen';

  @override
  String get pantryEmptyAddFirst =>
      'Ihr Vorrat ist leer, fügen Sie zuerst Zutaten hinzu';

  @override
  String errorGeneric(Object error) {
    return 'Fehler: $error';
  }

  @override
  String get notifications => 'Benachrichtigungen';

  @override
  String get markAllRead => 'Alle Gelesen';

  @override
  String get noNotifications => 'Noch keine Benachrichtigungen';

  @override
  String get noNotificationsSubtitle => 'Wichtige Updates erscheinen hier';

  @override
  String get justNow => 'Gerade eben';

  @override
  String minutesAgo(Object minutes) {
    return 'Vor $minutes Min';
  }

  @override
  String hoursAgo(Object hours) {
    return 'Vor $hours Std';
  }

  @override
  String get yesterdayLabel => 'Gestern';

  @override
  String get shoppingListTitle => 'Einkaufsliste';

  @override
  String get addIngredientHint => 'Zutat hinzufügen...';

  @override
  String get itemAlreadyExists => 'Dieses Produkt ist bereits in Ihrer Liste!';

  @override
  String get deleteCheckedTitle => 'Markierte Löschen';

  @override
  String deleteCheckedMessage(Object count) {
    return '$count markierte Produkte werden gelöscht. Sind Sie sicher?';
  }

  @override
  String get deleteSelectedTitle => 'Ausgewählte Löschen';

  @override
  String deleteSelectedMessage(Object count) {
    return 'Möchten Sie $count Produkte wirklich löschen?';
  }

  @override
  String selectedCount(Object count) {
    return '$count ausgewählt';
  }

  @override
  String get selectAll => 'Alle Auswählen';

  @override
  String get shareLabel => 'Teilen';

  @override
  String get shareList => 'Liste Teilen';

  @override
  String get multiSelect => 'Mehrfachauswahl';

  @override
  String get deleteChecked => 'Markierte Löschen';

  @override
  String get shoppingListEmpty => 'Einkaufsliste Leer';

  @override
  String get shoppingListEmptySubtitle =>
      'Beginnen Sie damit, was Sie kaufen möchten';

  @override
  String purchasedCount(Object count) {
    return 'Gekauft ($count)';
  }

  @override
  String get listCopied => 'Liste kopiert!';

  @override
  String get selectedItems => 'Ausgewählt:';

  @override
  String get itemsToBuy => 'Zu Kaufen:';

  @override
  String get editItem => 'Artikel bearbeiten';

  @override
  String get itemName => 'Artikelname';

  @override
  String get editLabel => 'Bearbeiten';

  @override
  String get smartStockAnalysis => 'Intelligente Bestandsanalyse';

  @override
  String get statsLoadError => 'Statistiken konnten nicht geladen werden';

  @override
  String get tryAgain => 'Erneut Versuchen';

  @override
  String get totalProducts => 'Gesamtprodukte';

  @override
  String get expiringSoonLabel => 'Bald Ablaufend';

  @override
  String get expiredLabel => 'Abgelaufen';

  @override
  String get categoriesLabel => 'Kategorien';

  @override
  String get categoryDistribution => 'Kategorieverteilung';

  @override
  String get noData => 'Keine Daten';

  @override
  String get wastePreventionScore => 'Abfallvermeidung';

  @override
  String get scoreGreat => 'Sie machen das großartig!';

  @override
  String get scoreWarning => 'Achtung! Hohes Verschwendungsrisiko.';

  @override
  String get scoreBetter => 'Könnte besser sein.';

  @override
  String get wastePreventionSubtitle =>
      'Sie vermeiden Lebensmittelverschwendung durch effiziente Nutzung Ihres Vorrats.';

  @override
  String productsCount(Object count) {
    return '$count Produkte';
  }

  @override
  String get manageSubscriptionTitle => 'Abonnement Verwalten';

  @override
  String get activeStatus => 'Aktiv';

  @override
  String get startDate => 'Startdatum';

  @override
  String get statusLabel => 'Status';

  @override
  String get autoRenews => 'Automatische Verlängerung';

  @override
  String get changePlan => 'Plan Ändern oder Kündigen';

  @override
  String get changePlanDescription =>
      'Sie werden zu den Store-Einstellungen weitergeleitet, um Ihr Abonnement zu kündigen oder zu ändern. Zahlungen und Verlängerungen werden direkt vom Store verwaltet.';

  @override
  String get platformLabel => 'Plattform';

  @override
  String get filterEasy => 'Einfach';

  @override
  String get filterFast => 'Schnell (<30Min)';

  @override
  String get filterLowCal => 'Kalorienarm';

  @override
  String get minuteAbbr => 'Min';

  @override
  String get stockAnalysis => 'Bestandsanalyse';

  @override
  String get suggestRecipe => 'Rezept Vorschlagen';

  @override
  String get categoryVegetables => 'Gemüse';

  @override
  String get categoryFruits => 'Obst';

  @override
  String get categoryMeat => 'Fleisch & Geflügel';

  @override
  String get categorySeafood => 'Meeresfrüchte';

  @override
  String get categoryDairy => 'Milchprodukte';

  @override
  String get categoryEggs => 'Eier';

  @override
  String get categoryGrains => 'Getreide';

  @override
  String get categoryLegumes => 'Hülsenfrüchte';

  @override
  String get categoryPasta => 'Nudeln & Pasta';

  @override
  String get categoryBakery => 'Brot & Backwaren';

  @override
  String get categorySpices => 'Gewürze';

  @override
  String get categorySauces => 'Soßen & Würzmittel';

  @override
  String get categoryOils => 'Öle';

  @override
  String get categoryBeverages => 'Getränke';

  @override
  String get categorySnacks => 'Snacks';

  @override
  String get categoryNuts => 'Nüsse';

  @override
  String get categoryFrozen => 'Tiefgekühlt';

  @override
  String get categoryCanned => 'Konserven';

  @override
  String get categorySweets => 'Süßigkeiten & Zucker';

  @override
  String get categoryOther => 'Sonstiges';

  @override
  String get expiryUnknown => 'Unbekannt';

  @override
  String get expiryExpired => 'Abgelaufen';

  @override
  String get expiryToday => 'Heute!';

  @override
  String get expiryTomorrow => 'Morgen';

  @override
  String expiryDays(Object days) {
    return '$days Tage';
  }

  @override
  String get unitAdet => 'Stk';

  @override
  String get unitKg => 'kg';

  @override
  String get unitG => 'g';

  @override
  String get unitL => 'L';

  @override
  String get unitMl => 'ml';

  @override
  String get unitDemet => 'Bund';

  @override
  String get unitPaket => 'Packung';

  @override
  String get unitKavanoz => 'Glas';

  @override
  String get errorImageAnalysisFailed => 'Bildanalyse fehlgeschlagen';

  @override
  String get errorFeatureLocked =>
      'Diese Funktion ist in Ihrem Plan nicht verfügbar.';

  @override
  String get errorLimitExceeded => 'Tageslimit überschritten.';

  @override
  String get errorNoIngredients =>
      'Bitte wählen Sie mindestens eine Zutat aus.';

  @override
  String get errorConnectionTimeout =>
      'Verbindungszeit überschritten. Bitte versuchen Sie es erneut.';

  @override
  String errorServerConnection(Object error) {
    return 'Verbindung zum Server fehlgeschlagen: $error';
  }

  @override
  String get errorRecipeSuggestionFailed => 'Rezeptvorschlag fehlgeschlagen';

  @override
  String get errorTrialExpired => 'Ihre kostenlose Testversion ist abgelaufen.';

  @override
  String get errorRecipeLimitExceeded =>
      'Tägliches Rezeptsuchlimit überschritten.';

  @override
  String get errorDetailedRecipeLocked =>
      'Detaillierte Rezepte sind dem Pro-Plan vorbehalten.';

  @override
  String errorRecipeDetailFailed(Object error) {
    return 'Rezeptdetails konnten nicht abgerufen werden: $error';
  }

  @override
  String get errorVerifyFailed =>
      'Verifizierung fehlgeschlagen: Unerwartete Antwort.';

  @override
  String errorSubscriptionVerifyFailed(Object error) {
    return 'Abonnement konnte nicht verifiziert werden: $error';
  }

  @override
  String get verifyEmailTitle => 'E-Mail Bestätigen';

  @override
  String verifyEmailSubtitle(Object email) {
    return 'Wir haben einen Bestätigungslink an $email gesendet. Bitte überprüfen Sie Ihren Posteingang und Spam-Ordner.';
  }

  @override
  String get verifiedButton => 'E-Mail Bestätigt, Anmelden';

  @override
  String get scanIngredientTitle => 'Zutaten Scannen';

  @override
  String get analyzeIngredients => 'Zutaten Analysieren';

  @override
  String get uploadIngredients => 'Zutaten Hochladen';

  @override
  String get aiWillRecognize => 'KI erkennt alle Zutaten';

  @override
  String get cameraLabel => 'Kamera';

  @override
  String get takePhotoAction => 'Foto machen';

  @override
  String get galleryLabel => 'Galerie';

  @override
  String get selectPhoto => 'Foto auswählen';

  @override
  String get ensureVisible =>
      'Stellen Sie sicher, dass alle Zutaten sichtbar sind';

  @override
  String get selectDifferentPhoto => 'Anderes Foto Auswählen';

  @override
  String imageCouldNotBeSelected(Object error) {
    return 'Bild konnte nicht ausgewählt werden: $error';
  }

  @override
  String get photoReady => 'Foto bereit';

  @override
  String get identifyingIngredients => 'Zutaten werden identifiziert';

  @override
  String get stepsLoading => 'Rezeptschritte werden vorbereitet...';

  @override
  String get pleaseWaitOrRetry => 'Bitte warten oder später erneut versuchen.';

  @override
  String get timerLabel => 'Timer';

  @override
  String get stopTimerQuestion => 'Möchten Sie den Timer stoppen?';

  @override
  String get noLabel => 'Nein';

  @override
  String get yesStop => 'Ja, Stoppen';

  @override
  String stepProgress(Object completed, Object current, Object total) {
    return 'SCHRITT $current / $total  ($completed abgeschlossen)';
  }

  @override
  String stepCompletedLabel(Object number) {
    return 'SCHRITT $number ✓';
  }

  @override
  String stepNumberLabel(Object number) {
    return 'SCHRITT $number';
  }

  @override
  String get readStepAloud => 'Schritt Vorlesen';

  @override
  String get completedLabel => 'Abgeschlossen';

  @override
  String get finishCookingAction => 'Kochen Beenden';

  @override
  String get listeningLabel => 'Höre zu...';

  @override
  String get thinkingLabel => 'Denke nach...';

  @override
  String get errorOccurred => 'Ein Fehler ist aufgetreten.';

  @override
  String get askSomething => 'Etwas fragen...';

  @override
  String get chefAssistant => 'Chef Assistent';

  @override
  String get chatEmptyHint =>
      'Sie können Fragen zum Rezept stellen.\nZ.B: \"Lies Schritt 2 nochmal\" oder \"Welche Temperatur für den Ofen?\"';

  @override
  String get timerFinished => 'Zeit Abgelaufen! 🍽️';

  @override
  String timerFinishedBody(Object title) {
    return 'Der Timer für $title ist abgelaufen.';
  }

  @override
  String get timeUpCheckFood => 'Zeit abgelaufen! Überprüfen Sie Ihr Essen.';

  @override
  String get detailedRecipe => 'Detailliertes Rezept';

  @override
  String detailedRecipeLoadFailed(Object error) {
    return 'Detailliertes Rezept konnte nicht geladen werden: $error';
  }

  @override
  String get turkishCuisine => 'Türkische Küche';

  @override
  String get optionalLabel => 'optional';

  @override
  String get instructionsNotFound => 'Keine Zubereitungsanleitung gefunden.';

  @override
  String get viewDetails => 'Details & Zubereitung Anzeigen';

  @override
  String get ingredientsLoading => 'Zutatenliste wird geladen...';

  @override
  String get addToShoppingList => 'Zur Einkaufsliste Hinzufügen';

  @override
  String get addingToList => 'Zutaten werden zur Liste hinzugefügt...';

  @override
  String ingredientsAddedToList(Object count) {
    return '$count Zutaten zur Einkaufsliste hinzugefügt!';
  }

  @override
  String get errorOrEmptyList =>
      'Ein Fehler ist aufgetreten oder die Liste ist leer.';

  @override
  String get chefIngredientTip => 'Zutaten-Tipp des Kochs';

  @override
  String chefTipDescription(Object ingredients) {
    return 'Wir haben dieses Rezept mit deinen verfügbaren Zutaten zubereitet, aber beachte: Wenn du $ingredients hast, würde das den Geschmack noch verbessern! ✨';
  }

  @override
  String get tipsPlaceholder =>
      'Die speziellen Tipps des Kochs erscheinen hier mit dem detaillierten Rezept.';

  @override
  String get quickLabel => 'Schnell';

  @override
  String get detailedLabel => 'Detailliert';

  @override
  String get preparingLabel => 'Wird vorbereitet...';

  @override
  String get requestDetailedRecipe => 'Detailliertes Rezept Anfordern';

  @override
  String get requestQuickRecipe => 'Schnelles Rezept';

  @override
  String caloriesPerServing(Object calories) {
    return '$calories kcal / Portion';
  }

  @override
  String get personSuffix => 'Person';

  @override
  String get receiptScanTitle => 'Beleg Scannen';

  @override
  String get tapToSelectReceipt => 'Tippen Sie, um ein Belegfoto auszuwählen';

  @override
  String get openCamera => 'Kamera Öffnen';

  @override
  String get analyzingReceipt =>
      'Beleg wird analysiert...\nDies kann einige Sekunden dauern.';

  @override
  String foundProducts(Object count) {
    return 'Gefundene Produkte ($count)';
  }

  @override
  String totalAmount(Object amount) {
    return 'Gesamt: $amount TL';
  }

  @override
  String get noProductsFound => 'Keine Produkte gefunden.';

  @override
  String get addAllToPantry => 'Alle zum Vorrat Hinzufügen';

  @override
  String get receiptAnalysisFailed =>
      'Beleganalyse fehlgeschlagen oder keine Produkte gefunden.';

  @override
  String productsAddedToPantry(Object count) {
    return '$count Produkte zum Vorrat hinzugefügt.';
  }

  @override
  String get voiceAssistantTitle => 'Sprachassistent';

  @override
  String get clearChat => 'Chat Löschen';

  @override
  String get chatCleared => 'Chat gelöscht. Wie kann ich helfen?';

  @override
  String get tapMicAndSpeak => 'Tippen Sie auf das Mikrofon und sprechen Sie';

  @override
  String get recipesStepsNotLoaded =>
      'Rezeptschritte konnten nicht geladen werden.';

  @override
  String get speechNotAvailable => 'Spracherkennung nicht verfügbar';

  @override
  String get welcomeMessage =>
      'Hallo! Ich bin dein Chef-Assistent. Wie kann ich helfen?';

  @override
  String get speakingLabel => 'Spricht...';

  @override
  String get quickItemBread => 'Brot';

  @override
  String get quickItemMilk => 'Milch';

  @override
  String get quickItemEgg => 'Ei';

  @override
  String get quickItemWater => 'Wasser';

  @override
  String get quickItemTomato => 'Tomate';

  @override
  String get quickItemCheese => 'Käse';

  @override
  String get quickItemYogurt => 'Joghurt';

  @override
  String get quickItemPasta => 'Pasta';

  @override
  String get suitablePlans => 'Passende Pläne';

  @override
  String get reviewPlans => 'Pläne Ansehen';

  @override
  String get later => 'Später';

  @override
  String get dietType => 'Diät-Typ';

  @override
  String get otherAllergyHint => 'Andere (z.B. Pilze)';

  @override
  String get apply => 'Anwenden';

  @override
  String get cuisineTurkish => 'Türkisch';

  @override
  String get cuisineItalian => 'Italienisch';

  @override
  String get cuisineAsian => 'Asiatisch';

  @override
  String get cuisineMexican => 'Mexikanisch';

  @override
  String get mealBreakfast => 'Frühstück';

  @override
  String get mealDinner => 'Abendessen';

  @override
  String get mealSnack => 'Snack';

  @override
  String get statTotal => 'Gesamt';

  @override
  String get errorLoginFailed =>
      'Anmeldung fehlgeschlagen. Bitte überprüfen Sie E-Mail und Passwort.';

  @override
  String get errorConnection =>
      'Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung.';

  @override
  String get errorTimeout =>
      'Zeitüberschreitung der Verbindung. Bitte versuchen Sie es erneut.';

  @override
  String get errorServer =>
      'Serverfehler. Bitte versuchen Sie es später erneut.';

  @override
  String get errorUnknown => 'Ein unbekannter Fehler ist aufgetreten.';

  @override
  String get errorAccessDenied => 'Zugriff verweigert.';

  @override
  String get restrictedAccessTitle => 'Zugriff eingeschränkt';

  @override
  String get restrictedAccessMessage =>
      'Zu viele Geräteänderungen in Ihrem Konto festgestellt.';

  @override
  String get restrictedAccessDescription =>
      'Aus Sicherheitsgründen wurde dieses Konto eingeschränkt (Eingeschränkter Modus). Bitte kontaktieren Sie den Support, um fortzufahren.';

  @override
  String get getSupport => 'Support kontaktieren';

  @override
  String get close => 'Schließen';

  @override
  String get accountRestrictionTopic => 'Kontoeinschränkung';

  @override
  String get liveSupportTitle => 'Live-Support';

  @override
  String get liveSupportSubtitle => 'Schreiben Sie uns Ihre Fragen';

  @override
  String get helpQuestion => 'Wie können wir Ihnen helfen?';

  @override
  String get topicTechnical => 'Technischer Support';

  @override
  String get topicPayment => 'Zahlung & Abonnement';

  @override
  String get topicSuggestion => 'Vorschläge & Wünsche';

  @override
  String get topicOther => 'Andere Themen';

  @override
  String get adminPanelTitle => 'Admin-Panel (Chat)';

  @override
  String get adminPanelSubtitle => 'Eingehende Nachrichten verwalten';

  @override
  String servingsCount(int count) {
    return '$count Portionen';
  }

  @override
  String get chatUserTitle => 'Benutzer-Chat';

  @override
  String get chatLiveSupportTitle => 'Live-Support';

  @override
  String get chatEndButtonTooltip => 'Chat beenden';

  @override
  String get chatEndDialogTitle => 'Chat beenden';

  @override
  String get chatEndDialogContext =>
      'Ist Ihr Problem gelöst? Sind Sie sicher, dass Sie den Chat beenden möchten?';

  @override
  String get chatEndDialogCancel => 'Abbrechen';

  @override
  String get chatEndDialogConfirm => 'Ja, Chat beenden';

  @override
  String get chatNoMessagesHello => 'Noch keine Nachrichten. Sag hallo! 👋';

  @override
  String get chatHistoryClearedInfo => 'Chatverlauf gelöscht. 👋';

  @override
  String get chatInputHint => 'Geben Sie Ihre Nachricht ein...';

  @override
  String get adminSupportRequestsTitle => 'Supportanfragen';

  @override
  String get adminNoSupportRequests => 'Noch keine Supportanfragen.';

  @override
  String get adminUserPrefix => 'Benutzer: ';

  @override
  String get customTimerChannelName => 'Aktiver Timer';

  @override
  String get customTimerChannelDescription => 'Status des Kochtimers';

  @override
  String get timerCookingDescription =>
      'Wird gekocht...\nSie werden benachrichtigt, wenn es fertig ist.';

  @override
  String get chefVisionActiveTimer => 'ChefVision Aktiver Timer';

  @override
  String timerCookingTitle(Object title) {
    return '$title wird gekocht...';
  }

  @override
  String get guestChefName => 'Gastkoch';

  @override
  String get unregisteredAccount => 'Nicht Registriertes Konto';

  @override
  String get guestSignUpDesc =>
      'Erstellen Sie Ihr kostenloses Konto, um eigene Rezepte zu speichern, unbegrenzte KI-Scans durchzuführen und Ihre virtuelle Vorratskammer aufzubauen.';

  @override
  String get usageLimitsTitle => 'Verbleibende Nutzungslimits';

  @override
  String get usageLimitCamera => 'Kamera-Scans';

  @override
  String get usageLimitAiRecipe => 'KI-Rezeptanfrage';

  @override
  String get loginOrRegister => 'Anmelden oder Registrieren';

  @override
  String get err_user_not_found =>
      'Benutzer nicht gefunden - bitte loggen Sie sich erneut ein';

  @override
  String get err_session_expired_other_device =>
      'Ihre Sitzung wurde beendet, da Sie sich von einem anderen Gerät aus angemeldet haben.';

  @override
  String get err_receipt_missing => 'Belegdaten fehlen.';

  @override
  String get err_receipt_used_by_another_user =>
      'Dieser Kauf ist mit einem anderen Konto verknüpft.';

  @override
  String get err_already_pro_other_platform =>
      'Sie haben bereits ein aktives Abonnement auf einer anderen Plattform.';

  @override
  String get err_subscription_expired => 'Ihr Abonnement ist abgelaufen.';

  @override
  String get err_google_credentials_missing =>
      'Google Credentials sind auf dem Server falsch konfiguriert.';

  @override
  String get err_google_receipt_invalid =>
      'Ungültige Google-Überprüfungsantwort.';

  @override
  String get err_google_verification_failed =>
      'Google-Überprüfung fehlgeschlagen.';

  @override
  String get err_apple_receipt_failed =>
      'Apple-Beleg konnte nicht decodiert werden oder wurde vom App Store abgelehnt.';

  @override
  String get err_platform_not_supported => 'Nicht unterstützte Plattform.';

  @override
  String get err_verification_service => 'Überprüfungsdienstfehler.';

  @override
  String get err_verification_failed => 'Überprüfung fehlgeschlagen.';

  @override
  String get err_database_update =>
      'Fehler bei der Datenbankaktualisierung während der Aktualisierung des Abonnements.';

  @override
  String get warning_subscription_active_delete =>
      'Ihr Konto wurde erfolgreich gelöscht. Ihr aktives Shop-Abonnement läuft jedoch möglicherweise noch! Bitte denken Sie daran, es manuell in den Einstellungen Ihres Telefons zu kündigen.';

  @override
  String get success_account_deleted => 'Ihr Konto wurde erfolgreich gelöscht.';

  @override
  String get err_usage_limit_reached =>
      'Sie haben Ihr kostenloses Testlimit erreicht. Bitte abonnieren Sie für weitere Rezepte.';

  @override
  String cuisineLabel(Object cuisine) {
    return '$cuisine Küche';
  }

  @override
  String get subExpiredTitle => 'Ihr Abonnement ist abgelaufen';

  @override
  String get subExpiredSubtitle =>
      'Erneuern Sie, um weiterhin Premium-Funktionen zu genießen.';

  @override
  String get subRenew => 'Abonnement erneuern';

  @override
  String get subExpiredBanner => 'Abonnement abgelaufen — Tippen zum Erneuern';
}
