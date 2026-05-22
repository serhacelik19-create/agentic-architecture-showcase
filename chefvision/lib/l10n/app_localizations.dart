import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_de.dart';
import 'app_localizations_en.dart';
import 'app_localizations_es.dart';
import 'app_localizations_fr.dart';
import 'app_localizations_it.dart';
import 'app_localizations_tr.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('de'),
    Locale('en'),
    Locale('es'),
    Locale('fr'),
    Locale('it'),
    Locale('tr')
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'ChefVision AI'**
  String get appTitle;

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'ChefVision'**
  String get appName;

  /// No description provided for @splashTagline.
  ///
  /// In en, this message translates to:
  /// **'Your AI-Powered Smart Chef'**
  String get splashTagline;

  /// No description provided for @greetingMorning.
  ///
  /// In en, this message translates to:
  /// **'Good Morning'**
  String get greetingMorning;

  /// No description provided for @greetingAfternoon.
  ///
  /// In en, this message translates to:
  /// **'Good Afternoon'**
  String get greetingAfternoon;

  /// No description provided for @greetingEvening.
  ///
  /// In en, this message translates to:
  /// **'Good Evening'**
  String get greetingEvening;

  /// No description provided for @greetingNight.
  ///
  /// In en, this message translates to:
  /// **'Good Night'**
  String get greetingNight;

  /// No description provided for @whatToCook.
  ///
  /// In en, this message translates to:
  /// **'What would you like to cook?'**
  String get whatToCook;

  /// No description provided for @scanIngredients.
  ///
  /// In en, this message translates to:
  /// **'Scan Ingredients'**
  String get scanIngredients;

  /// No description provided for @scanIngredientsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Snap your fridge, let AI find recipes'**
  String get scanIngredientsSubtitle;

  /// No description provided for @takePhoto.
  ///
  /// In en, this message translates to:
  /// **'Take Photo'**
  String get takePhoto;

  /// No description provided for @typeYourself.
  ///
  /// In en, this message translates to:
  /// **'Add Manually'**
  String get typeYourself;

  /// No description provided for @myPantry.
  ///
  /// In en, this message translates to:
  /// **'My Ingredients'**
  String get myPantry;

  /// No description provided for @yourIngredients.
  ///
  /// In en, this message translates to:
  /// **'Your Ingredients'**
  String get yourIngredients;

  /// No description provided for @shoppingList.
  ///
  /// In en, this message translates to:
  /// **'Shopping List'**
  String get shoppingList;

  /// No description provided for @yourList.
  ///
  /// In en, this message translates to:
  /// **'Your List'**
  String get yourList;

  /// No description provided for @popularRecipes.
  ///
  /// In en, this message translates to:
  /// **'🔥 Popular Flavors'**
  String get popularRecipes;

  /// No description provided for @viewAll.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get viewAll;

  /// No description provided for @expiryWarningTitle.
  ///
  /// In en, this message translates to:
  /// **'Expiring Soon'**
  String get expiryWarningTitle;

  /// No description provided for @expiredWarningTitle.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get expiredWarningTitle;

  /// No description provided for @itemsExpired.
  ///
  /// In en, this message translates to:
  /// **'{count} items have expired!'**
  String itemsExpired(Object count);

  /// No description provided for @itemsExpiring.
  ///
  /// In en, this message translates to:
  /// **'{count} items expiring soon!'**
  String itemsExpiring(Object count);

  /// No description provided for @dailyTip.
  ///
  /// In en, this message translates to:
  /// **'Tip of the Day'**
  String get dailyTip;

  /// No description provided for @discover.
  ///
  /// In en, this message translates to:
  /// **'Discover'**
  String get discover;

  /// No description provided for @discoverSubtitle.
  ///
  /// In en, this message translates to:
  /// **'New recipes and kitchen secrets coming soon!'**
  String get discoverSubtitle;

  /// No description provided for @noFavorites.
  ///
  /// In en, this message translates to:
  /// **'No Favorites Yet'**
  String get noFavorites;

  /// No description provided for @noFavoritesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'You can add recipes you like here.'**
  String get noFavoritesSubtitle;

  /// No description provided for @favoriteRecipes.
  ///
  /// In en, this message translates to:
  /// **'Your Favorite Recipes'**
  String get favoriteRecipes;

  /// No description provided for @profile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profile;

  /// No description provided for @editProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get editProfile;

  /// No description provided for @home.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get home;

  /// No description provided for @search.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get search;

  /// No description provided for @favorites.
  ///
  /// In en, this message translates to:
  /// **'Favorites'**
  String get favorites;

  /// No description provided for @settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @selectLanguage.
  ///
  /// In en, this message translates to:
  /// **'Select Language'**
  String get selectLanguage;

  /// No description provided for @ingredients.
  ///
  /// In en, this message translates to:
  /// **'Ingredients'**
  String get ingredients;

  /// No description provided for @instructions.
  ///
  /// In en, this message translates to:
  /// **'Instructions'**
  String get instructions;

  /// No description provided for @prepTime.
  ///
  /// In en, this message translates to:
  /// **'Prep'**
  String get prepTime;

  /// No description provided for @recipe.
  ///
  /// In en, this message translates to:
  /// **'Recipe'**
  String get recipe;

  /// No description provided for @cookTime.
  ///
  /// In en, this message translates to:
  /// **'Cook'**
  String get cookTime;

  /// No description provided for @servings.
  ///
  /// In en, this message translates to:
  /// **'Servings'**
  String get servings;

  /// No description provided for @difficulty.
  ///
  /// In en, this message translates to:
  /// **'Difficulty'**
  String get difficulty;

  /// No description provided for @calories.
  ///
  /// In en, this message translates to:
  /// **'Calories'**
  String get calories;

  /// No description provided for @startCooking.
  ///
  /// In en, this message translates to:
  /// **'Start Cooking'**
  String get startCooking;

  /// No description provided for @readAloud.
  ///
  /// In en, this message translates to:
  /// **'Read Aloud'**
  String get readAloud;

  /// No description provided for @stopReading.
  ///
  /// In en, this message translates to:
  /// **'Stop Reading'**
  String get stopReading;

  /// No description provided for @pauseReading.
  ///
  /// In en, this message translates to:
  /// **'Pause'**
  String get pauseReading;

  /// No description provided for @resumeReading.
  ///
  /// In en, this message translates to:
  /// **'Resume'**
  String get resumeReading;

  /// No description provided for @nextStep.
  ///
  /// In en, this message translates to:
  /// **'Next Step'**
  String get nextStep;

  /// No description provided for @previousStep.
  ///
  /// In en, this message translates to:
  /// **'Previous Step'**
  String get previousStep;

  /// No description provided for @finishCooking.
  ///
  /// In en, this message translates to:
  /// **'Finish Cooking'**
  String get finishCooking;

  /// No description provided for @cookingCompleted.
  ///
  /// In en, this message translates to:
  /// **'Cooking Completed!'**
  String get cookingCompleted;

  /// No description provided for @cookingCompletedSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Bon appétit! You\'ve made a delicious meal.'**
  String get cookingCompletedSubtitle;

  /// No description provided for @bonAppetit.
  ///
  /// In en, this message translates to:
  /// **'Bon Appétit!'**
  String get bonAppetit;

  /// No description provided for @backToHomeCaps.
  ///
  /// In en, this message translates to:
  /// **'BACK TO HOME'**
  String get backToHomeCaps;

  /// No description provided for @backToHome.
  ///
  /// In en, this message translates to:
  /// **'Back to Home'**
  String get backToHome;

  /// No description provided for @analyzing.
  ///
  /// In en, this message translates to:
  /// **'Analyzing...'**
  String get analyzing;

  /// No description provided for @analyzingSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Identifying ingredients with AI'**
  String get analyzingSubtitle;

  /// No description provided for @addToPantry.
  ///
  /// In en, this message translates to:
  /// **'Add to Pantry'**
  String get addToPantry;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @error.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get error;

  /// No description provided for @success.
  ///
  /// In en, this message translates to:
  /// **'Success'**
  String get success;

  /// No description provided for @itemAdded.
  ///
  /// In en, this message translates to:
  /// **'Item added successfully'**
  String get itemAdded;

  /// No description provided for @itemRemoved.
  ///
  /// In en, this message translates to:
  /// **'Item removed successfully'**
  String get itemRemoved;

  /// No description provided for @onboardingTitle1.
  ///
  /// In en, this message translates to:
  /// **'Scan Ingredients'**
  String get onboardingTitle1;

  /// No description provided for @onboardingDesc1.
  ///
  /// In en, this message translates to:
  /// **'Upload your ingredients, let AI identify them instantly'**
  String get onboardingDesc1;

  /// No description provided for @onboardingTitle2.
  ///
  /// In en, this message translates to:
  /// **'Get Recipes'**
  String get onboardingTitle2;

  /// No description provided for @onboardingDesc2.
  ///
  /// In en, this message translates to:
  /// **'AI suggests the most delicious recipes with what you have'**
  String get onboardingDesc2;

  /// No description provided for @onboardingTitle3.
  ///
  /// In en, this message translates to:
  /// **'Voice Assistant'**
  String get onboardingTitle3;

  /// No description provided for @onboardingDesc3.
  ///
  /// In en, this message translates to:
  /// **'Hands-free cooking, get recipes and step-by-step guidance with voice commands'**
  String get onboardingDesc3;

  /// No description provided for @skip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skip;

  /// No description provided for @start.
  ///
  /// In en, this message translates to:
  /// **'Start'**
  String get start;

  /// No description provided for @continueAction.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get continueAction;

  /// No description provided for @iapErrorStarted.
  ///
  /// In en, this message translates to:
  /// **'Purchase could not be started: {error}'**
  String iapErrorStarted(Object error);

  /// No description provided for @iapErrorVerification.
  ///
  /// In en, this message translates to:
  /// **'Verification failed (check internet). Transaction saved and will retry automatically.'**
  String get iapErrorVerification;

  /// No description provided for @iapErrorGeneral.
  ///
  /// In en, this message translates to:
  /// **'Purchase error: {error}'**
  String iapErrorGeneral(Object error);

  /// No description provided for @trialRemaining.
  ///
  /// In en, this message translates to:
  /// **'Trial: {current}/{total}'**
  String trialRemaining(Object current, Object total);

  /// No description provided for @darkMode.
  ///
  /// In en, this message translates to:
  /// **'Dark Mode'**
  String get darkMode;

  /// No description provided for @darkModeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Change app theme'**
  String get darkModeSubtitle;

  /// No description provided for @foodWaste.
  ///
  /// In en, this message translates to:
  /// **'Reduce Food Waste'**
  String get foodWaste;

  /// No description provided for @foodWasteSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Prioritize ingredients that are about to expire'**
  String get foodWasteSubtitle;

  /// No description provided for @maxPrepTime.
  ///
  /// In en, this message translates to:
  /// **'Maximum Prep Time'**
  String get maxPrepTime;

  /// No description provided for @minutesSuffix.
  ///
  /// In en, this message translates to:
  /// **'{minutes} minutes'**
  String minutesSuffix(Object minutes);

  /// No description provided for @logout.
  ///
  /// In en, this message translates to:
  /// **'Log Out'**
  String get logout;

  /// No description provided for @version.
  ///
  /// In en, this message translates to:
  /// **'Version {version}'**
  String version(Object version);

  /// No description provided for @dietaryPreferences.
  ///
  /// In en, this message translates to:
  /// **'🥗 Dietary Preferences'**
  String get dietaryPreferences;

  /// No description provided for @allergies.
  ///
  /// In en, this message translates to:
  /// **'⚠️ Allergies'**
  String get allergies;

  /// No description provided for @appSettings.
  ///
  /// In en, this message translates to:
  /// **'⚙️ App Settings'**
  String get appSettings;

  /// No description provided for @editAccountInfo.
  ///
  /// In en, this message translates to:
  /// **'Edit Account Info'**
  String get editAccountInfo;

  /// No description provided for @editAccountInfoSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Name, password and profile photo'**
  String get editAccountInfoSubtitle;

  /// No description provided for @subscriptionPlans.
  ///
  /// In en, this message translates to:
  /// **'View Subscription Plans'**
  String get subscriptionPlans;

  /// No description provided for @manageSubscription.
  ///
  /// In en, this message translates to:
  /// **'Manage Subscription'**
  String get manageSubscription;

  /// No description provided for @premiumDiscover.
  ///
  /// In en, this message translates to:
  /// **'Discover Premium Features'**
  String get premiumDiscover;

  /// No description provided for @premiumSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Unlimited recipes and special features with AI.'**
  String get premiumSubtitle;

  /// No description provided for @subscriptionActive.
  ///
  /// In en, this message translates to:
  /// **'ChefVision {tier} Active'**
  String subscriptionActive(Object tier);

  /// No description provided for @subscriptionActiveSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enjoy the benefits of your plan.'**
  String get subscriptionActiveSubtitle;

  /// No description provided for @deleteAccount.
  ///
  /// In en, this message translates to:
  /// **'Delete Account'**
  String get deleteAccount;

  /// No description provided for @deleteAccountWarning.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete your account? This action cannot be undone and all your data (pantry, favorites) will be permanently deleted.'**
  String get deleteAccountWarning;

  /// No description provided for @deleteAccountConfirm.
  ///
  /// In en, this message translates to:
  /// **'Yes, Delete My Account'**
  String get deleteAccountConfirm;

  /// No description provided for @deleteAccountCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get deleteAccountCancel;

  /// No description provided for @deleteAccountSuccess.
  ///
  /// In en, this message translates to:
  /// **'Your account has been deleted successfully.'**
  String get deleteAccountSuccess;

  /// No description provided for @gourmetUser.
  ///
  /// In en, this message translates to:
  /// **'Gourmet User'**
  String get gourmetUser;

  /// No description provided for @chefTitleBeginner.
  ///
  /// In en, this message translates to:
  /// **'Kitchen Apprentice 🌱'**
  String get chefTitleBeginner;

  /// No description provided for @chefTitleIntermediate.
  ///
  /// In en, this message translates to:
  /// **'Skilled Chef 👨‍🍳'**
  String get chefTitleIntermediate;

  /// No description provided for @chefTitleMaster.
  ///
  /// In en, this message translates to:
  /// **'Head Chef 👑'**
  String get chefTitleMaster;

  /// No description provided for @statFavorites.
  ///
  /// In en, this message translates to:
  /// **'Favorites'**
  String get statFavorites;

  /// No description provided for @statPantry.
  ///
  /// In en, this message translates to:
  /// **'My Ingredients'**
  String get statPantry;

  /// No description provided for @statCooked.
  ///
  /// In en, this message translates to:
  /// **'Cooked'**
  String get statCooked;

  /// No description provided for @recentSuggestions.
  ///
  /// In en, this message translates to:
  /// **'✨ Recent Suggestions'**
  String get recentSuggestions;

  /// No description provided for @clearAction.
  ///
  /// In en, this message translates to:
  /// **'Clear 🗑️'**
  String get clearAction;

  /// No description provided for @returnToRecipes.
  ///
  /// In en, this message translates to:
  /// **'Return to Recipes'**
  String get returnToRecipes;

  /// No description provided for @cameraLocked.
  ///
  /// In en, this message translates to:
  /// **'Camera Locked'**
  String get cameraLocked;

  /// No description provided for @cameraLockedMessage.
  ///
  /// In en, this message translates to:
  /// **'Upgrade to Pro to add ingredients by taking photos.'**
  String get cameraLockedMessage;

  /// No description provided for @pantryTracking.
  ///
  /// In en, this message translates to:
  /// **'Pantry Tracking'**
  String get pantryTracking;

  /// No description provided for @pantryTrackingMessage.
  ///
  /// In en, this message translates to:
  /// **'Upgrade to Pro or Premium to track expiry dates of your pantry items.'**
  String get pantryTrackingMessage;

  /// No description provided for @shoppingListLocked.
  ///
  /// In en, this message translates to:
  /// **'Shopping List'**
  String get shoppingListLocked;

  /// No description provided for @shoppingListLockedMessage.
  ///
  /// In en, this message translates to:
  /// **'Upgrade to Pro or Premium to smartly manage your shopping list.'**
  String get shoppingListLockedMessage;

  /// No description provided for @loginWelcome.
  ///
  /// In en, this message translates to:
  /// **'Welcome'**
  String get loginWelcome;

  /// No description provided for @loginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sign in to your ChefVision account'**
  String get loginSubtitle;

  /// No description provided for @loginFailed.
  ///
  /// In en, this message translates to:
  /// **'Login failed'**
  String get loginFailed;

  /// No description provided for @emailRequired.
  ///
  /// In en, this message translates to:
  /// **'Email is required'**
  String get emailRequired;

  /// No description provided for @emailInvalid.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid email'**
  String get emailInvalid;

  /// No description provided for @passwordLabel.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get passwordLabel;

  /// No description provided for @passwordRequired.
  ///
  /// In en, this message translates to:
  /// **'Password is required'**
  String get passwordRequired;

  /// No description provided for @passwordMinLength.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 6 characters'**
  String get passwordMinLength;

  /// No description provided for @rememberMe.
  ///
  /// In en, this message translates to:
  /// **'Remember Me'**
  String get rememberMe;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password'**
  String get forgotPassword;

  /// No description provided for @forgotPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your email address to receive a password reset link.'**
  String get forgotPasswordSubtitle;

  /// No description provided for @sendResetLink.
  ///
  /// In en, this message translates to:
  /// **'Send Link'**
  String get sendResetLink;

  /// No description provided for @resetLinkSent.
  ///
  /// In en, this message translates to:
  /// **'Password reset link sent. Please check your email.'**
  String get resetLinkSent;

  /// No description provided for @loginButton.
  ///
  /// In en, this message translates to:
  /// **'Log In'**
  String get loginButton;

  /// No description provided for @noAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account? '**
  String get noAccount;

  /// No description provided for @registerButton.
  ///
  /// In en, this message translates to:
  /// **'Sign Up Free'**
  String get registerButton;

  /// No description provided for @registerTitle.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get registerTitle;

  /// No description provided for @registerSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Get started, it\'s free!'**
  String get registerSubtitle;

  /// No description provided for @registerFailed.
  ///
  /// In en, this message translates to:
  /// **'Registration failed'**
  String get registerFailed;

  /// No description provided for @continueAsGuest.
  ///
  /// In en, this message translates to:
  /// **'Continue as Guest'**
  String get continueAsGuest;

  /// No description provided for @fullName.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get fullName;

  /// No description provided for @nameRequired.
  ///
  /// In en, this message translates to:
  /// **'Name is required'**
  String get nameRequired;

  /// No description provided for @nameMinLength.
  ///
  /// In en, this message translates to:
  /// **'Enter at least 2 characters'**
  String get nameMinLength;

  /// No description provided for @dietPreferencesOptional.
  ///
  /// In en, this message translates to:
  /// **'Diet Preferences (Optional)'**
  String get dietPreferencesOptional;

  /// No description provided for @allergiesOptional.
  ///
  /// In en, this message translates to:
  /// **'Allergies (Optional)'**
  String get allergiesOptional;

  /// No description provided for @dietVegan.
  ///
  /// In en, this message translates to:
  /// **'🌱 Vegan'**
  String get dietVegan;

  /// No description provided for @dietVegetarian.
  ///
  /// In en, this message translates to:
  /// **'🥗 Vegetarian'**
  String get dietVegetarian;

  /// No description provided for @dietGlutenFree.
  ///
  /// In en, this message translates to:
  /// **'🌾 Gluten Free'**
  String get dietGlutenFree;

  /// No description provided for @dietDairyFree.
  ///
  /// In en, this message translates to:
  /// **'🥛 Dairy Free'**
  String get dietDairyFree;

  /// No description provided for @allergyNuts.
  ///
  /// In en, this message translates to:
  /// **'🥜 Nuts'**
  String get allergyNuts;

  /// No description provided for @allergyShellfish.
  ///
  /// In en, this message translates to:
  /// **'🦐 Shellfish'**
  String get allergyShellfish;

  /// No description provided for @allergyEggs.
  ///
  /// In en, this message translates to:
  /// **'🥚 Eggs'**
  String get allergyEggs;

  /// No description provided for @allergySoy.
  ///
  /// In en, this message translates to:
  /// **'🫘 Soy'**
  String get allergySoy;

  /// No description provided for @subPackages.
  ///
  /// In en, this message translates to:
  /// **'Subscription Packages'**
  String get subPackages;

  /// No description provided for @subMaxTierActive.
  ///
  /// In en, this message translates to:
  /// **'{tier} Plan Active!'**
  String subMaxTierActive(Object tier);

  /// No description provided for @subCurrentTier.
  ///
  /// In en, this message translates to:
  /// **'You\'re on {tier}'**
  String subCurrentTier(Object tier);

  /// No description provided for @subUnlockPotential.
  ///
  /// In en, this message translates to:
  /// **'Unlock Your Kitchen Potential'**
  String get subUnlockPotential;

  /// No description provided for @subMaxTierSubtitle.
  ///
  /// In en, this message translates to:
  /// **'You\'re enjoying the top plan.'**
  String get subMaxTierSubtitle;

  /// No description provided for @subUpgradeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Upgrade your plan for more features.'**
  String get subUpgradeSubtitle;

  /// No description provided for @subChoosePlan.
  ///
  /// In en, this message translates to:
  /// **'Choose the best plan and grab the perks.'**
  String get subChoosePlan;

  /// No description provided for @subMostPopular.
  ///
  /// In en, this message translates to:
  /// **'MOST POPULAR'**
  String get subMostPopular;

  /// No description provided for @subSwitchTo.
  ///
  /// In en, this message translates to:
  /// **'Switch to {tier}'**
  String subSwitchTo(Object tier);

  /// No description provided for @subAutoRenew.
  ///
  /// In en, this message translates to:
  /// **'Auto-renewing subscription. Cancel anytime.'**
  String get subAutoRenew;

  /// No description provided for @subPurchaseStarted.
  ///
  /// In en, this message translates to:
  /// **'Purchase started... Please follow the store screen.'**
  String get subPurchaseStarted;

  /// No description provided for @subPurchaseError.
  ///
  /// In en, this message translates to:
  /// **'An error occurred.'**
  String get subPurchaseError;

  /// No description provided for @subYourPlan.
  ///
  /// In en, this message translates to:
  /// **'You\'re on {tier}'**
  String subYourPlan(Object tier);

  /// No description provided for @subEnjoyPerks.
  ///
  /// In en, this message translates to:
  /// **'Enjoy all the benefits.'**
  String get subEnjoyPerks;

  /// No description provided for @subManage.
  ///
  /// In en, this message translates to:
  /// **'Manage Membership'**
  String get subManage;

  /// No description provided for @subPerMonth.
  ///
  /// In en, this message translates to:
  /// **'/ mo'**
  String get subPerMonth;

  /// No description provided for @subRecipesPerDay.
  ///
  /// In en, this message translates to:
  /// **'{count} Recipe Searches / Day'**
  String subRecipesPerDay(Object count);

  /// No description provided for @subManualAdd.
  ///
  /// In en, this message translates to:
  /// **'Manual Ingredient Adding'**
  String get subManualAdd;

  /// No description provided for @subAdFree.
  ///
  /// In en, this message translates to:
  /// **'Ad-Free Experience'**
  String get subAdFree;

  /// No description provided for @subNoPhoto.
  ///
  /// In en, this message translates to:
  /// **'No Photo Upload'**
  String get subNoPhoto;

  /// No description provided for @subNoPantry.
  ///
  /// In en, this message translates to:
  /// **'No Pantry/Shopping Tracking'**
  String get subNoPantry;

  /// No description provided for @subNoAssistant.
  ///
  /// In en, this message translates to:
  /// **'No Assistant Access'**
  String get subNoAssistant;

  /// No description provided for @subPhotoAdd.
  ///
  /// In en, this message translates to:
  /// **'📸 Add Ingredients by Photo'**
  String get subPhotoAdd;

  /// No description provided for @subPantryTracking.
  ///
  /// In en, this message translates to:
  /// **'🏠 Pantry & Shopping Tracking'**
  String get subPantryTracking;

  /// No description provided for @subNoChat.
  ///
  /// In en, this message translates to:
  /// **'No Chat Assistant'**
  String get subNoChat;

  /// No description provided for @subNoVoice.
  ///
  /// In en, this message translates to:
  /// **'No Voice Assistant (Mic)'**
  String get subNoVoice;

  /// No description provided for @subChatAssistant.
  ///
  /// In en, this message translates to:
  /// **'💬 Chat Assistant'**
  String get subChatAssistant;

  /// No description provided for @subVoiceAssistant.
  ///
  /// In en, this message translates to:
  /// **'🎙️ Voice Assistant (Microphone)'**
  String get subVoiceAssistant;

  /// No description provided for @subVideoAdd.
  ///
  /// In en, this message translates to:
  /// **'📹 Video Upload (Coming Soon)'**
  String get subVideoAdd;

  /// No description provided for @subPrioritySupport.
  ///
  /// In en, this message translates to:
  /// **'⚡ Priority Support'**
  String get subPrioritySupport;

  /// No description provided for @editProfileTitle.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get editProfileTitle;

  /// No description provided for @saveChanges.
  ///
  /// In en, this message translates to:
  /// **'Save Changes'**
  String get saveChanges;

  /// No description provided for @profileUpdated.
  ///
  /// In en, this message translates to:
  /// **'Profile updated successfully! ✅'**
  String get profileUpdated;

  /// No description provided for @personalInfo.
  ///
  /// In en, this message translates to:
  /// **'Personal Information'**
  String get personalInfo;

  /// No description provided for @changePassword.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get changePassword;

  /// No description provided for @currentPassword.
  ///
  /// In en, this message translates to:
  /// **'Current Password'**
  String get currentPassword;

  /// No description provided for @newPassword.
  ///
  /// In en, this message translates to:
  /// **'New Password'**
  String get newPassword;

  /// No description provided for @confirmNewPassword.
  ///
  /// In en, this message translates to:
  /// **'Confirm New Password'**
  String get confirmNewPassword;

  /// No description provided for @passwordMismatch.
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match!'**
  String get passwordMismatch;

  /// No description provided for @passwordUpdated.
  ///
  /// In en, this message translates to:
  /// **'Password updated successfully! ✅'**
  String get passwordUpdated;

  /// No description provided for @updatePassword.
  ///
  /// In en, this message translates to:
  /// **'Update Password'**
  String get updatePassword;

  /// No description provided for @emailAddress.
  ///
  /// In en, this message translates to:
  /// **'Email Address'**
  String get emailAddress;

  /// No description provided for @changeEmail.
  ///
  /// In en, this message translates to:
  /// **'Change Email'**
  String get changeEmail;

  /// No description provided for @changeEmailDescription.
  ///
  /// In en, this message translates to:
  /// **'For security, please enter your current password and new email address.'**
  String get changeEmailDescription;

  /// No description provided for @newEmail.
  ///
  /// In en, this message translates to:
  /// **'New Email'**
  String get newEmail;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @update.
  ///
  /// In en, this message translates to:
  /// **'Update'**
  String get update;

  /// No description provided for @emailUpdated.
  ///
  /// In en, this message translates to:
  /// **'Email updated successfully! ✅'**
  String get emailUpdated;

  /// No description provided for @emailUpdateFailed.
  ///
  /// In en, this message translates to:
  /// **'Email could not be changed.'**
  String get emailUpdateFailed;

  /// No description provided for @prefVegan.
  ///
  /// In en, this message translates to:
  /// **'Vegan'**
  String get prefVegan;

  /// No description provided for @prefVegetarian.
  ///
  /// In en, this message translates to:
  /// **'Vegetarian'**
  String get prefVegetarian;

  /// No description provided for @prefGlutenFree.
  ///
  /// In en, this message translates to:
  /// **'Gluten Free'**
  String get prefGlutenFree;

  /// No description provided for @prefKeto.
  ///
  /// In en, this message translates to:
  /// **'Keto'**
  String get prefKeto;

  /// No description provided for @prefPaleo.
  ///
  /// In en, this message translates to:
  /// **'Paleo'**
  String get prefPaleo;

  /// No description provided for @prefLowCarb.
  ///
  /// In en, this message translates to:
  /// **'Low Carb'**
  String get prefLowCarb;

  /// No description provided for @prefMediterranean.
  ///
  /// In en, this message translates to:
  /// **'Mediterranean Diet'**
  String get prefMediterranean;

  /// No description provided for @prefIntermittentFasting.
  ///
  /// In en, this message translates to:
  /// **'Intermittent Fasting'**
  String get prefIntermittentFasting;

  /// No description provided for @prefLowFat.
  ///
  /// In en, this message translates to:
  /// **'Low Fat'**
  String get prefLowFat;

  /// No description provided for @prefPescatarian.
  ///
  /// In en, this message translates to:
  /// **'Pescatarian'**
  String get prefPescatarian;

  /// No description provided for @prefDiabeticFriendly.
  ///
  /// In en, this message translates to:
  /// **'Diabetic Friendly'**
  String get prefDiabeticFriendly;

  /// No description provided for @prefHighProtein.
  ///
  /// In en, this message translates to:
  /// **'High Protein'**
  String get prefHighProtein;

  /// No description provided for @allergyNutsName.
  ///
  /// In en, this message translates to:
  /// **'Nuts'**
  String get allergyNutsName;

  /// No description provided for @allergyMilk.
  ///
  /// In en, this message translates to:
  /// **'Milk'**
  String get allergyMilk;

  /// No description provided for @allergyEgg.
  ///
  /// In en, this message translates to:
  /// **'Egg'**
  String get allergyEgg;

  /// No description provided for @allergySeafood.
  ///
  /// In en, this message translates to:
  /// **'Seafood'**
  String get allergySeafood;

  /// No description provided for @allergyGluten.
  ///
  /// In en, this message translates to:
  /// **'Gluten'**
  String get allergyGluten;

  /// No description provided for @allergySoyName.
  ///
  /// In en, this message translates to:
  /// **'Soy'**
  String get allergySoyName;

  /// No description provided for @allergyPeanuts.
  ///
  /// In en, this message translates to:
  /// **'Peanuts'**
  String get allergyPeanuts;

  /// No description provided for @allergyMushroom.
  ///
  /// In en, this message translates to:
  /// **'Mushroom'**
  String get allergyMushroom;

  /// No description provided for @allergyMustard.
  ///
  /// In en, this message translates to:
  /// **'Mustard'**
  String get allergyMustard;

  /// No description provided for @allergySesame.
  ///
  /// In en, this message translates to:
  /// **'Sesame'**
  String get allergySesame;

  /// No description provided for @allergyStrawberry.
  ///
  /// In en, this message translates to:
  /// **'Strawberry'**
  String get allergyStrawberry;

  /// No description provided for @allergyKiwi.
  ///
  /// In en, this message translates to:
  /// **'Kiwi'**
  String get allergyKiwi;

  /// No description provided for @allergyCelery.
  ///
  /// In en, this message translates to:
  /// **'Celery'**
  String get allergyCelery;

  /// No description provided for @notifProductExpired.
  ///
  /// In en, this message translates to:
  /// **'Product Expired!'**
  String get notifProductExpired;

  /// No description provided for @notifTimeLow.
  ///
  /// In en, this message translates to:
  /// **'Time Running Out!'**
  String get notifTimeLow;

  /// No description provided for @notifProductExpiredMessage.
  ///
  /// In en, this message translates to:
  /// **'{name} has expired.'**
  String notifProductExpiredMessage(Object name);

  /// No description provided for @notifTimeLowMessage.
  ///
  /// In en, this message translates to:
  /// **'{name} is about to expire.'**
  String notifTimeLowMessage(Object name);

  /// No description provided for @maintenanceTitle.
  ///
  /// In en, this message translates to:
  /// **'Kitchen Under Maintenance!'**
  String get maintenanceTitle;

  /// No description provided for @maintenanceSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Our chefs are updating the system to serve you better. We\'ll be back soon with amazing recipes.'**
  String get maintenanceSubtitle;

  /// No description provided for @maintenanceRetry.
  ///
  /// In en, this message translates to:
  /// **'Try Again'**
  String get maintenanceRetry;

  /// No description provided for @lowCalorie.
  ///
  /// In en, this message translates to:
  /// **'Low Calorie'**
  String get lowCalorie;

  /// No description provided for @resumeCooking.
  ///
  /// In en, this message translates to:
  /// **'Resume Cooking 🍳'**
  String get resumeCooking;

  /// No description provided for @timerFinishedTitle.
  ///
  /// In en, this message translates to:
  /// **'Timer Finished!'**
  String get timerFinishedTitle;

  /// No description provided for @timerFinishedMessage.
  ///
  /// In en, this message translates to:
  /// **'The timer for {recipe} has completed.'**
  String timerFinishedMessage(Object recipe);

  /// No description provided for @timerNotificationAction.
  ///
  /// In en, this message translates to:
  /// **'Go to App'**
  String get timerNotificationAction;

  /// No description provided for @tipWaste.
  ///
  /// In en, this message translates to:
  /// **'Use ingredients about to expire first to prevent waste! ♻️'**
  String get tipWaste;

  /// No description provided for @tipSalt.
  ///
  /// In en, this message translates to:
  /// **'Add salt last to dishes, you\'ll use less salt 🧂'**
  String get tipSalt;

  /// No description provided for @tipOnion.
  ///
  /// In en, this message translates to:
  /// **'Chill onions in the fridge for 10 min before cutting, no tears 🧅'**
  String get tipOnion;

  /// No description provided for @tipPasta.
  ///
  /// In en, this message translates to:
  /// **'Add a pinch of salt when boiling pasta for extra flavor 🍝'**
  String get tipPasta;

  /// No description provided for @tipBread.
  ///
  /// In en, this message translates to:
  /// **'Turn leftover bread into breadcrumbs and store them 🍞'**
  String get tipBread;

  /// No description provided for @tipLemon.
  ///
  /// In en, this message translates to:
  /// **'Roll lemons on the counter before squeezing for more juice 🍋'**
  String get tipLemon;

  /// No description provided for @tipGreens.
  ///
  /// In en, this message translates to:
  /// **'Wrap greens in paper towels and store in fridge, they last longer 🥬'**
  String get tipGreens;

  /// No description provided for @tipGarlic.
  ///
  /// In en, this message translates to:
  /// **'Crush garlic with a knife first to remove skins easily 🧄'**
  String get tipGarlic;

  /// No description provided for @tipEgg.
  ///
  /// In en, this message translates to:
  /// **'Put boiled eggs in cold water to peel the shell easily 🥚'**
  String get tipEgg;

  /// No description provided for @tipRice.
  ///
  /// In en, this message translates to:
  /// **'Rinse rice before cooking to reduce starch 🍚'**
  String get tipRice;

  /// No description provided for @tipPan.
  ///
  /// In en, this message translates to:
  /// **'Don\'t overcrowd the pan, food will steam instead of fry 🍳'**
  String get tipPan;

  /// No description provided for @tipMeat.
  ///
  /// In en, this message translates to:
  /// **'Don\'t flip meat too often, flip once for a nice crust 🥩'**
  String get tipMeat;

  /// No description provided for @tipYogurt.
  ///
  /// In en, this message translates to:
  /// **'Take yogurt out 10 min before eating, it\'s tastier at room temp 🥛'**
  String get tipYogurt;

  /// No description provided for @tipSteam.
  ///
  /// In en, this message translates to:
  /// **'Steam vegetables to better preserve their vitamins 🥦'**
  String get tipSteam;

  /// No description provided for @tipSpices.
  ///
  /// In en, this message translates to:
  /// **'Lightly toast spices in a pan before using to unlock aromas 🌶️'**
  String get tipSpices;

  /// No description provided for @tipParmesan.
  ///
  /// In en, this message translates to:
  /// **'Add a piece of parmesan rind to soup for amazing flavor 🧀'**
  String get tipParmesan;

  /// No description provided for @tipAvocado.
  ///
  /// In en, this message translates to:
  /// **'Ripen avocados by placing them in a paper bag with a banana 🥑'**
  String get tipAvocado;

  /// No description provided for @tipBroth.
  ///
  /// In en, this message translates to:
  /// **'Save cooking water as vegetable broth for soups 🍲'**
  String get tipBroth;

  /// No description provided for @tipTomato.
  ///
  /// In en, this message translates to:
  /// **'Add a teaspoon of sugar to tomato sauce to reduce acidity 🍅'**
  String get tipTomato;

  /// No description provided for @tipHerbs.
  ///
  /// In en, this message translates to:
  /// **'Freeze fresh herbs in olive oil using ice cube trays 🌿'**
  String get tipHerbs;

  /// No description provided for @tipDishes.
  ///
  /// In en, this message translates to:
  /// **'Wash dishes right after eating, dried stains are harder to clean 🍽️'**
  String get tipDishes;

  /// No description provided for @tipCake.
  ///
  /// In en, this message translates to:
  /// **'Make sure ingredients are at room temperature when baking 🎂'**
  String get tipCake;

  /// No description provided for @tipSalad.
  ///
  /// In en, this message translates to:
  /// **'Prepare salad dressing ahead and refrigerate for better flavor 🥗'**
  String get tipSalad;

  /// No description provided for @tipOliveOil.
  ///
  /// In en, this message translates to:
  /// **'Use olive oil on low heat, high heat reduces nutritional value 🫒'**
  String get tipOliveOil;

  /// No description provided for @tipRosemary.
  ///
  /// In en, this message translates to:
  /// **'Brew a sprig of fresh rosemary as tea, it aids digestion 🫖'**
  String get tipRosemary;

  /// No description provided for @tipBeans.
  ///
  /// In en, this message translates to:
  /// **'Soak dried legumes overnight to halve the cooking time 🫘'**
  String get tipBeans;

  /// No description provided for @tipBrothCubes.
  ///
  /// In en, this message translates to:
  /// **'Freeze broth in ice cube trays to add flavor easily 🧊'**
  String get tipBrothCubes;

  /// No description provided for @tipFries.
  ///
  /// In en, this message translates to:
  /// **'Soak potatoes in water before frying for crispier fries 🍟'**
  String get tipFries;

  /// No description provided for @tipFreshEgg.
  ///
  /// In en, this message translates to:
  /// **'Test egg freshness by placing it in water 💧'**
  String get tipFreshEgg;

  /// No description provided for @tipCoffee.
  ///
  /// In en, this message translates to:
  /// **'Use coffee grounds as fertilizer for potted plants ☕'**
  String get tipCoffee;

  /// No description provided for @personServings.
  ///
  /// In en, this message translates to:
  /// **'{count} Person'**
  String personServings(Object count);

  /// No description provided for @howManyPeople.
  ///
  /// In en, this message translates to:
  /// **'How many people?'**
  String get howManyPeople;

  /// No description provided for @sixPlus.
  ///
  /// In en, this message translates to:
  /// **'6+'**
  String get sixPlus;

  /// No description provided for @kitchen.
  ///
  /// In en, this message translates to:
  /// **'Cuisine'**
  String get kitchen;

  /// No description provided for @meal.
  ///
  /// In en, this message translates to:
  /// **'Meal'**
  String get meal;

  /// No description provided for @diet.
  ///
  /// In en, this message translates to:
  /// **'Diet'**
  String get diet;

  /// No description provided for @preventWaste.
  ///
  /// In en, this message translates to:
  /// **'Prevent Waste'**
  String get preventWaste;

  /// No description provided for @clearList.
  ///
  /// In en, this message translates to:
  /// **'Clear All'**
  String get clearList;

  /// No description provided for @clearIngredientsTitle.
  ///
  /// In en, this message translates to:
  /// **'Clear All Ingredients?'**
  String get clearIngredientsTitle;

  /// No description provided for @clearIngredientsMsg.
  ///
  /// In en, this message translates to:
  /// **'All ingredients in your list will be deleted. This cannot be undone.'**
  String get clearIngredientsMsg;

  /// No description provided for @yesDelete.
  ///
  /// In en, this message translates to:
  /// **'Yes, Delete'**
  String get yesDelete;

  /// No description provided for @addIngredientTitle.
  ///
  /// In en, this message translates to:
  /// **'Add Ingredient'**
  String get addIngredientTitle;

  /// No description provided for @editIngredientTitle.
  ///
  /// In en, this message translates to:
  /// **'Edit Ingredient'**
  String get editIngredientTitle;

  /// No description provided for @newIngredientHint.
  ///
  /// In en, this message translates to:
  /// **'New ingredient name'**
  String get newIngredientHint;

  /// No description provided for @add.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get add;

  /// No description provided for @edit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get edit;

  /// No description provided for @suggestRecipes.
  ///
  /// In en, this message translates to:
  /// **'Suggest Recipes'**
  String get suggestRecipes;

  /// No description provided for @recipeSuggestions.
  ///
  /// In en, this message translates to:
  /// **'Recipe Suggestions'**
  String get recipeSuggestions;

  /// No description provided for @suggestDifferent.
  ///
  /// In en, this message translates to:
  /// **'Suggest Different Recipes'**
  String get suggestDifferent;

  /// No description provided for @noRecipesFound.
  ///
  /// In en, this message translates to:
  /// **'No Recipes Found'**
  String get noRecipesFound;

  /// No description provided for @noRecipesFoundMsg.
  ///
  /// In en, this message translates to:
  /// **'No recipes found for these filters.'**
  String get noRecipesFoundMsg;

  /// No description provided for @tryDifferentIngredients.
  ///
  /// In en, this message translates to:
  /// **'Try different ingredients'**
  String get tryDifferentIngredients;

  /// No description provided for @match.
  ///
  /// In en, this message translates to:
  /// **'match'**
  String get match;

  /// No description provided for @loadingMixing.
  ///
  /// In en, this message translates to:
  /// **'Mixing flavors...'**
  String get loadingMixing;

  /// No description provided for @loadingChef.
  ///
  /// In en, this message translates to:
  /// **'Chef is putting on the hat...'**
  String get loadingChef;

  /// No description provided for @loadingSelecting.
  ///
  /// In en, this message translates to:
  /// **'Selecting best recipes...'**
  String get loadingSelecting;

  /// No description provided for @loadingIngredients.
  ///
  /// In en, this message translates to:
  /// **'Checking ingredients...'**
  String get loadingIngredients;

  /// No description provided for @loadingSecret.
  ///
  /// In en, this message translates to:
  /// **'Searching secret recipes...'**
  String get loadingSecret;

  /// No description provided for @loadingAI.
  ///
  /// In en, this message translates to:
  /// **'Please wait, AI is working...'**
  String get loadingAI;

  /// No description provided for @ingredientsSearchHint.
  ///
  /// In en, this message translates to:
  /// **'Type ingredient name... (e.g. Milk)'**
  String get ingredientsSearchHint;

  /// No description provided for @noIngredients.
  ///
  /// In en, this message translates to:
  /// **'No ingredients yet'**
  String get noIngredients;

  /// No description provided for @addIngredientsHint.
  ///
  /// In en, this message translates to:
  /// **'Add ingredients by taking a photo'**
  String get addIngredientsHint;

  /// No description provided for @kitchenCustomTitle.
  ///
  /// In en, this message translates to:
  /// **'Or Type a Specific Cuisine:'**
  String get kitchenCustomTitle;

  /// No description provided for @kitchenCustomHint.
  ///
  /// In en, this message translates to:
  /// **'Ex: Korean, Aegean...'**
  String get kitchenCustomHint;

  /// No description provided for @clearSelection.
  ///
  /// In en, this message translates to:
  /// **'Clear Selection'**
  String get clearSelection;

  /// No description provided for @selected.
  ///
  /// In en, this message translates to:
  /// **'Selected'**
  String get selected;

  /// No description provided for @delete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get delete;

  /// No description provided for @worldCuisineSelection.
  ///
  /// In en, this message translates to:
  /// **'World Cuisine Selection'**
  String get worldCuisineSelection;

  /// No description provided for @pantryTitle.
  ///
  /// In en, this message translates to:
  /// **'My Ingredients'**
  String get pantryTitle;

  /// No description provided for @addIngredient.
  ///
  /// In en, this message translates to:
  /// **'Add Ingredient'**
  String get addIngredient;

  /// No description provided for @manualAdd.
  ///
  /// In en, this message translates to:
  /// **'Add Manually'**
  String get manualAdd;

  /// No description provided for @manualAddSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Type ingredient name to add'**
  String get manualAddSubtitle;

  /// No description provided for @scanReceipt.
  ///
  /// In en, this message translates to:
  /// **'Scan Receipt'**
  String get scanReceipt;

  /// No description provided for @scanReceiptSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Auto import from receipt'**
  String get scanReceiptSubtitle;

  /// No description provided for @photoAdd.
  ///
  /// In en, this message translates to:
  /// **'Add with Photo'**
  String get photoAdd;

  /// No description provided for @photoAddSubtitle.
  ///
  /// In en, this message translates to:
  /// **'AI auto recognition'**
  String get photoAddSubtitle;

  /// No description provided for @photoIngredientAdd.
  ///
  /// In en, this message translates to:
  /// **'Add Ingredient with Photo'**
  String get photoIngredientAdd;

  /// No description provided for @ingredientAdded.
  ///
  /// In en, this message translates to:
  /// **'Ingredient added'**
  String get ingredientAdded;

  /// No description provided for @ingredientsAddedCount.
  ///
  /// In en, this message translates to:
  /// **'{count} ingredients added!'**
  String ingredientsAddedCount(Object count);

  /// No description provided for @ingredientNotDetected.
  ///
  /// In en, this message translates to:
  /// **'Ingredient not detected'**
  String get ingredientNotDetected;

  /// No description provided for @aiAnalyzing.
  ///
  /// In en, this message translates to:
  /// **'AI Analyzing...'**
  String get aiAnalyzing;

  /// No description provided for @ingredientName.
  ///
  /// In en, this message translates to:
  /// **'Ingredient Name'**
  String get ingredientName;

  /// No description provided for @quantity.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get quantity;

  /// No description provided for @unitLabel.
  ///
  /// In en, this message translates to:
  /// **'Unit'**
  String get unitLabel;

  /// No description provided for @expiryDateOptional.
  ///
  /// In en, this message translates to:
  /// **'Expiry Date (Optional)'**
  String get expiryDateOptional;

  /// No description provided for @expiryDateLabel.
  ///
  /// In en, this message translates to:
  /// **'Exp: {day}/{month}/{year}'**
  String expiryDateLabel(Object day, Object month, Object year);

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @deleteConfirmTitle.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete?'**
  String get deleteConfirmTitle;

  /// No description provided for @deleteConfirmMessage.
  ///
  /// In en, this message translates to:
  /// **'{name} will be removed from your pantry.'**
  String deleteConfirmMessage(Object name);

  /// No description provided for @allIngredients.
  ///
  /// In en, this message translates to:
  /// **'All Ingredients'**
  String get allIngredients;

  /// No description provided for @expiringSoonCount.
  ///
  /// In en, this message translates to:
  /// **'Expiring Soon ({count})'**
  String expiringSoonCount(Object count);

  /// No description provided for @pantryEmpty.
  ///
  /// In en, this message translates to:
  /// **'Your pantry is empty'**
  String get pantryEmpty;

  /// No description provided for @pantryEmptySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Start by adding ingredients'**
  String get pantryEmptySubtitle;

  /// No description provided for @noExpiringItems.
  ///
  /// In en, this message translates to:
  /// **'No items expiring soon!'**
  String get noExpiringItems;

  /// No description provided for @allItemsFresh.
  ///
  /// In en, this message translates to:
  /// **'All items are fresh!'**
  String get allItemsFresh;

  /// No description provided for @addToList.
  ///
  /// In en, this message translates to:
  /// **'Add to List'**
  String get addToList;

  /// No description provided for @addedToShoppingList.
  ///
  /// In en, this message translates to:
  /// **'{name} added to shopping list'**
  String addedToShoppingList(Object name);

  /// No description provided for @ok.
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get ok;

  /// No description provided for @loginRequired.
  ///
  /// In en, this message translates to:
  /// **'You must log in to use this feature'**
  String get loginRequired;

  /// No description provided for @pantryEmptyAddFirst.
  ///
  /// In en, this message translates to:
  /// **'Your pantry is empty, add ingredients first'**
  String get pantryEmptyAddFirst;

  /// No description provided for @errorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Error: {error}'**
  String errorGeneric(Object error);

  /// No description provided for @notifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notifications;

  /// No description provided for @markAllRead.
  ///
  /// In en, this message translates to:
  /// **'Mark All Read'**
  String get markAllRead;

  /// No description provided for @noNotifications.
  ///
  /// In en, this message translates to:
  /// **'No notifications yet'**
  String get noNotifications;

  /// No description provided for @noNotificationsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Important updates will appear here'**
  String get noNotificationsSubtitle;

  /// No description provided for @justNow.
  ///
  /// In en, this message translates to:
  /// **'Just now'**
  String get justNow;

  /// No description provided for @minutesAgo.
  ///
  /// In en, this message translates to:
  /// **'{minutes} min ago'**
  String minutesAgo(Object minutes);

  /// No description provided for @hoursAgo.
  ///
  /// In en, this message translates to:
  /// **'{hours} hr ago'**
  String hoursAgo(Object hours);

  /// No description provided for @yesterdayLabel.
  ///
  /// In en, this message translates to:
  /// **'Yesterday'**
  String get yesterdayLabel;

  /// No description provided for @shoppingListTitle.
  ///
  /// In en, this message translates to:
  /// **'Shopping List'**
  String get shoppingListTitle;

  /// No description provided for @addIngredientHint.
  ///
  /// In en, this message translates to:
  /// **'Add ingredient...'**
  String get addIngredientHint;

  /// No description provided for @itemAlreadyExists.
  ///
  /// In en, this message translates to:
  /// **'This item is already in your list!'**
  String get itemAlreadyExists;

  /// No description provided for @deleteCheckedTitle.
  ///
  /// In en, this message translates to:
  /// **'Delete Checked Items'**
  String get deleteCheckedTitle;

  /// No description provided for @deleteCheckedMessage.
  ///
  /// In en, this message translates to:
  /// **'{count} checked items will be deleted. Are you sure?'**
  String deleteCheckedMessage(Object count);

  /// No description provided for @deleteSelectedTitle.
  ///
  /// In en, this message translates to:
  /// **'Delete Selected'**
  String get deleteSelectedTitle;

  /// No description provided for @deleteSelectedMessage.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete {count} items?'**
  String deleteSelectedMessage(Object count);

  /// No description provided for @selectedCount.
  ///
  /// In en, this message translates to:
  /// **'{count} selected'**
  String selectedCount(Object count);

  /// No description provided for @selectAll.
  ///
  /// In en, this message translates to:
  /// **'Select All'**
  String get selectAll;

  /// No description provided for @shareLabel.
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get shareLabel;

  /// No description provided for @shareList.
  ///
  /// In en, this message translates to:
  /// **'Share List'**
  String get shareList;

  /// No description provided for @multiSelect.
  ///
  /// In en, this message translates to:
  /// **'Multi Select'**
  String get multiSelect;

  /// No description provided for @deleteChecked.
  ///
  /// In en, this message translates to:
  /// **'Delete Checked'**
  String get deleteChecked;

  /// No description provided for @shoppingListEmpty.
  ///
  /// In en, this message translates to:
  /// **'Shopping List Empty'**
  String get shoppingListEmpty;

  /// No description provided for @shoppingListEmptySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Start by adding what you need to buy'**
  String get shoppingListEmptySubtitle;

  /// No description provided for @purchasedCount.
  ///
  /// In en, this message translates to:
  /// **'Purchased ({count})'**
  String purchasedCount(Object count);

  /// No description provided for @listCopied.
  ///
  /// In en, this message translates to:
  /// **'List copied!'**
  String get listCopied;

  /// No description provided for @selectedItems.
  ///
  /// In en, this message translates to:
  /// **'Selected:'**
  String get selectedItems;

  /// No description provided for @itemsToBuy.
  ///
  /// In en, this message translates to:
  /// **'To Buy:'**
  String get itemsToBuy;

  /// No description provided for @editItem.
  ///
  /// In en, this message translates to:
  /// **'Edit Item'**
  String get editItem;

  /// No description provided for @itemName.
  ///
  /// In en, this message translates to:
  /// **'Item Name'**
  String get itemName;

  /// No description provided for @editLabel.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get editLabel;

  /// No description provided for @smartStockAnalysis.
  ///
  /// In en, this message translates to:
  /// **'Smart Stock Analysis'**
  String get smartStockAnalysis;

  /// No description provided for @statsLoadError.
  ///
  /// In en, this message translates to:
  /// **'Could not load statistics'**
  String get statsLoadError;

  /// No description provided for @tryAgain.
  ///
  /// In en, this message translates to:
  /// **'Try Again'**
  String get tryAgain;

  /// No description provided for @totalProducts.
  ///
  /// In en, this message translates to:
  /// **'Total Products'**
  String get totalProducts;

  /// No description provided for @expiringSoonLabel.
  ///
  /// In en, this message translates to:
  /// **'Expiring Soon'**
  String get expiringSoonLabel;

  /// No description provided for @expiredLabel.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get expiredLabel;

  /// No description provided for @categoriesLabel.
  ///
  /// In en, this message translates to:
  /// **'Categories'**
  String get categoriesLabel;

  /// No description provided for @categoryDistribution.
  ///
  /// In en, this message translates to:
  /// **'Category Distribution'**
  String get categoryDistribution;

  /// No description provided for @noData.
  ///
  /// In en, this message translates to:
  /// **'No data'**
  String get noData;

  /// No description provided for @wastePreventionScore.
  ///
  /// In en, this message translates to:
  /// **'Waste Prevention Score'**
  String get wastePreventionScore;

  /// No description provided for @scoreGreat.
  ///
  /// In en, this message translates to:
  /// **'You\'re doing great!'**
  String get scoreGreat;

  /// No description provided for @scoreWarning.
  ///
  /// In en, this message translates to:
  /// **'Warning! High waste risk.'**
  String get scoreWarning;

  /// No description provided for @scoreBetter.
  ///
  /// In en, this message translates to:
  /// **'Could be better.'**
  String get scoreBetter;

  /// No description provided for @wastePreventionSubtitle.
  ///
  /// In en, this message translates to:
  /// **'You\'re preventing food waste by using your pantry efficiently.'**
  String get wastePreventionSubtitle;

  /// No description provided for @productsCount.
  ///
  /// In en, this message translates to:
  /// **'{count} products'**
  String productsCount(Object count);

  /// No description provided for @manageSubscriptionTitle.
  ///
  /// In en, this message translates to:
  /// **'Manage Subscription'**
  String get manageSubscriptionTitle;

  /// No description provided for @activeStatus.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get activeStatus;

  /// No description provided for @startDate.
  ///
  /// In en, this message translates to:
  /// **'Start Date'**
  String get startDate;

  /// No description provided for @statusLabel.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get statusLabel;

  /// No description provided for @autoRenews.
  ///
  /// In en, this message translates to:
  /// **'Auto Renews'**
  String get autoRenews;

  /// No description provided for @changePlan.
  ///
  /// In en, this message translates to:
  /// **'Change or Cancel Plan'**
  String get changePlan;

  /// No description provided for @changePlanDescription.
  ///
  /// In en, this message translates to:
  /// **'You will be redirected to store settings to cancel or change your subscription. Payments and renewals are managed directly by the store.'**
  String get changePlanDescription;

  /// No description provided for @platformLabel.
  ///
  /// In en, this message translates to:
  /// **'Platform'**
  String get platformLabel;

  /// No description provided for @filterEasy.
  ///
  /// In en, this message translates to:
  /// **'Easy'**
  String get filterEasy;

  /// No description provided for @filterFast.
  ///
  /// In en, this message translates to:
  /// **'Fast (<30min)'**
  String get filterFast;

  /// No description provided for @filterLowCal.
  ///
  /// In en, this message translates to:
  /// **'Low Calorie'**
  String get filterLowCal;

  /// No description provided for @minuteAbbr.
  ///
  /// In en, this message translates to:
  /// **'min'**
  String get minuteAbbr;

  /// No description provided for @stockAnalysis.
  ///
  /// In en, this message translates to:
  /// **'Stock Analysis'**
  String get stockAnalysis;

  /// No description provided for @suggestRecipe.
  ///
  /// In en, this message translates to:
  /// **'Suggest Recipe'**
  String get suggestRecipe;

  /// No description provided for @categoryVegetables.
  ///
  /// In en, this message translates to:
  /// **'Vegetables'**
  String get categoryVegetables;

  /// No description provided for @categoryFruits.
  ///
  /// In en, this message translates to:
  /// **'Fruits'**
  String get categoryFruits;

  /// No description provided for @categoryMeat.
  ///
  /// In en, this message translates to:
  /// **'Meat & Poultry'**
  String get categoryMeat;

  /// No description provided for @categorySeafood.
  ///
  /// In en, this message translates to:
  /// **'Seafood'**
  String get categorySeafood;

  /// No description provided for @categoryDairy.
  ///
  /// In en, this message translates to:
  /// **'Dairy'**
  String get categoryDairy;

  /// No description provided for @categoryEggs.
  ///
  /// In en, this message translates to:
  /// **'Eggs'**
  String get categoryEggs;

  /// No description provided for @categoryGrains.
  ///
  /// In en, this message translates to:
  /// **'Grains'**
  String get categoryGrains;

  /// No description provided for @categoryLegumes.
  ///
  /// In en, this message translates to:
  /// **'Legumes'**
  String get categoryLegumes;

  /// No description provided for @categoryPasta.
  ///
  /// In en, this message translates to:
  /// **'Pasta & Noodles'**
  String get categoryPasta;

  /// No description provided for @categoryBakery.
  ///
  /// In en, this message translates to:
  /// **'Bread & Bakery'**
  String get categoryBakery;

  /// No description provided for @categorySpices.
  ///
  /// In en, this message translates to:
  /// **'Spices'**
  String get categorySpices;

  /// No description provided for @categorySauces.
  ///
  /// In en, this message translates to:
  /// **'Sauces & Condiments'**
  String get categorySauces;

  /// No description provided for @categoryOils.
  ///
  /// In en, this message translates to:
  /// **'Oils'**
  String get categoryOils;

  /// No description provided for @categoryBeverages.
  ///
  /// In en, this message translates to:
  /// **'Beverages'**
  String get categoryBeverages;

  /// No description provided for @categorySnacks.
  ///
  /// In en, this message translates to:
  /// **'Snacks'**
  String get categorySnacks;

  /// No description provided for @categoryNuts.
  ///
  /// In en, this message translates to:
  /// **'Nuts'**
  String get categoryNuts;

  /// No description provided for @categoryFrozen.
  ///
  /// In en, this message translates to:
  /// **'Frozen'**
  String get categoryFrozen;

  /// No description provided for @categoryCanned.
  ///
  /// In en, this message translates to:
  /// **'Canned'**
  String get categoryCanned;

  /// No description provided for @categorySweets.
  ///
  /// In en, this message translates to:
  /// **'Sweets & Sugar'**
  String get categorySweets;

  /// No description provided for @categoryOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get categoryOther;

  /// No description provided for @expiryUnknown.
  ///
  /// In en, this message translates to:
  /// **'Unknown'**
  String get expiryUnknown;

  /// No description provided for @expiryExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get expiryExpired;

  /// No description provided for @expiryToday.
  ///
  /// In en, this message translates to:
  /// **'Today!'**
  String get expiryToday;

  /// No description provided for @expiryTomorrow.
  ///
  /// In en, this message translates to:
  /// **'Tomorrow'**
  String get expiryTomorrow;

  /// No description provided for @expiryDays.
  ///
  /// In en, this message translates to:
  /// **'{days} days'**
  String expiryDays(Object days);

  /// No description provided for @unitAdet.
  ///
  /// In en, this message translates to:
  /// **'pcs'**
  String get unitAdet;

  /// No description provided for @unitKg.
  ///
  /// In en, this message translates to:
  /// **'kg'**
  String get unitKg;

  /// No description provided for @unitG.
  ///
  /// In en, this message translates to:
  /// **'g'**
  String get unitG;

  /// No description provided for @unitL.
  ///
  /// In en, this message translates to:
  /// **'L'**
  String get unitL;

  /// No description provided for @unitMl.
  ///
  /// In en, this message translates to:
  /// **'ml'**
  String get unitMl;

  /// No description provided for @unitDemet.
  ///
  /// In en, this message translates to:
  /// **'bunch'**
  String get unitDemet;

  /// No description provided for @unitPaket.
  ///
  /// In en, this message translates to:
  /// **'pack'**
  String get unitPaket;

  /// No description provided for @unitKavanoz.
  ///
  /// In en, this message translates to:
  /// **'jar'**
  String get unitKavanoz;

  /// No description provided for @errorImageAnalysisFailed.
  ///
  /// In en, this message translates to:
  /// **'Image analysis failed'**
  String get errorImageAnalysisFailed;

  /// No description provided for @errorFeatureLocked.
  ///
  /// In en, this message translates to:
  /// **'This feature is not available in your plan.'**
  String get errorFeatureLocked;

  /// No description provided for @errorLimitExceeded.
  ///
  /// In en, this message translates to:
  /// **'Daily limit exceeded.'**
  String get errorLimitExceeded;

  /// No description provided for @errorNoIngredients.
  ///
  /// In en, this message translates to:
  /// **'Please select at least one ingredient.'**
  String get errorNoIngredients;

  /// No description provided for @errorConnectionTimeout.
  ///
  /// In en, this message translates to:
  /// **'Connection timeout. Please try again.'**
  String get errorConnectionTimeout;

  /// No description provided for @errorServerConnection.
  ///
  /// In en, this message translates to:
  /// **'Could not connect to server: {error}'**
  String errorServerConnection(Object error);

  /// No description provided for @errorRecipeSuggestionFailed.
  ///
  /// In en, this message translates to:
  /// **'Recipe suggestion failed'**
  String get errorRecipeSuggestionFailed;

  /// No description provided for @errorTrialExpired.
  ///
  /// In en, this message translates to:
  /// **'Your free trial has expired.'**
  String get errorTrialExpired;

  /// No description provided for @errorRecipeLimitExceeded.
  ///
  /// In en, this message translates to:
  /// **'Daily recipe search limit exceeded.'**
  String get errorRecipeLimitExceeded;

  /// No description provided for @errorDetailedRecipeLocked.
  ///
  /// In en, this message translates to:
  /// **'Detailed recipes are exclusive to the Pro plan.'**
  String get errorDetailedRecipeLocked;

  /// No description provided for @errorRecipeDetailFailed.
  ///
  /// In en, this message translates to:
  /// **'Could not get recipe details: {error}'**
  String errorRecipeDetailFailed(Object error);

  /// No description provided for @errorVerifyFailed.
  ///
  /// In en, this message translates to:
  /// **'Verification failed: Unexpected response.'**
  String get errorVerifyFailed;

  /// No description provided for @errorSubscriptionVerifyFailed.
  ///
  /// In en, this message translates to:
  /// **'Subscription could not be verified: {error}'**
  String errorSubscriptionVerifyFailed(Object error);

  /// No description provided for @verifyEmailTitle.
  ///
  /// In en, this message translates to:
  /// **'Verify Your Email'**
  String get verifyEmailTitle;

  /// No description provided for @verifyEmailSubtitle.
  ///
  /// In en, this message translates to:
  /// **'We sent a verification link to {email}. Please check your inbox and spam folder.'**
  String verifyEmailSubtitle(Object email);

  /// No description provided for @verifiedButton.
  ///
  /// In en, this message translates to:
  /// **'I Verified My Email, Log In'**
  String get verifiedButton;

  /// No description provided for @scanIngredientTitle.
  ///
  /// In en, this message translates to:
  /// **'Scan Ingredients'**
  String get scanIngredientTitle;

  /// No description provided for @analyzeIngredients.
  ///
  /// In en, this message translates to:
  /// **'Analyze Ingredients'**
  String get analyzeIngredients;

  /// No description provided for @uploadIngredients.
  ///
  /// In en, this message translates to:
  /// **'Upload Ingredients'**
  String get uploadIngredients;

  /// No description provided for @aiWillRecognize.
  ///
  /// In en, this message translates to:
  /// **'AI will recognize all ingredients'**
  String get aiWillRecognize;

  /// No description provided for @cameraLabel.
  ///
  /// In en, this message translates to:
  /// **'Camera'**
  String get cameraLabel;

  /// No description provided for @takePhotoAction.
  ///
  /// In en, this message translates to:
  /// **'Take a photo'**
  String get takePhotoAction;

  /// No description provided for @galleryLabel.
  ///
  /// In en, this message translates to:
  /// **'Gallery'**
  String get galleryLabel;

  /// No description provided for @selectPhoto.
  ///
  /// In en, this message translates to:
  /// **'Select a photo'**
  String get selectPhoto;

  /// No description provided for @ensureVisible.
  ///
  /// In en, this message translates to:
  /// **'Make sure all ingredients are visible'**
  String get ensureVisible;

  /// No description provided for @selectDifferentPhoto.
  ///
  /// In en, this message translates to:
  /// **'Select Different Photo'**
  String get selectDifferentPhoto;

  /// No description provided for @imageCouldNotBeSelected.
  ///
  /// In en, this message translates to:
  /// **'Image could not be selected: {error}'**
  String imageCouldNotBeSelected(Object error);

  /// No description provided for @photoReady.
  ///
  /// In en, this message translates to:
  /// **'Photo ready'**
  String get photoReady;

  /// No description provided for @identifyingIngredients.
  ///
  /// In en, this message translates to:
  /// **'Identifying ingredients'**
  String get identifyingIngredients;

  /// No description provided for @stepsLoading.
  ///
  /// In en, this message translates to:
  /// **'Recipe Steps Preparing...'**
  String get stepsLoading;

  /// No description provided for @pleaseWaitOrRetry.
  ///
  /// In en, this message translates to:
  /// **'Please wait or try again later.'**
  String get pleaseWaitOrRetry;

  /// No description provided for @timerLabel.
  ///
  /// In en, this message translates to:
  /// **'Timer'**
  String get timerLabel;

  /// No description provided for @stopTimerQuestion.
  ///
  /// In en, this message translates to:
  /// **'Do you want to stop the timer?'**
  String get stopTimerQuestion;

  /// No description provided for @noLabel.
  ///
  /// In en, this message translates to:
  /// **'No'**
  String get noLabel;

  /// No description provided for @yesStop.
  ///
  /// In en, this message translates to:
  /// **'Yes, Stop'**
  String get yesStop;

  /// No description provided for @stepProgress.
  ///
  /// In en, this message translates to:
  /// **'STEP {current} / {total}  ({completed} completed)'**
  String stepProgress(Object completed, Object current, Object total);

  /// No description provided for @stepCompletedLabel.
  ///
  /// In en, this message translates to:
  /// **'STEP {number} ✓'**
  String stepCompletedLabel(Object number);

  /// No description provided for @stepNumberLabel.
  ///
  /// In en, this message translates to:
  /// **'STEP {number}'**
  String stepNumberLabel(Object number);

  /// No description provided for @readStepAloud.
  ///
  /// In en, this message translates to:
  /// **'Read Step Aloud'**
  String get readStepAloud;

  /// No description provided for @completedLabel.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get completedLabel;

  /// No description provided for @finishCookingAction.
  ///
  /// In en, this message translates to:
  /// **'Finish Cooking'**
  String get finishCookingAction;

  /// No description provided for @listeningLabel.
  ///
  /// In en, this message translates to:
  /// **'Listening...'**
  String get listeningLabel;

  /// No description provided for @thinkingLabel.
  ///
  /// In en, this message translates to:
  /// **'Thinking...'**
  String get thinkingLabel;

  /// No description provided for @errorOccurred.
  ///
  /// In en, this message translates to:
  /// **'An error occurred.'**
  String get errorOccurred;

  /// No description provided for @askSomething.
  ///
  /// In en, this message translates to:
  /// **'Ask something...'**
  String get askSomething;

  /// No description provided for @chefAssistant.
  ///
  /// In en, this message translates to:
  /// **'Chef Assistant'**
  String get chefAssistant;

  /// No description provided for @chatEmptyHint.
  ///
  /// In en, this message translates to:
  /// **'You can ask about things you\'re stuck on with the recipe.\nE.g: \"Read step 2 again\" or \"What temperature for the oven?\"'**
  String get chatEmptyHint;

  /// No description provided for @timerFinished.
  ///
  /// In en, this message translates to:
  /// **'Time\'s Up! 🍽️'**
  String get timerFinished;

  /// No description provided for @timerFinishedBody.
  ///
  /// In en, this message translates to:
  /// **'The timer you set for {title} has finished.'**
  String timerFinishedBody(Object title);

  /// No description provided for @timeUpCheckFood.
  ///
  /// In en, this message translates to:
  /// **'Time\'s up! Check your food.'**
  String get timeUpCheckFood;

  /// No description provided for @detailedRecipe.
  ///
  /// In en, this message translates to:
  /// **'Detailed Recipe'**
  String get detailedRecipe;

  /// No description provided for @detailedRecipeLoadFailed.
  ///
  /// In en, this message translates to:
  /// **'Could not load detailed recipe: {error}'**
  String detailedRecipeLoadFailed(Object error);

  /// No description provided for @turkishCuisine.
  ///
  /// In en, this message translates to:
  /// **'Turkish Cuisine'**
  String get turkishCuisine;

  /// No description provided for @optionalLabel.
  ///
  /// In en, this message translates to:
  /// **'optional'**
  String get optionalLabel;

  /// No description provided for @instructionsNotFound.
  ///
  /// In en, this message translates to:
  /// **'Instructions not found.'**
  String get instructionsNotFound;

  /// No description provided for @viewDetails.
  ///
  /// In en, this message translates to:
  /// **'View Details & Preparation'**
  String get viewDetails;

  /// No description provided for @ingredientsLoading.
  ///
  /// In en, this message translates to:
  /// **'Ingredient info loading...'**
  String get ingredientsLoading;

  /// No description provided for @addToShoppingList.
  ///
  /// In en, this message translates to:
  /// **'Add to Shopping List'**
  String get addToShoppingList;

  /// No description provided for @addingToList.
  ///
  /// In en, this message translates to:
  /// **'Adding ingredients to list...'**
  String get addingToList;

  /// No description provided for @ingredientsAddedToList.
  ///
  /// In en, this message translates to:
  /// **'{count} ingredients added to shopping list!'**
  String ingredientsAddedToList(Object count);

  /// No description provided for @errorOrEmptyList.
  ///
  /// In en, this message translates to:
  /// **'An error occurred or list is empty.'**
  String get errorOrEmptyList;

  /// No description provided for @chefIngredientTip.
  ///
  /// In en, this message translates to:
  /// **'Chef\'s Ingredient Tip'**
  String get chefIngredientTip;

  /// No description provided for @chefTipDescription.
  ///
  /// In en, this message translates to:
  /// **'We prepared this recipe with your available ingredients but note: If you have {ingredients}, adding them would take the flavor much further! ✨'**
  String chefTipDescription(Object ingredients);

  /// No description provided for @tipsPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Chef\'s special tips will appear here with the detailed recipe.'**
  String get tipsPlaceholder;

  /// No description provided for @quickLabel.
  ///
  /// In en, this message translates to:
  /// **'Quick'**
  String get quickLabel;

  /// No description provided for @detailedLabel.
  ///
  /// In en, this message translates to:
  /// **'Detailed'**
  String get detailedLabel;

  /// No description provided for @preparingLabel.
  ///
  /// In en, this message translates to:
  /// **'Preparing...'**
  String get preparingLabel;

  /// No description provided for @requestDetailedRecipe.
  ///
  /// In en, this message translates to:
  /// **'Request Detailed Recipe'**
  String get requestDetailedRecipe;

  /// No description provided for @requestQuickRecipe.
  ///
  /// In en, this message translates to:
  /// **'Quick Recipe'**
  String get requestQuickRecipe;

  /// No description provided for @caloriesPerServing.
  ///
  /// In en, this message translates to:
  /// **'{calories} kcal / serving'**
  String caloriesPerServing(Object calories);

  /// No description provided for @personSuffix.
  ///
  /// In en, this message translates to:
  /// **'person'**
  String get personSuffix;

  /// No description provided for @receiptScanTitle.
  ///
  /// In en, this message translates to:
  /// **'Scan Receipt'**
  String get receiptScanTitle;

  /// No description provided for @tapToSelectReceipt.
  ///
  /// In en, this message translates to:
  /// **'Tap to select receipt photo'**
  String get tapToSelectReceipt;

  /// No description provided for @openCamera.
  ///
  /// In en, this message translates to:
  /// **'Open Camera'**
  String get openCamera;

  /// No description provided for @analyzingReceipt.
  ///
  /// In en, this message translates to:
  /// **'Analyzing receipt...\nThis may take a few seconds.'**
  String get analyzingReceipt;

  /// No description provided for @foundProducts.
  ///
  /// In en, this message translates to:
  /// **'Found Products ({count})'**
  String foundProducts(Object count);

  /// No description provided for @totalAmount.
  ///
  /// In en, this message translates to:
  /// **'Total: {amount} TL'**
  String totalAmount(Object amount);

  /// No description provided for @noProductsFound.
  ///
  /// In en, this message translates to:
  /// **'No products found.'**
  String get noProductsFound;

  /// No description provided for @addAllToPantry.
  ///
  /// In en, this message translates to:
  /// **'Add All to Pantry'**
  String get addAllToPantry;

  /// No description provided for @receiptAnalysisFailed.
  ///
  /// In en, this message translates to:
  /// **'Receipt analysis failed or no products found.'**
  String get receiptAnalysisFailed;

  /// No description provided for @productsAddedToPantry.
  ///
  /// In en, this message translates to:
  /// **'{count} products added to pantry.'**
  String productsAddedToPantry(Object count);

  /// No description provided for @voiceAssistantTitle.
  ///
  /// In en, this message translates to:
  /// **'Voice Assistant'**
  String get voiceAssistantTitle;

  /// No description provided for @clearChat.
  ///
  /// In en, this message translates to:
  /// **'Clear Chat'**
  String get clearChat;

  /// No description provided for @chatCleared.
  ///
  /// In en, this message translates to:
  /// **'Chat cleared. How can I help you?'**
  String get chatCleared;

  /// No description provided for @tapMicAndSpeak.
  ///
  /// In en, this message translates to:
  /// **'Tap the mic and speak'**
  String get tapMicAndSpeak;

  /// No description provided for @recipesStepsNotLoaded.
  ///
  /// In en, this message translates to:
  /// **'Recipe steps could not be loaded.'**
  String get recipesStepsNotLoaded;

  /// No description provided for @speechNotAvailable.
  ///
  /// In en, this message translates to:
  /// **'Speech to text not available'**
  String get speechNotAvailable;

  /// No description provided for @welcomeMessage.
  ///
  /// In en, this message translates to:
  /// **'Hi! I\'m your chef assistant. How can I help?'**
  String get welcomeMessage;

  /// No description provided for @speakingLabel.
  ///
  /// In en, this message translates to:
  /// **'Speaking...'**
  String get speakingLabel;

  /// No description provided for @quickItemBread.
  ///
  /// In en, this message translates to:
  /// **'Bread'**
  String get quickItemBread;

  /// No description provided for @quickItemMilk.
  ///
  /// In en, this message translates to:
  /// **'Milk'**
  String get quickItemMilk;

  /// No description provided for @quickItemEgg.
  ///
  /// In en, this message translates to:
  /// **'Egg'**
  String get quickItemEgg;

  /// No description provided for @quickItemWater.
  ///
  /// In en, this message translates to:
  /// **'Water'**
  String get quickItemWater;

  /// No description provided for @quickItemTomato.
  ///
  /// In en, this message translates to:
  /// **'Tomato'**
  String get quickItemTomato;

  /// No description provided for @quickItemCheese.
  ///
  /// In en, this message translates to:
  /// **'Cheese'**
  String get quickItemCheese;

  /// No description provided for @quickItemYogurt.
  ///
  /// In en, this message translates to:
  /// **'Yogurt'**
  String get quickItemYogurt;

  /// No description provided for @quickItemPasta.
  ///
  /// In en, this message translates to:
  /// **'Pasta'**
  String get quickItemPasta;

  /// No description provided for @suitablePlans.
  ///
  /// In en, this message translates to:
  /// **'Suitable Plans'**
  String get suitablePlans;

  /// No description provided for @reviewPlans.
  ///
  /// In en, this message translates to:
  /// **'Review Plans'**
  String get reviewPlans;

  /// No description provided for @later.
  ///
  /// In en, this message translates to:
  /// **'Later'**
  String get later;

  /// No description provided for @dietType.
  ///
  /// In en, this message translates to:
  /// **'Diet Type'**
  String get dietType;

  /// No description provided for @otherAllergyHint.
  ///
  /// In en, this message translates to:
  /// **'Other (e.g. Mushrooms)'**
  String get otherAllergyHint;

  /// No description provided for @apply.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get apply;

  /// No description provided for @cuisineTurkish.
  ///
  /// In en, this message translates to:
  /// **'Turkish'**
  String get cuisineTurkish;

  /// No description provided for @cuisineItalian.
  ///
  /// In en, this message translates to:
  /// **'Italian'**
  String get cuisineItalian;

  /// No description provided for @cuisineAsian.
  ///
  /// In en, this message translates to:
  /// **'Asian'**
  String get cuisineAsian;

  /// No description provided for @cuisineMexican.
  ///
  /// In en, this message translates to:
  /// **'Mexican'**
  String get cuisineMexican;

  /// No description provided for @mealBreakfast.
  ///
  /// In en, this message translates to:
  /// **'Breakfast'**
  String get mealBreakfast;

  /// No description provided for @mealDinner.
  ///
  /// In en, this message translates to:
  /// **'Dinner'**
  String get mealDinner;

  /// No description provided for @mealSnack.
  ///
  /// In en, this message translates to:
  /// **'Snack'**
  String get mealSnack;

  /// No description provided for @statTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get statTotal;

  /// No description provided for @errorLoginFailed.
  ///
  /// In en, this message translates to:
  /// **'Login failed. Please check your email and password.'**
  String get errorLoginFailed;

  /// No description provided for @errorConnection.
  ///
  /// In en, this message translates to:
  /// **'Could not connect to server. Please check your internet connection.'**
  String get errorConnection;

  /// No description provided for @errorTimeout.
  ///
  /// In en, this message translates to:
  /// **'Connection timed out. Please try again.'**
  String get errorTimeout;

  /// No description provided for @errorServer.
  ///
  /// In en, this message translates to:
  /// **'Server error. Please try again later.'**
  String get errorServer;

  /// No description provided for @errorUnknown.
  ///
  /// In en, this message translates to:
  /// **'An unknown error occurred.'**
  String get errorUnknown;

  /// No description provided for @errorAccessDenied.
  ///
  /// In en, this message translates to:
  /// **'Access denied.'**
  String get errorAccessDenied;

  /// No description provided for @restrictedAccessTitle.
  ///
  /// In en, this message translates to:
  /// **'Access Restricted'**
  String get restrictedAccessTitle;

  /// No description provided for @restrictedAccessMessage.
  ///
  /// In en, this message translates to:
  /// **'Too many device changes detected in your account.'**
  String get restrictedAccessMessage;

  /// No description provided for @restrictedAccessDescription.
  ///
  /// In en, this message translates to:
  /// **'For security reasons, this account has been restricted (Restricted Mode). Please contact support to proceed.'**
  String get restrictedAccessDescription;

  /// No description provided for @getSupport.
  ///
  /// In en, this message translates to:
  /// **'Get Support'**
  String get getSupport;

  /// No description provided for @close.
  ///
  /// In en, this message translates to:
  /// **'Close'**
  String get close;

  /// No description provided for @accountRestrictionTopic.
  ///
  /// In en, this message translates to:
  /// **'Account Restriction'**
  String get accountRestrictionTopic;

  /// No description provided for @liveSupportTitle.
  ///
  /// In en, this message translates to:
  /// **'Live Support'**
  String get liveSupportTitle;

  /// No description provided for @liveSupportSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Write to us with your questions'**
  String get liveSupportSubtitle;

  /// No description provided for @helpQuestion.
  ///
  /// In en, this message translates to:
  /// **'How can we help you?'**
  String get helpQuestion;

  /// No description provided for @topicTechnical.
  ///
  /// In en, this message translates to:
  /// **'Technical Support'**
  String get topicTechnical;

  /// No description provided for @topicPayment.
  ///
  /// In en, this message translates to:
  /// **'Payment & Subscription'**
  String get topicPayment;

  /// No description provided for @topicSuggestion.
  ///
  /// In en, this message translates to:
  /// **'Suggestions & Requests'**
  String get topicSuggestion;

  /// No description provided for @topicOther.
  ///
  /// In en, this message translates to:
  /// **'Other Topics'**
  String get topicOther;

  /// No description provided for @adminPanelTitle.
  ///
  /// In en, this message translates to:
  /// **'Admin Panel (Chat)'**
  String get adminPanelTitle;

  /// No description provided for @adminPanelSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Manage incoming messages'**
  String get adminPanelSubtitle;

  /// No description provided for @servingsCount.
  ///
  /// In en, this message translates to:
  /// **'{count} servings'**
  String servingsCount(int count);

  /// No description provided for @chatUserTitle.
  ///
  /// In en, this message translates to:
  /// **'User Chat'**
  String get chatUserTitle;

  /// No description provided for @chatLiveSupportTitle.
  ///
  /// In en, this message translates to:
  /// **'Live Support'**
  String get chatLiveSupportTitle;

  /// No description provided for @chatEndButtonTooltip.
  ///
  /// In en, this message translates to:
  /// **'End Chat'**
  String get chatEndButtonTooltip;

  /// No description provided for @chatEndDialogTitle.
  ///
  /// In en, this message translates to:
  /// **'End Chat'**
  String get chatEndDialogTitle;

  /// No description provided for @chatEndDialogContext.
  ///
  /// In en, this message translates to:
  /// **'Is your issue resolved? Are you sure you want to end the chat?'**
  String get chatEndDialogContext;

  /// No description provided for @chatEndDialogCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get chatEndDialogCancel;

  /// No description provided for @chatEndDialogConfirm.
  ///
  /// In en, this message translates to:
  /// **'Yes, End Chat'**
  String get chatEndDialogConfirm;

  /// No description provided for @chatNoMessagesHello.
  ///
  /// In en, this message translates to:
  /// **'No messages yet. Say hello! 👋'**
  String get chatNoMessagesHello;

  /// No description provided for @chatHistoryClearedInfo.
  ///
  /// In en, this message translates to:
  /// **'Chat history cleared. 👋'**
  String get chatHistoryClearedInfo;

  /// No description provided for @chatInputHint.
  ///
  /// In en, this message translates to:
  /// **'Type your message...'**
  String get chatInputHint;

  /// No description provided for @adminSupportRequestsTitle.
  ///
  /// In en, this message translates to:
  /// **'Support Requests'**
  String get adminSupportRequestsTitle;

  /// No description provided for @adminNoSupportRequests.
  ///
  /// In en, this message translates to:
  /// **'No support requests yet.'**
  String get adminNoSupportRequests;

  /// No description provided for @adminUserPrefix.
  ///
  /// In en, this message translates to:
  /// **'User: '**
  String get adminUserPrefix;

  /// No description provided for @customTimerChannelName.
  ///
  /// In en, this message translates to:
  /// **'Active Timer'**
  String get customTimerChannelName;

  /// No description provided for @customTimerChannelDescription.
  ///
  /// In en, this message translates to:
  /// **'Cooking timer status'**
  String get customTimerChannelDescription;

  /// No description provided for @timerCookingDescription.
  ///
  /// In en, this message translates to:
  /// **'Cooking...\nYou will be notified when it\'s done.'**
  String get timerCookingDescription;

  /// No description provided for @chefVisionActiveTimer.
  ///
  /// In en, this message translates to:
  /// **'ChefVision Active Timer'**
  String get chefVisionActiveTimer;

  /// No description provided for @timerCookingTitle.
  ///
  /// In en, this message translates to:
  /// **'{title} is cooking...'**
  String timerCookingTitle(Object title);

  /// No description provided for @guestChefName.
  ///
  /// In en, this message translates to:
  /// **'Guest Chef'**
  String get guestChefName;

  /// No description provided for @unregisteredAccount.
  ///
  /// In en, this message translates to:
  /// **'Unregistered Account'**
  String get unregisteredAccount;

  /// No description provided for @guestSignUpDesc.
  ///
  /// In en, this message translates to:
  /// **'Create your free account to save custom recipes, do unlimited AI scans, and build your own Virtual Pantry.'**
  String get guestSignUpDesc;

  /// No description provided for @usageLimitsTitle.
  ///
  /// In en, this message translates to:
  /// **'Remaining Usage Limits'**
  String get usageLimitsTitle;

  /// No description provided for @usageLimitCamera.
  ///
  /// In en, this message translates to:
  /// **'Camera Scanning'**
  String get usageLimitCamera;

  /// No description provided for @usageLimitAiRecipe.
  ///
  /// In en, this message translates to:
  /// **'AI Recipe Request'**
  String get usageLimitAiRecipe;

  /// No description provided for @loginOrRegister.
  ///
  /// In en, this message translates to:
  /// **'Log In or Register'**
  String get loginOrRegister;

  /// No description provided for @err_user_not_found.
  ///
  /// In en, this message translates to:
  /// **'User not found - please log in again'**
  String get err_user_not_found;

  /// No description provided for @err_session_expired_other_device.
  ///
  /// In en, this message translates to:
  /// **'Your session was terminated because you logged in from another device.'**
  String get err_session_expired_other_device;

  /// No description provided for @err_receipt_missing.
  ///
  /// In en, this message translates to:
  /// **'Receipt data is missing.'**
  String get err_receipt_missing;

  /// No description provided for @err_receipt_used_by_another_user.
  ///
  /// In en, this message translates to:
  /// **'This purchase is linked to another account.'**
  String get err_receipt_used_by_another_user;

  /// No description provided for @err_already_pro_other_platform.
  ///
  /// In en, this message translates to:
  /// **'You already have an active subscription from another platform.'**
  String get err_already_pro_other_platform;

  /// No description provided for @err_subscription_expired.
  ///
  /// In en, this message translates to:
  /// **'Your subscription has expired.'**
  String get err_subscription_expired;

  /// No description provided for @err_google_credentials_missing.
  ///
  /// In en, this message translates to:
  /// **'Google Credentials configured wrongly on server.'**
  String get err_google_credentials_missing;

  /// No description provided for @err_google_receipt_invalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid Google verification response.'**
  String get err_google_receipt_invalid;

  /// No description provided for @err_google_verification_failed.
  ///
  /// In en, this message translates to:
  /// **'Google verification failed.'**
  String get err_google_verification_failed;

  /// No description provided for @err_apple_receipt_failed.
  ///
  /// In en, this message translates to:
  /// **'Apple receipt could not be decoded or was rejected by the App Store.'**
  String get err_apple_receipt_failed;

  /// No description provided for @err_platform_not_supported.
  ///
  /// In en, this message translates to:
  /// **'Unsupported platform.'**
  String get err_platform_not_supported;

  /// No description provided for @err_verification_service.
  ///
  /// In en, this message translates to:
  /// **'Verification service error.'**
  String get err_verification_service;

  /// No description provided for @err_verification_failed.
  ///
  /// In en, this message translates to:
  /// **'Verification failed.'**
  String get err_verification_failed;

  /// No description provided for @err_database_update.
  ///
  /// In en, this message translates to:
  /// **'Database update error occurred while updating subscription.'**
  String get err_database_update;

  /// No description provided for @warning_subscription_active_delete.
  ///
  /// In en, this message translates to:
  /// **'Your account has been deleted successfully. However, your active store subscription might still be running! Please remember to cancel it manually from your phone\'s settings.'**
  String get warning_subscription_active_delete;

  /// No description provided for @success_account_deleted.
  ///
  /// In en, this message translates to:
  /// **'Your account has been deleted successfully.'**
  String get success_account_deleted;

  /// No description provided for @err_usage_limit_reached.
  ///
  /// In en, this message translates to:
  /// **'You\'ve reached your free trial limit. Please subscribe for advanced recipes and more.'**
  String get err_usage_limit_reached;

  /// No description provided for @cuisineLabel.
  ///
  /// In en, this message translates to:
  /// **'{cuisine} Cuisine'**
  String cuisineLabel(Object cuisine);

  /// No description provided for @subExpiredTitle.
  ///
  /// In en, this message translates to:
  /// **'Your Subscription Has Expired'**
  String get subExpiredTitle;

  /// No description provided for @subExpiredSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Renew to continue enjoying premium features.'**
  String get subExpiredSubtitle;

  /// No description provided for @subRenew.
  ///
  /// In en, this message translates to:
  /// **'Renew Subscription'**
  String get subRenew;

  /// No description provided for @subExpiredBanner.
  ///
  /// In en, this message translates to:
  /// **'Subscription expired — Tap to renew'**
  String get subExpiredBanner;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>[
        'de',
        'en',
        'es',
        'fr',
        'it',
        'tr'
      ].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'de':
      return AppLocalizationsDe();
    case 'en':
      return AppLocalizationsEn();
    case 'es':
      return AppLocalizationsEs();
    case 'fr':
      return AppLocalizationsFr();
    case 'it':
      return AppLocalizationsIt();
    case 'tr':
      return AppLocalizationsTr();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
