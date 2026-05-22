import 'package:flutter_test/flutter_test.dart';
import 'package:yks/utils/smart_quiz_parser.dart';

void main() {
  test('parses fenced smart quiz JSON and preserves intro', () {
    const raw = '''
```json
{
  "intro": "Hazirsan baslayalim",
  "questions": [
    {
      "question": "x + 1 = 2 ise x kactir?",
      "options": ["0", "1", "2", "3"],
      "correctIndex": 1,
      "explanation": "1 eklenince 2 oluyor."
    }
  ]
}
```
''';

    final parsed = parseSmartQuizResponse(raw, expectedCount: 1);
    expect(parsed.$1, 'Hazirsan baslayalim');
    expect(parsed.$2, hasLength(1));
    expect(parsed.$2.first.correctIndex, 1);
  });

  test('repairs raw latex slashes before json decode', () {
    const raw = '''
{
  "intro": "Latex test",
  "questions": [
    {
      "question": "Denklem \\(x^2 + 1\\) icin dogru ifade hangisi?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "KaTeX uyumlu."
    }
  ]
}
''';

    final parsed = parseSmartQuizResponse(raw, expectedCount: 1);
    expect(parsed.$2.first.question, contains(r'\(x^2 + 1\)'));
  });

  test('throws when expected question count is missing in strict mode', () {
    const raw = '''
{
  "intro": "Eksik",
  "questions": [
    {
      "question": "Tek soru",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}
''';

    expect(
      () => parseSmartQuizResponse(raw, expectedCount: 2),
      throwsFormatException,
    );
  });

  test('allows partial question count in relaxed mode', () {
    const raw = '''
{
  "intro": "Eksik ama gecerli",
  "questions": [
    {
      "question": "Tek soru",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}
''';

    final parsed = parseSmartQuizResponse(
      raw,
      expectedCount: 2,
      allowPartialCount: true,
    );
    expect(parsed.$2, hasLength(1));
  });
}
