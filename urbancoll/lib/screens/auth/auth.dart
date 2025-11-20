import 'package:flutter/material.dart';
import '../../services/api.dart';

class AuthPage extends StatefulWidget {
  final Function(String token) onLogin;
  const AuthPage({super.key, required this.onLogin});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _firstName = TextEditingController();
  final _lastName = TextEditingController();
  bool loading = false;
  String? error;
  bool isRegister = false;

  Future<void> _login() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final res = await Api.login(_email.text.trim(), _password.text.trim());
      final token = res['data']?['accessToken'] as String?;
      if (token != null) widget.onLogin(token);
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> _register() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final body = {
        'email': _email.text.trim(),
        'password': _password.text.trim(),
        'firstName': _firstName.text.trim(),
        'lastName': _lastName.text.trim(),
      };
      final res = await Api.register(body);
      final token = res['data']?['accessToken'] as String?;
      if (token != null) widget.onLogin(token);
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _email,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _password,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            if (isRegister) ...[
              const SizedBox(height: 8),
              TextField(
                controller: _firstName,
                decoration: const InputDecoration(labelText: 'First name'),
              ),
              TextField(
                controller: _lastName,
                decoration: const InputDecoration(labelText: 'Last name'),
              ),
            ],
            const SizedBox(height: 16),
            if (error != null)
              Text(error!, style: const TextStyle(color: Colors.red)),
            ElevatedButton(
              onPressed: loading ? null : (isRegister ? _register : _login),
              child: loading
                  ? const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Text(isRegister ? 'Register' : 'Login'),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: loading
                  ? null
                  : () {
                      setState(() {
                        isRegister = !isRegister;
                        error = null;
                      });
                    },
              child: Text(
                isRegister ? 'Have an account? Login' : 'Create an account',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
