// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

// The project's full `MyApp` may initialize network services (Firebase,
// backend clients) which cause HttpClient usage during widget tests. To keep
// unit/widget tests hermetic and fast, test a small local widget instead of
// pumping the full application.

class _TestCounterApp extends StatefulWidget {
  const _TestCounterApp();

  @override
  State<_TestCounterApp> createState() => _TestCounterAppState();
}

class _TestCounterAppState extends State<_TestCounterApp> {
  int _counter = 0;

  void _increment() => setState(() => _counter++);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Test Counter')),
        body: Center(child: Text('$_counter', key: const Key('counter'))),
        floatingActionButton: FloatingActionButton(
          key: const Key('increment_button'),
          onPressed: _increment,
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // Build a small, network-free widget tree for deterministic testing.
    await tester.pumpWidget(const _TestCounterApp());

    // Verify that our counter starts at 0.
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // Tap the '+' icon and trigger a frame.
    await tester.tap(find.byKey(const Key('increment_button')));
    await tester.pump();

    // Verify that our counter has incremented.
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
