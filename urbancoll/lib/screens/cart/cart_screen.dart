
import 'package:flutter/material.dart';
import '../../models/product_model.dart';

// A placeholder for a cart item
class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});
}

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  // --- DUMMY DATA ---
  // In a real app, you would get this from a state management solution (like Provider or Bloc)
  final List<CartItem> _cartItems = [
    CartItem(
      product: Product(
        id: '1',
        name: 'Classic White Tee',
        price: 29.99,
        imageUrl: 'https://via.placeholder.com/150/FFFFFF/000000?Text=T-Shirt',
        description: 'A classic white t-shirt, perfect for any occasion.',
      ),
      quantity: 2,
    ),
    CartItem(
      product: Product(
        id: '2',
        name: 'Denim Jeans',
        price: 89.99,
        imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=Jeans',
        description: 'High-quality denim jeans.',
      ),
      quantity: 1,
    ),
  ];
  // --- END DUMMY DATA ---

  double get _subtotal => _cartItems.fold(
      0.0, (total, item) => total + (item.product.price * item.quantity));
  double get _shipping => 5.99; // Example shipping cost
  double get _total => _subtotal + _shipping;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Cart'),
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (_cartItems.isEmpty) {
            return const Center(
              child: Text('Your cart is empty.'),
            );
          }
          // Use a two-column layout for wider screens
          if (constraints.maxWidth > 800) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 3,
                  child: _buildCartItemsList(),
                ),
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: _buildSummaryCard(),
                  ),
                ),
              ],
            );
          } else {
            // Use a single-column layout for narrower screens
            return Column(
              children: [
                Expanded(
                  child: _buildCartItemsList(),
                ),
                _buildSummaryCard(),
              ],
            );
          }
        },
      ),
    );
  }

  ListView _buildCartItemsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: _cartItems.length,
      itemBuilder: (context, index) {
        final item = _cartItems[index];
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Image.network(
                  item.product.imageUrl,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.product.name,
                          style: Theme.of(context).textTheme.titleMedium),
                      Text('\$${item.product.price.toStringAsFixed(2)}',
                          style: Theme.of(context).textTheme.titleSmall),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () {
                        setState(() {
                          if (item.quantity > 1) {
                            item.quantity--;
                          } else {
                            // Remove item if quantity is 1
                            _cartItems.removeAt(index);
                          }
                        });
                      },
                    ),
                    Text(item.quantity.toString(),
                        style: Theme.of(context).textTheme.titleMedium),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline),
                      onPressed: () {
                        setState(() {
                          item.quantity++;
                        });
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Card _buildSummaryCard() {
    return Card(
      // Remove margin for the single-column view to make it stick to the bottom
      margin: const EdgeInsets.all(16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min, // Take up minimum space
          children: [
            Text('Order Summary',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),
            _buildSummaryRow('Subtotal:', _subtotal),
            _buildSummaryRow('Shipping:', _shipping),
            const Divider(height: 32),
            _buildSummaryRow('Total:', _total, isTotal: true),
            const SizedBox(height: 24),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
              onPressed: () {
                // Checkout logic
              },
              child: const Text('Proceed to Checkout'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String title, double value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title,
              style: isTotal
                  ? Theme.of(context).textTheme.titleLarge
                  : Theme.of(context).textTheme.bodyLarge),
          Text('\$${value.toStringAsFixed(2)}',
              style: isTotal
                  ? Theme.of(context).textTheme.titleLarge
                  : Theme.of(context).textTheme.bodyLarge),
        ],
      ),
    );
  }
}
