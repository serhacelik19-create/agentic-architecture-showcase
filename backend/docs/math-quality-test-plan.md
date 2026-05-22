**Math Quality Plan**
Amaç iki ayrı katmanı birlikte ölçmek:

1. Altyapı / engine doğruluğu
2. Gerçek soru çözüm kalitesi

Bu ayrım önemli çünkü hata görüldüğünde kök sebebi ayırmayı sağlar:
- parse / prompt hatası
- yanlış action seçimi
- yanlış expression kurulumu
- backend normalization hatası
- solver hatası
- final explanation hatası

**Katmanlar**
`A. Engine Golden Set`
- Dosya: [math-engine-golden-set.json](/Users/serhat/Desktop/YKS%20kopyası/backend/tests/fixtures/math-engine-golden-set.json)
- Amaç: `math_service` ve backend integration davranışını ölçmek
- Ölçülenler:
  - `status`
  - `result`
  - `code`
  - `normalized_request`
  - `verification`

`B. Real Question Golden Set`
- Dosya: [math-real-question-set.json](/Users/serhat/Desktop/YKS%20kopyası/backend/tests/fixtures/math-real-question-set.json)
- Amaç: gerçek öğrenci sorularında modelin doğru action ve doğru formül kurup kurmadığını ölçmek
- Ölçülenler:
  - seçilen action
  - kurulan expression / params
  - nihai sonuç
  - açıklama kalitesi

`C. Adversarial Real Set`
- Dosya: [math-real-question-adversarial-set.json](/Users/serhat/Desktop/YKS%20kopyası/backend/tests/fixtures/math-real-question-adversarial-set.json)
- Amaç: hata üretmeye yatkın sınır durumları ve karıştırılması kolay konuları zorlamak
- Kapsam:
  - sağ/sol limit ayrışması
  - köklü denklemde dışarı atan kök
  - logaritma tanım kümesi
  - mutlak değerli denklem
  - ekstremum olmayan kritik nokta
  - trig genel çözüm
  - x/y dışı değişkenli denklem sistemi
  - düşey doğru
  - noktadan doğruya uzaklık
  - eğriler arası alan
  - matris determinantı
  - kombinasyon
  - invalid solve guard

**Önerilen Çalıştırma Sırası**
1. `math_service` sağlık kontrolü
2. Engine golden set
3. Backend integration golden set
4. Real question set
5. Başarısızları sınıflandırma
6. Adversarial real set

**Konu Kapsamı**
Engine set içinde şu konular var:
- `solve`
- `limit`
- `analyze_derivative`
- `trig_general_solution`
- `solve_system`
- `matrix`
- `coordinate_geometry`
- validation / structured error

Real question set içinde şu başlıklar var:
- limit
- türev işaret analizi
- trigonometrik denklem
- koordinat geometri uzaklık
- doğru denklemi
- denklem sistemi
- invalid solve guard

**Kabul Kriterleri**
`Engine`
- Beklenen `status` eşleşmeli
- `result_exact` varsa tam eşleşmeli
- `result_contains` varsa tüm parçalar bulunmalı
- `normalized_variable` varsa eşleşmeli
- error case ise `code` doğru dönmeli

`Real Questions`
- Beklenen action seçilmeli
- SymPy formatı doğru kurulmalı
- gerekli alt alanlar (`limit_point`, `params`, `variables`) doğru taşınmalı
- nihai sonuç doğru olmalı
- açıklama matematiksel çelişki içermemeli

**Raporlama Şeması**
Her test için şu alanlar tutulmalı:
- `id`
- `layer`
- `status`
- `passed`
- `observed_action`
- `observed_expression`
- `observed_result`
- `failure_type`
- `notes`

`failure_type` değerleri:
- `wrong_action`
- `wrong_expression`
- `normalization_bug`
- `solver_bug`
- `verification_bug`
- `explanation_bug`
- `transport_error`

**Önceliklendirme**
En kritik başarısızlıklar:
1. `wrong_action`
2. `wrong_expression`
3. `solver_bug`
4. `verification_bug`
5. `explanation_bug`

**Şu Anki Durum**
Elle yapılan smoke testlerde şu alanlar temiz geçti:
- `limit`
- `analyze_derivative`
- `trig_general_solution`
- `coordinate_geometry`
- `solve_system`
- structured error path

Şu an sadece ürün tercihi olarak izlenmesi gereken not:
- `trig_general_solution` `[0, 2π]` aralığında `2π` değerini dahil ediyor.
- Matematiksel olarak yanlış değil, fakat UI/option matching için `[0, 2π)` tercih edilebilir.

**Çalıştırma**
- Baseline real set:
  - `npm run test:math-quality -- --mode=real --realMode=ai --realSet=baseline`
- Adversarial real set:
  - `npm run test:math-quality -- --mode=real --realMode=expected --realSet=adversarial`
  - `npm run test:math-quality -- --mode=real --realMode=ai --realSet=adversarial`

**Sonraki Adım**
Bu iki fixture dosyası için otomatik probe runner yaz:
- engine set: doğrudan `/calculate` ve `solveMathProblem`
- real set: mümkünse `askAiWithMath` veya prompt bridge ile tam zincir test
