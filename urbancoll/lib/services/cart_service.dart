import 'package:flutter/foundation.dart';
import 'package:urbancoll/models/product.dart';

class CartService extends ChangeNotifier {
  final Map<String, Product> _items = {};

  Map<String, Product> get items => _items;

  double get total => _items.values.fold(0, (sum, item) => sum + item.price);

  void addItem(Product product) {
    _items.putIfAbsent(product.id, () => product);
    notifyListeners();
  }

  void removeItem(String productId) {
    _items.remove(productId);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}
