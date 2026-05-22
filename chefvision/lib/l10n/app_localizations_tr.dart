// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Turkish (`tr`).
class AppLocalizationsTr extends AppLocalizations {
  AppLocalizationsTr([String locale = 'tr']) : super(locale);

  @override
  String get appTitle => 'ChefVision AI';

  @override
  String get appName => 'ChefVision';

  @override
  String get splashTagline => 'Yapay Zeka Destekli Akıllı Şefiniz';

  @override
  String get greetingMorning => 'Günaydın';

  @override
  String get greetingAfternoon => 'İyi Öğlenler';

  @override
  String get greetingEvening => 'İyi Akşamlar';

  @override
  String get greetingNight => 'İyi Geceler';

  @override
  String get whatToCook => 'Ne pişirmek istersin?';

  @override
  String get scanIngredients => 'Malzemeleri Tara';

  @override
  String get scanIngredientsSubtitle =>
      'Malzemelerini yükle, Yapay Zeka tarifleri bulsun';

  @override
  String get takePhoto => 'Fotoğraf Çek';

  @override
  String get typeYourself => 'Manuel Ekle';

  @override
  String get myPantry => 'Malzemelerim';

  @override
  String get yourIngredients => 'Malzemelerin';

  @override
  String get shoppingList => 'Alışveriş';

  @override
  String get yourList => 'Listeniz';

  @override
  String get popularRecipes => '🔥 Lezzetler';

  @override
  String get viewAll => 'Tümü';

  @override
  String get expiryWarningTitle => 'Süresi Dolmak Üzere';

  @override
  String get expiredWarningTitle => 'Süresi Doldu';

  @override
  String itemsExpired(Object count) {
    return '$count malzemenin süresi doldu!';
  }

  @override
  String itemsExpiring(Object count) {
    return '$count malzemenin süresi dolmak üzere!';
  }

  @override
  String get dailyTip => 'Günün İpucu';

  @override
  String get discover => 'Keşfet';

  @override
  String get discoverSubtitle => 'Yeni tarifler ve mutfak sırları çok yakında!';

  @override
  String get noFavorites => 'Henüz Favori Yok';

  @override
  String get noFavoritesSubtitle =>
      'Beğendiğin tarifleri buraya ekleyebilirsin.';

  @override
  String get favoriteRecipes => 'Favori Tariflerin';

  @override
  String get profile => 'Profil';

  @override
  String get editProfile => 'Profili Düzenle';

  @override
  String get home => 'Ana Sayfa';

  @override
  String get search => 'Ara';

  @override
  String get favorites => 'Favoriler';

  @override
  String get settings => 'Ayarlar';

  @override
  String get language => 'Dil / Language';

  @override
  String get selectLanguage => 'Dil Seçiniz / Select Language';

  @override
  String get ingredients => 'Malzemeler';

  @override
  String get instructions => 'Yapılışı';

  @override
  String get prepTime => 'Hazırlık';

  @override
  String get recipe => 'Tarif';

  @override
  String get cookTime => 'Pişirme';

  @override
  String get servings => 'Porsiyon';

  @override
  String get difficulty => 'Zorluk';

  @override
  String get calories => 'Kalori';

  @override
  String get startCooking => 'Pişirmeye Başla';

  @override
  String get readAloud => 'Sesli Oku';

  @override
  String get stopReading => 'Okumayı Durdur';

  @override
  String get pauseReading => 'Durdur';

  @override
  String get resumeReading => 'Devam Et';

  @override
  String get nextStep => 'Sonraki Adım';

  @override
  String get previousStep => 'Önceki Adım';

  @override
  String get finishCooking => 'Pişirmeyi Bitir';

  @override
  String get cookingCompleted => 'Pişirme Tamamlandı!';

  @override
  String get cookingCompletedSubtitle =>
      'Afiyet olsun! Lezzetli bir yemek hazırladınız.';

  @override
  String get bonAppetit => 'Afiyet Olsun!';

  @override
  String get backToHomeCaps => 'ANA SAYFAYA DÖN';

  @override
  String get backToHome => 'Ana Sayfaya Dön';

  @override
  String get analyzing => 'Analiz Ediliyor...';

  @override
  String get analyzingSubtitle => 'Yapay zeka malzemeleri tanıyor';

  @override
  String get addToPantry => 'Dolaba Ekle';

  @override
  String get retry => 'Tekrar Dene';

  @override
  String get error => 'Hata';

  @override
  String get success => 'Başarılı';

  @override
  String get itemAdded => 'Ürün başarıyla eklendi';

  @override
  String get itemRemoved => 'Ürün başarıyla silindi';

  @override
  String get onboardingTitle1 => 'Malzemeleri Tara';

  @override
  String get onboardingDesc1 =>
      'Malzemelerini yükle, yapay zeka tüm malzemeleri anında tanısın';

  @override
  String get onboardingTitle2 => 'Tarif Al';

  @override
  String get onboardingDesc2 =>
      'Yapay Zeka, elindeki malzemelerle yapabileceğin en lezzetli tarifleri önersin';

  @override
  String get onboardingTitle3 => 'Sesli Asistan';

  @override
  String get onboardingDesc3 =>
      'Pişirirken elini kullanma, sesli komutlarla tarif al ve adım adım yönlendiril';

  @override
  String get skip => 'Atla';

  @override
  String get start => 'Başla';

  @override
  String get continueAction => 'Devam';

  @override
  String iapErrorStarted(Object error) {
    return 'Satın alma başlatılamadı: $error';
  }

  @override
  String get iapErrorVerification =>
      'Doğrulama şu an yapılamadı (İnternet bağlantısı olabilir). İşlem kaydedildi ve otomatik tekrar denenecek.';

  @override
  String iapErrorGeneral(Object error) {
    return 'Satın alma hatası: $error';
  }

  @override
  String trialRemaining(Object current, Object total) {
    return 'Deneme Hakkı: $current/$total';
  }

  @override
  String get darkMode => 'Karanlık Mod';

  @override
  String get darkModeSubtitle => 'Uygulama temasını değiştir';

  @override
  String get foodWaste => 'Gıda İsrafını Önle';

  @override
  String get foodWasteSubtitle =>
      'Süresi dolmak üzere olan malzemelere öncelik ver';

  @override
  String get maxPrepTime => 'Maksimum Hazırlama Süresi';

  @override
  String minutesSuffix(Object minutes) {
    return '$minutes dakika';
  }

