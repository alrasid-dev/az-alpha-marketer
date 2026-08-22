require('dotenv').config();

const themes = require('./themes');
const { generateTweetText } = require('./lib/generateContent');
const { generateImage } = require('./lib/generateImage');
const { postTweet } = require('./lib/postToX');
const { getRecentTweets, logTweet } = require('./lib/history');

function pickTheme() {
  const idx = Math.floor(Math.random() * themes.length);
  return themes[idx];
}

async function run() {
  console.log(`[${new Date().toISOString()}] بدء تشغيل سكربت التسويق...`);

  const theme = pickTheme();
  console.log(`المحور المختار: ${theme.type} — ${theme.topic.slice(0, 50)}...`);

  // 1) جلب آخر التغريدات لتفادي التكرار
  const recentTweets = await getRecentTweets(8);

  // 2) توليد نص التغريدة
  const text = await generateTweetText({ theme, recentTweets });
  console.log('نص التغريدة:', text);

  // 3) توليد الصورة (لو فشلت، ننشر بدون صورة بدل ما نوقف كل شي)
  let imageBuffer = null;
  try {
    imageBuffer = await generateImage({ imageStyle: theme.imageStyle, type: theme.type });
    console.log('تم توليد الصورة بنجاح');
  } catch (err) {
    console.warn('تعذر توليد الصورة، سيتم النشر بدون صورة:', err.message);
  }

  // 4) النشر على X
  const tweet = await postTweet({ text, imageBuffer });
  console.log('تم النشر بنجاح، Tweet ID:', tweet.data.id);

  // 5) تسجيل بالسجل (لو Supabase مفعّل)
  await logTweet({ text, theme, tweetId: tweet.data.id });

  console.log('انتهى التشغيل بنجاح ✅');
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ فشل تشغيل السكربت:', err?.response?.data || err.message || err);
    process.exit(1);
  });
