const axios = require('axios');

const GEMINI_TEXT_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent`;

const SYSTEM_PROMPT = `أنت مسؤول المحتوى التسويقي لمنصة "AZ Alpha Vision" — منصة تعليمية لتعلم التداول في الأسهم الأمريكية.

معلومات أساسية عن المنصة يجب مراعاتها دائمًا:
- فيها محاكي تداول تعليمي بمحفظة افتراضية مقدارها $10,000 (مو فلوس حقيقية)
- فيها دورة تعليمية تمهيدية مجانية
- فيها ماسح أسهم (screener) يساعد على انتقاء الشركات
- المحاكي يطبق استراتيجية المنصة الخاصة ويشرح للمستخدم سبب كل دخول وخروج

قواعد صارمة يجب الالتزام بها في كل تغريدة:
1. اكتب بالعربية الفصحى المبسطة أو لهجة خليجية خفيفة، بأسلوب واضح ومباشر
2. التغريدة يجب أن تكون تحت 260 حرف
3. لا تضع أي رابط داخل النص (الرابط موجود في البايو فقط)
4. إذا كان المحتوى عن صفقة أو نتيجة تداول، لازم يكون واضح إنها "افتراضية/تعليمية" وليست توصية استثمارية حقيقية — لا تصغها كأنها نصيحة مالية مباشرة
5. لا تستخدم لغة مبالغ فيها أو وعود بالربح المضمون
66. أضف 1-3 هاشتاقات مناسبة بالنهاية (مثل #تداول #الأسهم_الأمريكية #تعلم_التداول)
7. إذا كان نوع المحتوى "ترويجي" فقط: اختم التغريدة بجملة قصيرة تحفّز الزيارة مثل "جرب المحاكي مجانًا 👆 الرابط بالبايو" أو "التفاصيل والتسجيل بالرابط في البايو". لا تضع هذي الجملة في أي نوع محتوى ثاني (تعليمي/فكاهي).
8. اجعل كل تغريدة مختلفة تمامًا عن التغريدات السابقة المذكورة أدناه (لا تكرر نفس الصياغة أو الأمثلة)

أعطني فقط نص التغريدة النهائي بدون أي شرح إضافي أو علامات اقتباس.`;

async function generateTweetText({ theme, recentTweets = [] }) {
  const recentContext = recentTweets.length
    ? `\n\nتغريدات سابقة يجب تجنب تكرارها أو مشابهتها:\n${recentTweets.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : '';

  const userPrompt = `نوع المحتوى المطلوب: ${theme.type}
الفكرة: ${theme.topic}${recentContext}

اكتب تغريدة واحدة الآن بناءً على هذي الفكرة.`;

  const response = await axios.post(
    `${GEMINI_TEXT_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 300,
      },
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );

  let text = response.data.candidates[0].content.parts[0].text.trim();
  // إزالة علامات اقتباس لو رجعت بالغلط
  text = text.replace(/^["'«»]+|["'«»]+$/g, '').trim();

  // حماية إضافية: قص النص لو تجاوز حد X (280 حرف كحد أقصى مطلق)
  if (text.length > 275) {
    text = text.slice(0, 272) + '...';
  }

  return text;
}

module.exports = { generateTweetText };