  @override
  String get logout => 'Çıkış Yap';

  @override
  String version(Object version) {
    return 'Versiyon $version';
  }

  @override
  String get dietaryPreferences => '🥗 Beslenme Tercihleri';

  @override
  String get allergies => '⚠️ Alerjiler';

  @override
  String get appSettings => '⚙️ Uygulama Ayarları';

  @override
  String get editAccountInfo => 'Hesap Bilgilerimi Düzenle';

  @override
  String get editAccountInfoSubtitle => 'Ad, şifre ve profil fotoğrafı';

  @override
  String get subscriptionPlans => 'Abonelik Planlarını Gör';

  @override
  String get manageSubscription => 'Aboneliği Yönet';

  @override
  String get premiumDiscover => 'Premium Özellikleri Keşfet';

  @override
  String get premiumSubtitle => 'AI ile sınırsız tarif ve özel özellikler.';

  @override
  String subscriptionActive(Object tier) {
    return 'ChefVision $tier Aktif';
  }

  @override
  String get subscriptionActiveSubtitle =>
      'Paketinin avantajlarının keyfini çıkar.';

  @override
  String get deleteAccount => 'Hesabımı Sil';

  @override
  String get deleteAccountWarning =>
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz (kiler, favoriler) kalıcı olarak silinecektir.';

  @override
  String get deleteAccountConfirm => 'Evet, Hesabımı Sil';

  @override
  String get deleteAccountCancel => 'Vazgeç';

  @override
  String get deleteAccountSuccess => 'Hesabınız başarıyla silindi.';

  @override
  String get gourmetUser => 'Gurme Kullanıcı';

  @override
  String get chefTitleBeginner => 'Mutfak Çırağı 🌱';

  @override
  String get chefTitleIntermediate => 'Yetenekli Şef 👨‍🍳';

  @override
  String get chefTitleMaster => 'Baş Şef 👑';

  @override
  String get statFavorites => 'Favoriler';

  @override
  String get statPantry => 'Malzemelerim';

  @override
  String get statCooked => 'Pişirilen';

  @override
  String get recentSuggestions => '✨ Son Önerilenler';

  @override
  String get clearAction => 'Temizle 🗑️';

  @override
  String get returnToRecipes => 'Tariflere Dön';

  @override
  String get cameraLocked => 'Kamera Kilitli';

  @override
  String get cameraLockedMessage =>
      'Yiyecekleri fotoğraflayarak kilerine eklemek için Pro üyeliğe geçmelisin.';

  @override
  String get pantryTracking => 'Kiler Takibi';

  @override
  String get pantryTrackingMessage =>
      'Kilerindeki ürünlerin son kullanma tarihlerini takip etmek için Pro veya Premium üyeliğe yükselt.';

  @override
  String get shoppingListLocked => 'Market Listesi';

  @override
  String get shoppingListLockedMessage =>
      'Alışveriş listeni akıllıca yönetmek için Pro veya Premium üyeliğe yükselt.';

  @override
  String get loginWelcome => 'Hoş Geldiniz';

  @override
  String get loginSubtitle => 'ChefVision hesabınıza giriş yapın';

  @override
  String get loginFailed => 'Giriş başarısız';

  @override
  String get emailRequired => 'Email gerekli';

  @override
  String get emailInvalid => 'Geçerli bir email girin';

  @override
  String get passwordLabel => 'Şifre';

  @override
  String get passwordRequired => 'Şifre gerekli';

  @override
  String get passwordMinLength => 'Şifre en az 6 karakter olmalı';

  @override
  String get rememberMe => 'Beni Hatırla';

  @override
  String get forgotPassword => 'Şifremi Unuttum';

  @override
  String get forgotPasswordSubtitle =>
      'Şifre sıfırlama bağlantısı için e-posta adresinizi girin.';

  @override
  String get sendResetLink => 'Bağlantı Gönder';

  @override
  String get resetLinkSent =>
      'Şifre sıfırlama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.';

  @override
  String get loginButton => 'Giriş Yap';

  @override
  String get noAccount => 'Hesabınız yok mu? ';

  @override
  String get registerButton => 'Ücretsiz Kayıt Ol';

  @override
  String get registerTitle => 'Hesap Oluştur';

  @override
  String get registerSubtitle => 'Hemen başlayın, ücretsiz!';

  @override
  String get registerFailed => 'Kayıt başarısız';

  @override
  String get continueAsGuest => 'Misafir Olarak Devam Et';

  @override
  String get fullName => 'Ad Soyad';

  @override
  String get nameRequired => 'İsim gerekli';

  @override
  String get nameMinLength => 'En az 2 karakter girin';

  @override
  String get dietPreferencesOptional => 'Diyet Tercihleri (Opsiyonel)';

  @override
  String get allergiesOptional => 'Alerjiler (Opsiyonel)';

  @override
  String get dietVegan => '🌱 Vegan';

  @override
  String get dietVegetarian => '🥗 Vejetaryen';

  @override
  String get dietGlutenFree => '🌾 Glutensiz';

  @override
  String get dietDairyFree => '🥛 Laktozsuz';

  @override
  String get allergyNuts => '🥜 Fındık/Fıstık';

  @override
  String get allergyShellfish => '🦐 Kabuklu Deniz Ür.';

  @override
  String get allergyEggs => '🥚 Yumurta';

  @override
  String get allergySoy => '🫘 Soya';

  @override
  String get subPackages => 'Abonelik Paketleri';

  @override
  String subMaxTierActive(Object tier) {
    return '$tier Paketi Aktif!';
  }

  @override
  String subCurrentTier(Object tier) {
    return '$tier Paketindesin';
  }

  @override
  String get subUnlockPotential => 'Mutfak Potansiyelini Açığa Çıkar';

  @override
  String get subMaxTierSubtitle => 'En üst paketin keyfini çıkarıyorsun.';

  @override
  String get subUpgradeSubtitle =>
      'Daha fazla özellik için paketini yükseltebilirsin.';

  @override
  String get subChoosePlan => 'Sana en uygun paketi seç ve avantajları yakala.';

  @override
  String get subMostPopular => 'EN POPÜLER';

  @override
  String subSwitchTo(Object tier) {
    return '$tier Paketine Geç';
  }

  @override
  String get subAutoRenew =>
      'Otomatik yenilenen abonelik. İstediğin zaman iptal edebilirsin.';

