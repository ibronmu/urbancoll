
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:urbancoll/models/cart_item.dart';

class Order {
  final String id;
  final List<CartItem> items;
  final double total;
  final DateTime timestamp;

  Order({
    required this.id,
    required this.items,
    required this.total,
    required this.timestamp,
  });

  // Convert an Order to a map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'items': items.map((item) => item.toMap()).toList(),
      'total': total,
      'timestamp': FieldValue.serverTimestamp(),
    };
  }
}
