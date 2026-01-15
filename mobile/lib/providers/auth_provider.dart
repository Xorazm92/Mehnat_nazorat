import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  String? _userId;
  String? _userName;
  bool _isLoading = false;

  bool get isAuthenticated => _token != null;
  bool get isLoading => _isLoading;
  String? get token => _token;
  String? get userId => _userId;
  String? get userName => _userName;

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      // API call here
      // For demo, we'll use mock data
      await Future.delayed(const Duration(seconds: 2));

      if (username == 'admin' && password == 'password') {
        _token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
        _userId = '12345';
        _userName = username;
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void logout() {
    _token = null;
    _userId = null;
    _userName = null;
    notifyListeners();
  }
}