  @override
  String get subPurchaseStarted =>
      'İşlem başlatıldı... Lütfen Mağaza ekranını takip edin.';

  @override
  String get subPurchaseError => 'Bir hata oluştu.';

  @override
  String subYourPlan(Object tier) {
    return '$tier Paketindesin';
  }

  @override
  String get subEnjoyPerks => 'Tüm avantajların keyfini çıkarıyorsun.';

  @override
  String get subManage => 'Üyeliği Yönet';

  @override
  String get subPerMonth => '/ ay';

  @override
  String subRecipesPerDay(Object count) {
    return '$count Tarif Arama / Gün';
  }

  @override
  String get subManualAdd => 'Manuel Malzeme Ekleme';

  @override
  String get subAdFree => 'Reklamsız Deneyim';

  @override
  String get subNoPhoto => 'Fotoğrafla Ekleme Yok';

  @override
  String get subNoPantry => 'Kiler/Market Takibi Yok';

  @override
  String get subNoAssistant => 'Asistan Erişimi Yok';

  @override
  String get subPhotoAdd => '📸 Fotoğrafla Malzeme Ekleme';

  @override
  String get subPantryTracking => '🏠 Kiler ve Market Takibi';

  @override
  String get subNoChat => 'Chat Asistanı Yok';

  @override
  String get subNoVoice => 'Sesli Asistan (Mic) Yok';

  @override
  String get subChatAssistant => '💬 Chat Asistanı';

  @override
  String get subVoiceAssistant => '🎙️ Sesli Asistan (Mikrofon)';

  @override
  String get subVideoAdd => '📹 Video Ekleme (Yakında)';

  @override
  String get subPrioritySupport => '⚡ Öncelikli Destek';

  @override
  String get editProfileTitle => 'Profil Düzenle';

  @override
  String get saveChanges => 'Değişiklikleri Kaydet';

  @override
  String get profileUpdated => 'Profil başarıyla güncellendi! ✅';

  @override
  String get personalInfo => 'Kişisel Bilgiler';

  @override
  String get changePassword => 'Şifre Değiştir';

  @override
  String get currentPassword => 'Mevcut Şifre';

  @override
  String get newPassword => 'Yeni Şifre';

  @override
  String get confirmNewPassword => 'Yeni Şifre Tekrar';

  @override
  String get passwordMismatch => 'Şifreler uyuşmuyor!';

  @override
  String get passwordUpdated => 'Şifre başarıyla güncellendi! ✅';

  @override
  String get updatePassword => 'Şifreyi Güncelle';

  @override
  String get emailAddress => 'Email Adresi';

  @override
  String get changeEmail => 'Email Değiştir';

  @override
  String get changeEmailDescription =>
      'Güvenliğiniz için lütfen mevcut şifrenizi ve yeni email adresinizi girin.';

  @override
  String get newEmail => 'Yeni Email';

  @override
  String get cancel => 'İptal';

  @override
  String get update => 'Güncelle';

  @override
  String get emailUpdated => 'Email adresi başarıyla güncellendi! ✅';

  @override
  String get emailUpdateFailed => 'Email değiştirilemedi.';

  @override
  String get prefVegan => 'Vegan';

  @override
  String get prefVegetarian => 'Vejetaryen';

  @override
  String get prefGlutenFree => 'Glutensiz';

  @override
  String get prefKeto => 'Keto';

  @override
  String get prefPaleo => 'Paleo';

  @override
  String get prefLowCarb => 'Düşük Karbonhidrat';

  @override
  String get prefMediterranean => 'Akdeniz Diyeti';

  @override
  String get prefIntermittentFasting => 'Aralıklı Oruç';

  @override
  String get prefLowFat => 'Düşük Yağlı';

  @override
  String get prefPescatarian => 'Pesketaryen';

  @override
  String get prefDiabeticFriendly => 'Diyabetik Dostu';

  @override
  String get prefHighProtein => 'Yüksek Protein';

  @override
  String get allergyNutsName => 'Kuruyemiş';

  @override
  String get allergyMilk => 'Süt';

  @override
  String get allergyEgg => 'Yumurta';

  @override
  String get allergySeafood => 'Deniz Ürünleri';

  @override
  String get allergyGluten => 'Gluten';

  @override
  String get allergySoyName => 'Soya';

  @override
  String get allergyPeanuts => 'Yer Fıstığı';

  @override
  String get allergyMushroom => 'Mantar';

  @override
  String get allergyMustard => 'Hardal';

  @override
  String get allergySesame => 'Susam';

  @override
  String get allergyStrawberry => 'Çilek';

  @override
  String get allergyKiwi => 'Kivi';

  @override
  String get allergyCelery => 'Kereviz';

  @override
  String get notifProductExpired => 'Ürün Süresi Doldu!';

  @override
  String get notifTimeLow => 'Süre Azalıyor!';

  @override
  String notifProductExpiredMessage(Object name) {
    return '$name ürününün kullanım süresi doldu.';
  }

  @override
  String notifTimeLowMessage(Object name) {
    return '$name ürününün süresi dolmak üzere.';
  }

  @override
  String get maintenanceTitle => 'Mutfağımız Bakımda!';

  @override
  String get maintenanceSubtitle =>
      'Şeflerimiz size daha iyi hizmet verebilmek için sistemi güncelliyor. Kısa bir süre sonra harika tariflerle geri döneceğiz.';

  @override
  String get maintenanceRetry => 'Tekrar Dene';

  @override
  String get lowCalorie => 'Düşük Kalori';

  @override
  String get resumeCooking => 'Pişirmeye Devam Et 🍳';

  @override
  String get timerFinishedTitle => 'Süre Doldu!';

  @override
  String timerFinishedMessage(Object recipe) {
    return '$recipe tarifi için ayarladığınız süre tamamlandı.';
  }

  @override
  String get timerNotificationAction => 'Uygulamaya Git';

  @override
  String get tipWaste =>
      'Bozulmak üzere olan malzemeleri önce kullanarak israfı önle! ♻️';

  @override
  String get tipSalt =>
      'Yemeklere tuzu en son ekle, böylece daha az tuz kullanırsın 🧂';

  @override
  String get tipOnion =>
      'Soğanı doğramadan 10 dk buzdolabında beklet, gözlerin yanmaz 🧅';

  @override
  String get tipPasta =>
      'Makarnayı kaynar suya atarken bir tutam tuz ekle, lezzet artar 🍝';

