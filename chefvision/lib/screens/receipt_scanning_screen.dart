import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/pantry_service.dart';
import '../widgets/app_snackbar.dart';
import '../models/receipt_analysis_response.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';

class ReceiptScanningScreen extends StatefulWidget {
  const ReceiptScanningScreen({super.key});

  @override
  State<ReceiptScanningScreen> createState() => _ReceiptScanningScreenState();
}

class _ReceiptScanningScreenState extends State<ReceiptScanningScreen> {
  final ImagePicker _picker = ImagePicker();
  XFile? _xFile;
  Uint8List? _imageBytes;
  bool _isLoading = false;
  ReceiptAnalysisResponse? _result;

  Future<void> _pickImage(ImageSource source) async {
    final XFile? photo = await _picker.pickImage(source: source);
    if (photo != null) {
      final bytes = await photo.readAsBytes();
      setState(() {
        _xFile = photo;
        _imageBytes = bytes;
        _result = null;
      });
      _analyzeImage();
    }
  }

  Future<void> _analyzeImage() async {
    if (_xFile == null) return;

    setState(() {
      _isLoading = true;
    });

    final result = await pantryService.analyzeReceipt(_xFile!);

    setState(() {
      _isLoading = false;
      _result = result;
    });

    if (result == null || !result.success) {
      if (mounted) {
        AppSnackBar.error(
            context,
            result?.message ??
                AppLocalizations.of(context)!.receiptAnalysisFailed);
      }
    }
  }

  Future<void> _addItemsToPantry() async {
    if (_result == null || _result!.items.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    int addedCount = 0;
    for (var item in _result!.items) {
      await pantryService.addPantryItem(
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
      );
      addedCount++;
    }

    setState(() {
      _isLoading = false;
    });

    if (mounted) {
      AppSnackBar.success(context,
          AppLocalizations.of(context)!.productsAddedToPantry(addedCount));
      Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.receiptScanTitle),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Image Preview Area
            GestureDetector(
              onTap: () => _pickImage(ImageSource.gallery),
              child: Container(
                height: 250,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[400]!),
                ),
                child: _imageBytes != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.memory(_imageBytes!, fit: BoxFit.contain),
                      )
                    : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt,
                              size: 50, color: Colors.grey[600]),
                          const SizedBox(height: 8),
                          Text(AppLocalizations.of(context)!.tapToSelectReceipt,
                              style: TextStyle(color: Colors.grey[700])),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 16),

            // Camera Button
            if (_imageBytes == null)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => _pickImage(ImageSource.camera),
                  icon: const Icon(Icons.camera),
                  label: Text(AppLocalizations.of(context)!.openCamera),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),

            // Loading Indicator
            if (_isLoading) ...[
              const SizedBox(height: 24),
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(AppLocalizations.of(context)!.analyzingReceipt,
                  textAlign: TextAlign.center),
            ],

            // Results List
            if (!_isLoading && _result != null && _result!.success) ...[
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    AppLocalizations.of(context)!
                        .foundProducts(_result!.items.length),
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  if (_result!.totalAmount != null)
                    Chip(
                      label: Text(AppLocalizations.of(context)!
                          .totalAmount(_result!.totalAmount!)),
                      backgroundColor: Colors.green[100],
                    ),
                ],
              ),
              const SizedBox(height: 8),
              if (_result!.items.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(AppLocalizations.of(context)!.noProductsFound),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _result!.items.length,
                  itemBuilder: (context, index) {
                    final item = _result!.items[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          child: Text(item.ingredientName.isNotEmpty
                              ? item.ingredientName[0].toUpperCase()
                              : '?'),
                        ),
                        title: Text(item.ingredientName),
                        subtitle: Text(
                            '${item.quantity} ${item.unit} ${item.price != null ? "• ${item.price} TL" : ""}'),
                        trailing: IconButton(
                          icon: const Icon(Icons.close, color: Colors.red),
                          onPressed: () {
                            setState(() {
                              _result!.items.removeAt(index);
                            });
                          },
                        ),
                      ),
                    );
                  },
                ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _addItemsToPantry,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(AppLocalizations.of(context)!.addAllToPantry),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
