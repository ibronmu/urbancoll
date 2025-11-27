
import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/services/firestore_service.dart';

class AuthServiceException implements Exception {
  final String code;

  AuthServiceException(this.code);
}

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirestoreService _db = FirestoreService();

  // Create a user object based on Firebase's User and data from Firestore
  Future<AppUser?> _userFromFirebaseUser(User? user) async {
    if (user == null) {
      return null;
    }
    // Fetch user data from Firestore to get the role
    final appUser = await _db.getUser(user.uid);
    // If the user exists in Firestore, return an AppUser with the correct role.
    // Otherwise, it might be a new user, so default to 'user' role temporarily.
    // The registration process will solidify the role.
    return AppUser(uid: user.uid, role: appUser?.role ?? 'user');
  }

  // Auth change user stream
  Stream<AppUser?> get user {
    return _auth.authStateChanges().asyncMap(_userFromFirebaseUser);
  }

  // Sign in with email & password
  Future<AppUser?> signInWithEmailAndPassword(String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
      User? user = result.user;
      return await _userFromFirebaseUser(user);
    } on FirebaseAuthException catch (e) {
      throw AuthServiceException(e.code);
    } catch (e) {
      debugPrint(e.toString());
      throw AuthServiceException('unknown-error');
    }
  }

  // Register with email & password
  Future<AppUser?> registerWithEmailAndPassword(
      String email, String password) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      User? user = result.user;

      // Create a new document for the user with the uid and default role
      await _db.setUser(user!.uid, {'email': email, 'role': 'user'});
      return await _userFromFirebaseUser(user);
    } on FirebaseAuthException catch (e) {
      throw AuthServiceException(e.code);
    } catch (e) {
      debugPrint(e.toString());
      throw AuthServiceException('unknown-error');
    }
  }

  // Sign out
  Future<void> signOut() async {
    try {
      return await _auth.signOut();
    } catch (e) {
      debugPrint(e.toString());
      return;
    }
  }
}