  @override
  String get tipBread => 'Kalan ekmekleri galeta unu yapıp saklayabilirsin 🍞';

  @override
  String get tipLemon =>
      'Limonu kullanmadan önce avucunla yuvarlayarak sık, daha çok su verir 🍋';

  @override
  String get tipGreens =>
      'Yeşillikleri kağıt havluyla sarıp buzdolabında sakla, daha uzun dayanır 🥬';

  @override
  String get tipGarlic =>
      'Sarımsakları soyarken önce bıçakla ezersen kabukları kolayca çıkar 🧄';

  @override
  String get tipEgg =>
      'Haşlanmış yumurtayı soğuk suya atarsan kabuğu çok kolay soyulur 🥚';

  @override
  String get tipRice =>
      'Pirinç pilavı pişirmeden önce pirinçleri yıkayarak nişastayı azalt 🍚';

  @override
  String get tipPan =>
      'Tavada yemek yaparken tavayı kalabalık etme, malzemeler buharlaşır 🍳';

  @override
  String get tipMeat =>
      'Et pişirirken sık çevirme, bir kez çevir ki güzel kabuk oluşsun 🥩';

  @override
  String get tipYogurt =>
      'Yoğurdu yemekten 10 dk önce çıkar, oda sıcaklığında daha lezzetli olur 🥛';

  @override
  String get tipSteam =>
      'Sebzeleri buharda pişirirsen vitaminleri daha iyi korunur 🥦';

  @override
  String get tipSpices =>
      'Baharatları kullanmadan önce tavada hafifçe kavur, aromaları açılır 🌶️';

  @override
  String get tipParmesan =>
      'Çorbaya bir parça parmesan kabuğu ekle, inanılmaz lezzet verir 🧀';

  @override
  String get tipAvocado =>
      'Avokadoyu olgunlaştırmak için muz ile birlikte kağıt torbaya koy 🥑';

  @override
  String get tipBroth =>
      'Pişirme suyunu sebze suyu olarak saklayıp çorba yapabilirsin 🍲';

  @override
  String get tipTomato =>
      'Domates sosunu pişirirken bir çay kaşığı şeker eklersen asitliği azalır 🍅';

  @override
  String get tipHerbs =>
      'Taze otları buz kalıplarına zeytinyağı ile dondur, uzun süre dayanır 🌿';

  @override
  String get tipDishes =>
      'Yemekten sonra bulaşıkları hemen yıka, kurumuş lekeler daha zor çıkar 🍽️';

  @override
  String get tipCake =>
      'Kek yaparken malzemelerin oda sıcaklığında olmasına dikkat et 🎂';

  @override
  String get tipSalad =>
      'Salata sosunu önceden hazırlayıp buzdolabında sakla, lezzetlenir 🥗';

  @override
  String get tipOliveOil =>
      'Zeytinyağını düşük ateşte kullan, yüksek ateşte besin değeri düşer 🫒';

  @override
  String get tipRosemary =>
      'Taze biberiye dalını çay gibi demleyip içebilirsin, sindirime iyi gelir 🫖';

  @override
  String get tipBeans =>
      'Kuru baklagilleri gece önceden ıslatırsan pişirme süresi yarıya iner 🫘';

  @override
  String get tipBrothCubes =>
      'Yemeğe lezzet katmak için et suyunu buz kalıplarında dondur 🧊';

  @override
  String get tipFries =>
      'Patates kızartmasını çıtır yapmak için önce suda beklet, nişastayı at 🍟';

  @override
  String get tipFreshEgg =>
      'Yumurtanın taze olup olmadığını su testinden anlayabilirsin 💧';

  @override
  String get tipCoffee =>
      'Kahve telvesini saksı bitkilerine gübre olarak kullanabilirsin ☕';

  @override
  String personServings(Object count) {
    return '$count Kişilik';
  }

  @override
  String get howManyPeople => 'Kaç Kişilik?';

  @override
  String get sixPlus => '6+';

  @override
  String get kitchen => 'Mutfak';

  @override
  String get meal => 'Öğün';

  @override
  String get diet => 'Diyet';

  @override
  String get preventWaste => 'İsrafı Önle';

  @override
  String get clearList => 'Tümünü Sil';

  @override
  String get clearIngredientsTitle => 'Tüm Malzemeleri Sil?';

  @override
  String get clearIngredientsMsg =>
      'Listenizdeki tüm malzemeler silinecek. Bu işlem geri alınamaz.';

  @override
  String get yesDelete => 'Evet, Sil';

  @override
  String get addIngredientTitle => 'Malzeme Ekle';

  @override
  String get editIngredientTitle => 'Malzemeyi Düzenle';

  @override
  String get newIngredientHint => 'Yeni malzeme adı';

  @override
  String get add => 'Ekle';

  @override
  String get edit => 'Düzenle';

  @override
  String get suggestRecipes => 'Tarif Öner';

  @override
  String get recipeSuggestions => 'Tarif Önerileri';

  @override
  String get suggestDifferent => 'Farklı Tarifler Öner';

  @override
  String get noRecipesFound => 'Tarif bulunamadı';

  @override
  String get noRecipesFoundMsg => 'Bu filtreye uygun tarif yok.';

  @override
  String get tryDifferentIngredients => 'Farklı malzemeler deneyin';

  @override
  String get match => 'uyum';

  @override
  String get loadingMixing => 'Lezzetler harmanlanıyor...';

  @override
  String get loadingChef => 'Şef şapkasını takıyor...';

  @override
  String get loadingSelecting => 'En uygun tarifler seçiliyor...';

  @override
  String get loadingIngredients => 'Malzemeler kontrol ediliyor...';

  @override
  String get loadingSecret => 'Gizli tarifler araştırılıyor...';

  @override
  String get loadingAI => 'Lütfen bekleyin, yapay zeka çalışıyor...';

  @override
  String get ingredientsSearchHint => 'Malzeme adı yazın... (örn: Süt)';

  @override
  String get noIngredients => 'Henüz malzeme yok';

  @override
  String get addIngredientsHint => 'Fotoğraf çekerek malzeme ekleyin';

  @override
  String get kitchenCustomTitle => 'Veya Özel Bir Mutfak Yazın:';

  @override
  String get kitchenCustomHint => 'Örn: Kore, Ege, Karadeniz...';

  @override
  String get clearSelection => 'Seçimi Temizle';

  @override
  String get selected => 'Seçili';

  @override
  String get delete => 'Sil';

