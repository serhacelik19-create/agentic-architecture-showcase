// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Spanish Castilian (`es`).
class AppLocalizationsEs extends AppLocalizations {
  AppLocalizationsEs([String locale = 'es']) : super(locale);

  @override
  String get appTitle => 'ChefVision AI';

  @override
  String get appName => 'ChefVision';

  @override
  String get splashTagline => 'Tu chef inteligente impulsado por IA';

  @override
  String get greetingMorning => 'Buenos Días';

  @override
  String get greetingAfternoon => 'Buenas Tardes';

  @override
  String get greetingEvening => 'Buenas Noches';

  @override
  String get greetingNight => 'Buenas Noches';

  @override
  String get whatToCook => '¿Qué te gustaría cocinar?';

  @override
  String get scanIngredients => 'Escanear Ingredientes';

  @override
  String get scanIngredientsSubtitle =>
      'Fotografía tu nevera, deja que la IA encuentre recetas';

  @override
  String get takePhoto => 'Tomar Foto';

  @override
  String get typeYourself => 'Añadir Manualmente';

  @override
  String get myPantry => 'Mis Ingredientes';

  @override
  String get yourIngredients => 'Tus Ingredientes';

  @override
  String get shoppingList => 'Lista de Compras';

  @override
  String get yourList => 'Tu Lista';

  @override
  String get popularRecipes => 'Sabores Populares';

  @override
  String get viewAll => 'Ver Todo';

  @override
  String get expiryWarningTitle => 'Caducan Pronto';

  @override
  String get expiredWarningTitle => 'Caducado';

  @override
  String itemsExpired(Object count) {
    return '¡$count productos han caducado!';
  }

  @override
  String itemsExpiring(Object count) {
    return '¡$count productos caducan pronto!';
  }

  @override
  String get dailyTip => 'Consejo del Día';

  @override
  String get discover => 'Descubrir';

  @override
  String get discoverSubtitle =>
      '¡Nuevas recetas y secretos de cocina muy pronto!';

  @override
  String get noFavorites => 'Sin Favoritos Aún';

  @override
  String get noFavoritesSubtitle =>
      'Puedes añadir aquí las recetas que te gusten.';

  @override
  String get favoriteRecipes => 'Tus Recetas Favoritas';

  @override
  String get profile => 'Perfil';

  @override
  String get editProfile => 'Editar Perfil';

  @override
  String get home => 'Inicio';

  @override
  String get search => 'Buscar';

  @override
  String get favorites => 'Favoritos';

  @override
  String get settings => 'Ajustes';

  @override
  String get language => 'Idioma';

  @override
  String get selectLanguage => 'Seleccionar Idioma';

  @override
  String get ingredients => 'Ingredientes';

  @override
  String get instructions => 'Instrucciones';

  @override
  String get prepTime => 'Prep';

  @override
  String get recipe => 'Recipe';

  @override
  String get cookTime => 'Cocción';

  @override
  String get servings => 'Porciones';

  @override
  String get difficulty => 'Dificultad';

  @override
  String get calories => 'Calorías';

  @override
  String get startCooking => 'Empezar a Cocinar';

  @override
  String get readAloud => 'Leer en Voz Alta';

  @override
  String get stopReading => 'Detener Lectura';

  @override
  String get pauseReading => 'Pausa';

  @override
  String get resumeReading => 'Reanudar';

  @override
  String get nextStep => 'Siguiente Paso';

  @override
  String get previousStep => 'Paso Anterior';

  @override
  String get finishCooking => 'Terminar Cocción';

  @override
  String get cookingCompleted => '¡Cocción Completada!';

  @override
  String get cookingCompletedSubtitle =>
      '¡Buen provecho! Has preparado una comida deliciosa.';

  @override
  String get bonAppetit => '¡Buen Provecho!';

  @override
  String get backToHomeCaps => 'VOLVER AL INICIO';

  @override
  String get backToHome => 'Volver al Inicio';

  @override
  String get analyzing => 'Analizando...';

  @override
  String get analyzingSubtitle => 'Identificando ingredientes con IA';

  @override
  String get addToPantry => 'Añadir a Despensa';

  @override
  String get retry => 'Reintentar';

  @override
  String get error => 'Error';

  @override
  String get success => 'Éxito';

  @override
  String get itemAdded => 'Producto añadido con éxito';

  @override
  String get itemRemoved => 'Producto eliminado con éxito';

  @override
  String get onboardingTitle1 => 'Escanear Ingredientes';

  @override
  String get onboardingDesc1 =>
      'Fotografía tus ingredientes, deja que la IA los identifique al instante';

  @override
  String get onboardingTitle2 => 'Obtener Recetas';

  @override
  String get onboardingDesc2 =>
      'La IA sugiere las recetas más deliciosas con lo que tienes';

  @override
  String get onboardingTitle3 => 'Asistente de Voz';

  @override
  String get onboardingDesc3 =>
      'Cocina manos libres, obtén recetas y guía paso a paso con comandos de voz';

  @override
  String get skip => 'Saltar';

  @override
  String get start => 'Empezar';

  @override
  String get continueAction => 'Continuar';

  @override
  String iapErrorStarted(Object error) {
    return 'No se pudo iniciar la compra: $error';
  }

  @override
  String get iapErrorVerification =>
      'Falló la verificación (revisa internet). Transacción guardada, se reintentará automáticamente.';

  @override
  String iapErrorGeneral(Object error) {
    return 'Error de compra: $error';
  }

  @override
  String trialRemaining(Object current, Object total) {
    return 'Prueba: $current/$total';
  }

  @override
  String get darkMode => 'Modo Oscuro';

  @override
  String get darkModeSubtitle => 'Cambiar tema de la app';

