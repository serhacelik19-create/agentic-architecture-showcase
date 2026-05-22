import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'firebase_options.dart';
import 'config/theme.dart';
import 'providers/app_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/recipe_provider.dart';
import 'providers/notification_provider.dart';
import 'providers/timer_provider.dart';
import 'providers/guest_provider.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'screens/splash_screen.dart';
import 'services/security_service.dart';
import 'services/notification_service.dart'; // Assuming this path
import 'services/iap_service.dart'; // Assuming this path

// Global navigator key to allow navigation from non-context places (like ApiService)
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive before other providers that might use it
  await Hive.initFlutter();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Initialize Crashlytics
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;

  // Pass all uncaught asynchronous errors that aren't handled by the Flutter framework to Crashlytics
  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  // Initialize Notifications
  final notificationService = NotificationService();
  await notificationService.init();

  // Initialize In-App Purchase
  final iapService = IapService();
  await iapService.init();

  Animate.restartOnHotReload = true;
  Animate.defaultDuration = 300.ms;

  // Set preferred orientations
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness:
          Brightness.dark, // Dark icons for white background
      statusBarBrightness: Brightness.light, // For iOS
    ),
  );

  // Initialize locale (device detection + saved preference)
  final appProvider = AppProvider();
  await appProvider.initLocale();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appProvider),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => RecipeProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
        ChangeNotifierProvider(create: (_) => TimerProvider(), lazy: false),
        ChangeNotifierProvider(
            create: (_) => GuestProvider()..init(), lazy: false),
      ],
      child: const ChefVisionApp(),
    ),
  );
}

class ChefVisionApp extends StatelessWidget {
  const ChefVisionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, appProvider, child) {
        return MaterialApp(
          navigatorKey: navigatorKey, // Assign the global key
          title: 'ChefVision AI',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: appProvider.themeMode,
          locale: appProvider.locale,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('en'), // English
            Locale('tr'), // Turkish
            Locale('es'), // Spanish
            Locale('fr'), // French
            Locale('de'), // German
            Locale('it'), // Italian
          ],
          localeResolutionCallback: (deviceLocale, supportedLocales) {
            // If device locale matches a supported one, use it
            for (final locale in supportedLocales) {
              if (locale.languageCode == deviceLocale?.languageCode) {
                return locale;
              }
            }
            // Default fallback to English
            return const Locale('en');
          },
          home: FutureBuilder<bool>(
            future: _checkSecurity(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Scaffold(
                    body: Center(child: CircularProgressIndicator()));
              }

              if (snapshot.data == false) {
                return const Scaffold(
                  backgroundColor: Colors.black,
                  body: Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.security, color: Colors.red, size: 80),
                          SizedBox(height: 24),
                          Text(
                            "Güvenlik Uyarısı",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 16),
                          Text(
                            "Cihazınızın güvenliği ihlal edilmiş (Root/Jailbreak) veya güvenli olmayan bir ortam tespit edilmiştir. Uygulama güvenliğiniz için bu cihazda çalıştırılamaz.",
                            textAlign: TextAlign.center,
                            style:
                                TextStyle(color: Colors.white70, fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }

              return const SplashScreen();
            },
          ),
        );
      },
    );
  }

  Future<bool> _checkSecurity() async {
    // Import dynamically or use the service
    // We need to import security_service.dart
    // Just returning result of init()
    final securityService = SecurityService(); // Get instance
    return await securityService.init();
  }
}
