// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'ChefVision AI';

  @override
  String get appName => 'ChefVision';

  @override
  String get splashTagline => 'Votre chef intelligent propulsé par l\'IA';

  @override
  String get greetingMorning => 'Bonjour';

  @override
  String get greetingAfternoon => 'Bon Après-midi';

  @override
  String get greetingEvening => 'Bonsoir';

  @override
  String get greetingNight => 'Bonne Nuit';

  @override
  String get whatToCook => 'Que voulez-vous cuisiner ?';

  @override
  String get scanIngredients => 'Scanner les Ingrédients';

  @override
  String get scanIngredientsSubtitle =>
      'Prenez votre frigo en photo, l\'IA trouve des recettes';

  @override
  String get takePhoto => 'Prendre une Photo';

  @override
  String get typeYourself => 'Ajouter Manuellement';

  @override
  String get myPantry => 'Mes Ingrédients';

  @override
  String get yourIngredients => 'Vos Ingrédients';

  @override
  String get shoppingList => 'Liste de Courses';

  @override
  String get yourList => 'Votre Liste';

  @override
  String get popularRecipes => 'Saveurs Populaires';

  @override
  String get viewAll => 'Voir Tout';

  @override
  String get expiryWarningTitle => 'Expire Bientôt';

  @override
  String get expiredWarningTitle => 'Expiré';

  @override
  String itemsExpired(Object count) {
    return '$count produits ont expiré !';
  }

  @override
  String itemsExpiring(Object count) {
    return '$count produits expirent bientôt !';
  }

  @override
  String get dailyTip => 'Conseil du Jour';

  @override
  String get discover => 'Découvrir';

  @override
  String get discoverSubtitle =>
      'Nouvelles recettes et secrets de cuisine bientôt !';

  @override
  String get noFavorites => 'Pas de Favoris';

  @override
  String get noFavoritesSubtitle =>
      'Vous pouvez ajouter ici les recettes que vous aimez.';

  @override
  String get favoriteRecipes => 'Vos Recettes Favorites';

  @override
  String get profile => 'Profil';

  @override
  String get editProfile => 'Modifier le Profil';

  @override
  String get home => 'Accueil';

  @override
  String get search => 'Rechercher';

  @override
  String get favorites => 'Favoris';

  @override
  String get settings => 'Paramètres';

  @override
  String get language => 'Langue';

  @override
  String get selectLanguage => 'Choisir la Langue';

  @override
  String get ingredients => 'Ingrédients';

  @override
  String get instructions => 'Instructions';

  @override
  String get prepTime => 'Préparation';

  @override
  String get recipe => 'Recipe';

  @override
  String get cookTime => 'Cuisson';

  @override
  String get servings => 'Portions';

  @override
  String get difficulty => 'Difficulté';

  @override
  String get calories => 'Calories';

  @override
  String get startCooking => 'Commencer la Cuisson';

  @override
  String get readAloud => 'Lire à Haute Voix';

  @override
  String get stopReading => 'Arrêter la Lecture';

  @override
  String get pauseReading => 'Pause';

  @override
  String get resumeReading => 'Reprendre';

  @override
  String get nextStep => 'Étape Suivante';

  @override
  String get previousStep => 'Étape Précédente';

  @override
  String get finishCooking => 'Terminer la Cuisson';

  @override
  String get cookingCompleted => 'Cuisson Terminée !';

  @override
  String get cookingCompletedSubtitle =>
      'Bon appétit ! Vous avez préparé un délicieux repas.';

  @override
  String get bonAppetit => 'Bon Appétit !';

  @override
  String get backToHomeCaps => 'RETOUR À L\'ACCUEIL';

  @override
  String get backToHome => 'Retour à l\'Accueil';

  @override
  String get analyzing => 'Analyse en cours...';

  @override
  String get analyzingSubtitle => 'Identification des ingrédients par l\'IA';

  @override
  String get addToPantry => 'Ajouter au Garde-manger';

  @override
  String get retry => 'Réessayer';

  @override
  String get error => 'Erreur';

  @override
  String get success => 'Succès';

  @override
  String get itemAdded => 'Produit ajouté avec succès';

  @override
  String get itemRemoved => 'Produit supprimé avec succès';

  @override
  String get onboardingTitle1 => 'Scanner les Ingrédients';

  @override
  String get onboardingDesc1 =>
      'Téléchargez vos ingrédients, laissez l\'IA les identifier instantanément';

  @override
  String get onboardingTitle2 => 'Obtenir des Recettes';

  @override
  String get onboardingDesc2 =>
      'L\'IA suggère les recettes les plus délicieuses avec ce que vous avez';

  @override
  String get onboardingTitle3 => 'Assistant Vocal';

  @override
  String get onboardingDesc3 =>
      'Cuisinez les mains libres, obtenez des recettes et un guidage étape par étape par la voix';

  @override
  String get skip => 'Passer';

  @override
  String get start => 'Commencer';

  @override
  String get continueAction => 'Continuer';

  @override
  String iapErrorStarted(Object error) {
    return 'L\'achat n\'a pas pu être lancé : $error';
  }

  @override
  String get iapErrorVerification =>
      'Échec de la vérification (vérifiez internet). Transaction enregistrée, nouvelle tentative automatique.';

  @override
  String iapErrorGeneral(Object error) {
    return 'Erreur d\'achat : $error';
  }

  @override
  String trialRemaining(Object current, Object total) {
    return 'Essai : $current/$total';
  }

  @override
  String get darkMode => 'Mode Sombre';

  @override
  String get darkModeSubtitle => 'Changer le thème de l\'app';

  @override
  String get foodWaste => 'Réduire le Gaspillage';

  @override
  String get foodWasteSubtitle => 'Prioriser les ingrédients bientôt expirés';

  @override
  String get maxPrepTime => 'Temps de Préparation Maximum';

  @override
  String minutesSuffix(Object minutes) {
    return '$minutes minutes';
  }

  @override
  String get logout => 'Déconnexion';

  @override
  String version(Object version) {
    return 'Version $version';
  }

  @override
  String get dietaryPreferences => '🥗 Préférences Alimentaires';

  @override
  String get allergies => '⚠️ Allergies';

  @override
  String get appSettings => '⚙️ Paramètres de l\'App';

  @override
  String get editAccountInfo => 'Modifier les Infos du Compte';

  @override
  String get editAccountInfoSubtitle => 'Nom, mot de passe et photo de profil';

  @override
  String get subscriptionPlans => 'Voir les Plans d\'Abonnement';

  @override
  String get manageSubscription => 'Gérer l\'Abonnement';

  @override
  String get premiumDiscover => 'Découvrir les Fonctions Premium';

  @override
  String get premiumSubtitle =>
      'Recettes illimitées et fonctions spéciales avec l\'IA.';

  @override
  String subscriptionActive(Object tier) {
    return 'ChefVision $tier Actif';
  }

  @override
  String get subscriptionActiveSubtitle =>
      'Profitez des avantages de votre plan.';

  @override
  String get deleteAccount => 'Supprimer le Compte';

  @override
  String get deleteAccountWarning =>
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données (garde-manger, favoris) seront définitivement supprimées.';

  @override
  String get deleteAccountConfirm => 'Oui, Supprimer Mon Compte';

  @override
  String get deleteAccountCancel => 'Annuler';

  @override
  String get deleteAccountSuccess => 'Votre compte a été supprimé avec succès.';

  @override
  String get gourmetUser => 'Utilisateur Gourmet';

  @override
  String get chefTitleBeginner => 'Apprenti Cuisinier 🌱';

  @override
  String get chefTitleIntermediate => 'Chef Habile 👨‍🍳';

  @override
  String get chefTitleMaster => 'Chef Principal 👑';

  @override
  String get statFavorites => 'Favoris';

  @override
  String get statPantry => 'Mes Ingrédients';

  @override
  String get statCooked => 'Cuisinés';

  @override
  String get recentSuggestions => '✨ Suggestions Récentes';

  @override
  String get clearAction => 'Effacer 🗑️';

  @override
  String get returnToRecipes => 'Retour aux Recettes';

  @override
  String get cameraLocked => 'Caméra Verrouillée';

  @override
  String get cameraLockedMessage =>
      'Passez à Pro pour ajouter des ingrédients par photo.';

  @override
  String get pantryTracking => 'Suivi du Garde-manger';

  @override
  String get pantryTrackingMessage =>
      'Passez à Pro ou Premium pour suivre les dates de péremption.';

  @override
  String get shoppingListLocked => 'Liste de Courses';

  @override
  String get shoppingListLockedMessage =>
      'Passez à Pro ou Premium pour gérer votre liste de courses.';

  @override
  String get loginWelcome => 'Bienvenue';

  @override
  String get loginSubtitle => 'Connectez-vous à votre compte ChefVision';

  @override
  String get loginFailed => 'Échec de connexion';

  @override
  String get emailRequired => 'Email requis';

  @override
  String get emailInvalid => 'Entrez un email valide';

  @override
  String get passwordLabel => 'Mot de passe';

  @override
  String get passwordRequired => 'Mot de passe requis';

  @override
  String get passwordMinLength =>
      'Le mot de passe doit contenir au moins 6 caractères';

  @override
  String get rememberMe => 'Se souvenir de moi';

  @override
  String get forgotPassword => 'Mot de passe oublié';

  @override
  String get forgotPasswordSubtitle =>
      'Entrez votre adresse email pour recevoir un lien de réinitialisation du mot de passe.';

  @override
  String get sendResetLink => 'Envoyer le Lien';

  @override
  String get resetLinkSent =>
      'Lien de réinitialisation du mot de passe envoyé. Veuillez vérifier votre email.';

  @override
  String get loginButton => 'Se Connecter';

  @override
  String get noAccount => 'Pas de compte ? ';

  @override
  String get registerButton => 'S\'inscrire gratuitement';

  @override
  String get registerTitle => 'Créer un Compte';

  @override
  String get registerSubtitle => 'Commencez gratuitement !';

  @override
  String get registerFailed => 'Échec de l\'inscription';

  @override
  String get continueAsGuest => 'Continuer en tant qu\'invité';

  @override
  String get fullName => 'Nom Complet';

  @override
  String get nameRequired => 'Nom requis';

  @override
  String get nameMinLength => 'Minimum 2 caractères';

  @override
  String get dietPreferencesOptional => 'Préférences Alimentaires (Optionnel)';

  @override
  String get allergiesOptional => 'Allergies (Optionnel)';

  @override
  String get dietVegan => '🌱 Végan';

  @override
  String get dietVegetarian => '🥗 Végétarien';

  @override
  String get dietGlutenFree => '🌾 Sans Gluten';

  @override
  String get dietDairyFree => '🥛 Sans Lactose';

  @override
  String get allergyNuts => '🥜 Noix';

  @override
  String get allergyShellfish => '🦐 Fruits de Mer';

  @override
  String get allergyEggs => '🥚 Œufs';

  @override
  String get allergySoy => '🫘 Soja';

  @override
  String get subPackages => 'Forfaits d\'Abonnement';

  @override
  String subMaxTierActive(Object tier) {
    return 'Forfait $tier Actif !';
  }

  @override
  String subCurrentTier(Object tier) {
    return 'Vous êtes en $tier';
  }

  @override
  String get subUnlockPotential => 'Libérez votre Potentiel Culinaire';

  @override
  String get subMaxTierSubtitle => 'Vous profitez du forfait maximum.';

  @override
  String get subUpgradeSubtitle =>
      'Améliorez votre forfait pour plus de fonctionnalités.';

  @override
  String get subChoosePlan =>
      'Choisissez le meilleur forfait et profitez des avantages.';

  @override
  String get subMostPopular => 'LE PLUS POPULAIRE';

  @override
  String subSwitchTo(Object tier) {
    return 'Passer à $tier';
  }

  @override
  String get subAutoRenew =>
      'Abonnement à renouvellement automatique. Annulez à tout moment.';

  @override
  String get subPurchaseStarted => 'Achat lancé... Suivez l\'écran du magasin.';

  @override
  String get subPurchaseError => 'Une erreur est survenue.';

  @override
  String subYourPlan(Object tier) {
    return 'Vous êtes en $tier';
  }

  @override
  String get subEnjoyPerks => 'Profitez de tous les avantages.';

  @override
  String get subManage => 'Gérer l\'Abonnement';

  @override
  String get subPerMonth => '/ mois';

  @override
  String subRecipesPerDay(Object count) {
    return '$count Recherches de Recettes / Jour';
  }

  @override
  String get subManualAdd => 'Ajout Manuel d\'Ingrédients';

  @override
  String get subAdFree => 'Sans Publicité';

  @override
  String get subNoPhoto => 'Pas de Photo';

  @override
  String get subNoPantry => 'Pas de Suivi Garde-manger';

  @override
  String get subNoAssistant => 'Pas d\'Accès Assistant';

  @override
  String get subPhotoAdd => '📸 Ajout par Photo';

  @override
  String get subPantryTracking => '🏠 Garde-manger et Courses';

  @override
  String get subNoChat => 'Pas de Chat Assistant';

  @override
  String get subNoVoice => 'Pas d\'Assistant Vocal';

  @override
  String get subChatAssistant => '💬 Chat Assistant';

  @override
  String get subVoiceAssistant => '🎙️ Assistant Vocal';

  @override
  String get subVideoAdd => '📹 Ajout Vidéo (Bientôt)';

  @override
  String get subPrioritySupport => '⚡ Support Prioritaire';

  @override
  String get editProfileTitle => 'Modifier le Profil';

  @override
  String get saveChanges => 'Enregistrer';

  @override
  String get profileUpdated => 'Profil mis à jour ! ✅';

  @override
  String get personalInfo => 'Informations Personnelles';

  @override
  String get changePassword => 'Changer le Mot de Passe';

  @override
  String get currentPassword => 'Mot de Passe Actuel';

  @override
  String get newPassword => 'Nouveau Mot de Passe';

  @override
  String get confirmNewPassword => 'Confirmer le Nouveau Mot de Passe';

  @override
  String get passwordMismatch => 'Les mots de passe ne correspondent pas !';

  @override
  String get passwordUpdated => 'Mot de passe mis à jour ! ✅';

  @override
  String get updatePassword => 'Mettre à Jour le Mot de Passe';

  @override
  String get emailAddress => 'Adresse Email';

  @override
  String get changeEmail => 'Changer l\'Email';

  @override
  String get changeEmailDescription =>
      'Pour votre sécurité, entrez votre mot de passe actuel et votre nouvel email.';

  @override
  String get newEmail => 'Nouvel Email';

  @override
  String get cancel => 'Annuler';

  @override
  String get update => 'Mettre à jour';

  @override
  String get emailUpdated => 'Email mis à jour ! ✅';

  @override
  String get emailUpdateFailed => 'Impossible de changer l\'email.';

  @override
  String get prefVegan => 'Végan';

  @override
  String get prefVegetarian => 'Végétarien';

  @override
  String get prefGlutenFree => 'Sans Gluten';

  @override
  String get prefKeto => 'Keto';

  @override
  String get prefPaleo => 'Paléo';

  @override
  String get prefLowCarb => 'Faible en Glucides';

  @override
  String get prefMediterranean => 'Régime Méditerranéen';

  @override
  String get prefIntermittentFasting => 'Jeûne Intermittent';

  @override
  String get prefLowFat => 'Faible en Gras';

  @override
  String get prefPescatarian => 'Pescetarien';

  @override
  String get prefDiabeticFriendly => 'Adapté aux Diabétiques';

  @override
  String get prefHighProtein => 'Riche en Protéines';

  @override
  String get allergyNutsName => 'Noix';

  @override
  String get allergyMilk => 'Lait';

  @override
  String get allergyEgg => 'Œuf';

  @override
  String get allergySeafood => 'Fruits de Mer';

  @override
  String get allergyGluten => 'Gluten';

  @override
  String get allergySoyName => 'Soja';

  @override
  String get allergyPeanuts => 'Cacahuètes';

  @override
  String get allergyMushroom => 'Champignons';

  @override
  String get allergyMustard => 'Moutarde';

  @override
  String get allergySesame => 'Sésame';

  @override
  String get allergyStrawberry => 'Fraise';

  @override
  String get allergyKiwi => 'Kiwi';

  @override
  String get allergyCelery => 'Céleri';

  @override
  String get notifProductExpired => 'Produit Expiré !';

  @override
  String get notifTimeLow => 'Temps Limité !';

  @override
  String notifProductExpiredMessage(Object name) {
    return '$name a expiré.';
  }

  @override
  String notifTimeLowMessage(Object name) {
    return '$name va bientôt expirer.';
  }

  @override
  String get maintenanceTitle => 'Cuisine en Maintenance !';

  @override
  String get maintenanceSubtitle =>
      'Nos chefs mettent à jour le système pour mieux vous servir. Nous serons bientôt de retour avec de superbes recettes.';

  @override
  String get maintenanceRetry => 'Réessayer';

  @override
  String get lowCalorie => 'Faible en Calories';

  @override
  String get resumeCooking => 'Reprendre la Cuisine 🍳';

  @override
  String get timerFinishedTitle => 'Temps écoulé !';

  @override
  String timerFinishedMessage(Object recipe) {
    return 'Le minuteur pour $recipe est terminé.';
  }

  @override
  String get timerNotificationAction => 'Aller à l\'App';

  @override
  String get tipWaste =>
      'Utilisez d\'abord les ingrédients bientôt périmés pour éviter le gaspillage ! ♻️';

  @override
  String get tipSalt =>
      'Ajoutez le sel en dernier, vous en utiliserez moins 🧂';

  @override
  String get tipOnion =>
      'Réfrigérez les oignons 10 min avant de les couper, pas de larmes 🧅';

  @override
  String get tipPasta =>
      'Ajoutez une pincée de sel en faisant bouillir les pâtes 🍝';

  @override
  String get tipBread => 'Transformez le pain restant en chapelure 🍞';

  @override
  String get tipLemon =>
      'Roulez les citrons avant de les presser pour plus de jus 🍋';

  @override
  String get tipGreens =>
      'Enveloppez les légumes verts dans du papier absorbant 🥬';

  @override
  String get tipGarlic =>
      'Écrasez l\'ail avec un couteau pour le peler facilement 🧄';

  @override
  String get tipEgg =>
      'Plongez les œufs cuits dans l\'eau froide pour les peler facilement 🥚';

  @override
  String get tipRice =>
      'Rincez le riz avant la cuisson pour réduire l\'amidon 🍚';

  @override
  String get tipPan =>
      'Ne surchargez pas la poêle, les ingrédients vont cuire à la vapeur 🍳';

  @override
  String get tipMeat =>
      'Ne retournez pas trop la viande, une seule fois suffit 🥩';

  @override
  String get tipYogurt =>
      'Sortez le yaourt 10 min avant, il est meilleur à température ambiante 🥛';

  @override
  String get tipSteam =>
      'Cuisez les légumes à la vapeur pour mieux conserver les vitamines 🥦';

  @override
  String get tipSpices =>
      'Faites griller légèrement les épices pour libérer les arômes 🌶️';

  @override
  String get tipParmesan =>
      'Ajoutez une croûte de parmesan à la soupe pour un goût incroyable 🧀';

  @override
  String get tipAvocado =>
      'Mûrissez les avocats dans un sac en papier avec une banane 🥑';

  @override
  String get tipBroth =>
      'Gardez l\'eau de cuisson comme bouillon de légumes 🍲';

  @override
  String get tipTomato =>
      'Ajoutez une cuillère de sucre à la sauce tomate pour réduire l\'acidité 🍅';

  @override
  String get tipHerbs =>
      'Congelez les herbes fraîches dans de l\'huile d\'olive en bac à glaçons 🌿';

  @override
  String get tipDishes =>
      'Lavez la vaisselle tout de suite, les taches séchées sont plus difficiles 🍽️';

  @override
  String get tipCake =>
      'Assurez-vous que les ingrédients soient à température ambiante 🎂';

  @override
  String get tipSalad => 'Préparez la vinaigrette à l\'avance et réfrigérez 🥗';

  @override
  String get tipOliveOil =>
      'Utilisez l\'huile d\'olive à feu doux, elle perd ses nutriments à feu vif 🫒';

  @override
  String get tipRosemary =>
      'Infusez du romarin frais en tisane, bon pour la digestion 🫖';

  @override
  String get tipBeans =>
      'Faites tremper les légumineuses la veille pour réduire le temps de cuisson 🫘';

  @override
  String get tipBrothCubes =>
      'Congelez le bouillon en glaçons pour ajouter de la saveur facilement 🧊';

  @override
  String get tipFries =>
      'Trempez les pommes de terre dans l\'eau avant de frire pour plus de croustillant 🍟';

  @override
  String get tipFreshEgg =>
      'Testez la fraîcheur d\'un œuf en le plongeant dans l\'eau 💧';

  @override
  String get tipCoffee =>
      'Utilisez le marc de café comme engrais pour les plantes ☕';

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
  String get add => 'Ajouter';

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
  String get delete => 'Supprimer';

  @override
  String get worldCuisineSelection => 'Sélection de Cuisine Internationale';

  @override
  String get pantryTitle => 'Mes Ingrédients';

  @override
  String get addIngredient => 'Ajouter un Ingrédient';

  @override
  String get manualAdd => 'Ajouter Manuellement';

  @override
  String get manualAddSubtitle => 'Tapez le nom de l\'ingrédient';

  @override
  String get scanReceipt => 'Scanner le Reçu';

  @override
  String get scanReceiptSubtitle => 'Importation automatique du reçu';

  @override
  String get photoAdd => 'Ajouter par Photo';

  @override
  String get photoAddSubtitle => 'Reconnaissance automatique par IA';

  @override
  String get photoIngredientAdd => 'Ajouter un Ingrédient par Photo';

  @override
  String get ingredientAdded => 'Ingrédient ajouté';

  @override
  String ingredientsAddedCount(Object count) {
    return '$count ingrédients ajoutés !';
  }

  @override
  String get ingredientNotDetected => 'Ingrédient non détecté';

  @override
  String get aiAnalyzing => 'IA en cours d\'analyse...';

  @override
  String get ingredientName => 'Nom de l\'Ingrédient';

  @override
  String get quantity => 'Quantité';

  @override
  String get unitLabel => 'Unité';

  @override
  String get expiryDateOptional => 'Date de Péremption (Optionnelle)';

  @override
  String expiryDateLabel(Object day, Object month, Object year) {
    return 'DLC : $day/$month/$year';
  }

  @override
  String get save => 'Enregistrer';

  @override
  String get deleteConfirmTitle => 'Voulez-vous vraiment supprimer ?';

  @override
  String deleteConfirmMessage(Object name) {
    return '$name sera retiré de votre garde-manger.';
  }

  @override
  String get allIngredients => 'Tous les Ingrédients';

  @override
  String expiringSoonCount(Object count) {
    return 'Bientôt Périmés ($count)';
  }

  @override
  String get pantryEmpty => 'Votre garde-manger est vide';

  @override
  String get pantryEmptySubtitle => 'Commencez par ajouter des ingrédients';

  @override
  String get noExpiringItems => 'Aucun produit bientôt périmé !';

  @override
  String get allItemsFresh => 'Tous les produits sont frais !';

  @override
  String get addToList => 'Ajouter à la Liste';

  @override
  String addedToShoppingList(Object name) {
    return '$name ajouté à la liste de courses';
  }

  @override
  String get ok => 'OK';

  @override
  String get loginRequired =>
      'Vous devez vous connecter pour utiliser cette fonctionnalité';

  @override
  String get pantryEmptyAddFirst =>
      'Votre garde-manger est vide, ajoutez d\'abord des ingrédients';

  @override
  String errorGeneric(Object error) {
    return 'Erreur : $error';
  }

  @override
  String get notifications => 'Notifications';

  @override
  String get markAllRead => 'Tout Marquer Lu';

  @override
  String get noNotifications => 'Pas encore de notifications';

  @override
  String get noNotificationsSubtitle =>
      'Les mises à jour importantes apparaîtront ici';

  @override
  String get justNow => 'À l\'instant';

  @override
  String minutesAgo(Object minutes) {
    return 'Il y a $minutes min';
  }

  @override
  String hoursAgo(Object hours) {
    return 'Il y a $hours h';
  }

  @override
  String get yesterdayLabel => 'Hier';

  @override
  String get shoppingListTitle => 'Liste de Courses';

  @override
  String get addIngredientHint => 'Ajouter un ingrédient...';

  @override
  String get itemAlreadyExists => 'Ce produit est déjà dans votre liste !';

  @override
  String get deleteCheckedTitle => 'Supprimer les Cochés';

  @override
  String deleteCheckedMessage(Object count) {
    return '$count produits cochés seront supprimés. Êtes-vous sûr ?';
  }

  @override
  String get deleteSelectedTitle => 'Supprimer la Sélection';

  @override
  String deleteSelectedMessage(Object count) {
    return 'Voulez-vous vraiment supprimer $count produits ?';
  }

  @override
  String selectedCount(Object count) {
    return '$count sélectionnés';
  }

  @override
  String get selectAll => 'Tout Sélectionner';

  @override
  String get shareLabel => 'Partager';

  @override
  String get shareList => 'Partager la Liste';

  @override
  String get multiSelect => 'Sélection Multiple';

  @override
  String get deleteChecked => 'Supprimer les Cochés';

  @override
  String get shoppingListEmpty => 'Liste de Courses Vide';

  @override
  String get shoppingListEmptySubtitle =>
      'Commencez par ajouter ce que vous devez acheter';

  @override
  String purchasedCount(Object count) {
    return 'Acheté ($count)';
  }

  @override
  String get listCopied => 'Liste copiée !';

  @override
  String get selectedItems => 'Sélectionnés :';

  @override
  String get itemsToBuy => 'À Acheter :';

  @override
  String get editItem => 'Modifier l\'article';

  @override
  String get itemName => 'Nom de l\'article';

  @override
  String get editLabel => 'Modifier';

  @override
  String get smartStockAnalysis => 'Analyse Intelligente de Stock';

  @override
  String get statsLoadError => 'Impossible de charger les statistiques';

  @override
  String get tryAgain => 'Réessayer';

  @override
  String get totalProducts => 'Total Produits';

  @override
  String get expiringSoonLabel => 'Bientôt Périmés';

  @override
  String get expiredLabel => 'Périmés';

  @override
  String get categoriesLabel => 'Catégories';

  @override
  String get categoryDistribution => 'Répartition par Catégories';

  @override
  String get noData => 'Pas de données';

  @override
  String get wastePreventionScore => 'Score Anti-Gaspillage';

  @override
  String get scoreGreat => 'Vous êtes formidable !';

  @override
  String get scoreWarning => 'Attention ! Risque élevé de gaspillage.';

  @override
  String get scoreBetter => 'Pourrait être mieux.';

  @override
  String get wastePreventionSubtitle =>
      'Vous prévenez le gaspillage alimentaire en utilisant votre garde-manger efficacement.';

  @override
  String productsCount(Object count) {
    return '$count produits';
  }

  @override
  String get manageSubscriptionTitle => 'Gérer l\'Abonnement';

  @override
  String get activeStatus => 'Actif';

  @override
  String get startDate => 'Date de Début';

  @override
  String get statusLabel => 'Statut';

  @override
  String get autoRenews => 'Renouvellement Automatique';

  @override
  String get changePlan => 'Changer ou Annuler le Plan';

  @override
  String get changePlanDescription =>
      'Vous serez redirigé vers les paramètres du store pour annuler ou modifier votre abonnement. Les paiements et renouvellements sont gérés directement par le store.';

  @override
  String get platformLabel => 'Plateforme';

  @override
  String get filterEasy => 'Facile';

  @override
  String get filterFast => 'Rapide (<30min)';

  @override
  String get filterLowCal => 'Faible Calorie';

  @override
  String get minuteAbbr => 'min';

  @override
  String get stockAnalysis => 'Analyse de Stock';

  @override
  String get suggestRecipe => 'Suggérer une Recette';

  @override
  String get categoryVegetables => 'Légumes';

  @override
  String get categoryFruits => 'Fruits';

  @override
  String get categoryMeat => 'Viande & Volaille';

  @override
  String get categorySeafood => 'Fruits de Mer';

  @override
  String get categoryDairy => 'Produits Laitiers';

  @override
  String get categoryEggs => 'Œufs';

  @override
  String get categoryGrains => 'Céréales';

  @override
  String get categoryLegumes => 'Légumineuses';

  @override
  String get categoryPasta => 'Pâtes & Nouilles';

  @override
  String get categoryBakery => 'Pain & Boulangerie';

  @override
  String get categorySpices => 'Épices';

  @override
  String get categorySauces => 'Sauces & Condiments';

  @override
  String get categoryOils => 'Huiles';

  @override
  String get categoryBeverages => 'Boissons';

  @override
  String get categorySnacks => 'En-cas';

  @override
  String get categoryNuts => 'Fruits à Coque';

  @override
  String get categoryFrozen => 'Surgelés';

  @override
  String get categoryCanned => 'Conserves';

  @override
  String get categorySweets => 'Sucreries & Sucre';

  @override
  String get categoryOther => 'Autres';

  @override
  String get expiryUnknown => 'Inconnu';

  @override
  String get expiryExpired => 'Périmé';

  @override
  String get expiryToday => 'Aujourd\'hui !';

  @override
  String get expiryTomorrow => 'Demain';

  @override
  String expiryDays(Object days) {
    return '$days jours';
  }

  @override
  String get unitAdet => 'pcs';

  @override
  String get unitKg => 'kg';

  @override
  String get unitG => 'g';

  @override
  String get unitL => 'L';

  @override
  String get unitMl => 'ml';

  @override
  String get unitDemet => 'botte';

  @override
  String get unitPaket => 'paquet';

  @override
  String get unitKavanoz => 'bocal';

  @override
  String get errorImageAnalysisFailed => 'Échec de l\'analyse d\'image';

  @override
  String get errorFeatureLocked =>
      'Cette fonctionnalité n\'est pas disponible dans votre forfait.';

  @override
  String get errorLimitExceeded => 'Limite quotidienne dépassée.';

  @override
  String get errorNoIngredients =>
      'Veuillez sélectionner au moins un ingrédient.';

  @override
  String get errorConnectionTimeout =>
      'Délai de connexion dépassé. Veuillez réessayer.';

  @override
  String errorServerConnection(Object error) {
    return 'Impossible de se connecter au serveur : $error';
  }

  @override
  String get errorRecipeSuggestionFailed => 'Échec de la suggestion de recette';

  @override
  String get errorTrialExpired => 'Votre essai gratuit a expiré.';

  @override
  String get errorRecipeLimitExceeded =>
      'Limite quotidienne de recherche de recettes dépassée.';

  @override
  String get errorDetailedRecipeLocked =>
      'Les recettes détaillées sont réservées au forfait Pro.';

  @override
  String errorRecipeDetailFailed(Object error) {
    return 'Impossible d\'obtenir les détails de la recette : $error';
  }

  @override
  String get errorVerifyFailed => 'Vérification échouée : Réponse inattendue.';

  @override
  String errorSubscriptionVerifyFailed(Object error) {
    return 'L\'abonnement n\'a pas pu être vérifié : $error';
  }

  @override
  String get verifyEmailTitle => 'Vérifiez Votre Email';

  @override
  String verifyEmailSubtitle(Object email) {
    return 'Nous avons envoyé un lien de vérification à $email. Veuillez vérifier votre boîte de réception et votre dossier spam.';
  }

  @override
  String get verifiedButton => 'Email Vérifié, Se Connecter';

  @override
  String get scanIngredientTitle => 'Scanner les Ingrédients';

  @override
  String get analyzeIngredients => 'Analyser les Ingrédients';

  @override
  String get uploadIngredients => 'Télécharger les Ingrédients';

  @override
  String get aiWillRecognize => 'L\'IA reconnaîtra tous les ingrédients';

  @override
  String get cameraLabel => 'Caméra';

  @override
  String get takePhotoAction => 'Prendre une photo';

  @override
  String get galleryLabel => 'Galerie';

  @override
  String get selectPhoto => 'Sélectionner une photo';

  @override
  String get ensureVisible =>
      'Assurez-vous que tous les ingrédients soient visibles';

  @override
  String get selectDifferentPhoto => 'Choisir une Autre Photo';

  @override
  String imageCouldNotBeSelected(Object error) {
    return 'L\'image n\'a pas pu être sélectionnée : $error';
  }

  @override
  String get photoReady => 'Photo prête';

  @override
  String get identifyingIngredients => 'Identification des ingrédients';

  @override
  String get stepsLoading => 'Préparation des Étapes...';

  @override
  String get pleaseWaitOrRetry => 'Veuillez patienter ou réessayer plus tard.';

  @override
  String get timerLabel => 'Minuteur';

  @override
  String get stopTimerQuestion => 'Voulez-vous arrêter le minuteur ?';

  @override
  String get noLabel => 'Non';

  @override
  String get yesStop => 'Oui, Arrêter';

  @override
  String stepProgress(Object completed, Object current, Object total) {
    return 'ÉTAPE $current / $total  ($completed terminées)';
  }

  @override
  String stepCompletedLabel(Object number) {
    return 'ÉTAPE $number ✓';
  }

  @override
  String stepNumberLabel(Object number) {
    return 'ÉTAPE $number';
  }

  @override
  String get readStepAloud => 'Lire l\'Étape à Voix Haute';

  @override
  String get completedLabel => 'Terminé';

  @override
  String get finishCookingAction => 'Terminer la Cuisson';

  @override
  String get listeningLabel => 'Écoute en cours...';

  @override
  String get thinkingLabel => 'Réflexion en cours...';

  @override
  String get errorOccurred => 'Une erreur est survenue.';

  @override
  String get askSomething => 'Posez une question...';

  @override
  String get chefAssistant => 'Assistant Chef';

  @override
  String get chatEmptyHint =>
      'Vous pouvez poser des questions sur la recette.\nEx : \"Relis l\'étape 2\" ou \"À quelle température le four ?\"';

  @override
  String get timerFinished => 'Temps Écoulé ! 🍽️';

  @override
  String timerFinishedBody(Object title) {
    return 'Le minuteur que vous avez réglé pour $title est terminé.';
  }

  @override
  String get timeUpCheckFood => 'Temps écoulé ! Vérifiez votre plat.';

  @override
  String get detailedRecipe => 'Recette Détaillée';

  @override
  String detailedRecipeLoadFailed(Object error) {
    return 'Impossible de charger la recette détaillée : $error';
  }

  @override
  String get turkishCuisine => 'Cuisine Turque';

  @override
  String get optionalLabel => 'optionnel';

  @override
  String get instructionsNotFound => 'Aucune instruction trouvée.';

  @override
  String get viewDetails => 'Voir Détails & Préparation';

  @override
  String get ingredientsLoading => 'Chargement des ingrédients...';

  @override
  String get addToShoppingList => 'Ajouter à la Liste de Courses';

  @override
  String get addingToList => 'Ajout des ingrédients à la liste...';

  @override
  String ingredientsAddedToList(Object count) {
    return '$count ingrédients ajoutés à la liste de courses !';
  }

  @override
  String get errorOrEmptyList =>
      'Une erreur est survenue ou la liste est vide.';

  @override
  String get chefIngredientTip => 'Conseil Ingrédient du Chef';

  @override
  String chefTipDescription(Object ingredients) {
    return 'Nous avons préparé cette recette avec vos ingrédients disponibles mais notez : Si vous avez $ingredients, les ajouter améliorerait grandement le goût ! ✨';
  }

  @override
  String get tipsPlaceholder =>
      'Les conseils spéciaux du chef apparaîtront ici avec la recette détaillée.';

  @override
  String get quickLabel => 'Rapide';

  @override
  String get detailedLabel => 'Détaillé';

  @override
  String get preparingLabel => 'Préparation...';

  @override
  String get requestDetailedRecipe => 'Demander une Recette Détaillée';

  @override
  String get requestQuickRecipe => 'Recette Rapide';

  @override
  String caloriesPerServing(Object calories) {
    return '$calories kcal / portion';
  }

  @override
  String get personSuffix => 'personne';

  @override
  String get receiptScanTitle => 'Scanner le Reçu';

  @override
  String get tapToSelectReceipt => 'Appuyez pour sélectionner la photo du reçu';

  @override
  String get openCamera => 'Ouvrir la Caméra';

  @override
  String get analyzingReceipt =>
      'Analyse du reçu...\nCela peut prendre quelques secondes.';

  @override
  String foundProducts(Object count) {
    return 'Produits Trouvés ($count)';
  }

  @override
  String totalAmount(Object amount) {
    return 'Total : $amount TL';
  }

  @override
  String get noProductsFound => 'Aucun produit trouvé.';

  @override
  String get addAllToPantry => 'Tout Ajouter au Garde-manger';

  @override
  String get receiptAnalysisFailed =>
      'Analyse du reçu échouée ou aucun produit trouvé.';

  @override
  String productsAddedToPantry(Object count) {
    return '$count produits ajoutés au garde-manger.';
  }

  @override
  String get voiceAssistantTitle => 'Assistant Vocal';

  @override
  String get clearChat => 'Effacer le Chat';

  @override
  String get chatCleared => 'Chat effacé. Comment puis-je vous aider ?';

  @override
  String get tapMicAndSpeak => 'Appuyez sur le micro et parlez';

  @override
  String get recipesStepsNotLoaded =>
      'Les étapes de la recette n\'ont pas pu être chargées.';

  @override
  String get speechNotAvailable => 'Reconnaissance vocale non disponible';

  @override
  String get welcomeMessage =>
      'Salut ! Je suis votre assistant chef. Comment puis-je vous aider ?';

  @override
  String get speakingLabel => 'Parle...';

  @override
  String get quickItemBread => 'Pain';

  @override
  String get quickItemMilk => 'Lait';

  @override
  String get quickItemEgg => 'Œuf';

  @override
  String get quickItemWater => 'Eau';

  @override
  String get quickItemTomato => 'Tomate';

  @override
  String get quickItemCheese => 'Fromage';

  @override
  String get quickItemYogurt => 'Yaourt';

  @override
  String get quickItemPasta => 'Pâtes';

  @override
  String get suitablePlans => 'Plans Appropriés';

  @override
  String get reviewPlans => 'Voir les Plans';

  @override
  String get later => 'Plus Tard';

  @override
  String get dietType => 'Type de Régime';

  @override
  String get otherAllergyHint => 'Autre (ex. Champignons)';

  @override
  String get apply => 'Appliquer';

  @override
  String get cuisineTurkish => 'Turc';

  @override
  String get cuisineItalian => 'Italien';

  @override
  String get cuisineAsian => 'Asiatique';

  @override
  String get cuisineMexican => 'Mexicain';

  @override
  String get mealBreakfast => 'Petit Déjeuner';

  @override
  String get mealDinner => 'Dîner';

  @override
  String get mealSnack => 'En-cas';

  @override
  String get statTotal => 'Total';

  @override
  String get errorLoginFailed =>
      'Échec de la connexion. Veuillez vérifier votre e-mail et votre mot de passe.';

  @override
  String get errorConnection =>
      'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';

  @override
  String get errorTimeout => 'Délai de connexion dépassé. Veuillez réessayer.';

  @override
  String get errorServer => 'Erreur du serveur. Veuillez réessayer plus tard.';

  @override
  String get errorUnknown => 'Une erreur inconnue s\'est produite.';

  @override
  String get errorAccessDenied => 'Accès refusé.';

  @override
  String get restrictedAccessTitle => 'Accès Restreint';

  @override
  String get restrictedAccessMessage =>
      'Trop de changements d\'appareil détectés sur votre compte.';

  @override
  String get restrictedAccessDescription =>
      'Pour des raisons de sécurité, ce compte a été restreint (Mode Restreint). Veuillez contacter le support pour continuer.';

  @override
  String get getSupport => 'Obtenir de l\'Aide';

  @override
  String get close => 'Fermer';

  @override
  String get accountRestrictionTopic => 'Restriction du Compte';

  @override
  String get liveSupportTitle => 'Support en Direct';

  @override
  String get liveSupportSubtitle => 'Écrivez-nous vos questions';

  @override
  String get helpQuestion => 'Comment pouvons-nous vous aider ?';

  @override
  String get topicTechnical => 'Support Technique';

  @override
  String get topicPayment => 'Paiement & Abonnement';

  @override
  String get topicSuggestion => 'Suggestions & Demandes';

  @override
  String get topicOther => 'Autres Sujets';

  @override
  String get adminPanelTitle => 'Panneau d\'Administration (Chat)';

  @override
  String get adminPanelSubtitle => 'Gérer les messages entrants';

  @override
  String servingsCount(int count) {
    return '$count portions';
  }

  @override
  String get chatUserTitle => 'Chat Utilisateur';

  @override
  String get chatLiveSupportTitle => 'Support en Direct';

  @override
  String get chatEndButtonTooltip => 'Terminer le Chat';

  @override
  String get chatEndDialogTitle => 'Terminer le Chat';

  @override
  String get chatEndDialogContext =>
      'Votre problème est-il résolu ? Êtes-vous sûr de vouloir terminer le chat ?';

  @override
  String get chatEndDialogCancel => 'Annuler';

  @override
  String get chatEndDialogConfirm => 'Oui, Terminer le Chat';

  @override
  String get chatNoMessagesHello =>
      'Aucun message pour le moment. Dites bonjour ! 👋';

  @override
  String get chatHistoryClearedInfo => 'Historique du chat effacé. 👋';

  @override
  String get chatInputHint => 'Tapez votre message...';

  @override
  String get adminSupportRequestsTitle => 'Demandes de Support';

  @override
  String get adminNoSupportRequests =>
      'Aucune demande de support pour le moment.';

  @override
  String get adminUserPrefix => 'Utilisateur : ';

  @override
  String get customTimerChannelName => 'Minuterie Active';

  @override
  String get customTimerChannelDescription => 'État de la minuterie de cuisson';

  @override
  String get timerCookingDescription =>
      'Cuisson en cours...\nVous serez averti quand ce sera prêt.';

  @override
  String get chefVisionActiveTimer => 'Minuterie Active ChefVision';

  @override
  String timerCookingTitle(Object title) {
    return '$title est en cours de cuisson...';
  }

  @override
  String get guestChefName => 'Chef Invité';

  @override
  String get unregisteredAccount => 'Compte Non Inscrit';

  @override
  String get guestSignUpDesc =>
      'Créez votre compte gratuit pour enregistrer des recettes personnalisées, effectuer des analyses IA illimitées et constituer votre propre Garde-manger Virtuel.';

  @override
  String get usageLimitsTitle => 'Limites d\'Utilisation Restantes';

  @override
  String get usageLimitCamera => 'Scan par Caméra';

  @override
  String get usageLimitAiRecipe => 'Demande de Recette IA';

  @override
  String get loginOrRegister => 'Se Connecter ou S\'inscrire';

  @override
  String get err_user_not_found =>
      'Utilisateur introuvable - veuillez vous reconnecter';

  @override
  String get err_session_expired_other_device =>
      'Votre session a été terminée car vous vous êtes connecté depuis un autre appareil.';

  @override
  String get err_receipt_missing => 'Les données du reçu sont manquantes.';

  @override
  String get err_receipt_used_by_another_user =>
      'Cet achat est lié à un autre compte.';

  @override
  String get err_already_pro_other_platform =>
      'Vous avez déjà un abonnement actif sur une autre plateforme.';

  @override
  String get err_subscription_expired => 'Votre abonnement a expiré.';

  @override
  String get err_google_credentials_missing =>
      'Informations d\'identification Google mal configurées sur le serveur.';

  @override
  String get err_google_receipt_invalid =>
      'Réponse de vérification Google invalide.';

  @override
  String get err_google_verification_failed =>
      'Échec de la vérification Google.';

  @override
  String get err_apple_receipt_failed =>
      'Le reçu Apple n\'a pas pu être décodé ou a été rejeté par l\'App Store.';

  @override
  String get err_platform_not_supported => 'Plateforme non prise en charge.';

  @override
  String get err_verification_service => 'Erreur du service de vérification.';

  @override
  String get err_verification_failed => 'Échec de la vérification.';

  @override
  String get err_database_update =>
      'Une erreur de base de données s\'est produite lors de la mise à jour de l\'abonnement.';

  @override
  String get warning_subscription_active_delete =>
      'Votre compte a été supprimé avec succès. Cependant, votre abonnement actif en magasin pourrait toujours être en cours ! N\'oubliez pas de l\'annuler manuellement à partir des paramètres de votre téléphone.';

  @override
  String get success_account_deleted =>
      'Votre compte a été supprimé avec succès.';

  @override
  String get err_usage_limit_reached =>
      'Vous avez atteint votre limite d\'essai gratuit. Abonnez-vous pour accéder à des recettes avancées et plus encore.';

  @override
  String cuisineLabel(Object cuisine) {
    return 'Cuisine $cuisine';
  }

  @override
  String get subExpiredTitle => 'Votre abonnement a expiré';

  @override
  String get subExpiredSubtitle =>
      'Renouvelez pour continuer à profiter des fonctionnalités premium.';

  @override
  String get subRenew => 'Renouveler l\'abonnement';

  @override
  String get subExpiredBanner => 'Abonnement expiré — Appuyez pour renouveler';
}
