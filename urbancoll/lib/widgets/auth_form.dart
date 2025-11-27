
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/services/auth_service.dart';

class AuthForm extends StatefulWidget {
  const AuthForm({super.key});

  @override
  State<AuthForm> createState() => _AuthFormState();
}

class _AuthFormState extends State<AuthForm> {
  final _formKey = GlobalKey<FormState>();
  bool _isLogin = true;
  bool _isLoading = false;
  String _email = '';
  String _password = '';

  void _trySubmit() async {
    final isValid = _formKey.currentState!.validate();
    FocusScope.of(context).unfocus();

    if (isValid) {
      _formKey.currentState!.save();
      setState(() {
        _isLoading = true;
      });
      try {
        final authService = Provider.of<AuthService>(context, listen: false);
        if (_isLogin) {
          await authService.signInWithEmailAndPassword(_email, _password);
        } else {
          await authService.registerWithEmailAndPassword(_email, _password);
        }
        // No need to set _isLoading to false here because the stream will rebuild the widget
      } on AuthServiceException catch (e) {
        String message = 'An error occurred, please check your credentials!';

        switch (e.code) {
          case 'user-not-found':
            message = 'No user found for that email. Please sign up.';
            break;
          case 'wrong-password':
            message = 'Wrong password. Please try again.';
            break;
          case 'weak-password':
            message = 'The password is too weak. Please use a stronger password.';
            break;
          case 'email-already-in-use':
            message = 'An account already exists for that email. Please log in.';
            break;
          default:
            message = 'Something went wrong. Please try again later.';
        }

        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(message),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
        setState(() {
          _isLoading = false;
        });
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Something went wrong. Please try again later.'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Semantics(
            textField: true,
            label: 'Email Address',
            hint: 'Enter your email address',
            child: TextFormField(
              key: const ValueKey('email'),
              autofocus: true,
              validator: (value) {
                if (value!.isEmpty || !value.contains('@')) {
                  return 'Please enter a valid email address.';
                }
                return null;
              },
              onSaved: (value) {
                _email = value!;
              },
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email address',
                hintText: 'Enter your email',
              ),
            ),
          ),
          const SizedBox(height: 12),
          Semantics(
            textField: true,
            label: 'Password',
            hint: 'Enter your password, must be at least 7 characters long.',
            child: TextFormField(
              key: const ValueKey('password'),
              validator: (value) {
                if (value!.isEmpty || value.length < 7) {
                  return 'Password must be at least 7 characters long.';
                }
                return null;
              },
              onSaved: (value) {
                _password = value!;
              },
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
                hintText: 'Enter your password',
              ),
            ),
          ),
          const SizedBox(height: 20),
          if (_isLoading)
            const CircularProgressIndicator()
          else
            FilledButton(
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
              ),
              onPressed: _trySubmit,
              child: Text(_isLogin ? 'Login' : 'Signup'),
            ),
          const SizedBox(height: 12),
          if (!_isLoading)
            TextButton(
              onPressed: () {
                setState(() {
                  _isLogin = !_isLogin;
                });
              },
              child: Text(_isLogin
                  ? 'Create new account'
                  : 'I already have an account'),
            )
        ],
      ),
    );
  }
}