  @override
  String get foodWaste => 'Reducir Desperdicio';

  @override
  String get foodWasteSubtitle => 'Priorizar ingredientes a punto de caducar';

  @override
  String get maxPrepTime => 'Tiempo Máximo de Preparación';

  @override
  String minutesSuffix(Object minutes) {
    return '$minutes minutos';
  }

  @override
  String get logout => 'Cerrar Sesión';

  @override
  String version(Object version) {
    return 'Versión $version';
  }

  @override
  String get dietaryPreferences => '🥗 Preferencias Dietéticas';

  @override
  String get allergies => '⚠️ Alergias';

  @override
  String get appSettings => '⚙️ Ajustes de la App';

  @override
  String get editAccountInfo => 'Editar Info de Cuenta';

  @override
  String get editAccountInfoSubtitle => 'Nombre, contraseña y foto de perfil';

  @override
  String get subscriptionPlans => 'Ver Planes de Suscripción';

  @override
  String get manageSubscription => 'Gestionar Suscripción';

  @override
  String get premiumDiscover => 'Descubre Funciones Premium';

  @override
  String get premiumSubtitle =>
      'Recetas ilimitadas y funciones especiales con IA.';

  @override
  String subscriptionActive(Object tier) {
    return 'ChefVision $tier Activo';
  }

  @override
  String get subscriptionActiveSubtitle =>
      'Disfruta de los beneficios de tu plan.';

  @override
  String get deleteAccount => 'Eliminar Cuenta';

  @override
  String get deleteAccountWarning =>
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y todos tus datos (despensa, favoritos) se eliminarán permanentemente.';

  @override
  String get deleteAccountConfirm => 'Sí, Eliminar Mi Cuenta';

  @override
  String get deleteAccountCancel => 'Cancelar';

  @override
  String get deleteAccountSuccess => 'Tu cuenta ha sido eliminada con éxito.';

  @override
  String get gourmetUser => 'Usuario Gourmet';

  @override
  String get chefTitleBeginner => 'Aprendiz de Cocina 🌱';

  @override
  String get chefTitleIntermediate => 'Chef Hábil 👨‍🍳';

  @override
  String get chefTitleMaster => 'Chef Principal 👑';

  @override
  String get statFavorites => 'Favoritos';

  @override
  String get statPantry => 'Mis Ingredientes';

  @override
  String get statCooked => 'Cocinados';

  @override
  String get recentSuggestions => '✨ Sugerencias Recientes';

  @override
  String get clearAction => 'Limpiar 🗑️';

  @override
  String get returnToRecipes => 'Volver a Recetas';

  @override
  String get cameraLocked => 'Cámara Bloqueada';

  @override
  String get cameraLockedMessage =>
      'Actualiza a Pro para añadir ingredientes con fotos.';

  @override
  String get pantryTracking => 'Seguimiento de Despensa';

  @override
  String get pantryTrackingMessage =>
      'Actualiza a Pro o Premium para seguir las fechas de caducidad.';

  @override
  String get shoppingListLocked => 'Lista de Compras';

  @override
  String get shoppingListLockedMessage =>
      'Actualiza a Pro o Premium para gestionar tu lista de compras.';

  @override
  String get loginWelcome => 'Bienvenido';

  @override
  String get loginSubtitle => 'Inicia sesión en tu cuenta ChefVision';

  @override
  String get loginFailed => 'Inicio de sesión fallido';

  @override
  String get emailRequired => 'Email requerido';

  @override
  String get emailInvalid => 'Introduce un email válido';

  @override
  String get passwordLabel => 'Contraseña';

  @override
  String get passwordRequired => 'Contraseña requerida';

  @override
  String get passwordMinLength =>
      'La contraseña debe tener al menos 6 caracteres';

  @override
  String get rememberMe => 'Recuérdame';

  @override
  String get forgotPassword => 'Olvidé mi contraseña';

  @override
  String get forgotPasswordSubtitle =>
      'Ingresa tu dirección de correo electrónico para recibir un enlace de restablecimiento de contraseña.';

  @override
  String get sendResetLink => 'Enviar Enlace';

  @override
  String get resetLinkSent =>
      'Enlace de restablecimiento de contraseña enviado. Revisa tu correo electrónico.';

  @override
  String get loginButton => 'Iniciar Sesión';

  @override
  String get noAccount => '¿No tienes cuenta? ';

  @override
  String get registerButton => 'Regístrate gratis';

  @override
  String get registerTitle => 'Crear Cuenta';

  @override
  String get registerSubtitle => '¡Comienza gratis!';

  @override
  String get registerFailed => 'Registro fallido';

  @override
  String get continueAsGuest => 'Continuar como invitado';

  @override
  String get fullName => 'Nombre Completo';

  @override
  String get nameRequired => 'Nombre requerido';

  @override
  String get nameMinLength => 'Mínimo 2 caracteres';

  @override
  String get dietPreferencesOptional => 'Preferencias Dietéticas (Opcional)';

  @override
  String get allergiesOptional => 'Alergias (Opcional)';

  @override
  String get dietVegan => '🌱 Vegano';

  @override
  String get dietVegetarian => '🥗 Vegetariano';

  @override
  String get dietGlutenFree => '🌾 Sin Gluten';

  @override
  String get dietDairyFree => '🥛 Sin Lácteos';

  @override
  String get allergyNuts => '🥜 Frutos Secos';

  @override
  String get allergyShellfish => '🦐 Mariscos';

  @override
  String get allergyEggs => '🥚 Huevos';

  @override
  String get allergySoy => '🫘 Soja';

  @override
  String get subPackages => 'Paquetes de Suscripción';

  @override
  String subMaxTierActive(Object tier) {
    return '¡Plan $tier Activo!';
  }

