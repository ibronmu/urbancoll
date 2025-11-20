import 'dart:convert';
import 'package:http/http.dart' as http;

class Api {
  // Adjust this base URL if your backend runs elsewhere.
  static const String baseUrl = 'http://10.0.2.2:4000';

  static Future<Map<String, dynamic>> getProducts() async {
    final res = await http.get(Uri.parse('$baseUrl/products'));
    if (res.statusCode != 200) throw Exception('Failed to load products');
    return json.decode(res.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );
    if (res.statusCode != 200) throw Exception('Login failed');
    return json.decode(res.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> register(
    Map<String, dynamic> body,
  ) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(body),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw Exception('Register failed');
    }
    return json.decode(res.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> getVendorMe(String token) async {
    final res = await http.get(
      Uri.parse('$baseUrl/vendors/me'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (res.statusCode != 200) throw Exception('Failed to load vendor');
    return json.decode(res.body) as Map<String, dynamic>;
  }
}
