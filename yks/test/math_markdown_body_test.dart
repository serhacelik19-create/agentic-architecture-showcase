import 'package:flutter/material.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yks/widgets/math_markdown_body.dart';

void main() {
  testWidgets('renders problematic limit response without raw latex leakage',
      (tester) async {
    const content = '''
**Doğru Cevap:** E Şıkkı / Yoktur

**Adım Adım Çözüm:**
- İfadeyi düzenleyelim:
\\[
\\sqrt{x^2 - 8x + 16} = \\sqrt{(x - 4)^2} = |x - 4|.
\\]
- **Sağdan Limit (x \\to 4^+):** \\(x > 4\\) olduğu için \\(|x - 4| = x - 4\\) olur.
\\[
\\lim_{x \\to 4^+} \\frac{x-4}{(x-4)(x+4)} = \\frac{1}{8}
\\]
- **Soldan Limit (x \\to 4^-):** \\(x < 4\\) olduğu için \\(|x - 4| = -(x - 4)\\) olur.
Sağdan ve soldan limitler birbirine eşit ((\\frac{1}{8} \\neq -\\frac{1}{8})) olmadığı için limit yoktur.
''';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: MathMarkdownBody(data: content),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Sağdan Limit'), findsOneWidget);
    expect(find.text('Soldan Limit'), findsOneWidget);

    final mathWidgets = tester.widgetList<Math>(find.byType(Math)).toList();
    expect(mathWidgets.length, greaterThanOrEqualTo(5));

    expect(find.textContaining(r'\frac'), findsNothing);
    expect(find.textContaining(r'\to'), findsNothing);
    expect(find.textContaining(r'((\frac'), findsNothing);
  });

  testWidgets('renders loose inline latex that appears after bold labels',
      (tester) async {
    const content = r'''
- **Sagdan Limit** x \to 4^+\: x > 4 oldugu icin devam eder.
- **Soldan Limit** x \to 4^-\: x < 4 oldugu icin devam eder.
''';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: MathMarkdownBody(data: content),
        ),
      ),
    );

    await tester.pumpAndSettle();

    final mathWidgets = tester.widgetList<Math>(find.byType(Math)).toList();
    expect(mathWidgets.length, greaterThanOrEqualTo(2));

    expect(find.textContaining(r'\to'), findsNothing);
    expect(find.textContaining(r'4^+'), findsNothing);
    expect(find.textContaining(r'4^-'), findsNothing);
  });

  testWidgets('normalizes double escaped latex delimiters before rendering',
      (tester) async {
    const content = r'''
Limit ifadesi su hale gelir: \\(\lim_{x \to 4} \frac{|x-4|}{(x-4)(x+4)}\\).
- **Sagdan Limit** \\(x \to 4^+\\): \\(x > 4\\) oldugu icin devam eder.
Son durumda \\(\frac{1}{8} \neq -\frac{1}{8}\\) oldugu icin limit yoktur.
''';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: MathMarkdownBody(data: content),
        ),
      ),
    );

    await tester.pumpAndSettle();

    final mathWidgets = tester.widgetList<Math>(find.byType(Math)).toList();
    expect(mathWidgets.length, greaterThanOrEqualTo(4));

    expect(find.textContaining(r'\('), findsNothing);
    expect(find.textContaining(r'\)'), findsNothing);
    expect(find.textContaining(r'\\('), findsNothing);
  });

  testWidgets('preserves tex row breaks inside aligned environments',
      (tester) async {
    const content = r'''
\[
\begin{aligned}
f(x) &= x^2 + 1 \\
g(x) &= x^2 - 1
\end{aligned}
\]
''';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: MathMarkdownBody(data: content),
        ),
      ),
    );

    await tester.pumpAndSettle();

    final mathWidgets = tester.widgetList<Math>(find.byType(Math)).toList();
    expect(mathWidgets.length, greaterThanOrEqualTo(1));
    expect(find.textContaining(r'\begin'), findsNothing);
    expect(find.textContaining(r'\end'), findsNothing);
  });

  testWidgets('renders nested parentheses inside inline math safely',
      (tester) async {
    const content = r'''
Parantezli ifade: \(\left(\frac{x+1}{y-1}\right)\) olarak kalir.
''';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: MathMarkdownBody(data: content),
        ),
      ),
    );

    await tester.pumpAndSettle();

    final mathWidgets = tester.widgetList<Math>(find.byType(Math)).toList();
    expect(mathWidgets.length, greaterThanOrEqualTo(1));
    expect(find.textContaining(r'\frac{x+1}{y-1}'), findsNothing);
    expect(find.textContaining(r'\right'), findsNothing);
  });

  testWidgets('renders a realistic exam-style solution with mixed math forms',
      (tester) async {
    const content = r'''
**Doğru Cevap:** B

**Çözüm Mantığı:** İfadeyi çarpanlarına ayırıp sağ ve sol limitleri ayrı inceleriz.

- **Sağdan Limit (\lim_{x \to 2^+}):** \[
\frac{x^2-4}{x-2} = \frac{(x-2)(x+2)}{x-2} = x+2
\]
- **Soldan Limit (\lim_{x \to 2^-}):** \(\left(\frac{x^2-4}{x-2}\right)=x+2\)
- Her iki durumda da sonuç \(\frac{4}{1} = 4\) olur.

Sonuç olarak \(\lim_{x \to 2} \frac{x^2-4}{x-2} = 4\).
''';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: MathMarkdownBody(data: content),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Sağdan Limit'), findsOneWidget);
    expect(find.text('Soldan Limit'), findsOneWidget);
    expect(tester.widgetList<Math>(find.byType(Math)).length, greaterThanOrEqualTo(5));
    expect(find.textContaining(r'\frac{x^2-4}{x-2}'), findsNothing);
    expect(find.textContaining(r'\lim_{x \to 2}'), findsNothing);
  });
}