  @override
  String subCurrentTier(Object tier) {
    return 'Estás en $tier';
  }

  @override
  String get subUnlockPotential => 'Desbloquea tu Potencial Culinario';

  @override
  String get subMaxTierSubtitle => 'Disfrutas del plan máximo.';

  @override
  String get subUpgradeSubtitle => 'Mejora tu plan para más funciones.';

  @override
  String get subChoosePlan => 'Elige el mejor plan y aprovecha las ventajas.';

  @override
  String get subMostPopular => 'MÁS POPULAR';

  @override
  String subSwitchTo(Object tier) {
    return 'Cambiar a $tier';
  }

  @override
  String get subAutoRenew =>
      'Suscripción con renovación automática. Cancela cuando quieras.';

  @override
  String get subPurchaseStarted =>
      'Compra iniciada... Sigue la pantalla de la tienda.';

  @override
  String get subPurchaseError => 'Ocurrió un error.';

  @override
  String subYourPlan(Object tier) {
    return 'Estás en $tier';
  }

  @override
  String get subEnjoyPerks => 'Disfruta de todos los beneficios.';

  @override
  String get subManage => 'Gestionar Membresía';

  @override
  String get subPerMonth => '/ mes';

  @override
  String subRecipesPerDay(Object count) {
    return '$count Búsquedas de Recetas / Día';
  }

  @override
  String get subManualAdd => 'Agregar Ingredientes Manual';

  @override
  String get subAdFree => 'Sin Anuncios';

  @override
  String get subNoPhoto => 'Sin Subida de Fotos';

  @override
  String get subNoPantry => 'Sin Seguimiento de Despensa';

  @override
  String get subNoAssistant => 'Sin Acceso al Asistente';

  @override
  String get subPhotoAdd => '📸 Agregar por Foto';

  @override
  String get subPantryTracking => '🏠 Despensa y Compras';

  @override
  String get subNoChat => 'Sin Chat Asistente';

  @override
  String get subNoVoice => 'Sin Asistente de Voz';

  @override
  String get subChatAssistant => '💬 Chat Asistente';

  @override
  String get subVoiceAssistant => '🎙️ Asistente de Voz';

  @override
  String get subVideoAdd => '📹 Subida de Video (Próximamente)';

  @override
  String get subPrioritySupport => '⚡ Soporte Prioritario';

  @override
  String get editProfileTitle => 'Editar Perfil';

  @override
  String get saveChanges => 'Guardar Cambios';

  @override
  String get profileUpdated => '¡Perfil actualizado! ✅';

  @override
  String get personalInfo => 'Información Personal';

  @override
  String get changePassword => 'Cambiar Contraseña';

  @override
  String get currentPassword => 'Contraseña Actual';

  @override
  String get newPassword => 'Nueva Contraseña';

  @override
  String get confirmNewPassword => 'Confirmar Nueva Contraseña';

  @override
  String get passwordMismatch => '¡Las contraseñas no coinciden!';

  @override
  String get passwordUpdated => '¡Contraseña actualizada! ✅';

  @override
  String get updatePassword => 'Actualizar Contraseña';

  @override
  String get emailAddress => 'Dirección de Email';

  @override
  String get changeEmail => 'Cambiar Email';

  @override
  String get changeEmailDescription =>
      'Por seguridad, introduce tu contraseña actual y nuevo email.';

  @override
  String get newEmail => 'Nuevo Email';

  @override
  String get cancel => 'Cancelar';

  @override
  String get update => 'Actualizar';

  @override
  String get emailUpdated => '¡Email actualizado! ✅';

  @override
  String get emailUpdateFailed => 'No se pudo cambiar el email.';

  @override
  String get prefVegan => 'Vegano';

  @override
  String get prefVegetarian => 'Vegetariano';

  @override
  String get prefGlutenFree => 'Sin Gluten';

  @override
  String get prefKeto => 'Keto';

  @override
  String get prefPaleo => 'Paleo';

  @override
  String get prefLowCarb => 'Bajo en Carbos';

  @override
  String get prefMediterranean => 'Dieta Mediterránea';

  @override
  String get prefIntermittentFasting => 'Ayuno Intermitente';

  @override
  String get prefLowFat => 'Bajo en Grasa';

  @override
  String get prefPescatarian => 'Pescetariano';

  @override
  String get prefDiabeticFriendly => 'Apto para Diabéticos';

  @override
  String get prefHighProtein => 'Alto en Proteína';

  @override
  String get allergyNutsName => 'Frutos Secos';

  @override
  String get allergyMilk => 'Leche';

  @override
  String get allergyEgg => 'Huevo';

  @override
  String get allergySeafood => 'Mariscos';

  @override
  String get allergyGluten => 'Gluten';

  @override
  String get allergySoyName => 'Soja';

  @override
  String get allergyPeanuts => 'Cacahuetes';

  @override
  String get allergyMushroom => 'Champiñones';

  @override
  String get allergyMustard => 'Mostaza';

  @override
  String get allergySesame => 'Sésamo';

  @override
  String get allergyStrawberry => 'Fresa';

  @override
  String get allergyKiwi => 'Kiwi';

  @override
  String get allergyCelery => 'Apio';

  @override
  String get notifProductExpired => '¡Producto Caducado!';

  @override
  String get notifTimeLow => '¡Tiempo Agotándose!';

  @override
  String notifProductExpiredMessage(Object name) {
    return '$name ha caducado.';
  }

  @override
  String notifTimeLowMessage(Object name) {
    return '$name está a punto de caducar.';
  }

  @override
  String get maintenanceTitle => '¡Cocina en Mantenimiento!';

  @override
  String get maintenanceSubtitle =>
      'Nuestros chefs están actualizando el sistema para servirte mejor. Volveremos pronto con recetas increíbles.';

