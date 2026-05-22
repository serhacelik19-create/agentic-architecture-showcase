const mockText = (label) =>
  `[DEMO MODE] ${label} için örnek çıktı. Bu public repo dış AI servisine bağlanmaz.`;

const generateDashboardSummary = async () => mockText('dashboard özeti');
const generateStudentAnalysis = async () => mockText('öğrenci analizi');
const generateSmartQuizOverviewAnalysis = async () => mockText('akıllı quiz genel analizi');
const generateSmartQuizAttemptAnalysis = async () => mockText('akıllı quiz deneme analizi');
const generateCurriculumSuggestions = async () => ({
  suggestions: [
    {
      dayIndex: 0,
      subject: 'Matematik',
      topic: 'Fonksiyonlar',
      reason: 'Demo veride bu konu öncelikli gösterildi.',
    },
  ],
  mentorNote: 'Demo modunda yerel örnek öneri üretildi.',
});
const generateTraditionalHash = (value = '') => String(value).slice(0, 64);
const generateImageHash = async () => 'demo-image-hash';
const generateSemanticHash = async () => 'demo-semantic-hash';
const generateEmbedding = async () => [];
const cosineSimilarity = () => 0;
const generateBatchIntroduction = async () => mockText('toplu rapor girişi');
const generateExcelMapping = async () => ({ mappings: [] });
const evaluateGuidanceAlert = async () => ({ shouldAlert: false, reason: 'Demo mode' });
const askAiSimpleDetailed = async () => ({ text: mockText('AI yanıtı'), usageMetadata: null });
const askAiSimple = async () => mockText('AI yanıtı');
const solveMathProblem = async () => mockText('matematik çözümü');
const verifyMathSolution = async () => ({ valid: true, feedback: 'Demo mode' });
const validateGeometry = async () => ({ valid: true, feedback: 'Demo mode' });
const askAiWithMath = async () => mockText('matematik destekli AI yanıtı');

module.exports = {
  __ai_instance: null,
  generateDashboardSummary,
  generateStudentAnalysis,
  generateSmartQuizOverviewAnalysis,
  generateSmartQuizAttemptAnalysis,
  generateCurriculumSuggestions,
  generateTraditionalHash,
  generateImageHash,
  generateSemanticHash,
  generateEmbedding,
  cosineSimilarity,
  generateBatchIntroduction,
  generateExcelMapping,
  evaluateGuidanceAlert,
  askAiSimpleDetailed,
  askAiSimple,
  solveMathProblem,
  verifyMathSolution,
  validateGeometry,
  askAiWithMath,
  __testHooks: {},
};
