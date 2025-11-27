
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/models/product.dart';
import 'package:urbancoll/screens/product/product_detail_screen.dart';
import 'package:urbancoll/screens/vendor/add_product.dart';
import 'package:urbancoll/services/auth_service.dart';
import 'package:urbancoll/services/firestore_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final FirestoreService db;
  late final AuthService auth;

  @override
  void initState() {
    super.initState();
    db = Provider.of<FirestoreService>(context, listen: false);
    auth = Provider.of<AuthService>(context, listen: false);
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AppUser?>(context);
    final isVendor = user?.role == 'vendor';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            tooltip: 'Sign Out',
            onPressed: () async {
              await auth.signOut();
            },
          )
        ],
      ),
      body: StreamBuilder<List<Product>>(
        stream: db.getProducts(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text(
                'No products available right now. Please check back later!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
            );
          }

          final allProducts = snapshot.data!;
          final products = allProducts
              .where((p) => p.category.toLowerCase() == 'product')
              .toList();
          final services = allProducts
              .where((p) => p.category.toLowerCase() == 'service')
              .toList();
          final eateries = allProducts
              .where((p) => p.category.toLowerCase() == 'eatery')
              .toList();

          return ListView(
            children: [
              _buildCategorySection('Products', products, context),
              _buildCategorySection('Services', services, context),
              _buildCategorySection('Eateries', eateries, context),
            ],
          );
        },
      ),
      floatingActionButton: isVendor
          ? FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AddProductScreen(),
                  ),
                );
              },
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  Widget _buildCategorySection(
      String title, List<Product> products, BuildContext context) {
    if (products.isEmpty) {
      return Container();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            title,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
        SizedBox(
          height: 250,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return SizedBox(
                width: 200,
                child: Card(
                  margin: const EdgeInsets.all(8.0),
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ProductDetailScreen(product: product),
                        ),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Center(
                            child: Image.network(
                              product.imageUrl,
                              fit: BoxFit.cover,
                              semanticLabel: 'Image of ${product.name}',
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '\$${product.price}',
                                style: TextStyle(
                                  color: Colors.grey[800],
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