  @override
  String get maintenanceRetry => 'Reintentar';

  @override
  String get lowCalorie => 'Bajo en Calorías';

  @override
  String get resumeCooking => 'Continuar Cocinando 🍳';

  @override
  String get timerFinishedTitle => '¡Tiempo agotado!';

  @override
  String timerFinishedMessage(Object recipe) {
    return 'El temporizador para $recipe ha terminado.';
  }

  @override
  String get timerNotificationAction => 'Ir a la App';

  @override
  String get tipWaste =>
      '¡Usa primero los ingredientes próximos a caducar para evitar desperdicios! ♻️';

  @override
  String get tipSalt => 'Añade la sal al final, usarás menos 🧂';

  @override
  String get tipOnion =>
      'Enfría las cebollas 10 min en la nevera antes de cortarlas, no llorarás 🧅';

  @override
  String get tipPasta =>
      'Añade una pizca de sal al hervir la pasta para más sabor 🍝';

  @override
  String get tipBread => 'Convierte el pan sobrante en pan rallado 🍞';

  @override
  String get tipLemon =>
      'Rueda los limones antes de exprimirlos para más jugo 🍋';

  @override
  String get tipGreens =>
      'Envuelve las verduras en papel de cocina, duran más 🥬';

  @override
  String get tipGarlic =>
      'Aplasta el ajo con un cuchillo para pelarlo fácilmente 🧄';

  @override
  String get tipEgg =>
      'Pon los huevos cocidos en agua fría para pelarlos fácil 🥚';

  @override
  String get tipRice =>
      'Lava el arroz antes de cocinar para reducir el almidón 🍚';

  @override
  String get tipPan =>
      'No llenes demasiado la sartén, los ingredientes se cocerán al vapor 🍳';

  @override
  String get tipMeat =>
      'No des la vuelta a la carne muy seguido, una vez basta para una buena costra 🥩';

  @override
  String get tipYogurt =>
      'Saca el yogur 10 min antes, está más rico a temperatura ambiente 🥛';

  @override
  String get tipSteam =>
      'Cocina las verduras al vapor para conservar mejor las vitaminas 🥦';

  @override
  String get tipSpices =>
      'Tuesta las especias ligeramente para liberar aromas 🌶️';

  @override
  String get tipParmesan =>
      'Añade corteza de parmesano a la sopa para un sabor increíble 🧀';

  @override
  String get tipAvocado =>
      'Madura los aguacates metiéndolos en una bolsa con un plátano 🥑';

  @override
  String get tipBroth => 'Guarda el agua de cocción como caldo vegetal 🍲';

  @override
  String get tipTomato =>
      'Añade una cucharadita de azúcar a la salsa de tomate para reducir la acidez 🍅';

  @override
  String get tipHerbs =>
      'Congela hierbas frescas con aceite de oliva en cubiteras 🌿';

  @override
  String get tipDishes =>
      'Lava los platos enseguida, las manchas secas son más difíciles 🍽️';

  @override
  String get tipCake =>
      'Asegúrate de que los ingredientes estén a temperatura ambiente al hornear 🎂';

  @override
  String get tipSalad => 'Prepara el aliño con antelación y refrigera 🥗';

  @override
  String get tipOliveOil =>
      'Usa aceite de oliva a fuego bajo, a fuego alto pierde nutrientes 🫒';

  @override
  String get tipRosemary =>
      'Prepara una infusión de romero fresco, ayuda a la digestión 🫖';

  @override
  String get tipBeans =>
      'Remoja las legumbres la noche anterior para cocinar más rápido 🫘';

  @override
  String get tipBrothCubes =>
      'Congela caldo en cubiteras para añadir sabor fácilmente 🧊';

  @override
  String get tipFries =>
      'Remoja las patatas en agua antes de freír para más crujientes 🍟';

  @override
  String get tipFreshEgg =>
      'Comprueba la frescura del huevo sumergiéndolo en agua 💧';

  @override
  String get tipCoffee => 'Usa los posos de café como abono para plantas ☕';

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
  String get add => 'Añadir';

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
  String get delete => 'Eliminar';

  @override
  String get worldCuisineSelection => 'Selección de Cocina Mundial';

  @override
  String get pantryTitle => 'Mis Ingredientes';

  @override
  String get addIngredient => 'Añadir Ingrediente';

  @override
  String get manualAdd => 'Añadir Manualmente';

  @override
  String get manualAddSubtitle => 'Escribe el nombre del ingrediente';

  @override
  String get scanReceipt => 'Escanear Recibo';

  @override
  String get scanReceiptSubtitle => 'Importar automáticamente del recibo';

  @override
  String get photoAdd => 'Añadir con Foto';

  @override
  String get photoAddSubtitle => 'Reconocimiento automático con IA';

  @override
  String get photoIngredientAdd => 'Añadir Ingrediente con Foto';

  @override
  String get ingredientAdded => 'Ingrediente añadido';

  @override
  String ingredientsAddedCount(Object count) {
    return '¡$count ingredientes añadidos!';
  }

  @override
  String get ingredientNotDetected => 'Ingrediente no detectado';

  @override
  String get aiAnalyzing => 'IA Analizando...';

  @override
  String get ingredientName => 'Nombre del Ingrediente';

  @override
  String get quantity => 'Cantidad';

  @override
  String get unitLabel => 'Unidad';

  @override
  String get expiryDateOptional => 'Fecha de Caducidad (Opcional)';

  @override
  String expiryDateLabel(Object day, Object month, Object year) {
    return 'Cad: $day/$month/$year';
  }

  @override
  String get save => 'Guardar';

  @override
  String get deleteConfirmTitle => '¿Seguro que quieres eliminar?';

