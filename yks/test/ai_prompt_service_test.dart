import 'package:flutter_test/flutter_test.dart';
import 'package:yks/services/ai_prompt_service.dart';

void main() {
  group('AIPromptService course normalization', () {
    test('keeps TYT and AYT math separate', () {
      expect(
        AIPromptService.normalizeCourseForMetadata('Matematik (TYT)'),
        'TYT Matematik',
      );
      expect(
        AIPromptService.normalizeCourseForMetadata('Matematik (AYT)'),
        'AYT Matematik',
      );
    });

    test('keeps TYT and AYT geometry separate', () {
      expect(
        AIPromptService.normalizeCourseForMetadata('Geometri (TYT)'),
        'TYT Geometri',
      );
      expect(
        AIPromptService.normalizeCourseForMetadata('Geometri (AYT)'),
        'AYT Geometri',
      );
      expect(
        AIPromptService.normalizeCourseForMetadata('tyt_geo'),
        'TYT Geometri',
      );
      expect(
        AIPromptService.normalizeCourseForMetadata('ayt_geo'),
        'AYT Geometri',
      );

      final tytInstruction = AIPromptService.buildQuestionSystemInstruction(
        course: 'Geometri (TYT)',
        branch: 'Sayısal',
        goal: '',
        hasImage: true,
        wantsDetailed: false,
      );
      final aytInstruction = AIPromptService.buildQuestionSystemInstruction(
        course: 'Geometri (AYT)',
        branch: 'Sayısal',
        goal: '',
        hasImage: true,
        wantsDetailed: false,
      );

      expect(tytInstruction, contains('Ders: TYT Geometri'));
      expect(tytInstruction, contains('TYT Geometri'));
      expect(aytInstruction, contains('Ders: AYT Geometri'));
      expect(aytInstruction, contains('AYT Geometri'));
    });
  });
}
