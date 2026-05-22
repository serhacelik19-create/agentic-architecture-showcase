import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../main.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';

class IapService extends ChangeNotifier {
  static final IapService _instance = IapService._internal();
  factory IapService() => _instance;
  IapService._internal();

  final InAppPurchase _iap = InAppPurchase.instance;
  late StreamSubscription<List<PurchaseDetails>> _subscription;
  bool _listenerAttached = false;

  List<ProductDetails> _products = [];
  List<ProductDetails> get products => _products;

  bool _isAvailable = false;
  bool get isAvailable => _isAvailable;

  bool _purchasePending = false;
  bool get purchasePending => _purchasePending;

  String? _error;
  String? get error => _error;

  /// Callback triggered when a subscription is successfully verified.
  /// Used by HomeScreen to refresh AuthProvider without restarting the app.
  VoidCallback? onSubscriptionVerified;

  // Product IDs (Must match store configuration)
  static const Set<String> _kProductIds = {
    'com.chefvision.plus',
    'com.chefvision.pro',
    'com.chefvision.premium',
  };

  // --- Offline Queue Config ---
  static const String _kQueuePrefix = 'pending_iap_';

  Future<void> init() async {
    _isAvailable = await _iap.isAvailable();
    notifyListeners();

    if (_isAvailable && !_listenerAttached) {
      final Stream<List<PurchaseDetails>> purchaseUpdated = _iap.purchaseStream;
      _subscription = purchaseUpdated.listen(
        (purchaseDetailsList) {
          _listenToPurchaseUpdated(purchaseDetailsList);
        },
        onDone: () {
          _subscription.cancel();
        },
        onError: (error) {
          _handleError(error);
        },
      );
      _listenerAttached = true;
    }

    if (_isAvailable) {
      if (_products.isEmpty) {
        await _loadProducts();
      }

      // Retry pending transactions from offline queue
      await _restorePendingTransactions();
    }
  }

  Future<void> _loadProducts() async {
    try {
      final ProductDetailsResponse response =
          await _iap.queryProductDetails(_kProductIds);
      if (response.notFoundIDs.isNotEmpty) {
        debugPrint('Products not found: ${response.notFoundIDs}');
      }
      _products = response.productDetails;
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading products: $e');
    }
  }

  Future<void> buyProduct(ProductDetails product) async {
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: product);
    _purchasePending = true;
    _error = null;
    notifyListeners();