  @override
  String deleteConfirmMessage(Object name) {
    return '$name se eliminará de tu despensa.';
  }

  @override
  String get allIngredients => 'Todos los Ingredientes';

  @override
  String expiringSoonCount(Object count) {
    return 'Caducan Pronto ($count)';
  }

  @override
  String get pantryEmpty => 'Tu despensa está vacía';

  @override
  String get pantryEmptySubtitle => 'Empieza añadiendo ingredientes';

  @override
  String get noExpiringItems => '¡No hay productos próximos a caducar!';

  @override
  String get allItemsFresh => '¡Todos los productos están frescos!';

  @override
  String get addToList => 'Añadir a Lista';

  @override
  String addedToShoppingList(Object name) {
    return '$name añadido a la lista de compras';
  }

  @override
  String get ok => 'OK';

  @override
  String get loginRequired => 'Debes iniciar sesión para usar esta función';

  @override
  String get pantryEmptyAddFirst =>
      'Tu despensa está vacía, añade ingredientes primero';

  @override
  String errorGeneric(Object error) {
    return 'Error: $error';
  }

  @override
  String get notifications => 'Notificaciones';

  @override
  String get markAllRead => 'Marcar Todo Leído';

  @override
  String get noNotifications => 'Sin notificaciones aún';

  @override
  String get noNotificationsSubtitle =>
      'Las actualizaciones importantes aparecerán aquí';

  @override
  String get justNow => 'Ahora mismo';

  @override
  String minutesAgo(Object minutes) {
    return 'Hace $minutes min';
  }

  @override
  String hoursAgo(Object hours) {
    return 'Hace $hours h';
  }

  @override
  String get yesterdayLabel => 'Ayer';

  @override
  String get shoppingListTitle => 'Lista de Compras';

  @override
  String get addIngredientHint => 'Añadir ingrediente...';

  @override
  String get itemAlreadyExists => '¡Este producto ya está en tu lista!';

  @override
  String get deleteCheckedTitle => 'Eliminar Marcados';

  @override
  String deleteCheckedMessage(Object count) {
    return 'Se eliminarán $count productos marcados. ¿Estás seguro?';
  }

  @override
  String get deleteSelectedTitle => 'Eliminar Seleccionados';

  @override
  String deleteSelectedMessage(Object count) {
    return '¿Seguro que quieres eliminar $count productos?';
  }

  @override
  String selectedCount(Object count) {
    return '$count seleccionados';
  }

  @override
  String get selectAll => 'Seleccionar Todo';

  @override
  String get shareLabel => 'Compartir';

  @override
  String get shareList => 'Compartir Lista';

  @override
  String get multiSelect => 'Selección Múltiple';

  @override
  String get deleteChecked => 'Eliminar Marcados';

  @override
  String get shoppingListEmpty => 'Lista de Compras Vacía';

  @override
  String get shoppingListEmptySubtitle =>
      'Empieza añadiendo lo que necesitas comprar';

  @override
  String purchasedCount(Object count) {
    return 'Comprado ($count)';
  }

  @override
  String get listCopied => '¡Lista copiada!';

  @override
  String get selectedItems => 'Seleccionados:';

  @override
  String get itemsToBuy => 'Por Comprar:';

  @override
  String get editItem => 'Editar artículo';

  @override
  String get itemName => 'Nombre del artículo';

  @override
  String get editLabel => 'Editar';

  @override
  String get smartStockAnalysis => 'Análisis Inteligente de Stock';

  @override
  String get statsLoadError => 'No se pudieron cargar las estadísticas';

  @override
  String get tryAgain => 'Reintentar';

  @override
  String get totalProducts => 'Total Productos';

  @override
  String get expiringSoonLabel => 'Caducan Pronto';

  @override
  String get expiredLabel => 'Caducados';

  @override
  String get categoriesLabel => 'Categorías';

  @override
  String get categoryDistribution => 'Distribución por Categorías';

  @override
  String get noData => 'Sin datos';

  @override
  String get wastePreventionScore => 'Puntuación Anti-Desperdicio';

  @override
  String get scoreGreat => '¡Lo estás haciendo genial!';

  @override
  String get scoreWarning => '¡Atención! Alto riesgo de desperdicio.';

  @override
  String get scoreBetter => 'Podría mejorar.';

  @override
  String get wastePreventionSubtitle =>
      'Estás previniendo el desperdicio alimentario usando tu despensa eficientemente.';

  @override
  String productsCount(Object count) {
    return '$count productos';
  }

  @override
  String get manageSubscriptionTitle => 'Gestionar Suscripción';

  @override
  String get activeStatus => 'Activo';

  @override
  String get startDate => 'Fecha de Inicio';

  @override
  String get statusLabel => 'Estado';

  @override
  String get autoRenews => 'Renovación Automática';

  @override
  String get changePlan => 'Cambiar o Cancelar Plan';

  @override
  String get changePlanDescription =>
      'Serás redirigido a la configuración de la tienda para cancelar o cambiar tu suscripción. Los pagos y renovaciones son gestionados directamente por la tienda.';

  @override
  String get platformLabel => 'Plataforma';

  @override
  String get filterEasy => 'Fácil';

  @override
  String get filterFast => 'Rápido (<30min)';

  @override
  String get filterLowCal => 'Baja Caloría';

  @override
  String get minuteAbbr => 'min';

  @override
  String get stockAnalysis => 'Análisis de Stock';

  @override
  String get suggestRecipe => 'Sugerir Receta';

  @override
  String get categoryVegetables => 'Verduras';

  @override
  String get categoryFruits => 'Frutas';

  @override
  String get categoryMeat => 'Carne y Aves';

  @override
  String get categorySeafood => 'Mariscos';

  @override
  String get categoryDairy => 'Lácteos';