  @override
  String get worldCuisineSelection => 'Dünya Mutfağından Seçmeler';

  @override
  String get pantryTitle => 'Malzemelerim';

  @override
  String get addIngredient => 'Malzeme Ekle';

  @override
  String get manualAdd => 'Manuel Ekle';

  @override
  String get manualAddSubtitle => 'İsim yazarak malzeme ekle';

  @override
  String get scanReceipt => 'Fiş Tara';

  @override
  String get scanReceiptSubtitle => 'Fişten otomatik içe aktar';

  @override
  String get photoAdd => 'Fotoğraf ile Ekle';

  @override
  String get photoAddSubtitle => 'AI otomatik tanıma';

  @override
  String get photoIngredientAdd => 'Fotoğrafla Malzeme Ekle';

  @override
  String get ingredientAdded => 'Malzeme eklendi';

  @override
  String ingredientsAddedCount(Object count) {
    return '$count malzeme eklendi!';
  }

  @override
  String get ingredientNotDetected => 'Malzeme tespit edilemedi';

  @override
  String get aiAnalyzing => 'AI Analiz Ediyor...';

  @override
  String get ingredientName => 'Malzeme Adı';

  @override
  String get quantity => 'Miktar';

  @override
  String get unitLabel => 'Birim';

  @override
  String get expiryDateOptional => 'Son Kullanma Tarihi (Opsiyonel)';

  @override
  String expiryDateLabel(Object day, Object month, Object year) {
    return 'SKT: $day/$month/$year';
  }

  @override
  String get save => 'Kaydet';

  @override
  String get deleteConfirmTitle => 'Silmek istediğinize emin misiniz?';

  @override
  String deleteConfirmMessage(Object name) {
    return '$name dolabınızdan kaldırılacak.';
  }

  @override
  String get allIngredients => 'Tüm Malzemeler';

  @override
  String expiringSoonCount(Object count) {
    return 'Tarihi Yaklaşanlar ($count)';
  }

  @override
  String get pantryEmpty => 'Dolabınız boş';

  @override
  String get pantryEmptySubtitle => 'Malzeme ekleyerek başlayın';

  @override
  String get noExpiringItems => 'Tarihi yaklaşan ürün yok!';

  @override
  String get allItemsFresh => 'Tüm ürünler taze!';

  @override
  String get addToList => 'Listeye Ekle';

  @override
  String addedToShoppingList(Object name) {
    return '$name alışveriş listesine eklendi';
  }

  @override
  String get ok => 'Tamam';

  @override
  String get loginRequired => 'Bu özelliği kullanmak için giriş yapmalısınız';

  @override
  String get pantryEmptyAddFirst => 'Dolabınız boş, önce malzeme ekleyin';

  @override
  String errorGeneric(Object error) {
    return 'Hata: $error';
  }

  @override
  String get notifications => 'Bildirimler';

  @override
  String get markAllRead => 'Tümünü Oku';

  @override
  String get noNotifications => 'Henüz bildirim yok';

  @override
  String get noNotificationsSubtitle => 'Önemli güncellemeler burada görünecek';

  @override
  String get justNow => 'Az önce';

  @override
  String minutesAgo(Object minutes) {
    return '$minutes dk önce';
  }

  @override
  String hoursAgo(Object hours) {
    return '$hours saat önce';
  }

  @override
  String get yesterdayLabel => 'Dün';

  @override
  String get shoppingListTitle => 'Alışveriş Listem';

  @override
  String get addIngredientHint => 'Malzeme ekle...';

  @override
  String get itemAlreadyExists => 'Bu ürün zaten listenizde!';

  @override
  String get deleteCheckedTitle => 'İşaretlileri Sil';

  @override
  String deleteCheckedMessage(Object count) {
    return '$count işaretli ürün silinecek. Emin misiniz?';
  }

  @override
  String get deleteSelectedTitle => 'Seçilenleri Sil';

  @override
  String deleteSelectedMessage(Object count) {
    return '$count ürünü silmek istediğinize emin misiniz?';
  }

  @override
  String selectedCount(Object count) {
    return '$count seçili';
  }

  @override
  String get selectAll => 'Tümünü Seç';

  @override
  String get shareLabel => 'Paylaş';

  @override
  String get shareList => 'Listeyi Paylaş';

  @override
  String get multiSelect => 'Çoklu Seçim';

  @override
  String get deleteChecked => 'İşaretlileri Sil';

  @override
  String get shoppingListEmpty => 'Alışveriş Listeniz Boş';

  @override
  String get shoppingListEmptySubtitle =>
      'Almak istediğiniz ürünleri ekleyerek başlayın';

  @override
  String purchasedCount(Object count) {
    return 'Alınanlar ($count)';
  }

  @override
  String get listCopied => 'Liste kopyalandı!';

  @override
  String get selectedItems => 'Seçilenler:';

  @override
  String get itemsToBuy => 'Alınacaklar:';

  @override
  String get editItem => 'Ürünü Düzenle';

  @override
  String get itemName => 'Ürün Adı';

  @override
  String get editLabel => 'Düzenle';

  @override
  String get smartStockAnalysis => 'Akıllı Stok Analizi';

  @override
  String get statsLoadError => 'İstatistikler yüklenemedi';

  @override
  String get tryAgain => 'Tekrar Dene';

  @override
  String get totalProducts => 'Toplam Ürün';

  @override
  String get expiringSoonLabel => 'Tarihi Yaklaşan';

  @override
  String get expiredLabel => 'Tarihi Geçen';

  @override
  String get categoriesLabel => 'Kategoriler';

  @override
  String get categoryDistribution => 'Kategori Dağılımı';

  @override
  String get noData => 'Veri yok';

  @override
  String get wastePreventionScore => 'İsraf Önleme Puanı';

  @override
  String get scoreGreat => 'Harika gidiyorsunuz!';

  @override
  String get scoreWarning => 'Dikkat! Yüksek israf riski.';

  @override
  String get scoreBetter => 'Daha iyi olabilir.';

  @override
  String get wastePreventionSubtitle =>
      'Dolabınızı verimli kullanarak gıda israfını önlüyorsunuz.';

  @override
  String productsCount(Object count) {
    return '$count ürün';
  }

  @override
  String get manageSubscriptionTitle => 'Üyeliği Yönet';

  @override
  String get activeStatus => 'Aktif';

  @override
  String get startDate => 'Başlangıç Tarihi';

  @override
  String get statusLabel => 'Durum';

