export interface Word {
  id: number
  word: string
  phonetic: string
  pos: string
  translation: string
}

const words: Word[] = [
  { id: 1, word: 'abandon', phonetic: '/əˈbændən/', pos: 'v.', translation: '放弃；抛弃' },
  { id: 2, word: 'abstract', phonetic: '/ˈæbstrækt/', pos: 'adj.', translation: '抽象的；理论的' },
  { id: 3, word: 'academy', phonetic: '/əˈkædəmi/', pos: 'n.', translation: '学院；研究院' },
  { id: 4, word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', pos: 'v.', translation: '容纳；为…提供住宿' },
  { id: 5, word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', pos: 'v.', translation: '承认；确认收到' },
  { id: 6, word: 'acquire', phonetic: '/əˈkwaɪər/', pos: 'v.', translation: '获得；习得' },
  { id: 7, word: 'adequate', phonetic: '/ˈædɪkwət/', pos: 'adj.', translation: '足够的；适当的' },
  { id: 8, word: 'adverse', phonetic: '/ˈædvɜːs/', pos: 'adj.', translation: '不利的；相反的' },
  { id: 9, word: 'aggregate', phonetic: '/ˈæɡrɪɡət/', pos: 'n.', translation: '总计；集合体' },
  { id: 10, word: 'allege', phonetic: '/əˈledʒ/', pos: 'v.', translation: '声称；指控' },
  { id: 11, word: 'ambiguous', phonetic: '/æmˈbɪɡjuəs/', pos: 'adj.', translation: '模棱两可的；含糊的' },
  { id: 12, word: 'analogy', phonetic: '/əˈnælədʒi/', pos: 'n.', translation: '类比；相似' },
  { id: 13, word: 'apparatus', phonetic: '/ˌæpəˈreɪtəs/', pos: 'n.', translation: '装置；仪器' },
  { id: 14, word: 'arbitrary', phonetic: '/ˈɑːbɪtrəri/', pos: 'adj.', translation: '任意的；武断的' },
  { id: 15, word: 'articulate', phonetic: '/ɑːˈtɪkjuleɪt/', pos: 'v.', translation: '清晰表达；明确阐述' },
  { id: 16, word: 'assert', phonetic: '/əˈsɜːt/', pos: 'v.', translation: '断言；坚持主张' },
  { id: 17, word: 'attribute', phonetic: '/əˈtrɪbjuːt/', pos: 'v.', translation: '把…归因于' },
  { id: 18, word: 'barrier', phonetic: '/ˈbæriər/', pos: 'n.', translation: '障碍；屏障' },
  { id: 19, word: 'bizarre', phonetic: '/bɪˈzɑːr/', pos: 'adj.', translation: '奇异的；怪诞的' },
  { id: 20, word: 'boom', phonetic: '/buːm/', pos: 'n.', translation: '繁荣；激增' },
  { id: 21, word: 'chronic', phonetic: '/ˈkrɒnɪk/', pos: 'adj.', translation: '慢性的；长期的' },
  { id: 22, word: 'collapse', phonetic: '/kəˈlæps/', pos: 'v.', translation: '倒塌；崩溃；暴跌' },
  { id: 23, word: 'commodity', phonetic: '/kəˈmɒdəti/', pos: 'n.', translation: '商品；日用品' },
  { id: 24, word: 'compensate', phonetic: '/ˈkɒmpenseɪt/', pos: 'v.', translation: '补偿；弥补' },
  { id: 25, word: 'comply', phonetic: '/kəmˈplaɪ/', pos: 'v.', translation: '遵守；服从' },
  { id: 26, word: 'conceive', phonetic: '/kənˈsiːv/', pos: 'v.', translation: '构想；怀孕' },
  { id: 27, word: 'confer', phonetic: '/kənˈfɜːr/', pos: 'v.', translation: '商议；授予' },
  { id: 28, word: 'confine', phonetic: '/kənˈfaɪn/', pos: 'v.', translation: '限制；禁闭' },
  { id: 29, word: 'consolidate', phonetic: '/kənˈsɒlɪdeɪt/', pos: 'v.', translation: '巩固；合并' },
  { id: 30, word: 'contradict', phonetic: '/ˌkɒntrəˈdɪkt/', pos: 'v.', translation: '反驳；与…矛盾' },
  { id: 31, word: 'criterion', phonetic: '/kraɪˈtɪəriən/', pos: 'n.', translation: '标准；准则' },
  { id: 32, word: 'democracy', phonetic: '/dɪˈmɒkrəsi/', pos: 'n.', translation: '民主；民主制度' },
  { id: 33, word: 'deteriorate', phonetic: '/dɪˈtɪəriəreɪt/', pos: 'v.', translation: '恶化；退化' },
  { id: 34, word: 'dilemma', phonetic: '/dɪˈlemə/', pos: 'n.', translation: '困境；两难境地' },
  { id: 35, word: 'diminish', phonetic: '/dɪˈmɪnɪʃ/', pos: 'v.', translation: '减少；削弱' },
  { id: 36, word: 'dispute', phonetic: '/dɪˈspjuːt/', pos: 'n.', translation: '争论；纠纷' },
  { id: 37, word: 'elaborate', phonetic: '/ɪˈlæbərət/', pos: 'adj.', translation: '精心制作的；详尽的' },
  { id: 38, word: 'eliminate', phonetic: '/ɪˈlɪmɪneɪt/', pos: 'v.', translation: '消除；淘汰' },
  { id: 39, word: 'embrace', phonetic: '/ɪmˈbreɪs/', pos: 'v.', translation: '拥抱；欣然接受' },
  { id: 40, word: 'endeavor', phonetic: '/ɪnˈdevər/', pos: 'n.', translation: '努力；尽力' },
  { id: 41, word: 'fluctuate', phonetic: '/ˈflʌktʃueɪt/', pos: 'v.', translation: '波动；起伏' },
  { id: 42, word: 'genuine', phonetic: '/ˈdʒenjuɪn/', pos: 'adj.', translation: '真正的；真诚的' },
  { id: 43, word: 'homogeneous', phonetic: '/ˌhəʊməˈdʒiːniəs/', pos: 'adj.', translation: '同质的；相似的' },
  { id: 44, word: 'indigenous', phonetic: '/ɪnˈdɪdʒɪnəs/', pos: 'adj.', translation: '本土的；土著的' },
  { id: 45, word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/', pos: 'adj.', translation: '不可避免的' },
  { id: 46, word: 'manuscript', phonetic: '/ˈmænjuskrɪpt/', pos: 'n.', translation: '手稿；原稿' },
  { id: 47, word: 'notion', phonetic: '/ˈnəʊʃən/', pos: 'n.', translation: '概念；想法' },
  { id: 48, word: 'portray', phonetic: '/pɔːˈtreɪ/', pos: 'v.', translation: '描绘；扮演' },
  { id: 49, word: 'retrospect', phonetic: '/ˈretrəspekt/', pos: 'n.', translation: '回顾；追溯' },
  { id: 50, word: 'scrutiny', phonetic: '/ˈskruːtɪni/', pos: 'n.', translation: '仔细审查；监督' },
]

export default words
