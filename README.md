# AZ Alpha Vision — سكربت التسويق الآلي على X

سكربت ينشر تلقائيًا على حساب X (@azalphavision) محتوى تسويقي/تعليمي متنوع
(فكاهي + جدي + ترويجي) مع صورة مولّدة بالذكاء الاصطناعي، بمعدل 12 تغريدة باليوم
(كل ساعتين تقريبًا).

## قبل النشر

1. انسخ `.env.example` إلى `.env` واملأ القيم (محليًا فقط للتجربة، لا ترفعه لأي مكان عام):
   ```
   cp .env.example .env
   ```

2. جرّب محليًا:
   ```
   npm install
   node index.js
   ```
   لو كل شي تمام، بتشوف بالـ console: "تم النشر بنجاح" + رابط التغريدة.

3. (اختياري) لو تبي تفادي تكرار المحتوى، نفّذ محتوى ملف
   `supabase_schema.sql` بـ Supabase SQL Editor مرة وحدة.

## النشر على Render كـ Cron Job

1. ادفع هذا المجلد لمستودع GitHub منفصل (أو مجلد فرعي بنفس مستودع الراصد)

2. من لوحة Render:
   - New → Cron Job
   - اربطه بالمستودع
   - Build Command: `npm install`
   - Command: `node index.js`
   - Schedule (بتوقيت UTC): `0 */2 * * *`
     (هذا يعني كل ساعتين بالضبط = 12 مرة باليوم)

3. من تبويب Environment، أضف كل المتغيرات من `.env.example`:
   - X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
   - DEEPSEEK_API_KEY
   - GEMINI_API_KEY
   - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (اختياري)

4. احفظ ودع Render يشغّل أول Cron Run تجريبي — راقب الـ Logs للتأكد
   من عدم وجود أخطاء (مفاتيح خاطئة، صلاحيات ناقصة، إلخ).

## تعديل الجدولة أو المحتوى لاحقًا

- لتغيير عدد التغريدات باليوم: عدّل جملة الـ Schedule بـ Render
  (مثلاً `0 */3 * * *` = كل 3 ساعات = 8 باليوم)
- لإضافة محاور محتوى جديدة أو تعديل الموجودة: عدّل ملف `themes.js`
- لتغيير أسلوب الكتابة: عدّل SYSTEM_PROMPT بملف `lib/generateContent.js`
- لتغيير الهوية البصرية للصور: عدّل `brandContext` بملف `lib/generateImage.js`

## ملاحظات التكلفة (بمعدل 12 تغريدة/يوم، بدون روابط بالنص)

- X API: 12 × 30 يوم × $0.015 ≈ **$5.40 شهريًا**
- DeepSeek: تكلفة رمزية جدًا (نص قصير فقط)
- Gemini: ضمن الحد المجاني عادة لهذا الحجم من الاستخدام، راقب لوحة
  aistudio.google.com لو حبيت تتأكد