  @override
  String get autoRenews => 'Otomatik Yenilenir';

  @override
  String get changePlan => 'Plan Değiştir veya İptal Et';

  @override
  String get changePlanDescription =>
      'Aboneliğinizi iptal etmek veya değiştirmek için mağaza ayarlarına yönlendirileceksiniz. Ödemeler ve yenilemeler doğrudan mağaza tarafından yönetilir.';

  @override
  String get platformLabel => 'Platform';

  @override
  String get filterEasy => 'Kolay';

  @override
  String get filterFast => 'Hızlı (<30dk)';

  @override
  String get filterLowCal => 'Düşük Kalori';

  @override
  String get minuteAbbr => 'dk';

  @override
  String get stockAnalysis => 'Stok Analizi';

  @override
  String get suggestRecipe => 'Tarif Öner';

  @override
  String get categoryVegetables => 'Sebzeler';

  @override
  String get categoryFruits => 'Meyveler';

  @override
  String get categoryMeat => 'Et & Tavuk';

  @override
  String get categorySeafood => 'Deniz Ürünleri';

  @override
  String get categoryDairy => 'Süt Ürünleri';

  @override
  String get categoryEggs => 'Yumurta';

  @override
  String get categoryGrains => 'Tahıllar';

  @override
  String get categoryLegumes => 'Bakliyat';

  @override
  String get categoryPasta => 'Makarna & Erişte';

  @override
  String get categoryBakery => 'Ekmek & Unlu Mamüller';

  @override
  String get categorySpices => 'Baharatlar';

  @override
  String get categorySauces => 'Soslar & Çeşniler';

  @override
  String get categoryOils => 'Yağlar';

  @override
  String get categoryBeverages => 'İçecekler';

  @override
  String get categorySnacks => 'Atıştırmalıklar';

  @override
  String get categoryNuts => 'Kuruyemişler';

  @override
  String get categoryFrozen => 'Dondurulmuş';

  @override
  String get categoryCanned => 'Konserve';

  @override
  String get categorySweets => 'Tatlılar & Şeker';

  @override
  String get categoryOther => 'Diğer';

  @override
  String get expiryUnknown => 'Bilinmiyor';

  @override
  String get expiryExpired => 'Süresi Dolmuş';

  @override
  String get expiryToday => 'Bugün!';

  @override
  String get expiryTomorrow => 'Yarın';

  @override
  String expiryDays(Object days) {
    return '$days gün';
  }

  @override
  String get unitAdet => 'adet';

  @override
  String get unitKg => 'kg';

  @override
  String get unitG => 'g';

  @override
  String get unitL => 'L';

  @override
  String get unitMl => 'ml';

  @override
  String get unitDemet => 'demet';

  @override
  String get unitPaket => 'paket';

  @override
  String get unitKavanoz => 'kavanoz';

  @override
  String get errorImageAnalysisFailed => 'Görüntü analizi başarısız';

  @override
  String get errorFeatureLocked => 'Bu özellik paketinizde bulunmuyor.';

  @override
  String get errorLimitExceeded => 'Günlük limitiniz doldu.';

  @override
  String get errorNoIngredients => 'Lütfen en az bir malzeme seçin.';

  @override
  String get errorConnectionTimeout =>
      'Bağlantı zaman aşımı. Lütfen tekrar deneyin.';

  @override
  String errorServerConnection(Object error) {
    return 'Sunucuya bağlanılamadı: $error';
  }

  @override
  String get errorRecipeSuggestionFailed => 'Tarif önerisi başarısız';

  @override
  String get errorTrialExpired => 'Ücretsiz deneme hakkınız doldu.';

  @override
  String get errorRecipeLimitExceeded => 'Günlük tarif arama limitiniz doldu.';

  @override
  String get errorDetailedRecipeLocked =>
      'Detaylı tarifler Pro pakete özeldir.';

  @override
  String errorRecipeDetailFailed(Object error) {
    return 'Tarif detayı alınamadı: $error';
  }

  @override
  String get errorVerifyFailed => 'Doğrulama başarısız: Beklenmeyen yanıt.';

  @override
  String errorSubscriptionVerifyFailed(Object error) {
    return 'Abonelik doğrulanamadı: $error';
  }

  @override
  String get verifyEmailTitle => 'Email Adresini Doğrula';

  @override
  String verifyEmailSubtitle(Object email) {
    return '$email adresine bir doğrulama bağlantısı gönderdik. Lütfen gelen kutunu ve spam klasörünü kontrol et.';
  }

  @override
  String get verifiedButton => 'Doğruladım, Giriş Yap';

  @override
  String get scanIngredientTitle => 'Malzeme Tara';

  @override
  String get analyzeIngredients => 'Malzemeleri Analiz Et';

  @override
  String get uploadIngredients => 'Malzemelerini Yükle';

  @override
  String get aiWillRecognize => 'Yapay Zeka tüm malzemeleri tanıyacak';

  @override
  String get cameraLabel => 'Kamera';

  @override
  String get takePhotoAction => 'Fotoğraf çek';

  @override
  String get galleryLabel => 'Galeri';

  @override
  String get selectPhoto => 'Fotoğraf seç';

  @override
  String get ensureVisible => 'Tüm malzemelerin görünür olduğundan emin ol';

  @override
  String get selectDifferentPhoto => 'Farklı Fotoğraf Seç';

  @override
  String imageCouldNotBeSelected(Object error) {
    return 'Görsel seçilemedi: $error';
  }

  @override
  String get photoReady => 'Fotoğraf hazır';

  @override
  String get identifyingIngredients => 'Malzemeler tanımlanıyor';

  @override
  String get stepsLoading => 'Tarif Adımları Hazırlanıyor...';

  @override
  String get pleaseWaitOrRetry =>
      'Lütfen bekleyin veya daha sonra tekrar deneyin.';

  @override
  String get timerLabel => 'Zamanlayıcı';

  @override
  String get stopTimerQuestion => 'Zamanlayıcıyı durdurmak istiyor musunuz?';

  @override
  String get noLabel => 'Hayır';

  @override
  String get yesStop => 'Evet, Durdur';

  @override
  String stepProgress(Object completed, Object current, Object total) {
    return 'ADIM $current / $total  ($completed tamamlandı)';
  }

  @override
  String stepCompletedLabel(Object number) {
    return 'ADIM $number ✓';
  }

  @override
  String stepNumberLabel(Object number) {
    return 'ADIM $number';
  }

