
import 'package:flutter/material.dart';
import 'package:urbancoll/services/auth_service.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final AuthService _auth = AuthService();
  final _formKey = GlobalKey<FormState>();

  //text field state
  String email = '';
  String password = '';
  String error = '';

  bool isLogin = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isLogin ? 'Login' : 'Sign Up'),
        elevation: 0, // Remove shadow for a flatter look
      ),
      // Use a light grey background for better contrast
      backgroundColor: Colors.grey[200],
      body: Center( // Center the content
        child: SingleChildScrollView( // Allow scrolling on smaller screens
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
            // Constrain the width for larger screens
            constraints: const BoxConstraints(maxWidth: 500),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch, // Stretch buttons to full width
                children: <Widget>[
                  // Add a nice header
                  Text(
                    isLogin ? 'Welcome Back!' : 'Create an Account',
                    style: Theme.of(context).textTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 30),
                  TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Email',
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide.none, // No border
                      ),
                    ),
                    validator: (val) => val!.isEmpty ? 'Enter an email' : null,
                    onChanged: (val) {
                      setState(() => email = val);
                    },
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 20),
                  TextFormField(
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    validator: (val) =>
                        val!.length < 6 ? 'Enter a password 6+ chars long' : null,
                    onChanged: (val) {
                      setState(() => password = val);
                    },
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                    child: Text(isLogin ? 'Login' : 'Sign Up'),
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        dynamic result = isLogin
                            ? await _auth.signInWithEmailAndPassword(email, password)
                            : await _auth.signUpWithEmailAndPassword(email, password);
                        if (result == null && mounted) {
                          setState(() => error =
                              'Could not sign in with those credentials.');
                        }
                      }
                    },
                  ),
                  const SizedBox(height: 12),
                  if (error.isNotEmpty)
                    Text(
                      error,
                      style: const TextStyle(color: Colors.red, fontSize: 14),
                      textAlign: TextAlign.center,
                    ),
                  TextButton(
                    child: Text(isLogin
                        ? 'Don\'t have an account? Sign up'
                        : 'Have an account? Login'),
                    onPressed: () {
                      setState(() {
                        isLogin = !isLogin;
                        error = ''; // Clear error on switch
                      });
                    },
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