    try {
      await _iap.buyNonConsumable(purchaseParam: purchaseParam);
    } catch (e) {
      _purchasePending = false;
      final context = navigatorKey.currentContext;
      if (context != null) {
        _error = AppLocalizations.of(context)!.iapErrorStarted(e.toString());
      } else {
        _error = "Could not start purchase: $e";
      }
      notifyListeners();
    }
  }

  Future<void> _listenToPurchaseUpdated(
      List<PurchaseDetails> purchaseDetailsList) async {
    for (final PurchaseDetails purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        _purchasePending = true;
        notifyListeners();
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          _handleError(purchaseDetails.error!);
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
            purchaseDetails.status == PurchaseStatus.restored) {
          // 1. Save to Offline Queue (Persistence)
          await _savePendingTransaction(purchaseDetails);

          // 2. Try to Verify
          final bool valid = await _verifyPurchase(purchaseDetails);

          if (valid) {
            // 3. Remove from Queue on Success
            await _removePendingTransaction(purchaseDetails.purchaseID!);

            if (purchaseDetails.pendingCompletePurchase) {
              await _iap.completePurchase(purchaseDetails);
            }
          } else {
            // Keep in queue, user sees error or pending state.
            // Next app launch will retry because it remains in SharedPreferences.
            final context = navigatorKey.currentContext;
            if (context != null) {
              _error = AppLocalizations.of(context)!.iapErrorVerification;
            } else {
              _error = "Verification failed.";
            }
          }
        }

        if (purchaseDetails.pendingCompletePurchase &&
            purchaseDetails.status != PurchaseStatus.purchased) {
          // For failed/canceled transactions, we should complete them to remove from queue
          if (purchaseDetails.status == PurchaseStatus.error ||
              purchaseDetails.status == PurchaseStatus.canceled) {
            await _iap.completePurchase(purchaseDetails);
          }
        }

        _purchasePending = false;
        notifyListeners();
      }
    }
  }

  Future<bool> _verifyPurchase(PurchaseDetails purchaseDetails) async {
    try {
      final token = authService.token;
      if (token == null) return false;

      // Determine platform
      String platform = 'android';
      if (kIsWeb) {
        platform = 'web';
      } else if (!kIsWeb && Platform.isIOS) {
        platform = 'ios';
      }

      final success = await apiService.verifySubscription(
        receiptData: purchaseDetails.verificationData.serverVerificationData,
        platform: platform,
        productId: purchaseDetails.productID,
        price: 0.0,
        currency: null,
      );

      if (success) {
        // Force profile refresh
        await authService.getProfile();
        // Notify listeners (e.g. AuthProvider) that subscription changed
        onSubscriptionVerified?.call();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Verify error: $e');
      return false;
    }
  }

  Future<void> restorePurchases() async {
    await init();

    if (!_isAvailable) {
      final context = navigatorKey.currentContext;
      if (context != null) {
        _error = AppLocalizations.of(context)!.iapErrorGeneral(
          'Store is unavailable.',
        );
      } else {
        _error = 'Store is unavailable.';
      }
      notifyListeners();
      return;
    }

    _error = null;
    _purchasePending = true;
    notifyListeners();

    try {
      await _iap.restorePurchases();
    } catch (e) {
      _purchasePending = false;
      final context = navigatorKey.currentContext;
      if (context != null) {
        _error = AppLocalizations.of(context)!.iapErrorGeneral(e.toString());
      } else {
        _error = 'Restore failed: $e';
      }
      notifyListeners();
    }
  }

  void _handleError(dynamic error) {
    // dynamic because IAPError might vary or stick to IAPError type if imported
    _purchasePending = false;
    final context = navigatorKey.currentContext;
    if (context != null) {
      _error = AppLocalizations.of(context)!.iapErrorGeneral(error.toString());
    } else {
      _error = "Purchase error: $error";
    }
    notifyListeners();
  }

  // --- Offline Queue Logic ---

  Future<void> _savePendingTransaction(PurchaseDetails details) async {
    try {
      if (details.purchaseID == null) return;
      final prefs = await SharedPreferences.getInstance();
      final key = '$_kQueuePrefix${details.purchaseID}';

      // Store info needed for re-verification
      final data = {
        'productID': details.productID,
        'purchaseID': details.purchaseID,
        'verificationData': details.verificationData.serverVerificationData,
        'transactionDate': details.transactionDate,
        'status': details.status.toString(),
        'source': details.verificationData.source,
        'retryCount': 0,
      };

      await prefs.setString(key, jsonEncode(data));
      debugPrint('Saved pending transaction: $key');
    } catch (e) {
      debugPrint('Failed to save pending transaction: $e');
    }
  }

  Future<void> _removePendingTransaction(String purchaseID) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final key = '$_kQueuePrefix$purchaseID';
      await prefs.remove(key);
      debugPrint('Removed pending transaction: $key');
    } catch (e) {
      debugPrint('Failed to remove pending transaction: $e');
    }
  }

  Future<void> _restorePendingTransactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys().where((k) => k.startsWith(_kQueuePrefix));

      if (keys.isEmpty) return;

      debugPrint('Restoring ${keys.length} pending transactions...');

      for (final key in keys) {
        try {
          final jsonString = prefs.getString(key);
          if (jsonString != null) {
            final data = jsonDecode(jsonString) as Map<String, dynamic>;

            String platform = 'android';
            if (kIsWeb) {
              platform = 'web';
            } else if (Platform.isIOS) {
              platform = 'ios';
            }

            if (authService.token == null) {
              debugPrint('Skipping pending restore: No auth token');
              continue;
            }

            int retryCount = data['retryCount'] ?? 0;
            if (retryCount >= 3) {
              debugPrint(
                  'Transaction $key failed verification too many times, removing.');
              final context = navigatorKey.currentContext;
              if (context != null) {
                _error =
                    "${AppLocalizations.of(context)!.err_verification_failed} (ID: ${data['purchaseID']})";
                notifyListeners();
              }
              await prefs.remove(key);
              continue;
            }

            try {
              final success = await apiService.verifySubscription(
                receiptData: data['verificationData'],
                platform: platform,
                productId: data['productID'],
              );

              if (success) {
                await authService.getProfile();
                onSubscriptionVerified?.call();
                await prefs.remove(key); // Remove on success
                debugPrint('Restored and verified: $key');
              } else {
                debugPrint('Retry failed for: $key');
              }
            } catch (apiError) {
              debugPrint('API Error during restore: $apiError');
              // Increment retry count on failure
              data['retryCount'] = retryCount + 1;
              await prefs.setString(key, jsonEncode(data));
            }
          }
        } catch (e) {
          debugPrint('Error processing saved transaction $key: $e');
        }
      }
    } catch (e) {
      debugPrint('Failed to restore transactions: $e');
    }
  }

  Future<void> openSubscriptionManagement() async {
    Uri url;
    if (!kIsWeb && Platform.isIOS) {
      url = Uri.parse('https://apps.apple.com/account/subscriptions');
    } else {
      url = Uri.parse('https://play.google.com/store/account/subscriptions');
    }

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      debugPrint('Could not launch $url');
    }
  }
}

// Global instance
final iapService = IapService();
