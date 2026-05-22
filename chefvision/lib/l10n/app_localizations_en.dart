// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'ChefVision AI';

  @override
  String get appName => 'ChefVision';

  @override
  String get splashTagline => 'Your AI-Powered Smart Chef';

  @override
  String get greetingMorning => 'Good Morning';

  @override
  String get greetingAfternoon => 'Good Afternoon';

  @override
  String get greetingEvening => 'Good Evening';

  @override
  String get greetingNight => 'Good Night';

  @override
  String get whatToCook => 'What would you like to cook?';

  @override
  String get scanIngredients => 'Scan Ingredients';

  @override
  String get scanIngredientsSubtitle => 'Snap your fridge, let AI find recipes';

  @override
  String get takePhoto => 'Take Photo';

  @override
  String get typeYourself => 'Add Manually';

  @override
  String get myPantry => 'My Ingredients';

  @override
  String get yourIngredients => 'Your Ingredients';

  @override
  String get shoppingList => 'Shopping List';

  @override
  String get yourList => 'Your List';

  @override
  String get popularRecipes => '🔥 Popular Flavors';

  @override
  String get viewAll => 'View All';

  @override
  String get expiryWarningTitle => 'Expiring Soon';

  @override
  String get expiredWarningTitle => 'Expired';

  @override
  String itemsExpired(Object count) {
    return '$count items have expired!';
  }

  @override
  String itemsExpiring(Object count) {
    return '$count items expiring soon!';
  }

  @override
  String get dailyTip => 'Tip of the Day';

  @override
  String get discover => 'Discover';

  @override
  String get discoverSubtitle => 'New recipes and kitchen secrets coming soon!';

  @override
  String get noFavorites => 'No Favorites Yet';

  @override
  String get noFavoritesSubtitle => 'You can add recipes you like here.';

  @override
  String get favoriteRecipes => 'Your Favorite Recipes';

  @override
  String get profile => 'Profile';

  @override
  String get editProfile => 'Edit Profile';

  @override
  String get home => 'Home';

  @override
  String get search => 'Search';

  @override
  String get favorites => 'Favorites';

  @override
  String get settings => 'Settings';

  @override
  String get language => 'Language';

  @override
  String get selectLanguage => 'Select Language';

  @override
  String get ingredients => 'Ingredients';

  @override
  String get instructions => 'Instructions';

  @override
  String get prepTime => 'Prep';

  @override
  String get recipe => 'Recipe';

  @override
  String get cookTime => 'Cook';

  @override
  String get servings => 'Servings';

  @override
  String get difficulty => 'Difficulty';

  @override
  String get calories => 'Calories';

  @override
  String get startCooking => 'Start Cooking';

  @override
  String get readAloud => 'Read Aloud';

  @override
  String get stopReading => 'Stop Reading';

  @override
  String get pauseReading => 'Pause';

  @override
  String get resumeReading => 'Resume';

  @override
  String get nextStep => 'Next Step';

  @override
  String get previousStep => 'Previous Step';

  @override
  String get finishCooking => 'Finish Cooking';

  @override
  String get cookingCompleted => 'Cooking Completed!';

  @override
  String get cookingCompletedSubtitle =>
      'Bon appétit! You\'ve made a delicious meal.';

  @override
  String get bonAppetit => 'Bon Appétit!';

  @override
  String get backToHomeCaps => 'BACK TO HOME';

  @override
  String get backToHome => 'Back to Home';

  @override
  String get analyzing => 'Analyzing...';

  @override
  String get analyzingSubtitle => 'Identifying ingredients with AI';

  @override
  String get addToPantry => 'Add to Pantry';

  @override
  String get retry => 'Retry';

  @override
  String get error => 'Error';

  @override
  String get success => 'Success';

  @override
  String get itemAdded => 'Item added successfully';

  @override
  String get itemRemoved => 'Item removed successfully';

  @override
  String get onboardingTitle1 => 'Scan Ingredients';

  @override
  String get onboardingDesc1 =>
      'Upload your ingredients, let AI identify them instantly';

  @override
  String get onboardingTitle2 => 'Get Recipes';

  @override
  String get onboardingDesc2 =>
      'AI suggests the most delicious recipes with what you have';

  @override
  String get onboardingTitle3 => 'Voice Assistant';

  @override
  String get onboardingDesc3 =>
      'Hands-free cooking, get recipes and step-by-step guidance with voice commands';

  @override
  String get skip => 'Skip';

  @override
  String get start => 'Start';

  @override
  String get continueAction => 'Continue';

  @override
  String iapErrorStarted(Object error) {
    return 'Purchase could not be started: $error';
  }

  @override
  String get iapErrorVerification =>
      'Verification failed (check internet). Transaction saved and will retry automatically.';

  @override
  String iapErrorGeneral(Object error) {
    return 'Purchase error: $error';
  }

  @override
  String trialRemaining(Object current, Object total) {
    return 'Trial: $current/$total';
  }

  @override
  String get darkMode => 'Dark Mode';

  @override
  String get darkModeSubtitle => 'Change app theme';

  @override
  String get foodWaste => 'Reduce Food Waste';

  @override
  String get foodWasteSubtitle =>
      'Prioritize ingredients that are about to expire';

  @override
  String get maxPrepTime => 'Maximum Prep Time';

  @override
  String minutesSuffix(Object minutes) {
    return '$minutes minutes';
  }

  @override
  String get logout => 'Log Out';

  @override
  String version(Object version) {
    return 'Version $version';
  }

  @override
  String get dietaryPreferences => '🥗 Dietary Preferences';

  @override
  String get allergies => '⚠️ Allergies';

  @override
  String get appSettings => '⚙️ App Settings';

  @override
  String get editAccountInfo => 'Edit Account Info';

  @override
  String get editAccountInfoSubtitle => 'Name, password and profile photo';

  @override
  String get subscriptionPlans => 'View Subscription Plans';

  @override
  String get manageSubscription => 'Manage Subscription';

  @override
  String get premiumDiscover => 'Discover Premium Features';

  @override
  String get premiumSubtitle =>
      'Unlimited recipes and special features with AI.';

  @override
  String subscriptionActive(Object tier) {
    return 'ChefVision $tier Active';
  }

  @override
  String get subscriptionActiveSubtitle => 'Enjoy the benefits of your plan.';

  @override
  String get deleteAccount => 'Delete Account';

  @override
  String get deleteAccountWarning =>
      'Are you sure you want to delete your account? This action cannot be undone and all your data (pantry, favorites) will be permanently deleted.';

  @override
  String get deleteAccountConfirm => 'Yes, Delete My Account';

  @override
  String get deleteAccountCancel => 'Cancel';

  @override
  String get deleteAccountSuccess =>
      'Your account has been deleted successfully.';

  @override
  String get gourmetUser => 'Gourmet User';

  @override
  String get chefTitleBeginner => 'Kitchen Apprentice 🌱';

  @override
  String get chefTitleIntermediate => 'Skilled Chef 👨‍🍳';

  @override
  String get chefTitleMaster => 'Head Chef 👑';

  @override
  String get statFavorites => 'Favorites';

  @override
  String get statPantry => 'My Ingredients';

  @override
  String get statCooked => 'Cooked';

  @override
  String get recentSuggestions => '✨ Recent Suggestions';

  @override
  String get clearAction => 'Clear 🗑️';

  @override
  String get returnToRecipes => 'Return to Recipes';

  @override
  String get cameraLocked => 'Camera Locked';

  @override
  String get cameraLockedMessage =>
      'Upgrade to Pro to add ingredients by taking photos.';

  @override
  String get pantryTracking => 'Pantry Tracking';

  @override
  String get pantryTrackingMessage =>
      'Upgrade to Pro or Premium to track expiry dates of your pantry items.';

  @override
  String get shoppingListLocked => 'Shopping List';

  @override
  String get shoppingListLockedMessage =>
      'Upgrade to Pro or Premium to smartly manage your shopping list.';

  @override
  String get loginWelcome => 'Welcome';

  @override
  String get loginSubtitle => 'Sign in to your ChefVision account';

  @override
  String get loginFailed => 'Login failed';

  @override
  String get emailRequired => 'Email is required';

  @override
  String get emailInvalid => 'Enter a valid email';

  @override
  String get passwordLabel => 'Password';

  @override
  String get passwordRequired => 'Password is required';

  @override
  String get passwordMinLength => 'Password must be at least 6 characters';

  @override
  String get rememberMe => 'Remember Me';

  @override
  String get forgotPassword => 'Forgot Password';

  @override
  String get forgotPasswordSubtitle =>
      'Enter your email address to receive a password reset link.';

  @override
  String get sendResetLink => 'Send Link';

  @override
  String get resetLinkSent =>
      'Password reset link sent. Please check your email.';

  @override
  String get loginButton => 'Log In';

  @override
  String get noAccount => 'Don\'t have an account? ';

  @override
  String get registerButton => 'Sign Up Free';

  @override
  String get registerTitle => 'Create Account';

  @override
  String get registerSubtitle => 'Get started, it\'s free!';

  @override
  String get registerFailed => 'Registration failed';

  @override
  String get continueAsGuest => 'Continue as Guest';

  @override
  String get fullName => 'Full Name';

  @override
  String get nameRequired => 'Name is required';

  @override
  String get nameMinLength => 'Enter at least 2 characters';

  @override
  String get dietPreferencesOptional => 'Diet Preferences (Optional)';

  @override
  String get allergiesOptional => 'Allergies (Optional)';

  @override
  String get dietVegan => '🌱 Vegan';

  @override
  String get dietVegetarian => '🥗 Vegetarian';

  @override
  String get dietGlutenFree => '🌾 Gluten Free';

  @override
  String get dietDairyFree => '🥛 Dairy Free';

  @override
  String get allergyNuts => '🥜 Nuts';

  @override
  String get allergyShellfish => '🦐 Shellfish';

  @override
  String get allergyEggs => '🥚 Eggs';

  @override
  String get allergySoy => '🫘 Soy';

  @override
  String get subPackages => 'Subscription Packages';

  @override
  String subMaxTierActive(Object tier) {
    return '$tier Plan Active!';
  }

  @override
  String subCurrentTier(Object tier) {
    return 'You\'re on $tier';
  }

  @override
  String get subUnlockPotential => 'Unlock Your Kitchen Potential';

  @override
  String get subMaxTierSubtitle => 'You\'re enjoying the top plan.';

  @override
  String get subUpgradeSubtitle => 'Upgrade your plan for more features.';

  @override
  String get subChoosePlan => 'Choose the best plan and grab the perks.';

  @override
  String get subMostPopular => 'MOST POPULAR';

  @override
  String subSwitchTo(Object tier) {
    return 'Switch to $tier';
  }

  @override
  String get subAutoRenew => 'Auto-renewing subscription. Cancel anytime.';

  @override
  String get subPurchaseStarted =>
      'Purchase started... Please follow the store screen.';

  @override
  String get subPurchaseError => 'An error occurred.';

  @override
  String subYourPlan(Object tier) {
    return 'You\'re on $tier';
  }

  @override
  String get subEnjoyPerks => 'Enjoy all the benefits.';

  @override
  String get subManage => 'Manage Membership';

  @override
  String get subPerMonth => '/ mo';

  @override
  String subRecipesPerDay(Object count) {
    return '$count Recipe Searches / Day';
  }

  @override
  String get subManualAdd => 'Manual Ingredient Adding';

  @override
  String get subAdFree => 'Ad-Free Experience';

  @override
  String get subNoPhoto => 'No Photo Upload';

  @override
  String get subNoPantry => 'No Pantry/Shopping Tracking';

  @override
  String get subNoAssistant => 'No Assistant Access';

  @override
  String get subPhotoAdd => '📸 Add Ingredients by Photo';

  @override
  String get subPantryTracking => '🏠 Pantry & Shopping Tracking';

  @override
  String get subNoChat => 'No Chat Assistant';

  @override
  String get subNoVoice => 'No Voice Assistant (Mic)';

  @override
  String get subChatAssistant => '💬 Chat Assistant';

  @override
  String get subVoiceAssistant => '🎙️ Voice Assistant (Microphone)';

  @override
  String get subVideoAdd => '📹 Video Upload (Coming Soon)';

  @override
  String get subPrioritySupport => '⚡ Priority Support';

  @override
  String get editProfileTitle => 'Edit Profile';

  @override
  String get saveChanges => 'Save Changes';

  @override
  String get profileUpdated => 'Profile updated successfully! ✅';

  @override
  String get personalInfo => 'Personal Information';

  @override
  String get changePassword => 'Change Password';

  @override
  String get currentPassword => 'Current Password';

  @override
  String get newPassword => 'New Password';

  @override
  String get confirmNewPassword => 'Confirm New Password';

  @override
  String get passwordMismatch => 'Passwords do not match!';

  @override
  String get passwordUpdated => 'Password updated successfully! ✅';

  @override
  String get updatePassword => 'Update Password';

  @override
  String get emailAddress => 'Email Address';

  @override
  String get changeEmail => 'Change Email';

  @override
  String get changeEmailDescription =>
      'For security, please enter your current password and new email address.';

  @override
  String get newEmail => 'New Email';

  @override
  String get cancel => 'Cancel';

  @override
  String get update => 'Update';

  @override
  String get emailUpdated => 'Email updated successfully! ✅';

  @override
  String get emailUpdateFailed => 'Email could not be changed.';

  @override
  String get prefVegan => 'Vegan';

  @override
  String get prefVegetarian => 'Vegetarian';

  @override
  String get prefGlutenFree => 'Gluten Free';

  @override
  String get prefKeto => 'Keto';

  @override
  String get prefPaleo => 'Paleo';

  @override
  String get prefLowCarb => 'Low Carb';

  @override
  String get prefMediterranean => 'Mediterranean Diet';

  @override
  String get prefIntermittentFasting => 'Intermittent Fasting';

  @override
  String get prefLowFat => 'Low Fat';

  @override
  String get prefPescatarian => 'Pescatarian';

  @override
  String get prefDiabeticFriendly => 'Diabetic Friendly';

  @override
  String get prefHighProtein => 'High Protein';

  @override
  String get allergyNutsName => 'Nuts';

  @override
  String get allergyMilk => 'Milk';

  @override
  String get allergyEgg => 'Egg';

  @override
  String get allergySeafood => 'Seafood';

  @override
  String get allergyGluten => 'Gluten';

  @override
  String get allergySoyName => 'Soy';

  @override
  String get allergyPeanuts => 'Peanuts';

  @override
  String get allergyMushroom => 'Mushroom';

  @override
  String get allergyMustard => 'Mustard';

  @override
  String get allergySesame => 'Sesame';

  @override
  String get allergyStrawberry => 'Strawberry';

  @override
  String get allergyKiwi => 'Kiwi';

  @override
  String get allergyCelery => 'Celery';

  @override
  String get notifProductExpired => 'Product Expired!';

  @override
  String get notifTimeLow => 'Time Running Out!';

  @override
  String notifProductExpiredMessage(Object name) {
    return '$name has expired.';
  }

  @override
  String notifTimeLowMessage(Object name) {
    return '$name is about to expire.';
  }

  @override
  String get maintenanceTitle => 'Kitchen Under Maintenance!';

  @override
  String get maintenanceSubtitle =>
      'Our chefs are updating the system to serve you better. We\'ll be back soon with amazing recipes.';

  @override
  String get maintenanceRetry => 'Try Again';

  @override
  String get lowCalorie => 'Low Calorie';

  @override
  String get resumeCooking => 'Resume Cooking 🍳';

  @override
  String get timerFinishedTitle => 'Timer Finished!';

  @override
  String timerFinishedMessage(Object recipe) {
    return 'The timer for $recipe has completed.';
  }

  @override
  String get timerNotificationAction => 'Go to App';

  @override
  String get tipWaste =>
      'Use ingredients about to expire first to prevent waste! ♻️';

  @override
  String get tipSalt => 'Add salt last to dishes, you\'ll use less salt 🧂';

  @override
  String get tipOnion =>
      'Chill onions in the fridge for 10 min before cutting, no tears 🧅';

  @override
  String get tipPasta =>
      'Add a pinch of salt when boiling pasta for extra flavor 🍝';

  @override
  String get tipBread =>
      'Turn leftover bread into breadcrumbs and store them 🍞';

  @override
  String get tipLemon =>
      'Roll lemons on the counter before squeezing for more juice 🍋';

  @override
  String get tipGreens =>
      'Wrap greens in paper towels and store in fridge, they last longer 🥬';

  @override
  String get tipGarlic =>
      'Crush garlic with a knife first to remove skins easily 🧄';

  @override
  String get tipEgg =>
      'Put boiled eggs in cold water to peel the shell easily 🥚';

  @override
  String get tipRice => 'Rinse rice before cooking to reduce starch 🍚';

  @override
  String get tipPan =>
      'Don\'t overcrowd the pan, food will steam instead of fry 🍳';

  @override
  String get tipMeat =>
      'Don\'t flip meat too often, flip once for a nice crust 🥩';

  @override
  String get tipYogurt =>
      'Take yogurt out 10 min before eating, it\'s tastier at room temp 🥛';

  @override
  String get tipSteam =>
      'Steam vegetables to better preserve their vitamins 🥦';

  @override
  String get tipSpices =>
      'Lightly toast spices in a pan before using to unlock aromas 🌶️';

  @override
  String get tipParmesan =>
      'Add a piece of parmesan rind to soup for amazing flavor 🧀';

  @override
  String get tipAvocado =>
      'Ripen avocados by placing them in a paper bag with a banana 🥑';

  @override
  String get tipBroth => 'Save cooking water as vegetable broth for soups 🍲';

  @override
  String get tipTomato =>
      'Add a teaspoon of sugar to tomato sauce to reduce acidity 🍅';

  @override
  String get tipHerbs =>
      'Freeze fresh herbs in olive oil using ice cube trays 🌿';

  @override
  String get tipDishes =>
      'Wash dishes right after eating, dried stains are harder to clean 🍽️';

  @override
  String get tipCake =>
      'Make sure ingredients are at room temperature when baking 🎂';

  @override
  String get tipSalad =>
      'Prepare salad dressing ahead and refrigerate for better flavor 🥗';

  @override
  String get tipOliveOil =>
      'Use olive oil on low heat, high heat reduces nutritional value 🫒';

  @override
  String get tipRosemary =>
      'Brew a sprig of fresh rosemary as tea, it aids digestion 🫖';

  @override
  String get tipBeans =>
      'Soak dried legumes overnight to halve the cooking time 🫘';

  @override
  String get tipBrothCubes =>
      'Freeze broth in ice cube trays to add flavor easily 🧊';

  @override
  String get tipFries =>
      'Soak potatoes in water before frying for crispier fries 🍟';

  @override
  String get tipFreshEgg => 'Test egg freshness by placing it in water 💧';

  @override
  String get tipCoffee =>
      'Use coffee grounds as fertilizer for potted plants ☕';

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
  String get add => 'Add';

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
  String get delete => 'Delete';

  @override
  String get worldCuisineSelection => 'World Cuisine Selection';

  @override
  String get pantryTitle => 'My Ingredients';

  @override
  String get addIngredient => 'Add Ingredient';

  @override
  String get manualAdd => 'Add Manually';

  @override
  String get manualAddSubtitle => 'Type ingredient name to add';

  @override
  String get scanReceipt => 'Scan Receipt';

  @override
  String get scanReceiptSubtitle => 'Auto import from receipt';

  @override
  String get photoAdd => 'Add with Photo';

  @override
  String get photoAddSubtitle => 'AI auto recognition';

  @override
  String get photoIngredientAdd => 'Add Ingredient with Photo';

  @override
  String get ingredientAdded => 'Ingredient added';

  @override
  String ingredientsAddedCount(Object count) {
    return '$count ingredients added!';
  }

  @override
  String get ingredientNotDetected => 'Ingredient not detected';

  @override
  String get aiAnalyzing => 'AI Analyzing...';

  @override
  String get ingredientName => 'Ingredient Name';

  @override
  String get quantity => 'Quantity';

  @override
  String get unitLabel => 'Unit';

  @override
  String get expiryDateOptional => 'Expiry Date (Optional)';

  @override
  String expiryDateLabel(Object day, Object month, Object year) {
    return 'Exp: $day/$month/$year';
  }

  @override
  String get save => 'Save';

  @override
  String get deleteConfirmTitle => 'Are you sure you want to delete?';

  @override
  String deleteConfirmMessage(Object name) {
    return '$name will be removed from your pantry.';
  }

  @override
  String get allIngredients => 'All Ingredients';

  @override
  String expiringSoonCount(Object count) {
    return 'Expiring Soon ($count)';
  }

  @override
  String get pantryEmpty => 'Your pantry is empty';

  @override
  String get pantryEmptySubtitle => 'Start by adding ingredients';

  @override
  String get noExpiringItems => 'No items expiring soon!';

  @override
  String get allItemsFresh => 'All items are fresh!';

  @override
  String get addToList => 'Add to List';

  @override
  String addedToShoppingList(Object name) {
    return '$name added to shopping list';
  }

  @override
  String get ok => 'OK';

  @override
  String get loginRequired => 'You must log in to use this feature';

  @override
  String get pantryEmptyAddFirst =>
      'Your pantry is empty, add ingredients first';

  @override
  String errorGeneric(Object error) {
    return 'Error: $error';
  }

  @override
  String get notifications => 'Notifications';

  @override
  String get markAllRead => 'Mark All Read';

  @override
  String get noNotifications => 'No notifications yet';

  @override
  String get noNotificationsSubtitle => 'Important updates will appear here';

  @override
  String get justNow => 'Just now';

  @override
  String minutesAgo(Object minutes) {
    return '$minutes min ago';
  }

  @override
  String hoursAgo(Object hours) {
    return '$hours hr ago';
  }

  @override
  String get yesterdayLabel => 'Yesterday';

  @override
  String get shoppingListTitle => 'Shopping List';

  @override
  String get addIngredientHint => 'Add ingredient...';

  @override
  String get itemAlreadyExists => 'This item is already in your list!';

  @override
  String get deleteCheckedTitle => 'Delete Checked Items';

  @override
  String deleteCheckedMessage(Object count) {
    return '$count checked items will be deleted. Are you sure?';
  }

  @override
  String get deleteSelectedTitle => 'Delete Selected';

  @override
  String deleteSelectedMessage(Object count) {
    return 'Are you sure you want to delete $count items?';
  }

  @override
  String selectedCount(Object count) {
    return '$count selected';
  }

  @override
  String get selectAll => 'Select All';

  @override
  String get shareLabel => 'Share';

  @override
  String get shareList => 'Share List';

  @override
  String get multiSelect => 'Multi Select';

  @override
  String get deleteChecked => 'Delete Checked';

  @override
  String get shoppingListEmpty => 'Shopping List Empty';

  @override
  String get shoppingListEmptySubtitle =>
      'Start by adding what you need to buy';

  @override
  String purchasedCount(Object count) {
    return 'Purchased ($count)';
  }

  @override
  String get listCopied => 'List copied!';

  @override
  String get selectedItems => 'Selected:';

  @override
  String get itemsToBuy => 'To Buy:';

  @override
  String get editItem => 'Edit Item';

  @override
  String get itemName => 'Item Name';

  @override
  String get editLabel => 'Edit';

  @override
  String get smartStockAnalysis => 'Smart Stock Analysis';

  @override
  String get statsLoadError => 'Could not load statistics';

  @override
  String get tryAgain => 'Try Again';

  @override
  String get totalProducts => 'Total Products';

  @override
  String get expiringSoonLabel => 'Expiring Soon';

  @override
  String get expiredLabel => 'Expired';

  @override
  String get categoriesLabel => 'Categories';

  @override
  String get categoryDistribution => 'Category Distribution';

  @override
  String get noData => 'No data';

  @override
  String get wastePreventionScore => 'Waste Prevention Score';

  @override
  String get scoreGreat => 'You\'re doing great!';

  @override
  String get scoreWarning => 'Warning! High waste risk.';

  @override
  String get scoreBetter => 'Could be better.';

  @override
  String get wastePreventionSubtitle =>
      'You\'re preventing food waste by using your pantry efficiently.';

  @override
  String productsCount(Object count) {
    return '$count products';
  }

  @override
  String get manageSubscriptionTitle => 'Manage Subscription';

  @override
  String get activeStatus => 'Active';

  @override
  String get startDate => 'Start Date';

  @override
  String get statusLabel => 'Status';

  @override
  String get autoRenews => 'Auto Renews';

  @override
  String get changePlan => 'Change or Cancel Plan';

  @override
  String get changePlanDescription =>
      'You will be redirected to store settings to cancel or change your subscription. Payments and renewals are managed directly by the store.';

  @override
  String get platformLabel => 'Platform';

  @override
  String get filterEasy => 'Easy';

  @override
  String get filterFast => 'Fast (<30min)';

  @override
  String get filterLowCal => 'Low Calorie';

  @override
  String get minuteAbbr => 'min';

  @override
  String get stockAnalysis => 'Stock Analysis';

  @override
  String get suggestRecipe => 'Suggest Recipe';

  @override
  String get categoryVegetables => 'Vegetables';

  @override
  String get categoryFruits => 'Fruits';

  @override
  String get categoryMeat => 'Meat & Poultry';

  @override
  String get categorySeafood => 'Seafood';

  @override
  String get categoryDairy => 'Dairy';

  @override
  String get categoryEggs => 'Eggs';

  @override
  String get categoryGrains => 'Grains';

  @override
  String get categoryLegumes => 'Legumes';

  @override
  String get categoryPasta => 'Pasta & Noodles';

  @override
  String get categoryBakery => 'Bread & Bakery';

  @override
  String get categorySpices => 'Spices';

  @override
  String get categorySauces => 'Sauces & Condiments';

  @override
  String get categoryOils => 'Oils';

  @override
  String get categoryBeverages => 'Beverages';

  @override
  String get categorySnacks => 'Snacks';

  @override
  String get categoryNuts => 'Nuts';

  @override
  String get categoryFrozen => 'Frozen';

  @override
  String get categoryCanned => 'Canned';

  @override
  String get categorySweets => 'Sweets & Sugar';

  @override
  String get categoryOther => 'Other';

  @override
  String get expiryUnknown => 'Unknown';

  @override
  String get expiryExpired => 'Expired';

  @override
  String get expiryToday => 'Today!';

  @override
  String get expiryTomorrow => 'Tomorrow';

  @override
  String expiryDays(Object days) {
    return '$days days';
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
  String get unitDemet => 'bunch';

  @override
  String get unitPaket => 'pack';

  @override
  String get unitKavanoz => 'jar';

  @override
  String get errorImageAnalysisFailed => 'Image analysis failed';

  @override
  String get errorFeatureLocked =>
      'This feature is not available in your plan.';

  @override
  String get errorLimitExceeded => 'Daily limit exceeded.';

  @override
  String get errorNoIngredients => 'Please select at least one ingredient.';

  @override
  String get errorConnectionTimeout => 'Connection timeout. Please try again.';

  @override
  String errorServerConnection(Object error) {
    return 'Could not connect to server: $error';
  }

  @override
  String get errorRecipeSuggestionFailed => 'Recipe suggestion failed';

  @override
  String get errorTrialExpired => 'Your free trial has expired.';

  @override
  String get errorRecipeLimitExceeded => 'Daily recipe search limit exceeded.';

  @override
  String get errorDetailedRecipeLocked =>
      'Detailed recipes are exclusive to the Pro plan.';

  @override
  String errorRecipeDetailFailed(Object error) {
    return 'Could not get recipe details: $error';
  }

  @override
  String get errorVerifyFailed => 'Verification failed: Unexpected response.';

  @override
  String errorSubscriptionVerifyFailed(Object error) {
    return 'Subscription could not be verified: $error';
  }

  @override
  String get verifyEmailTitle => 'Verify Your Email';

  @override
  String verifyEmailSubtitle(Object email) {
    return 'We sent a verification link to $email. Please check your inbox and spam folder.';
  }

  @override
  String get verifiedButton => 'I Verified My Email, Log In';

  @override
  String get scanIngredientTitle => 'Scan Ingredients';

  @override
  String get analyzeIngredients => 'Analyze Ingredients';

  @override
  String get uploadIngredients => 'Upload Ingredients';

  @override
  String get aiWillRecognize => 'AI will recognize all ingredients';

  @override
  String get cameraLabel => 'Camera';

  @override
  String get takePhotoAction => 'Take a photo';

  @override
  String get galleryLabel => 'Gallery';

  @override
  String get selectPhoto => 'Select a photo';

  @override
  String get ensureVisible => 'Make sure all ingredients are visible';

  @override
  String get selectDifferentPhoto => 'Select Different Photo';

  @override
  String imageCouldNotBeSelected(Object error) {
    return 'Image could not be selected: $error';
  }

  @override
  String get photoReady => 'Photo ready';

  @override
  String get identifyingIngredients => 'Identifying ingredients';

  @override
  String get stepsLoading => 'Recipe Steps Preparing...';

  @override
  String get pleaseWaitOrRetry => 'Please wait or try again later.';

  @override
  String get timerLabel => 'Timer';

  @override
  String get stopTimerQuestion => 'Do you want to stop the timer?';

  @override
  String get noLabel => 'No';

  @override
  String get yesStop => 'Yes, Stop';

  @override
  String stepProgress(Object completed, Object current, Object total) {
    return 'STEP $current / $total  ($completed completed)';
  }

  @override
  String stepCompletedLabel(Object number) {
    return 'STEP $number ✓';
  }

  @override
  String stepNumberLabel(Object number) {
    return 'STEP $number';
  }

  @override
  String get readStepAloud => 'Read Step Aloud';

  @override
  String get completedLabel => 'Completed';

  @override
  String get finishCookingAction => 'Finish Cooking';

  @override
  String get listeningLabel => 'Listening...';

  @override
  String get thinkingLabel => 'Thinking...';

  @override
  String get errorOccurred => 'An error occurred.';

  @override
  String get askSomething => 'Ask something...';

  @override
  String get chefAssistant => 'Chef Assistant';

  @override
  String get chatEmptyHint =>
      'You can ask about things you\'re stuck on with the recipe.\nE.g: \"Read step 2 again\" or \"What temperature for the oven?\"';

  @override
  String get timerFinished => 'Time\'s Up! 🍽️';

  @override
  String timerFinishedBody(Object title) {
    return 'The timer you set for $title has finished.';
  }

  @override
  String get timeUpCheckFood => 'Time\'s up! Check your food.';

  @override
  String get detailedRecipe => 'Detailed Recipe';

  @override
  String detailedRecipeLoadFailed(Object error) {
    return 'Could not load detailed recipe: $error';
  }

  @override
  String get turkishCuisine => 'Turkish Cuisine';

  @override
  String get optionalLabel => 'optional';

  @override
  String get instructionsNotFound => 'Instructions not found.';

  @override
  String get viewDetails => 'View Details & Preparation';

  @override
  String get ingredientsLoading => 'Ingredient info loading...';

  @override
  String get addToShoppingList => 'Add to Shopping List';

  @override
  String get addingToList => 'Adding ingredients to list...';

  @override
  String ingredientsAddedToList(Object count) {
    return '$count ingredients added to shopping list!';
  }

  @override
  String get errorOrEmptyList => 'An error occurred or list is empty.';

  @override
  String get chefIngredientTip => 'Chef\'s Ingredient Tip';

  @override
  String chefTipDescription(Object ingredients) {
    return 'We prepared this recipe with your available ingredients but note: If you have $ingredients, adding them would take the flavor much further! ✨';
  }

  @override
  String get tipsPlaceholder =>
      'Chef\'s special tips will appear here with the detailed recipe.';

  @override
  String get quickLabel => 'Quick';

  @override
  String get detailedLabel => 'Detailed';

  @override
  String get preparingLabel => 'Preparing...';

  @override
  String get requestDetailedRecipe => 'Request Detailed Recipe';

  @override
  String get requestQuickRecipe => 'Quick Recipe';

  @override
  String caloriesPerServing(Object calories) {
    return '$calories kcal / serving';
  }

  @override
  String get personSuffix => 'person';

  @override
  String get receiptScanTitle => 'Scan Receipt';

  @override
  String get tapToSelectReceipt => 'Tap to select receipt photo';

  @override
  String get openCamera => 'Open Camera';

  @override
  String get analyzingReceipt =>
      'Analyzing receipt...\nThis may take a few seconds.';

  @override
  String foundProducts(Object count) {
    return 'Found Products ($count)';
  }

  @override
  String totalAmount(Object amount) {
    return 'Total: $amount TL';
  }

  @override
  String get noProductsFound => 'No products found.';

  @override
  String get addAllToPantry => 'Add All to Pantry';

  @override
  String get receiptAnalysisFailed =>
      'Receipt analysis failed or no products found.';

  @override
  String productsAddedToPantry(Object count) {
    return '$count products added to pantry.';
  }

  @override
  String get voiceAssistantTitle => 'Voice Assistant';

  @override
  String get clearChat => 'Clear Chat';

  @override
  String get chatCleared => 'Chat cleared. How can I help you?';

  @override
  String get tapMicAndSpeak => 'Tap the mic and speak';

  @override
  String get recipesStepsNotLoaded => 'Recipe steps could not be loaded.';

  @override
  String get speechNotAvailable => 'Speech to text not available';

  @override
  String get welcomeMessage => 'Hi! I\'m your chef assistant. How can I help?';

  @override
  String get speakingLabel => 'Speaking...';

  @override
  String get quickItemBread => 'Bread';

  @override
  String get quickItemMilk => 'Milk';

  @override
  String get quickItemEgg => 'Egg';

  @override
  String get quickItemWater => 'Water';

  @override
  String get quickItemTomato => 'Tomato';

  @override
  String get quickItemCheese => 'Cheese';

  @override
  String get quickItemYogurt => 'Yogurt';

  @override
  String get quickItemPasta => 'Pasta';

  @override
  String get suitablePlans => 'Suitable Plans';

  @override
  String get reviewPlans => 'Review Plans';

  @override
  String get later => 'Later';

  @override
  String get dietType => 'Diet Type';

  @override
  String get otherAllergyHint => 'Other (e.g. Mushrooms)';

  @override
  String get apply => 'Apply';

  @override
  String get cuisineTurkish => 'Turkish';

  @override
  String get cuisineItalian => 'Italian';

  @override
  String get cuisineAsian => 'Asian';

  @override
  String get cuisineMexican => 'Mexican';

  @override
  String get mealBreakfast => 'Breakfast';

  @override
  String get mealDinner => 'Dinner';

  @override
  String get mealSnack => 'Snack';

  @override
  String get statTotal => 'Total';

  @override
  String get errorLoginFailed =>
      'Login failed. Please check your email and password.';

  @override
  String get errorConnection =>
      'Could not connect to server. Please check your internet connection.';

  @override
  String get errorTimeout => 'Connection timed out. Please try again.';

  @override
  String get errorServer => 'Server error. Please try again later.';

  @override
  String get errorUnknown => 'An unknown error occurred.';

  @override
  String get errorAccessDenied => 'Access denied.';

  @override
  String get restrictedAccessTitle => 'Access Restricted';

  @override
  String get restrictedAccessMessage =>
      'Too many device changes detected in your account.';

  @override
  String get restrictedAccessDescription =>
      'For security reasons, this account has been restricted (Restricted Mode). Please contact support to proceed.';

  @override
  String get getSupport => 'Get Support';

  @override
  String get close => 'Close';

  @override
  String get accountRestrictionTopic => 'Account Restriction';

  @override
  String get liveSupportTitle => 'Live Support';

  @override
  String get liveSupportSubtitle => 'Write to us with your questions';

  @override
  String get helpQuestion => 'How can we help you?';

  @override
  String get topicTechnical => 'Technical Support';

  @override
  String get topicPayment => 'Payment & Subscription';

  @override
  String get topicSuggestion => 'Suggestions & Requests';

  @override
  String get topicOther => 'Other Topics';

  @override
  String get adminPanelTitle => 'Admin Panel (Chat)';

  @override
  String get adminPanelSubtitle => 'Manage incoming messages';

  @override
  String servingsCount(int count) {
    return '$count servings';
  }

  @override
  String get chatUserTitle => 'User Chat';

  @override
  String get chatLiveSupportTitle => 'Live Support';

  @override
  String get chatEndButtonTooltip => 'End Chat';

  @override
  String get chatEndDialogTitle => 'End Chat';

  @override
  String get chatEndDialogContext =>
      'Is your issue resolved? Are you sure you want to end the chat?';

  @override
  String get chatEndDialogCancel => 'Cancel';

  @override
  String get chatEndDialogConfirm => 'Yes, End Chat';

  @override
  String get chatNoMessagesHello => 'No messages yet. Say hello! 👋';

  @override
  String get chatHistoryClearedInfo => 'Chat history cleared. 👋';

  @override
  String get chatInputHint => 'Type your message...';

  @override
  String get adminSupportRequestsTitle => 'Support Requests';

  @override
  String get adminNoSupportRequests => 'No support requests yet.';

  @override
  String get adminUserPrefix => 'User: ';

  @override
  String get customTimerChannelName => 'Active Timer';

  @override
  String get customTimerChannelDescription => 'Cooking timer status';

  @override
  String get timerCookingDescription =>
      'Cooking...\nYou will be notified when it\'s done.';

  @override
  String get chefVisionActiveTimer => 'ChefVision Active Timer';

  @override
  String timerCookingTitle(Object title) {
    return '$title is cooking...';
  }

  @override
  String get guestChefName => 'Guest Chef';

  @override
  String get unregisteredAccount => 'Unregistered Account';

  @override
  String get guestSignUpDesc =>
      'Create your free account to save custom recipes, do unlimited AI scans, and build your own Virtual Pantry.';

  @override
  String get usageLimitsTitle => 'Remaining Usage Limits';

  @override
  String get usageLimitCamera => 'Camera Scanning';

  @override
  String get usageLimitAiRecipe => 'AI Recipe Request';

  @override
  String get loginOrRegister => 'Log In or Register';

  @override
  String get err_user_not_found => 'User not found - please log in again';

  @override
  String get err_session_expired_other_device =>
      'Your session was terminated because you logged in from another device.';

  @override
  String get err_receipt_missing => 'Receipt data is missing.';

  @override
  String get err_receipt_used_by_another_user =>
      'This purchase is linked to another account.';

  @override
  String get err_already_pro_other_platform =>
      'You already have an active subscription from another platform.';

  @override
  String get err_subscription_expired => 'Your subscription has expired.';

  @override
  String get err_google_credentials_missing =>
      'Google Credentials configured wrongly on server.';

  @override
  String get err_google_receipt_invalid =>
      'Invalid Google verification response.';

  @override
  String get err_google_verification_failed => 'Google verification failed.';

  @override
  String get err_apple_receipt_failed =>
      'Apple receipt could not be decoded or was rejected by the App Store.';

  @override
  String get err_platform_not_supported => 'Unsupported platform.';

  @override
  String get err_verification_service => 'Verification service error.';

  @override
  String get err_verification_failed => 'Verification failed.';

  @override
  String get err_database_update =>
      'Database update error occurred while updating subscription.';

  @override
  String get warning_subscription_active_delete =>
      'Your account has been deleted successfully. However, your active store subscription might still be running! Please remember to cancel it manually from your phone\'s settings.';

  @override
  String get success_account_deleted =>
      'Your account has been deleted successfully.';

  @override
  String get err_usage_limit_reached =>
      'You\'ve reached your free trial limit. Please subscribe for advanced recipes and more.';

  @override
  String cuisineLabel(Object cuisine) {
    return '$cuisine Cuisine';
  }

  @override
  String get subExpiredTitle => 'Your Subscription Has Expired';

  @override
  String get subExpiredSubtitle =>
      'Renew to continue enjoying premium features.';

  @override
  String get subRenew => 'Renew Subscription';

  @override
  String get subExpiredBanner => 'Subscription expired — Tap to renew';
}
