
import 'package:urbancoll/models/product.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});

  // Convert a CartItem to a map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'productId': product.id,
      'quantity': quantity,
      // Store product details for easier access in the cart
      'productName': product.name,
      'productPrice': product.price,
      'productImageUrl': product.imageUrl,
    };
  }

  // Create a CartItem from a Firestore map
  factory CartItem.fromMap(Map<String, dynamic> map, Product product) {
    return CartItem(
      product: product,
      quantity: map['quantity'] ?? 1,
    );
  }
}
