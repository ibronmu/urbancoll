
import 'package:flutter/material.dart';
import 'package:urbancoll/models/product_model.dart';
import 'package:urbancoll/services/auth_service.dart';
import 'package:urbancoll/services/firestore_service.dart';

class AddProductScreen extends StatefulWidget {
  const AddProductScreen({super.key});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final FirestoreService _db = FirestoreService();
  final AuthService _auth = AuthService();
  final _formKey = GlobalKey<FormState>();

  String name = '';
  String description = '';
  double price = 0;
  String imageUrl = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Product'),
      ),
      body: Container(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 50),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              TextFormField(
                decoration: const InputDecoration(labelText: 'Name'),
                validator: (val) => val!.isEmpty ? 'Enter a name' : null,
                onChanged: (val) {
                  setState(() => name = val);
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Description'),
                validator: (val) =>
                    val!.isEmpty ? 'Enter a description' : null,
                onChanged: (val) {
                  setState(() => description = val);
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Price'),
                keyboardType: TextInputType.number,
                validator: (val) =>
                    val!.isEmpty ? 'Enter a price' : null,
                onChanged: (val) {
                  setState(() => price = double.parse(val));
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Image URL'),
                validator: (val) => val!.isEmpty ? 'Enter an image URL' : null,
                onChanged: (val) {
                  setState(() => imageUrl = val);
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                child: const Text('Add Product'),
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    await _db.addProduct(Product(
                      id: '',
                      name: name,
                      description: description,
                      price: price,
                      imageUrl: imageUrl,
                      vendorId: _auth.getCurrentUser()!.uid,
                    ));
                    Navigator.pop(context);
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
