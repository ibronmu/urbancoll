
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/models/product.dart';
import 'package:urbancoll/services/firestore_service.dart';

class AddProductScreen extends StatefulWidget {
  const AddProductScreen({super.key});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final _formKey = GlobalKey<FormState>();

  String name = '';
  String description = '';
  double price = 0;
  String imageUrl = '';
  String category = 'Product'; // Default category

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<FirestoreService>(context, listen: false);
    final user = Provider.of<AppUser?>(context, listen: false);
    final navigator = Navigator.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Product'),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 50),
          child: Form(
            key: _formKey,
            child: Column(
              children: <Widget>[
                const SizedBox(height: 20),
                TextFormField(
                  autofocus: true,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    hintText: 'Enter product name',
                  ),
                  validator: (val) => val!.isEmpty ? 'Enter a name' : null,
                  onChanged: (val) {
                    setState(() => name = val);
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    hintText: 'Enter product description',
                  ),
                  validator: (val) =>
                      val!.isEmpty ? 'Enter a description' : null,
                  onChanged: (val) {
                    setState(() => description = val);
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Price',
                    hintText: 'Enter product price',
                  ),
                  keyboardType: TextInputType.number,
                  validator: (val) =>
                      val!.isEmpty ? 'Enter a price' : null,
                  onChanged: (val) {
                    setState(() => price = double.parse(val));
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Image URL',
                    hintText: 'Enter product image URL',
                  ),
                  validator: (val) => val!.isEmpty ? 'Enter an image URL' : null,
                  onChanged: (val) {
                    setState(() => imageUrl = val);
                  },
                ),
                const SizedBox(height: 20),
                DropdownButtonFormField<String>(
                  initialValue: category,
                  decoration: const InputDecoration(
                    labelText: 'Category',
                  ),
                  items: <String>['Product', 'Service', 'Eatery']
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      category = newValue!;
                    });
                  },
                ),
                const SizedBox(height: 40),
                FilledButton.icon(
                  icon: const Icon(Icons.add),
                  label: const Text('Add Product'),
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      if (user != null) {
                        await db.addProduct(Product(
                          id: '', // Firestore will generate the ID
                          name: name,
                          description: description,
                          price: price,
                          imageUrl: imageUrl,
                          category: category, // Add the category
                          vendorId: user.uid, // Correctly use the user's UID
                        ));
                        navigator.pop();
                      }
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