  @override
  String get categoryEggs => 'Huevos';

  @override
  String get categoryGrains => 'Cereales';

  @override
  String get categoryLegumes => 'Legumbres';

  @override
  String get categoryPasta => 'Pasta y Fideos';

  @override
  String get categoryBakery => 'Pan y Panadería';

  @override
  String get categorySpices => 'Especias';

  @override
  String get categorySauces => 'Salsas y Condimentos';

  @override
  String get categoryOils => 'Aceites';

  @override
  String get categoryBeverages => 'Bebidas';

  @override
  String get categorySnacks => 'Snacks';

  @override
  String get categoryNuts => 'Frutos Secos';

  @override
  String get categoryFrozen => 'Congelados';

  @override
  String get categoryCanned => 'Conservas';

  @override
  String get categorySweets => 'Dulces y Azúcar';

  @override
  String get categoryOther => 'Otros';

  @override
  String get expiryUnknown => 'Desconocido';

  @override
  String get expiryExpired => 'Caducado';

  @override
  String get expiryToday => '¡Hoy!';

  @override
  String get expiryTomorrow => 'Mañana';

  @override
  String expiryDays(Object days) {
    return '$days días';
  }

  @override
  String get unitAdet => 'uds';

  @override
  String get unitKg => 'kg';

  @override
  String get unitG => 'g';

  @override
  String get unitL => 'L';

  @override
  String get unitMl => 'ml';

  @override
  String get unitDemet => 'manojo';

  @override
  String get unitPaket => 'paquete';

  @override
  String get unitKavanoz => 'tarro';

  @override
  String get errorImageAnalysisFailed => 'Error en el análisis de imagen';

  @override
  String get errorFeatureLocked =>
      'Esta función no está disponible en tu plan.';

  @override
  String get errorLimitExceeded => 'Límite diario superado.';

  @override
  String get errorNoIngredients =>
      'Por favor selecciona al menos un ingrediente.';

  @override
  String get errorConnectionTimeout =>
      'Tiempo de conexión agotado. Inténtalo de nuevo.';

  @override
  String errorServerConnection(Object error) {
    return 'No se pudo conectar al servidor: $error';
  }

  @override
  String get errorRecipeSuggestionFailed => 'Error en la sugerencia de receta';

  @override
  String get errorTrialExpired => 'Tu prueba gratuita ha expirado.';

  @override
  String get errorRecipeLimitExceeded =>
      'Límite diario de búsqueda de recetas superado.';

  @override
  String get errorDetailedRecipeLocked =>
      'Las recetas detalladas son exclusivas del plan Pro.';

  @override
  String errorRecipeDetailFailed(Object error) {
    return 'No se pudieron obtener los detalles de la receta: $error';
  }

  @override
  String get errorVerifyFailed => 'Verificación fallida: Respuesta inesperada.';

  @override
  String errorSubscriptionVerifyFailed(Object error) {
    return 'No se pudo verificar la suscripción: $error';
  }

  @override
  String get verifyEmailTitle => 'Verifica Tu Email';

  @override
  String verifyEmailSubtitle(Object email) {
    return 'Hemos enviado un enlace de verificación a $email. Revisa tu bandeja de entrada y carpeta de spam.';
  }

  @override
  String get verifiedButton => 'Email Verificado, Iniciar Sesión';

  @override
  String get scanIngredientTitle => 'Escanear Ingredientes';

  @override
  String get analyzeIngredients => 'Analizar Ingredientes';

  @override
  String get uploadIngredients => 'Subir Ingredientes';

  @override
  String get aiWillRecognize => 'La IA reconocerá todos los ingredientes';

  @override
  String get cameraLabel => 'Cámara';

  @override
  String get takePhotoAction => 'Tomar una foto';

  @override
  String get galleryLabel => 'Galería';

  @override
  String get selectPhoto => 'Seleccionar una foto';

  @override
  String get ensureVisible =>
      'Asegúrate de que todos los ingredientes sean visibles';

  @override
  String get selectDifferentPhoto => 'Seleccionar Otra Foto';

  @override
  String imageCouldNotBeSelected(Object error) {
    return 'No se pudo seleccionar la imagen: $error';
  }

  @override
  String get photoReady => 'Foto lista';

  @override
  String get identifyingIngredients => 'Identificando ingredientes';

  @override
  String get stepsLoading => 'Preparando Pasos de la Receta...';

  @override
  String get pleaseWaitOrRetry => 'Espera o inténtalo de nuevo más tarde.';

  @override
  String get timerLabel => 'Temporizador';

  @override
  String get stopTimerQuestion => '¿Quieres detener el temporizador?';

  @override
  String get noLabel => 'No';

  @override
  String get yesStop => 'Sí, Detener';

  @override
  String stepProgress(Object completed, Object current, Object total) {
    return 'PASO $current / $total  ($completed completados)';
  }

  @override
  String stepCompletedLabel(Object number) {
    return 'PASO $number ✓';
  }

  @override
  String stepNumberLabel(Object number) {
    return 'PASO $number';
  }

  @override
  String get readStepAloud => 'Leer Paso en Voz Alta';

  @override
  String get completedLabel => 'Completado';

  @override
  String get finishCookingAction => 'Terminar Cocción';

  @override
  String get listeningLabel => 'Escuchando...';

  @override
  String get thinkingLabel => 'Pensando...';

  @override
  String get errorOccurred => 'Ocurrió un error.';

  @override
  String get askSomething => 'Pregunta algo...';

  @override
  String get chefAssistant => 'Asistente Chef';

  @override
  String get chatEmptyHint =>
      'Puedes preguntar sobre la receta.\nEj: \"Lee el paso 2 de nuevo\" o \"¿A qué temperatura el horno?\"';

