
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:urbancoll/models/product_model.dart';
import 'package:urbancoll/models/user_model.dart' as model;

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<void> addUser(model.User user) async {
    await _db.collection('users').doc(user.id).set({
      'name': user.name,
      'email': user.email,
      'isVendor': user.isVendor,
    });
  }

  Future<model.User> getUser(String id) async {
    final doc = await _db.collection('users').doc(id).get();
    return model.User(
      id: doc.id,
      name: doc.data()!['name'],
      email: doc.data()!['email'],
      isVendor: doc.data()!['isVendor'],
    );
  }

  Future<void> addProduct(Product product) async {
    await _db.collection('products').add({
      'name': product.name,
      'description': product.description,
      'price': product.price,
      'imageUrl': product.imageUrl,
      'vendorId': product.vendorId,
    });
  }

  Stream<List<Product>> getProducts() {
    return _db.collection('products').snapshots().map((snapshot) => snapshot.docs
        .map((doc) => Product(
              id: doc.id,
              name: doc.data()['name'],
              description: doc.data()['description'],
              price: doc.data()['price'],
              imageUrl: doc.data()['imageUrl'],
              vendorId: doc.data()['vendorId'],
            ))
        .toList());
  }

  Stream<List<Product>> getVendorProducts(String vendorId) {
    return _db
        .collection('products')
        .where('vendorId', isEqualTo: vendorId)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product(
                  id: doc.id,
                  name: doc.data()['name'],
                  description: doc.data()['description'],
                  price: doc.data()['price'],
                  imageUrl: doc.data()['imageUrl'],
                  vendorId: doc.data()['vendorId'],
                ))
            .toList());
  }

  Future<void> updateProduct(Product product) async {
    await _db.collection('products').doc(product.id).update({
      'name': product.name,
      'description': product.description,
      'price': product.price,
      'imageUrl': product.imageUrl,
    });
  }

  Future<void> deleteProduct(String productId) async {
    await _db.collection('products').doc(productId).delete();
  }
}
