import 'package:flutter/material.dart';

// ignore: must_be_immutable
class Products extends StatelessWidget {
  Products({super.key});
  List<String> products = ['hello', 'hi', 'hello there'];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      home: Scaffold(
        appBar: AppBar(centerTitle: true, title: Text('Urbancommerce')),
        body: Scaffold(
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (var product in products)
                Container(
                  padding: EdgeInsets.all(10),
                  margin: EdgeInsets.all(10),
                  decoration: BoxDecoration(color: Colors.blueGrey),
                  child: SizedBox(width: 100, child: Text(product)),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