  @override
  String get timerFinished => '¡Tiempo Terminado! 🍽️';

  @override
  String timerFinishedBody(Object title) {
    return 'El temporizador que configuraste para $title ha terminado.';
  }

  @override
  String get timeUpCheckFood => '¡Tiempo terminado! Revisa tu comida.';

  @override
  String get detailedRecipe => 'Receta Detallada';

  @override
  String detailedRecipeLoadFailed(Object error) {
    return 'No se pudo cargar la receta detallada: $error';
  }

  @override
  String get turkishCuisine => 'Cocina Turca';

  @override
  String get optionalLabel => 'opcional';

  @override
  String get instructionsNotFound => 'No se encontraron instrucciones.';

  @override
  String get viewDetails => 'Ver Detalles y Preparación';

  @override
  String get ingredientsLoading => 'Cargando información de ingredientes...';

  @override
  String get addToShoppingList => 'Añadir a Lista de Compras';

  @override
  String get addingToList => 'Añadiendo ingredientes a la lista...';

  @override
  String ingredientsAddedToList(Object count) {
    return '¡$count ingredientes añadidos a la lista de compras!';
  }

  @override
  String get errorOrEmptyList => 'Ocurrió un error o la lista está vacía.';

  @override
  String get chefIngredientTip => 'Consejo del Chef sobre Ingredientes';

  @override
  String chefTipDescription(Object ingredients) {
    return 'Preparamos esta receta con tus ingredientes disponibles pero ten en cuenta: Si tienes $ingredients, añadirlos mejoraría mucho el sabor! ✨';
  }

  @override
  String get tipsPlaceholder =>
      'Los consejos especiales del chef aparecerán aquí con la receta detallada.';

  @override
  String get quickLabel => 'Rápido';

  @override
  String get detailedLabel => 'Detallado';

  @override
  String get preparingLabel => 'Preparando...';

  @override
  String get requestDetailedRecipe => 'Solicitar Receta Detallada';

  @override
  String get requestQuickRecipe => 'Receta Rápida';

  @override
  String caloriesPerServing(Object calories) {
    return '$calories kcal / porción';
  }

  @override
  String get personSuffix => 'persona';

  @override
  String get receiptScanTitle => 'Escanear Recibo';

  @override
  String get tapToSelectReceipt => 'Toca para seleccionar foto del recibo';

  @override
  String get openCamera => 'Abrir Cámara';

  @override
  String get analyzingReceipt =>
      'Analizando recibo...\nEsto puede tardar unos segundos.';

  @override
  String foundProducts(Object count) {
    return 'Productos Encontrados ($count)';
  }

  @override
  String totalAmount(Object amount) {
    return 'Total: $amount TL';
  }

  @override
  String get noProductsFound => 'No se encontraron productos.';

  @override
  String get addAllToPantry => 'Añadir Todo a la Despensa';

  @override
  String get receiptAnalysisFailed =>
      'Análisis del recibo fallido o no se encontraron productos.';

  @override
  String productsAddedToPantry(Object count) {
    return '$count productos añadidos a la despensa.';
  }

  @override
  String get voiceAssistantTitle => 'Asistente de Voz';

  @override
  String get clearChat => 'Limpiar Chat';

  @override
  String get chatCleared => 'Chat limpiado. ¿En qué puedo ayudarte?';

  @override
  String get tapMicAndSpeak => 'Toca el micrófono y habla';

  @override
  String get recipesStepsNotLoaded =>
      'No se pudieron cargar los pasos de la receta.';

  @override
  String get speechNotAvailable => 'Voz a texto no disponible';

  @override
  String get welcomeMessage =>
      '¡Hola! Soy tu asistente de chef. ¿Cómo puedo ayudarte?';

  @override
  String get speakingLabel => 'Hablando...';

  @override
  String get quickItemBread => 'Pan';

  @override
  String get quickItemMilk => 'Leche';

  @override
  String get quickItemEgg => 'Huevo';

  @override
  String get quickItemWater => 'Agua';

  @override
  String get quickItemTomato => 'Tomate';

  @override
  String get quickItemCheese => 'Queso';

  @override
  String get quickItemYogurt => 'Yogur';

  @override
  String get quickItemPasta => 'Pasta';

  @override
  String get suitablePlans => 'Planes Adecuados';

  @override
  String get reviewPlans => 'Revisar Planes';

  @override
  String get later => 'Más Tarde';

  @override
  String get dietType => 'Tipo de Dieta';

  @override
  String get otherAllergyHint => 'Otro (ej. Champiñones)';

  @override
  String get apply => 'Aplicar';

  @override
  String get cuisineTurkish => 'Turco';

  @override
  String get cuisineItalian => 'Italiano';

  @override
  String get cuisineAsian => 'Asiático';

  @override
  String get cuisineMexican => 'Mexicano';

  @override
  String get mealBreakfast => 'Desayuno';

  @override
  String get mealDinner => 'Cena';

  @override
  String get mealSnack => 'Merienda';

  @override
  String get statTotal => 'Total';

  @override
  String get errorLoginFailed =>
      'Error de inicio de sesión. Por favor, verifique su correo y contraseña.';

  @override
  String get errorConnection =>
      'No se pudo conectar al servidor. Verifique su conexión a internet.';

  @override
  String get errorTimeout =>
      'Se agotó el tiempo de espera. Inténtelo de nuevo.';

  @override
  String get errorServer => 'Error del servidor. Inténtelo más tarde.';

  @override
  String get errorUnknown => 'Ocurrió un error desconocido.';

  @override
  String get errorAccessDenied => 'Acceso denegado.';

  @override
  String get restrictedAccessTitle => 'Acceso Restringido';

  @override
  String get restrictedAccessMessage =>
      'Se detectaron demasiados cambios de dispositivo en su cuenta.';

