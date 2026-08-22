let supabase = null;

function getClient() {
  if (supabase) return supabase;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null; // Supabase غير مفعّل، السكربت يشتغل بدونه بدون مشاكل
  }
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return supabase;
}

/**
 * يرجع آخر N تغريدات منشورة (لتفادي التكرار بالبرومبت)
 */
async function getRecentTweets(limit = 8) {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('marketing_posts')
    .select('tweet_text')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('تعذر جلب السجل من Supabase:', error.message);
    return [];
  }
  return (data || []).map((row) => row.tweet_text);
}

/**
 * يسجل تغريدة جديدة بالسجل
 */
async function logTweet({ text, theme, tweetId }) {
  const client = getClient();
  if (!client) return;

  const { error } = await client.from('marketing_posts').insert({
    tweet_text: text,
    theme_type: theme.type,
    tweet_id: tweetId,
  });

  if (error) {
    console.warn('تعذر تسجيل التغريدة بـ Supabase:', error.message);
  }
}

module.exports = { getRecentTweets, logTweet };
