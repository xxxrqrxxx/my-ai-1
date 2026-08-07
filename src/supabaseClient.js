import { createClient } from '@supabase/supabase-js';

// 这里会自动读取你刚才配置好的 .env 文件
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 创建并导出客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;