  @override
  String get restrictedAccessDescription =>
      'Por razones de seguridad, esta cuenta ha sido restringida (Modo Restringido). Por favor, contacte el soporte para proceder.';

  @override
  String get getSupport => 'Obtener Soporte';

  @override
  String get close => 'Cerrar';

  @override
  String get accountRestrictionTopic => 'Restricción de Cuenta';

  @override
  String get liveSupportTitle => 'Soporte en Vivo';

  @override
  String get liveSupportSubtitle => 'Escríbenos con tus preguntas';

  @override
  String get helpQuestion => '¿Cómo podemos ayudarte?';

  @override
  String get topicTechnical => 'Soporte Técnico';

  @override
  String get topicPayment => 'Pago y Suscripción';

  @override
  String get topicSuggestion => 'Sugerencias y Solicitudes';

  @override
  String get topicOther => 'Otros Temas';

  @override
  String get adminPanelTitle => 'Panel de Administración (Chat)';

  @override
  String get adminPanelSubtitle => 'Gestionar mensajes entrantes';

  @override
  String servingsCount(int count) {
    return '$count porciones';
  }

  @override
  String get chatUserTitle => 'Chat de Usuario';

  @override
  String get chatLiveSupportTitle => 'Soporte en Vivo';

  @override
  String get chatEndButtonTooltip => 'Terminar Chat';

  @override
  String get chatEndDialogTitle => 'Terminar Chat';

  @override
  String get chatEndDialogContext =>
      '¿Está resuelto su problema? ¿Está seguro de que desea terminar el chat?';

  @override
  String get chatEndDialogCancel => 'Cancelar';

  @override
  String get chatEndDialogConfirm => 'Sí, Terminar Chat';

  @override
  String get chatNoMessagesHello => 'Aún no hay mensajes. ¡Di hola! 👋';

  @override
  String get chatHistoryClearedInfo => 'Historial de chat borrado. 👋';

  @override
  String get chatInputHint => 'Escribe tu mensaje...';

  @override
  String get adminSupportRequestsTitle => 'Solicitudes de Soporte';

  @override
  String get adminNoSupportRequests => 'Aún no hay solicitudes de soporte.';

  @override
  String get adminUserPrefix => 'Usuario: ';

  @override
  String get customTimerChannelName => 'Temporizador Activo';

  @override
  String get customTimerChannelDescription =>
      'Estado del temporizador de cocción';

  @override
  String get timerCookingDescription =>
      'Cocinando...\nSerás notificado cuando termine.';

  @override
  String get chefVisionActiveTimer => 'Temporizador Activo ChefVision';

  @override
  String timerCookingTitle(Object title) {
    return '$title se está cocinando...';
  }

  @override
  String get guestChefName => 'Chef Invitado';

  @override
  String get unregisteredAccount => 'Cuenta No Registrada';

  @override
  String get guestSignUpDesc =>
      'Crea tu cuenta gratuita para guardar recetas, hacer escaneos IA ilimitados y construir tu Despensa Virtual.';

  @override
  String get usageLimitsTitle => 'Límites de Uso Restantes';

  @override
  String get usageLimitCamera => 'Escaneo con Cámara';

  @override
  String get usageLimitAiRecipe => 'Petición de Receta de IA';

  @override
  String get loginOrRegister => 'Iniciar Sesión o Registrarse';

  @override
  String get err_user_not_found =>
      'Usuario no encontrado - por favor, inicie sesión nuevamente';

  @override
  String get err_session_expired_other_device =>
      'Su sesión fue terminada porque inició sesión desde otro dispositivo.';

  @override
  String get err_receipt_missing => 'Faltan los datos del recibo.';

  @override
  String get err_receipt_used_by_another_user =>
      'Esta compra está vinculada a otra cuenta.';

  @override
  String get err_already_pro_other_platform =>
      'Ya tiene una suscripción activa en otra plataforma.';

  @override
  String get err_subscription_expired => 'Su suscripción ha expirado.';

  @override
  String get err_google_credentials_missing =>
      'Credenciales de Google configuradas incorrectamente en el servidor.';

  @override
  String get err_google_receipt_invalid =>
      'Respuesta de verificación de Google inválida.';

  @override
  String get err_google_verification_failed =>
      'La verificación de Google falló.';

  @override
  String get err_apple_receipt_failed =>
      'El recibo de Apple no se pudo decodificar o fue rechazado por la App Store.';

  @override
  String get err_platform_not_supported => 'Plataforma no compatible.';

  @override
  String get err_verification_service =>
      'Error en el servicio de verificación.';

  @override
  String get err_verification_failed => 'La verificación falló.';

  @override
  String get err_database_update =>
      'Se produjo un error de base de datos al actualizar la suscripción.';

  @override
  String get warning_subscription_active_delete =>
      'Su cuenta ha sido eliminada con éxito. ¡Sin embargo, su suscripción de la tienda activa podría seguir funcionando! Por favor, recuerde cancelarla manualmente desde la configuración de su teléfono.';

  @override
  String get success_account_deleted =>
      'Su cuenta ha sido eliminada exitosamente.';

  @override
  String get err_usage_limit_reached =>
      'Ha alcanzado su límite de prueba gratuita. Suscríbase para acceder a recetas avanzadas y más.';

  @override
  String cuisineLabel(Object cuisine) {
    return 'Cocina $cuisine';
  }

  @override
  String get subExpiredTitle => 'Tu suscripción ha expirado';

  @override
  String get subExpiredSubtitle =>
      'Renueva para seguir disfrutando de las funciones premium.';

  @override
  String get subRenew => 'Renovar suscripción';

  @override
  String get subExpiredBanner => 'Suscripción expirada — Toca para renovar';
}
