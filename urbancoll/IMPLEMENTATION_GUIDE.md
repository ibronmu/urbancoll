# ArtisanHub - Implementation Guide
## Technical Deep Dive & Code Patterns

**Version:** 1.0  
**Last Updated:** November 17, 2025

---

## Table of Contents
1. [Data Models Implementation](#data-models-implementation)
2. [State Management Patterns](#state-management-patterns)
3. [Repository Pattern](#repository-pattern)
4. [API Integration](#api-integration)
5. [Authentication Flow](#authentication-flow)
6. [Error Handling](#error-handling)
7. [Testing Examples](#testing-examples)
8. [Code Style Guide](#code-style-guide)

---

## Data Models Implementation

### Base Model Structure

```dart
// lib/data/models/base/base_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'base_model.freezed.dart';
part 'base_model.g.dart';

@freezed
class BaseModel<T> with _$BaseModel<T> {
  const factory BaseModel({
    required T data,
    String? message,
    int? statusCode,
  }) = _BaseModel;

  factory BaseModel.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) =>
      _$BaseModelFromJson(json, fromJsonT);
}

// Pagination support
@freezed
class PaginatedResponse<T> with _$PaginatedResponse<T> {
  const factory PaginatedResponse({
    required List<T> items,
    required int page,
    required int pageSize,
    required int total,
    required bool hasMore,
  }) = _PaginatedResponse;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) =>
      _$PaginatedResponseFromJson(json, fromJsonT);
}
```

### User Models

```dart
// lib/data/models/user/user_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    required String phone,
    required String firstName,
    required String lastName,
    required String role,
    @Default(false) bool isEmailVerified,
    @Default(false) bool isPhoneVerified,
    String? profileImageUrl,
    @Default(0) double walletBalance,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

// Vendor specific model
@freezed
class VendorModel with _$VendorModel {
  const factory VendorModel({
    required String id,
    required String userId,
    required String businessName,
    required String businessDescription,
    required String vendorType, // 'product_seller' or 'service_artisan'
    String? businessLogoUrl,
    String? bankAccountId,
    @Default(0.0) double rating,
    @Default(0) int reviewCount,
    @Default(false) bool isVerified,
    @Default('pending') String status, // pending, verified, suspended, rejected
    DateTime? verificationDate,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _VendorModel;

  factory VendorModel.fromJson(Map<String, dynamic> json) =>
      _$VendorModelFromJson(json);
}

// Customer specific model
@freezed
class CustomerModel with _$CustomerModel {
  const factory CustomerModel({
    required String id,
    required String userId,
    @Default([]) List<String> savedAddresses,
    @Default([]) List<String> savedPaymentMethods,
    @Default(0.0) double walletBalance,
    @Default([]) List<String> wishlistItems,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _CustomerModel;

  factory CustomerModel.fromJson(Map<String, dynamic> json) =>
      _$CustomerModelFromJson(json);
}
```

### Product Models

```dart
// lib/data/models/product/product_model.dart
@freezed
class ProductModel with _$ProductModel {
  const factory ProductModel({
    required String id,
    required String vendorId,
    required String name,
    required String description,
    required double price,
    @Default(0.0) double discount,
    required List<String> imageUrls,
    required String category,
    @Default([]) List<String> subcategories,
    required int stock,
    @Default(0.0) double rating,
    @Default(0) int reviewCount,
    @Default([]) List<ProductVariantModel> variants,
    @Default('active') String status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _ProductModel;

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _$ProductModelFromJson(json);
}

@freezed
class ProductVariantModel with _$ProductVariantModel {
  const factory ProductVariantModel({
    required String id,
    required String productId,
    required String name,
    required List<String> values,
    @Default({}) Map<String, double> priceModifier,
    @Default({}) Map<String, int> stockByVariant,
  }) = _ProductVariantModel;

  factory ProductVariantModel.fromJson(Map<String, dynamic> json) =>
      _$ProductVariantModelFromJson(json);
}

@freezed
class ProductReviewModel with _$ProductReviewModel {
  const factory ProductReviewModel({
    required String id,
    required String productId,
    required String customerId,
    required String customerName,
    required double rating,
    required String comment,
    @Default([]) List<String> imageUrls,
    @Default(0) int helpfulCount,
    DateTime? createdAt,
  }) = _ProductReviewModel;

  factory ProductReviewModel.fromJson(Map<String, dynamic> json) =>
      _$ProductReviewModelFromJson(json);
}
```

### Service Models

```dart
// lib/data/models/service/service_model.dart
@freezed
class ServiceModel with _$ServiceModel {
  const factory ServiceModel({
    required String id,
    required String vendorId,
    required String name,
    required String description,
    required String category,
    required double basePrice,
    required List<ServicePackageModel> packages,
    @Default(0.0) double rating,
    @Default(0) int reviewCount,
    @Default([]) List<String> imageUrls,
    required int estimatedDurationMinutes,
    @Default('active') String status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _ServiceModel;

  factory ServiceModel.fromJson(Map<String, dynamic> json) =>
      _$ServiceModelFromJson(json);
}

@freezed
class ServicePackageModel with _$ServicePackageModel {
  const factory ServicePackageModel({
    required String id,
    required String serviceId,
    required String name,
    required String description,
    required double price,
    required int durationMinutes,
    @Default([]) List<String> features,
  }) = _ServicePackageModel;

  factory ServicePackageModel.fromJson(Map<String, dynamic> json) =>
      _$ServicePackageModelFromJson(json);
}

@freezed
class AvailabilityModel with _$AvailabilityModel {
  const factory AvailabilityModel({
    required String id,
    required String vendorId,
    required int dayOfWeek, // 0=Monday, 6=Sunday
    required List<TimeSlotModel> timeSlots,
    @Default([]) List<String> blockedDates,
  }) = _AvailabilityModel;

  factory AvailabilityModel.fromJson(Map<String, dynamic> json) =>
      _$AvailabilityModelFromJson(json);
}

@freezed
class TimeSlotModel with _$TimeSlotModel {
  const factory TimeSlotModel({
    required String id,
    required DateTime startTime,
    required DateTime endTime,
    required bool isAvailable,
    @Default(1) int maxCapacity,
    @Default(0) int currentBookings,
  }) = _TimeSlotModel;

  factory TimeSlotModel.fromJson(Map<String, dynamic> json) =>
      _$TimeSlotModelFromJson(json);
}
```

### Booking Models

```dart
// lib/data/models/booking/booking_model.dart
@freezed
class ServiceBookingModel with _$ServiceBookingModel {
  const factory ServiceBookingModel({
    required String id,
    required String customerId,
    required String vendorId,
    required String serviceId,
    required String servicePackageId,
    required DateTime bookingDate,
    required DateTime serviceDate,
    required TimeSlotModel selectedTimeSlot,
    @Default(1) int quantity,
    required double totalPrice,
    @Default([]) List<BookingAddonModel> addons,
    String? notes,
    @Default('pending') String status,
    String? cancellationReason,
    DateTime? cancelledAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _ServiceBookingModel;

  factory ServiceBookingModel.fromJson(Map<String, dynamic> json) =>
      _$ServiceBookingModelFromJson(json);
}

@freezed
class BookingAddonModel with _$BookingAddonModel {
  const factory BookingAddonModel({
    required String id,
    required String name,
    required double price,
  }) = _BookingAddonModel;

  factory BookingAddonModel.fromJson(Map<String, dynamic> json) =>
      _$BookingAddonModelFromJson(json);
}
```

### Order Models

```dart
// lib/data/models/order/order_model.dart
@freezed
class OrderModel with _$OrderModel {
  const factory OrderModel({
    required String id,
    required String customerId,
    required List<OrderItemModel> items,
    required double subtotal,
    @Default(0.0) double taxAmount,
    @Default(0.0) double shippingCost,
    @Default(0.0) double discountAmount,
    required double totalAmount,
    required PaymentInfoModel paymentInfo,
    required ShippingInfoModel shippingInfo,
    @Default([]) List<OrderTimelineModel> timeline,
    @Default('pending') String status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _OrderModel;

  factory OrderModel.fromJson(Map<String, dynamic> json) =>
      _$OrderModelFromJson(json);
}

@freezed
class OrderItemModel with _$OrderItemModel {
  const factory OrderItemModel({
    required String id,
    required String vendorId,
    required String productId,
    required String productName,
    required int quantity,
    required double unitPrice,
    Map<String, String>? selectedVariants,
    required double itemTotal,
  }) = _OrderItemModel;

  factory OrderItemModel.fromJson(Map<String, dynamic> json) =>
      _$OrderItemModelFromJson(json);
}

@freezed
class ShippingInfoModel with _$ShippingInfoModel {
  const factory ShippingInfoModel({
    required String firstName,
    required String lastName,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pinCode,
    required String country,
    required String phone,
    @Default('standard') String method,
    DateTime? estimatedDeliveryDate,
    String? trackingNumber,
  }) = _ShippingInfoModel;

  factory ShippingInfoModel.fromJson(Map<String, dynamic> json) =>
      _$ShippingInfoModelFromJson(json);
}

@freezed
class OrderTimelineModel with _$OrderTimelineModel {
  const factory OrderTimelineModel({
    required String status,
    required DateTime timestamp,
    String? description,
  }) = _OrderTimelineModel;

  factory OrderTimelineModel.fromJson(Map<String, dynamic> json) =>
      _$OrderTimelineModelFromJson(json);
}
```

### Payment Models

```dart
// lib/data/models/payment/payment_model.dart
@freezed
class PaymentModel with _$PaymentModel {
  const factory PaymentModel({
    required String id,
    String? orderId,
    String? bookingId,
    required double amount,
    @Default('USD') String currency,
    required String method,
    @Default('pending') String status,
    String? transactionId,
    String? gatewayReference,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _PaymentModel;

  factory PaymentModel.fromJson(Map<String, dynamic> json) =>
      _$PaymentModelFromJson(json);
}

@freezed
class PaymentInfoModel with _$PaymentInfoModel {
  const factory PaymentInfoModel({
    required String method,
    required String status,
    String? transactionId,
    String? gatewayReference,
    required DateTime paidAt,
  }) = _PaymentInfoModel;

  factory PaymentInfoModel.fromJson(Map<String, dynamic> json) =>
      _$PaymentInfoModelFromJson(json);
}

@freezed
class WalletModel with _$WalletModel {
  const factory WalletModel({
    required String userId,
    required double balance,
    @Default([]) List<WalletTransactionModel> transactions,
    DateTime? lastUpdated,
  }) = _WalletModel;

  factory WalletModel.fromJson(Map<String, dynamic> json) =>
      _$WalletModelFromJson(json);
}

@freezed
class WalletTransactionModel with _$WalletTransactionModel {
  const factory WalletTransactionModel({
    required String id,
    required String userId,
    required double amount,
    required String type, // credit, debit, refund
    required String description,
    required DateTime timestamp,
  }) = _WalletTransactionModel;

  factory WalletTransactionModel.fromJson(Map<String, dynamic> json) =>
      _$WalletTransactionModelFromJson(json);
}
```

---

## State Management Patterns

### Authentication State

```dart
// lib/presentation/notifiers/auth_notifier.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_notifier.freezed.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated({
    required UserModel user,
    required String accessToken,
    required String refreshToken,
  }) = _Authenticated;
  const factory AuthState.unauthenticated() = _Unauthenticated;
  const factory AuthState.error(String message) = _Error;
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;
  final LocalStorageService _storageService;

  AuthNotifier({
    required AuthRepository authRepository,
    required LocalStorageService storageService,
  })  : _authRepository = authRepository,
        _storageService = storageService,
        super(const AuthState.initial());

  /// Login with email and password
  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = const AuthState.loading();
    try {
      final result = await _authRepository.login(
        email: email,
        password: password,
      );

      result.when(
        success: (response) async {
          final user = response.user;
          final accessToken = response.accessToken;
          final refreshToken = response.refreshToken;

          // Store tokens securely
          await _storageService.saveToken(accessToken);
          await _storageService.saveRefreshToken(refreshToken);

          state = AuthState.authenticated(
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          );
        },
        failure: (failure) {
          state = AuthState.error(failure.message);
        },
      );
    } catch (e, st) {
      state = AuthState.error('Login failed: $e');
    }
  }

  /// Register new user
  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phone,
    required String role,
  }) async {
    state = const AuthState.loading();
    try {
      final result = await _authRepository.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role,
      );

      result.when(
        success: (response) async {
          final user = response.user;
          final accessToken = response.accessToken;
          final refreshToken = response.refreshToken;

          await _storageService.saveToken(accessToken);
          await _storageService.saveRefreshToken(refreshToken);

          state = AuthState.authenticated(
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          );
        },
        failure: (failure) {
          state = AuthState.error(failure.message);
        },
      );
    } catch (e, st) {
      state = AuthState.error('Registration failed: $e');
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await _authRepository.logout();
      await _storageService.clearAll();
      state = const AuthState.unauthenticated();
    } catch (e) {
      state = AuthState.error('Logout failed: $e');
    }
  }

  /// Refresh token
  Future<void> refreshAuthToken() async {
    try {
      final refreshToken = await _storageService.getRefreshToken();
      if (refreshToken == null) {
        state = const AuthState.unauthenticated();
        return;
      }

      final result = await _authRepository.refreshToken(refreshToken);
      result.when(
        success: (response) async {
          await _storageService.saveToken(response.accessToken);
          await _storageService.saveRefreshToken(response.refreshToken);

          state = AuthState.authenticated(
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          );
        },
        failure: (failure) {
          state = const AuthState.unauthenticated();
        },
      );
    } catch (e) {
      state = const AuthState.unauthenticated();
    }
  }

  /// Check if user is authenticated
  bool get isAuthenticated => state.maybeWhen(
        authenticated: (_, __, ___) => true,
        orElse: () => false,
      );

  /// Get current user
  UserModel? get currentUser => state.maybeWhen(
        authenticated: (user, _, __) => user,
        orElse: () => null,
      );
}

// Provider definitions
final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  final storageService = ref.watch(localStorageServiceProvider);
  return AuthNotifier(
    authRepository: authRepository,
    storageService: storageService,
  );
});

// Derived providers
final currentUserProvider = Provider<UserModel?>((ref) {
  return ref.watch(authNotifierProvider).maybeWhen(
        authenticated: (user, _, __) => user,
        orElse: () => null,
      );
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authNotifierProvider).maybeWhen(
        authenticated: (_, __, ___) => true,
        orElse: () => false,
      );
});

final accessTokenProvider = Provider<String?>((ref) {
  return ref.watch(authNotifierProvider).maybeWhen(
        authenticated: (_, token, __) => token,
        orElse: () => null,
      );
});
```

### Product State

```dart
// lib/presentation/notifiers/product_notifier.dart
@freezed
class ProductState with _$ProductState {
  const factory ProductState.initial() = _Initial;
  const factory ProductState.loading() = _Loading;
  const factory ProductState.success(List<ProductModel> products) = _Success;
  const factory ProductState.error(String message) = _Error;
}

class ProductNotifier extends StateNotifier<ProductState> {
  final ProductRepository _productRepository;
  int _currentPage = 1;
  final int _pageSize = 20;
  List<ProductModel> _allProducts = [];

  ProductNotifier({required ProductRepository productRepository})
      : _productRepository = productRepository,
        super(const ProductState.initial());

  /// Fetch products with pagination
  Future<void> fetchProducts({
    String? category,
    String? searchQuery,
    double? minPrice,
    double? maxPrice,
    bool refresh = false,
  }) async {
    if (refresh) {
      _currentPage = 1;
      _allProducts = [];
    }

    state = const ProductState.loading();
    try {
      final result = await _productRepository.getProducts(
        page: _currentPage,
        pageSize: _pageSize,
        category: category,
        searchQuery: searchQuery,
        minPrice: minPrice,
        maxPrice: maxPrice,
      );

      result.when(
        success: (paginatedResponse) {
          _allProducts.addAll(paginatedResponse.items);
          state = ProductState.success(_allProducts);
          _currentPage++;
        },
        failure: (failure) {
          state = ProductState.error(failure.message);
        },
      );
    } catch (e) {
      state = ProductState.error('Failed to fetch products: $e');
    }
  }

  /// Load more products (pagination)
  Future<void> loadMore({
    String? category,
    String? searchQuery,
  }) async {
    try {
      final result = await _productRepository.getProducts(
        page: _currentPage,
        pageSize: _pageSize,
        category: category,
        searchQuery: searchQuery,
      );

      result.when(
        success: (paginatedResponse) {
          _allProducts.addAll(paginatedResponse.items);
          state = ProductState.success(_allProducts);
          _currentPage++;
        },
        failure: (failure) {
          // Show error but keep existing products
        },
      );
    } catch (e) {
      // Silent fail on pagination error
    }
  }
}

// Family provider for single product details
final productDetailsProvider = FutureProvider.family<ProductModel, String>(
  (ref, productId) async {
    final repository = ref.watch(productRepositoryProvider);
    final result = await repository.getProductDetails(productId);

    return result.when(
      success: (product) => product,
      failure: (failure) => throw failure,
    );
  },
);

// Family provider for product reviews
final productReviewsProvider =
    FutureProvider.family<List<ProductReviewModel>, String>(
  (ref, productId) async {
    final repository = ref.watch(productRepositoryProvider);
    final result = await repository.getProductReviews(productId);

    return result.when(
      success: (reviews) => reviews,
      failure: (failure) => throw failure,
    );
  },
);
```

### Booking State

```dart
// lib/presentation/notifiers/booking_notifier.dart
@freezed
class BookingState with _$BookingState {
  const factory BookingState.initial() = _Initial;
  const factory BookingState.loading() = _Loading;
  const factory BookingState.availabilityLoaded(
    List<AvailabilityModel> availabilities,
  ) = _AvailabilityLoaded;
  const factory BookingState.bookingCreated(
    ServiceBookingModel booking,
  ) = _BookingCreated;
  const factory BookingState.error(String message) = _Error;
}

class BookingNotifier extends StateNotifier<BookingState> {
  final BookingRepository _bookingRepository;
  final ServiceRepository _serviceRepository;

  BookingNotifier({
    required BookingRepository bookingRepository,
    required ServiceRepository serviceRepository,
  })  : _bookingRepository = bookingRepository,
        _serviceRepository = serviceRepository,
        super(const BookingState.initial());

  /// Fetch availability for a service
  Future<void> fetchAvailability({
    required String serviceId,
    required String vendorId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    state = const BookingState.loading();
    try {
      final result = await _serviceRepository.getAvailability(
        vendorId: vendorId,
        startDate: startDate,
        endDate: endDate,
      );

      result.when(
        success: (availabilities) {
          state = BookingState.availabilityLoaded(availabilities);
        },
        failure: (failure) {
          state = BookingState.error(failure.message);
        },
      );
    } catch (e) {
      state = BookingState.error('Failed to fetch availability: $e');
    }
  }

  /// Create a new booking
  Future<void> createBooking({
    required String serviceId,
    required String servicePackageId,
    required DateTime serviceDate,
    required TimeSlotModel timeSlot,
    required int quantity,
    List<BookingAddonModel> addons = const [],
    String? notes,
  }) async {
    state = const BookingState.loading();
    try {
      final booking = ServiceBookingModel(
        id: '', // Server will generate
        customerId: '', // Will be set from auth context
        vendorId: '', // Will be fetched from service
        serviceId: serviceId,
        servicePackageId: servicePackageId,
        bookingDate: DateTime.now(),
        serviceDate: serviceDate,
        selectedTimeSlot: timeSlot,
        quantity: quantity,
        totalPrice: 0, // Will be calculated
        addons: addons,
        notes: notes,
      );

      final result = await _bookingRepository.createBooking(booking);

      result.when(
        success: (createdBooking) {
          state = BookingState.bookingCreated(createdBooking);
        },
        failure: (failure) {
          state = BookingState.error(failure.message);
        },
      );
    } catch (e) {
      state = BookingState.error('Failed to create booking: $e');
    }
  }

  /// Cancel a booking
  Future<void> cancelBooking({
    required String bookingId,
    required String reason,
  }) async {
    state = const BookingState.loading();
    try {
      final result = await _bookingRepository.cancelBooking(
        bookingId: bookingId,
        reason: reason,
      );

      result.when(
        success: (updatedBooking) {
          state = BookingState.bookingCreated(updatedBooking);
        },
        failure: (failure) {
          state = BookingState.error(failure.message);
        },
      );
    } catch (e) {
      state = BookingState.error('Failed to cancel booking: $e');
    }
  }
}

// Providers
final bookingNotifierProvider = StateNotifierProvider<BookingNotifier, BookingState>(
  (ref) {
    final bookingRepository = ref.watch(bookingRepositoryProvider);
    final serviceRepository = ref.watch(serviceRepositoryProvider);
    return BookingNotifier(
      bookingRepository: bookingRepository,
      serviceRepository: serviceRepository,
    );
  },
);

// Family provider for user's bookings
final userBookingsProvider = FutureProvider.family<List<ServiceBookingModel>, String>(
  (ref, userId) async {
    final repository = ref.watch(bookingRepositoryProvider);
    final result = await repository.getUserBookings(userId);

    return result.when(
      success: (bookings) => bookings,
      failure: (failure) => throw failure,
    );
  },
);
```

---

## Repository Pattern

### Authentication Repository

```dart
// lib/data/repositories/auth_repository.dart
abstract class IAuthRepository {
  Future<Result<LoginResponse>> login({
    required String email,
    required String password,
  });

  Future<Result<RegisterResponse>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phone,
    required String role,
  });

  Future<Result<RefreshTokenResponse>> refreshToken(String refreshToken);

  Future<Result<void>> logout();

  Future<Result<UserModel>> getCurrentUser();

  Future<Result<bool>> verifyEmail(String email, String token);
}

class AuthRepository implements IAuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final AuthLocalDataSource _localDataSource;

  AuthRepository({
    required AuthRemoteDataSource remoteDataSource,
    required AuthLocalDataSource localDataSource,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource;

  @override
  Future<Result<LoginResponse>> login({
    required String email,
    required String password,
  }) async {
    try {
      // Validate input
      if (email.isEmpty || password.isEmpty) {
        return Result.failure(AppFailure(message: 'Email and password are required'));
      }

      if (!_isValidEmail(email)) {
        return Result.failure(AppFailure(message: 'Invalid email format'));
      }

      // Call API
      final response = await _remoteDataSource.login(
        email: email,
        password: password,
      );

      // Save user locally
      await _localDataSource.saveUser(response.user);

      return Result.success(response);
    } on ApiException catch (e) {
      return Result.failure(AppFailure(message: e.message));
    } catch (e) {
      return Result.failure(AppFailure(message: 'An unexpected error occurred'));
    }
  }

  @override
  Future<Result<RegisterResponse>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phone,
    required String role,
  }) async {
    try {
      // Validate input
      final validation = _validateRegistration(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );

      if (validation != null) {
        return Result.failure(AppFailure(message: validation));
      }

      // Call API
      final response = await _remoteDataSource.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role,
      );

      // Save user locally
      await _localDataSource.saveUser(response.user);

      return Result.success(response);
    } on ApiException catch (e) {
      return Result.failure(AppFailure(message: e.message));
    } catch (e) {
      return Result.failure(AppFailure(message: 'Registration failed'));
    }
  }

  @override
  Future<Result<RefreshTokenResponse>> refreshToken(String refreshToken) async {
    try {
      final response = await _remoteDataSource.refreshToken(refreshToken);
      return Result.success(response);
    } on ApiException catch (e) {
      return Result.failure(AppFailure(message: e.message));
    }
  }

  @override
  Future<Result<void>> logout() async {
    try {
      await _remoteDataSource.logout();
      await _localDataSource.clearUser();
      return Result.success(null);
    } on ApiException catch (e) {
      return Result.failure(AppFailure(message: e.message));
    }
  }

  @override
  Future<Result<UserModel>> getCurrentUser() async {
    try {
      final user = await _localDataSource.getUser();
      if (user != null) {
        return Result.success(user);
      }
      return Result.failure(AppFailure(message: 'No user found'));
    } catch (e) {
      return Result.failure(AppFailure(message: 'Failed to get user'));
    }
  }

  @override
  Future<Result<bool>> verifyEmail(String email, String token) async {
    try {
      final result = await _remoteDataSource.verifyEmail(email, token);
      return Result.success(result);
    } on ApiException catch (e) {
      return Result.failure(AppFailure(message: e.message));
    }
  }

  // Validation helpers
  bool _isValidEmail(String email) {
    return RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email);
  }

  String? _validateRegistration({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phone,
  }) {
    if (email.isEmpty) return 'Email is required';
    if (!_isValidEmail(email)) return 'Invalid email format';
    if (password.isEmpty) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (firstName.isEmpty) return 'First name is required';
    if (lastName.isEmpty) return 'Last name is required';
    if (phone.isEmpty) return 'Phone number is required';
    return null;
  }
}

// Provider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remoteDataSource = ref.watch(authRemoteDataSourceProvider);
  final localDataSource = ref.watch(authLocalDataSourceProvider);
  return AuthRepository(
    remoteDataSource: remoteDataSource,
    localDataSource: localDataSource,
  );
});
```

---

## API Integration

### API Client Setup

```dart
// lib/data/datasources/remote/api_client.dart
import 'package:dio/dio.dart';

class ApiClient {
  late Dio _dio;
  final String baseUrl;

  ApiClient({required this.baseUrl}) {
    _setupDio();
  }

  void _setupDio() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onResponse: _onResponse,
        onError: _onError,
      ),
    );
  }

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Add auth token if available
    final token = await _getAuthToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  Future<void> _onResponse(
    Response response,
    ResponseInterceptorHandler handler,
  ) async {
    handler.next(response);
  }

  Future<void> _onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Handle token refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        try {
          final response = await _retry(err.requestOptions);
          handler.resolve(response);
          return;
        } catch (e) {
          handler.next(err);
        }
      }
    }
    handler.next(err);
  }

  Future<Response<dynamic>> _retry(RequestOptions requestOptions) async {
    final options = Options(
      method: requestOptions.method,
      headers: requestOptions.headers,
    );
    return _dio.request<dynamic>(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }

  // HTTP Methods
  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data as T;
    on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Helper methods
  Future<String?> _getAuthToken() async {
    // Retrieve from secure storage
    return null;
  }

  Future<bool> _refreshToken() async {
    // Implement token refresh logic
    return false;
  }

  ApiException _handleError(DioException error) {
    String message = 'An error occurred';
    int? statusCode;

    if (error.response != null) {
      statusCode = error.response!.statusCode;
      final data = error.response!.data;

      if (data is Map<String, dynamic>) {
        message = data['message'] ?? 'An error occurred';
      }
    } else if (error.type == DioExceptionType.connectionTimeout) {
      message = 'Connection timeout';
    } else if (error.type == DioExceptionType.receiveTimeout) {
      message = 'Receive timeout';
    } else if (error.type == DioExceptionType.sendTimeout) {
      message = 'Send timeout';
    }

    return ApiException(message, statusCode: statusCode);
  }
}

// Provider
final dioProvider = Provider<Dio>((ref) {
  const baseUrl = 'https://api.artisanhub.com';
  return Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ),
  );
});

final apiClientProvider = Provider<ApiClient>((ref) {
  const baseUrl = 'https://api.artisanhub.com';
  return ApiClient(baseUrl: baseUrl);
});
```

---

## Testing Examples

### Unit Test Example

```dart
// test/data/repositories/auth_repository_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

void main() {
  late AuthRepository authRepository;
  late MockAuthRemoteDataSource mockRemoteDataSource;
  late MockAuthLocalDataSource mockLocalDataSource;

  setUp(() {
    mockRemoteDataSource = MockAuthRemoteDataSource();
    mockLocalDataSource = MockAuthLocalDataSource();
    authRepository = AuthRepository(
      remoteDataSource: mockRemoteDataSource,
      localDataSource: mockLocalDataSource,
    );
  });

  group('AuthRepository.login', () {
    const email = 'test@example.com';
    const password = 'password123';

    test('returns LoginResponse on successful login', () async {
      // Arrange
      final mockResponse = LoginResponse(
        user: UserModel(
          id: '1',
          email: email,
          phone: '1234567890',
          firstName: 'Test',
          lastName: 'User',
          role: 'customer',
        ),
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      );

      when(mockRemoteDataSource.login(
        email: email,
        password: password,
      )).thenAnswer((_) async => mockResponse);

      when(mockLocalDataSource.saveUser(mockResponse.user))
          .thenAnswer((_) async => {});

      // Act
      final result = await authRepository.login(
        email: email,
        password: password,
      );

      // Assert
      expect(result, isA<Result<LoginResponse>>());
      result.when(
        success: (response) {
          expect(response.user.email, email);
          expect(response.accessToken, 'access_token');
        },
        failure: (_) => fail('Should not fail'),
      );

      verify(mockRemoteDataSource.login(
        email: email,
        password: password,
      )).called(1);
      verify(mockLocalDataSource.saveUser(mockResponse.user)).called(1);
    });

    test('returns failure on invalid email', () async {
      // Act
      final result = await authRepository.login(
        email: 'invalid-email',
        password: password,
      );

      // Assert
      result.when(
        success: (_) => fail('Should not succeed'),
        failure: (failure) {
          expect(failure.message, contains('Invalid email'));
        },
      );

      verifyNever(mockRemoteDataSource.login(
        email: any,
        password: any,
      ));
    });
  });
}
```

### Widget Test Example

```dart
// test/presentation/screens/login_screen_test.dart
void main() {
  late MockAuthNotifier mockAuthNotifier;

  setUp(() {
    mockAuthNotifier = MockAuthNotifier();
  });

  testWidgets('LoginScreen displays email and password fields', (WidgetTester tester) async {
    // Arrange
    await tester.pumpWidget(
      ProviderContainer(
        overrides: [
          authNotifierProvider.overrideWith((ref) => mockAuthNotifier),
        ],
        child: const MyApp(),
      ),
    );

    // Act
    await tester.pumpAndSettle();

    // Assert
    expect(find.byType(TextField), findsWidgets);
    expect(find.byKey(const Key('email_field')), findsOneWidget);
    expect(find.byKey(const Key('password_field')), findsOneWidget);
    expect(find.byKey(const Key('login_button')), findsOneWidget);
  });

  testWidgets('LoginScreen shows error on failed login', (WidgetTester tester) async {
    // Arrange
    when(mockAuthNotifier.login(email: any, password: any))
        .thenAnswer((_) async {
          // Simulate error state
        });

    await tester.pumpWidget(
      ProviderContainer(
        overrides: [
          authNotifierProvider.overrideWith((ref) => mockAuthNotifier),
        ],
        child: const MyApp(),
      ),
    );

    // Act
    await tester.enterText(find.byKey(const Key('email_field')), 'test@example.com');
    await tester.enterText(find.byKey(const Key('password_field')), 'password');
    await tester.tap(find.byKey(const Key('login_button')));
    await tester.pumpAndSettle();

    // Assert
    expect(find.byType(SnackBar), findsOneWidget);
  });
}
```

---

## Code Style Guide

### Dart/Flutter Best Practices

```dart
// ✅ DO: Use meaningful variable names
final userEmailAddress = 'user@example.com';

// ❌ DON'T: Use abbreviations
final ue = 'user@example.com';

// ✅ DO: Use const for compile-time constants
const kDefaultPadding = 16.0;

// ✅ DO: Use sealed classes for better type safety
sealed class ApiResult<T> {
  const ApiResult();
}

// ✅ DO: Use named parameters for clarity
Future<void> fetchProducts({
  required String category,
  int page = 1,
  int pageSize = 20,
});

// ❌ DON'T: Use positional parameters for multiple arguments
// Future<void> fetchProducts(String category, int page, int pageSize);

// ✅ DO: Use extension methods for reusability
extension StringExtension on String {
  bool isValidEmail() {
    return RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(this);
  }
}

// ✅ DO: Use async/await instead of .then()
final user = await authRepository.getUser();

// ❌ DON'T: Use callback hell
// authRepository.getUser().then((user) {
//   productRepository.getProducts().then((products) {
//     ...
//   });
// });

// ✅ DO: Handle errors explicitly
try {
  final result = await repository.fetchData();
  // Handle success
} on ApiException catch (e) {
  // Handle API error
} on TimeoutException catch (e) {
  // Handle timeout
} catch (e) {
  // Handle generic error
}

// ✅ DO: Use freezed for immutable models
@freezed
class Product with _$Product {
  const factory Product({
    required String id,
    required String name,
  }) = _Product;
}

// ✅ DO: Use const constructors
const productCard = ProductCard(product: product);

// ✅ DO: Document public APIs
/// Fetches products from the repository.
///
/// Parameters:
///   - [category]: Filter by category
///   - [page]: Page number for pagination
///
/// Returns: List of products
Future<List<ProductModel>> fetchProducts({
  String? category,
  int page = 1,
}) async {
  // Implementation
}
```

---

## Conclusion

This implementation guide provides concrete code patterns and examples for building ArtisanHub. Each section demonstrates best practices for:

- Data modeling with Freezed
- State management with Riverpod
- Repository pattern implementation
- API integration with Dio
- Testing strategies
- Code organization and style

Follow these patterns consistently throughout the project to maintain clean, maintainable, and testable code.

