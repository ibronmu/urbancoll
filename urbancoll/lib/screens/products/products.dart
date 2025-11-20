import 'package:flutter/material.dart';
import '../../services/api.dart';

class Products extends StatefulWidget {
  const Products({super.key});

  @override
  State<Products> createState() => _ProductsState();
}

class _ProductsState extends State<Products> {
  List items = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await Api.getProducts();
      setState(() {
        items = res['data']?['items'] ?? [];
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
      appBar: AppBar(title: const Text('Products')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, idx) {
                final p = items[idx];
                return Card(
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text(p['name'] ?? 'Unnamed'),
                    subtitle: Text(p['description'] ?? ''),
                    trailing: Text('\$${p['price'] ?? ''}'),
                  ),
                );
              },
            ),
    );
  }
}