  @override
  String get readStepAloud => 'Adımı Sesli Oku';

  @override
  String get completedLabel => 'Tamamlandı';

  @override
  String get finishCookingAction => 'Yemeği Tamamla';

  @override
  String get listeningLabel => 'Dinliyorum...';

  @override
  String get thinkingLabel => 'Düşünüyorum...';

  @override
  String get errorOccurred => 'Hata oluştu.';

  @override
  String get askSomething => 'Bir şeyler sorun...';

  @override
  String get chefAssistant => 'Chef Asistan';

  @override
  String get chatEmptyHint =>
      'Tarifle ilgili takıldığınız yerleri sorabilirsiniz.\nÖrn: \"2. adımı tekrar oku\" veya \"Fırın kaç derece?\"';

  @override
  String get timerFinished => 'Süre Doldu! 🍽️';

  @override
  String timerFinishedBody(Object title) {
    return '$title için ayarladığınız zamanlayıcı tamamlandı.';
  }

  @override
  String get timeUpCheckFood => 'Süre doldu! Yemeğinizi kontrol edin.';

  @override
  String get detailedRecipe => 'Detaylı Tarif';

  @override
  String detailedRecipeLoadFailed(Object error) {
    return 'Detaylı tarif yüklenemedi: $error';
  }

  @override
  String get turkishCuisine => 'Türk Mutfağı';

  @override
  String get optionalLabel => 'opsiyonel';

  @override
  String get instructionsNotFound => 'Yapılış bilgisi bulunamadı.';

  @override
  String get viewDetails => 'Detayları ve Hazırlığı Gör';

  @override
  String get ingredientsLoading => 'Malzeme bilgisi yükleniyor...';

  @override
  String get addToShoppingList => 'Alışveriş Listesine Ekle';

  @override
  String get addingToList => 'Malzemeler listeye ekleniyor...';

  @override
  String ingredientsAddedToList(Object count) {
    return '$count malzeme alışveriş listesine eklendi!';
  }

  @override
  String get errorOrEmptyList => 'Hata oluştu veya liste boş.';

  @override
  String get chefIngredientTip => 'Şefin Malzeme Tavsiyesi';

  @override
  String chefTipDescription(Object ingredients) {
    return 'Eldeki malzemelerinle bu tarifi hazırladık ancak şuna dikkat: Eğer elinde varsa $ingredients ekleyerek lezzeti çok daha ileri taşıyabilirsin! ✨';
  }

  @override
  String get tipsPlaceholder =>
      'Detaylı tarif ile birlikte şefin özel ipuçları burada yer alacak.';

  @override
  String get quickLabel => 'Hızlı';

  @override
  String get detailedLabel => 'Detaylı';

  @override
  String get preparingLabel => 'Hazırlanıyor...';

  @override
  String get requestDetailedRecipe => 'Detaylı Tarif İste';

  @override
  String get requestQuickRecipe => 'Hızlı Tarif Çek';

  @override
  String caloriesPerServing(Object calories) {
    return '$calories kcal / porsiyon';
  }

  @override
  String get personSuffix => 'kişi';

  @override
  String get receiptScanTitle => 'Fiş Tara';

  @override
  String get tapToSelectReceipt => 'Fiş fotoğrafı seçmek için dokunun';

  @override
  String get openCamera => 'Kamerayı Aç';

  @override
  String get analyzingReceipt =>
      'Fiş analiz ediliyor...\nBu işlem birkaç saniye sürebilir.';

  @override
  String foundProducts(Object count) {
    return 'Bulunan Ürünler ($count)';
  }

  @override
  String totalAmount(Object amount) {
    return 'Toplam: $amount TL';
  }

  @override
  String get noProductsFound => 'Hiç ürün bulunamadı.';

  @override
  String get addAllToPantry => 'Tümünü Dolaba Ekle';

  @override
  String get receiptAnalysisFailed =>
      'Fiş analizi başarısız oldu veya ürün bulunamadı.';

  @override
  String productsAddedToPantry(Object count) {
    return '$count ürün dolaba eklendi.';
  }

  @override
  String get voiceAssistantTitle => 'Sesli Asistan';

  @override
  String get clearChat => 'Sohbeti Temizle';

  @override
  String get chatCleared =>
      'Sohbet temizlendi. Size nasıl yardımcı olabilirim?';

  @override
  String get tapMicAndSpeak => 'Mikrofona dokun ve konuş';

  @override
  String get recipesStepsNotLoaded => 'Tarif adımları yüklenemedi.';

  @override
  String get speechNotAvailable => 'Ses tanıma kullanılamıyor';

  @override
  String get welcomeMessage =>
      'Merhaba! Ben şef asistanınız. Size nasıl yardımcı olabilirim?';

  @override
  String get speakingLabel => 'Konuşuyor...';

  @override
  String get quickItemBread => 'Ekmek';

  @override
  String get quickItemMilk => 'Süt';

  @override
  String get quickItemEgg => 'Yumurta';

  @override
  String get quickItemWater => 'Su';

  @override
  String get quickItemTomato => 'Domates';

  @override
  String get quickItemCheese => 'Peynir';

  @override
  String get quickItemYogurt => 'Yoğurt';

  @override
  String get quickItemPasta => 'Makarna';

  @override
  String get suitablePlans => 'Uygun Paketler';

  @override
  String get reviewPlans => 'Paketleri İncele';

  @override
  String get later => 'Daha Sonra';

  @override
  String get dietType => 'Diyet Türü';

  @override
  String get otherAllergyHint => 'Diğer (örn: Mantar)';

  @override
  String get apply => 'Uygula';

  @override
  String get cuisineTurkish => 'Türk';

  @override
  String get cuisineItalian => 'İtalyan';

  @override
  String get cuisineAsian => 'Asya';

  @override
  String get cuisineMexican => 'Meksika';

  @override
  String get mealBreakfast => 'Kahvaltı';

  @override
  String get mealDinner => 'Akşam Yemeği';

  @override
  String get mealSnack => 'Atıştırmalık';

  @override
  String get statTotal => 'Toplam';

  @override
  String get errorLoginFailed =>
      'Giriş yapılamadı. E-posta veya şifrenizi kontrol edin.';

  @override
  String get errorConnection =>
      'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';

  @override
  String get errorTimeout =>
      'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.';

  @override
  String get errorServer => 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';

  @override
  String get errorUnknown => 'Beklenmedik bir hata oluştu.';

