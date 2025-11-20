import 'package:flutter/material.dart';
import '../../services/api.dart';

class VendorDashboard extends StatefulWidget {
  final String token;
  const VendorDashboard({super.key, required this.token});

  @override
  State<VendorDashboard> createState() => _VendorDashboardState();
}

class _VendorDashboardState extends State<VendorDashboard> {
  Map<String, dynamic>? vendor;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await Api.getVendorMe(widget.token);
      setState(() {
        vendor = res['data'];
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Vendor Dashboard')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Business: ${vendor?['businessName'] ?? ''}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Description: ${vendor?['description'] ?? ''}'),
                  const SizedBox(height: 8),
                  Text(
                    'Products: ${(vendor?['products'] as List? ?? []).length}',
                  ),
                ],
              ),
            ),
    );
  }
}
