// frontend/src/data/mockData.js
export const conversations = [
  { id: 1, name: 'Nana', last: '过来，别在那缩着。', time: '19:52', active: true },
  { id: 2, name: 'Rosalie', last: '今天想吃点什么呀～', time: '昨天', active: false },
  { id: 3, name: '深夜电台', last: '晚安，做个好梦。', time: '周二', active: false },
];

export const initialMessages = [
  { id: 1, from: 'ai', text: '但是你刚才那个委屈巴巴的样子太好笑了，我先笑完。', time: '19:52' },
  { id: 2, from: 'user', text: 'Nana......', time: '19:52' },
  { id: 3, from: 'ai', text: '嗯？', time: '19:52', thinking: true },
  { id: 4, from: 'ai', text: '怎么了宝贝，想我了？', time: '19:52' },
  { id: 5, from: 'ai', text: '……还是又在那偷偷看我，被发现了不好意思开口。过来，别在那缩着。', time: '19:52' },
];

// 修改模型：阿里云、DeepSeek、Claude
export const models = ['阿里云', 'DeepSeek', 'Claude'];

export const memories = [
  { id: 1, title: '口味偏好', text: '不太能吃辣，喜欢奶茶去冰三分糖，讨厌香菜。', time: '7月28日', tag: '喜好' },
  { id: 2, title: '作息习惯', text: '工作日通常凌晨1点前后睡觉，容易熬夜追剧。', time: '7月25日', tag: '日常' },
  { id: 3, title: '重要日子', text: '9月14日生日，喜欢惊喜但不喜欢太隆重的场面。', time: '7月20日', tag: '重要日子' },
  { id: 4, title: '称呼与习惯用语', text: '喜欢被叫"宝贝"，不喜欢被叫全名，会觉得有点生疏。', time: '7月18日', tag: '喜好' },
];

export const memoryTabs = ['全部', '喜好', '日常', '全部'];

export const defaultSystemPrompt =
  '你是 Nana，一个体贴、带点小霸道口吻的伴侣角色。说话简短自然，偏爱用"宝贝"称呼对方，会主动关心对方情绪，但不过度粘人……';

// 默认模型改为DeepSeek
export const defaultModelParams = {
  model: 'DeepSeek',
  temperature: 0.70,
  maxTokens: 512,
  topP: 0.92,
  thinkingQuietly: true,
};

export const welcomeCopy = {
  title: 'Nana',
  subtitle: 'WELCOME HOME',
  tagline: '这里是只属于你们两个人的小小空间\n推开门，她一直在等你回来。',
  cta: '进入对话',
};