  @override
  String get errorAccessDenied => 'Erişim reddedildi.';

  @override
  String get restrictedAccessTitle => 'Erişim Kısıtlandı';

  @override
  String get restrictedAccessMessage =>
      'Hesabınızda çok fazla cihaz değişikliği tespit edildi.';

  @override
  String get restrictedAccessDescription =>
      'Güvenlik nedeniyle bu hesap kısıtlanmıştır (Kısıtlı Mod). İşlem yapabilmek için lütfen destek ekibiyle iletişime geçin.';

  @override
  String get getSupport => 'Destek Al';

  @override
  String get close => 'Kapat';

  @override
  String get accountRestrictionTopic => 'Hesap Kısıtlaması';

  @override
  String get liveSupportTitle => 'Canlı Destek';

  @override
  String get liveSupportSubtitle => 'Sorularınız için bize yazın';

  @override
  String get helpQuestion => 'Size nasıl yardımcı olabiliriz?';

  @override
  String get topicTechnical => 'Teknik Destek';

  @override
  String get topicPayment => 'Ödeme & Üyelik';

  @override
  String get topicSuggestion => 'Öneri & İstek';

  @override
  String get topicOther => 'Diğer Konular';

  @override
  String get adminPanelTitle => 'Yönetici Paneli (Chat)';

  @override
  String get adminPanelSubtitle => 'Gelen mesajları yönet';

  @override
  String servingsCount(int count) {
    return '$count kişilik';
  }

  @override
  String get chatUserTitle => 'Kullanıcı Sohbeti';

  @override
  String get chatLiveSupportTitle => 'Canlı Destek';

  @override
  String get chatEndButtonTooltip => 'Sohbeti Sonlandır';

  @override
  String get chatEndDialogTitle => 'Sohbeti Sonlandır';

  @override
  String get chatEndDialogContext =>
      'Sorununuz çözüldü mü? Sohbeti kapatmak istediğinize emin misiniz?';

  @override
  String get chatEndDialogCancel => 'Vazgeç';

  @override
  String get chatEndDialogConfirm => 'Evet, Sonlandır';

  @override
  String get chatNoMessagesHello => 'Henüz mesaj yok. Merhaba deyin! 👋';

  @override
  String get chatHistoryClearedInfo => 'Sohbet geçmişi temizlendi. 👋';

  @override
  String get chatInputHint => 'Mesajınızı yazın...';

  @override
  String get adminSupportRequestsTitle => 'Destek Talepleri';

  @override
  String get adminNoSupportRequests => 'Henüz destek talebi yok.';

  @override
  String get adminUserPrefix => 'Kullanıcı: ';

  @override
  String get customTimerChannelName => 'Özel Aktif Sayaç';

  @override
  String get customTimerChannelDescription => 'Yemek pişirme sayacı durumu';

  @override
  String get timerCookingDescription =>
      'Pişiriliyor...\nSüre dolduğunda bildirim alacaksınız.';

  @override
  String get chefVisionActiveTimer => 'ŞefVision Aktif Sayaç';

  @override
  String timerCookingTitle(Object title) {
    return '$title pişiyor...';
  }

  @override
  String get guestChefName => 'Misafir Şef';

  @override
  String get unregisteredAccount => 'Kayıtsız Hesap';

  @override
  String get guestSignUpDesc =>
      'Özel tariflerinizi kaydetmek, sınırsız yapay zeka taranması yapmak ve kendi Sanal Kiler\'inizi oluşturmak için ücretsiz hesabınızı açın.';

  @override
  String get usageLimitsTitle => 'Kalan Kullanım Hakları';

  @override
  String get usageLimitCamera => 'Kamera İle Tarama';

  @override
  String get usageLimitAiRecipe => 'Yapay Zeka Tarif İsteği';

  @override
  String get loginOrRegister => 'Giriş Yap veya Kayıt Ol';

  @override
  String get err_user_not_found =>
      'Kullanıcı bulunamadı - lütfen tekrar giriş yapın';

  @override
  String get err_session_expired_other_device =>
      'Oturumunuz başka bir cihazda açıldığı için sonlandırıldı.';

  @override
  String get err_receipt_missing => 'Doğrulama verisi (receipt) eksik.';

  @override
  String get err_receipt_used_by_another_user =>
      'Bu satın alma işlemi başka bir hesaba bağlı.';

  @override
  String get err_already_pro_other_platform =>
      'Halihazırda farklı bir platformda aktif aboneliğiniz var.';

  @override
  String get err_subscription_expired => 'Abonelik süreniz dolmuş.';

  @override
  String get err_google_credentials_missing =>
      'Sunucuda Google kimlik bilgileri eksik veya hatalı.';

  @override
  String get err_google_receipt_invalid => 'Google doğrulama yanıtı geçersiz.';

  @override
  String get err_google_verification_failed =>
      'Google doğrulaması başarısız oldu.';

  @override
  String get err_apple_receipt_failed =>
      'Apple makbuzu okunamadı veya App Store tarafından reddedildi.';

  @override
  String get err_platform_not_supported => 'Desteklenmeyen platform.';

  @override
  String get err_verification_service => 'Doğrulama servisi hatası.';

  @override
  String get err_verification_failed => 'Doğrulama başarısız oldu.';

  @override
  String get err_database_update =>
      'Abonelik güncellenirken veritabanı hatası oluştu.';

  @override
  String get warning_subscription_active_delete =>
      'Hesabınız başarıyla silindi. Ancak mevcut mağaza aboneliğiniz hala devam ediyor olabilir! Lütfen telefonunuzun ayarlarından aboneliğinizi manuel iptal etmeyi unutmayın.';

  @override
  String get success_account_deleted => 'Hesabınız başarıyla silindi.';

  @override
  String get err_usage_limit_reached =>
      'Ücretsiz deneme limitinize ulaştınız. Gelişmiş tarifler ve daha fazlası için lütfen abone olun.';

  @override
  String cuisineLabel(Object cuisine) {
    return '$cuisine Mutfağı';
  }

  @override
  String get subExpiredTitle => 'Aboneliğiniz Sona Erdi';

  @override
  String get subExpiredSubtitle =>
      'Premium özelliklerden yararlanmaya devam etmek için yenileyin.';

  @override
  String get subRenew => 'Aboneliği Yenile';

  @override
  String get subExpiredBanner =>
      'Abonelik süresi doldu — Yenilemek için tıklayın';
}
