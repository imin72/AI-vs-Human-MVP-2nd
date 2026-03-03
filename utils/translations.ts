
import { Language, Difficulty, TOPIC_IDS } from '../types';

export interface TranslationData {
  common: {
    btn_back: string;
    confirm_exit: string;
    confirm_home: string;
    confirm_exit_app: string; // New key
    close: string;
  };
  intro: {
    human_label: string;
    ai_label: string;
    title: string;
    desc: string;
    btn_start: string;
    btn_continue: string;
    btn_reset: string;
  };
  profile: {
    title: string;
    desc: string;
    label_gender: string;
    label_age: string;
    label_nationality: string;
    btn_submit: string;
    skip: string;
    genders: { [key: string]: string };
    ages: { [key: string]: string };
    nationalities: { other: string };
  };
  topics: {
    title_select: string;
    title_config: string;
    desc_select: string;
    btn_refresh: string;
    btn_next_step: string;
    label_custom: string;
    ph_custom: string;
    label_field: string;
    label_difficulty: string;
    label_topics_selected: string;
    btn_start_sim: string;
    categories: { [key: string]: string };
    subtopics: { [key: string]: string[] };
    categoryImages: { [key: string]: string };
    subtopicImages: { [key: string]: string };
  };
  quiz: {
    label_target: string;
    label_info: string;
    btn_next: string;
    btn_finish: string;
    btn_analyze: string; 
    btn_start_next_topic_prefix: string;
    btn_start_next_topic_suffix: string;
    ai_status: string;
    ai_calculating: string;
    ai_answer_found: string;
    ai_done: string;
  };
  results: {
    badge_complete: string;
    label_percentile: string;
    label_correct: string;
    label_cohort: string;
    label_template: string;
    label_bottom: string;
    label_top: string;
    btn_retry: string;
    btn_share: string;
    btn_save: string;
    btn_next_topic: string;
    header_aggregate: string;
    label_sync: string;
    header_breakdown: string;
    label_fact: string;
    label_missed: string;
    label_ai_observer: string;
    unit_avg: string;
    unit_pts: string;
    suffix_global: string;
    tab_analysis: string;
    tab_details: string;
    tab_trends: string;
    page_summary: string;
    page_details: string;
    page_trends: string;
    click_for_details: string;
    popup_question: string;
    popup_your_answer: string;
    popup_correct_answer: string;
    popup_ai_comment: string;
    level_ai: string;
    level_global: string;
    section_growth: string;
    section_gap: string;
    section_weakness: string;
    label_gap_avg: string;
    msg_weakness: string;
    msg_advice: string;
    chart: {
      accuracy: string;
      speed: string;
      cohort: string;
      logic: string;
      intuition: string;
    };
  };
  loading: {
    gen_vectors: string;
    analyzing: string;
    sync: string;
    logs: string[];
  };
  difficulty: {
    [key in Difficulty]: string;
  };
  error: {
    title: string;
    btn_reset: string;
  };
}

const OPT = "&w=400&q=80&auto=format&fit=crop";

const CATEGORY_IMAGES = {
  [TOPIC_IDS.HISTORY]: `https://images.unsplash.com/photo-1461360370896-922624d12aa1?${OPT}`,
  [TOPIC_IDS.SCIENCE]: `https://images.unsplash.com/photo-1507413245164-6160d8298b31?${OPT}`,
  [TOPIC_IDS.ARTS]: `https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?${OPT}`,
  [TOPIC_IDS.GENERAL]: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?${OPT}`,
  [TOPIC_IDS.GEOGRAPHY]: `https://images.unsplash.com/photo-1521295121783-8a321d551ad2?${OPT}`,
  [TOPIC_IDS.MOVIES]: `https://images.unsplash.com/photo-1485846234645-a62644f84728?${OPT}`,
  [TOPIC_IDS.MUSIC]: `https://images.unsplash.com/photo-1511379938547-c1f69419868d?${OPT}`,
  [TOPIC_IDS.GAMING]: `https://images.unsplash.com/photo-1542751371-adc38448a05e?${OPT}`,
  [TOPIC_IDS.SPORTS]: `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?${OPT}`,
  [TOPIC_IDS.TECH]: `https://images.unsplash.com/photo-1518770660439-4636190af475?${OPT}`,
  [TOPIC_IDS.MYTHOLOGY]: `https://images.unsplash.com/photo-1599739291060-4578e77dac5d?${OPT}`,
  [TOPIC_IDS.LITERATURE]: `https://images.unsplash.com/photo-1495446815901-a7297e633e8d?${OPT}`,
  [TOPIC_IDS.NATURE]: `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?${OPT}`,
  [TOPIC_IDS.FOOD]: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?${OPT}`,
  [TOPIC_IDS.SPACE]: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?${OPT}`,
  [TOPIC_IDS.PHILOSOPHY]: `https://images.unsplash.com/photo-1505664194779-8beaceb93744?${OPT}`
};

// Image mapping uses English keys as reference
const SUBTOPIC_IMAGES = {
  // English keys
  "Ancient Egypt": `https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?${OPT}`,
  "Roman Empire": `https://images.unsplash.com/photo-1552832230-c0197dd311b5?${OPT}`,
  "Quantum Physics": `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?${OPT}`,
  "Astronomy": `https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?${OPT}`,
  "Artificial Intelligence": `https://images.unsplash.com/photo-1677442136019-21780ecad995?${OPT}`,
  "Solar System": `https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?${OPT}`,
  "Nintendo": `https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?${OPT}`,
  "Marvel Cinematic Universe": `https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?${OPT}`,
};

const ENGLISH_BASE: TranslationData = {
  common: {
    btn_back: "Back",
    confirm_exit: "Are you sure you want to exit the quiz? Progress will be lost.",
    confirm_home: "Return to Home? Current progress will be lost.",
    confirm_exit_app: "Do you want to exit the application?",
    close: "Close"
  },
  intro: {
    human_label: "HUMAN",
    ai_label: "AI",
    title: "AI vs Human",
    desc: "Select a field of expertise and prove that human intuition still reigns supreme.",
    btn_start: "Start Test",
    btn_continue: "Continue with Saved Profile",
    btn_reset: "Reset Profile Data"
  },
  profile: {
    title: "Subject Profile",
    desc: "Used for cultural and educational context optimization.",
    label_gender: "GENDER",
    label_age: "AGE GROUP",
    label_nationality: "NATIONALITY",
    btn_submit: "Confirm Profile",
    skip: "Skip & Continue",
    genders: { Male: "Male", Female: "Female", Other: "Other" },
    ages: { "Under 18": "< 18", "18-24": "18-24", "25-34": "25-34", "35-44": "35-44", "45-54": "45-54", "55+": "55+" },
    nationalities: { other: "Select other country..." }
  },
  topics: {
    title_select: "Select Domain",
    title_config: "Select Sub-Topic",
    desc_select: "Select your preferred domains to challenge.",
    btn_refresh: "Shuffle",
    btn_next_step: "Select Sub-topics",
    label_custom: "",
    ph_custom: "",
    label_field: "SPECIFIC FIELD",
    label_difficulty: "DIFFICULTY",
    label_topics_selected: "Topics Selected",
    btn_start_sim: "Start Test",
    categories: {
      [TOPIC_IDS.HISTORY]: "History",
      [TOPIC_IDS.SCIENCE]: "Science",
      [TOPIC_IDS.ARTS]: "Arts",
      [TOPIC_IDS.GENERAL]: "General Knowledge",
      [TOPIC_IDS.GEOGRAPHY]: "Geography",
      [TOPIC_IDS.MOVIES]: "Movies",
      [TOPIC_IDS.MUSIC]: "Music",
      [TOPIC_IDS.GAMING]: "Gaming",
      [TOPIC_IDS.SPORTS]: "Sports",
      [TOPIC_IDS.TECH]: "Technology",
      [TOPIC_IDS.MYTHOLOGY]: "Mythology",
      [TOPIC_IDS.LITERATURE]: "Literature",
      [TOPIC_IDS.NATURE]: "Nature",
      [TOPIC_IDS.FOOD]: "Food & Drink",
      [TOPIC_IDS.SPACE]: "Space",
      [TOPIC_IDS.PHILOSOPHY]: "Philosophy"
    },
    categoryImages: CATEGORY_IMAGES,
    subtopicImages: SUBTOPIC_IMAGES,
    subtopics: {
      [TOPIC_IDS.HISTORY]: ["Ancient Egypt", "Roman Empire", "World War II", "Cold War", "Renaissance", "Industrial Revolution", "French Revolution", "American Civil War", "Feudal Japan", "The Vikings", "Aztec Empire", "Mongol Empire", "The Crusades", "Victorian Era", "Prehistoric Era", "Public History"],
      [TOPIC_IDS.SCIENCE]: ["Quantum Physics", "Genetics", "Organic Chemistry", "Neuroscience", "Synthetic Biology", "Astronomy", "Earth Systems", "Energy Systems", "Marine Biology", "Evolution", "Particle Physics", "Bioinformatics", "Planetary Health", "Climate Science", "Robotics", "Ecology"],
      [TOPIC_IDS.ARTS]: ["Impressionism", "Renaissance Art", "AI Art & Prompt Design", "Surrealism", "Digital Illustration", "Modernism", "Sculpture", "Graphic Design", "Fashion Core Trends", "Mobile Content Creation", "Street & Public Art", "Immersive Art Experiences", "Abstract Expressionism", "Ceramics Revival", "Modern Calligraphy", "Gothic Architecture"],
      [TOPIC_IDS.GENERAL]: ["AI Regulation", "Creator Economy", "Inventions", "World Capitals", "Currencies", "Nobel Prizes", "Phobias", "Brand Logos", "Cryptocurrency", "Viral Trends", "Board Games", "Card Games", "Superheroes", "Digital Wellbeing", "Personal AI Assistants", "EV Brands"],
      [TOPIC_IDS.GEOGRAPHY]: ["Capitals", "Landmarks", "Mountains", "Rivers", "Deserts", "Islands", "Volcanoes", "Flags", "Population Stats", "Climate Zones", "Oceans", "US States", "European Countries", "Megacities", "African Nations", "Geopolitical Hotspots"],
      [TOPIC_IDS.MOVIES]: ["Oscars", "Sci-Fi", "Horror", "Marvel Cinematic Universe", "Star Wars", "Pixar", "Streaming Originals", "Game-to-Film Adaptations", "Famous Directors", "Movie Soundtracks", "Cult Classics", "Anime Movies", "French Cinema", "A24 & Indie Cinema", "Special Effects", "Movie Villains"],
      [TOPIC_IDS.MUSIC]: ["Rock & Roll", "Pop Music", "K-Pop 5th Gen", "Afrobeats", "Hip Hop", "Latin Urbano", "EDM", "Hyperpop & Digicore", "R&B Revival", "Country Pop Crossover", "Film & TV Scores", "Music Production & DAWs", "AI Music Tools", "Viral Challenge Songs", "Lo-fi & Chill Beats", "Global Festival Anthems"],
      [TOPIC_IDS.GAMING]: ["Nintendo", "PlayStation", "Xbox", "PC Gaming", "RPGs", "FPS", "Live Service Games", "Retro Gaming", "Esports", "Minecraft", "Pokemon", "Zelda", "Mario", "Indie Games", "Creator Games", "Cross-Platform Gaming"],
      [TOPIC_IDS.SPORTS]: ["Soccer", "Basketball", "Baseball", "Tennis", "Golf", "Formula 1", "Olympics", "Boxing", "MMA", "Cricket", "Rugby", "Swimming", "Winter Sports", "Skateboarding", "Women's Sports", "World Cup"],
      [TOPIC_IDS.TECH]: ["Artificial Intelligence", "Smartphones", "Cloud Computing", "Social Media", "Coding", "Cybersecurity", "Space Tech", "Spatial Computing", "Blockchain", "Robots", "Computer Hardware", "Big Data", "Startups", "AI Safety", "Gaming Tech", "Generative AI Apps"],
      [TOPIC_IDS.MYTHOLOGY]: ["Greek Mythology", "Norse Mythology", "Egyptian Mythology", "Roman Mythology", "Japanese Folklore", "Chinese Mythology", "Celtic Mythology", "Aztec Mythology", "Hindu Mythology", "Native American", "Myth Retellings", "Dark Academia Lore", "Underworlds", "Creation Myths", "Divine Pantheons", "Tricksters"],
      [TOPIC_IDS.LITERATURE]: ["Shakespeare", "Classic Novels", "Dystopian Fiction", "Fantasy", "Sci-Fi Books", "Poetry", "Horror", "Mystery", "Comics & Manga", "Nobel Laureates", "Fairy Tales", "Greek Epics", "Russian Literature", "American Literature", "British Literature", "Serialized Web Fiction"],
      [TOPIC_IDS.NATURE]: ["Mammals", "Birds", "Insects", "Marine Life", "Rewilding", "Rain Forests", "Deserts", "Extreme Weather", "Pollinator Gardens", "Urban Biodiversity", "National Parks", "Survival Skills", "Climate Adaptation", "Endangered Species", "Fungi & Mycelium", "Blue Carbon Ecosystems"],
      [TOPIC_IDS.FOOD]: ["Italian Cuisine", "French Cuisine", "Mexican Food", "Japanese Food", "Chinese Food", "Indian Food", "Korean Cuisine", "Desserts", "Natural Wine", "Specialty Coffee", "High-Protein Meals", "Street Food", "Fast Food", "Artisan Baking", "Vegan", "Zero-Proof Drinks"],
      [TOPIC_IDS.SPACE]: ["Solar System", "Black Holes", "Mars", "Lunar Economy", "Constellations", "Stars", "Galaxies", "Astronauts", "New Space Economy", "Space Telescopes", "Exoplanets", "Gravity", "Rockets", "Commercial Spaceflight", "Space Stations", "Big Bang"],
      [TOPIC_IDS.PHILOSOPHY]: ["Ethics", "Logic", "Metaphysics", "Existentialism", "Stoicism", "Nihilism", "Political Philosophy", "Eastern Philosophy", "Philosophy of Technology", "Consciousness Studies", "Utilitarianism", "Aesthetics", "Epistemology", "Philosophy of AI Alignment", "Digital Ethics", "Paradoxes"]
    }
  },
  quiz: { 
    label_target: "TARGET", 
    label_info: "INFO", 
    btn_next: "Next Question", 
    btn_finish: "Analyze Results",
    btn_analyze: "Analyze Segment", 
    btn_start_next_topic_prefix: "Start ",
    btn_start_next_topic_suffix: " Test",
    ai_status: "AI STATUS",
    ai_calculating: "CALCULATING...",
    ai_answer_found: "ANSWER FOUND",
    ai_done: "AI DONE"
  },
  results: {
    badge_complete: "Analysis Complete", label_percentile: "Global Percentile", label_correct: "Correct Answers", label_cohort: "Cohort Analysis", label_template: "Result Template", label_bottom: "Bottom 1%", label_top: "Top", btn_retry: "Retry", btn_share: "Share Result", btn_save: "Save Image",
    btn_next_topic: "Continue to", 
    header_aggregate: "Aggregate Report",
    label_sync: "AI Knowledge Match",
    header_breakdown: "Detailed Breakdown",
    label_fact: "Fact:",
    label_missed: "Missed",
    label_ai_observer: "AI Observer",
    unit_avg: "AVG",
    unit_pts: "pts",
    suffix_global: "Global",
    tab_analysis: "Analysis",
    tab_details: "Details",
    tab_trends: "Trends",
    page_summary: "SUMMARY",
    page_details: "DETAILS",
    page_trends: "TRENDS",
    click_for_details: "Click for Details",
    popup_question: "Question",
    popup_your_answer: "Your Answer",
    popup_correct_answer: "Correct Answer",
    popup_ai_comment: "AI Analysis",
    level_ai: "AI Level",
    level_global: "Global Level",
    section_growth: "Growth Trajectory",
    section_gap: "Human vs AI Gap",
    section_weakness: "Weakness Analysis",
    label_gap_avg: "Avg Gap",
    msg_weakness: "Identified weakest domain:",
    msg_advice: "Focus on fundamental principles to improve your rating.",
    chart: {
      accuracy: "Accuracy",
      speed: "Speed",
      cohort: "Cohort",
      logic: "Logic",
      intuition: "Intuition"
    }
  },
  loading: { 
    gen_vectors: "PREPARING FOR AI BATTLE...", 
    analyzing: "CALCULATING NEURAL METRICS...",
    sync: "SYNCHRONIZING...",
    logs: [
      "INITIALIZING_NEURAL_NET...",
      "HANDSHAKE_PROTOCOL: [SECURE]",
      "ACCESSING_GLOBAL_DATABASE...",
      "LOADING_TOPIC_VECTORS...",
      "CALIBRATING_DIFFICULTY_MATRIX...",
      "SYNCHRONIZING_WAVEFORMS...",
      "ALLOCATING_VIRTUAL_NEURONS...",
      "READY_TO_ENGAGE."
    ]
  },
  difficulty: { [Difficulty.EASY]: "Novice", [Difficulty.MEDIUM]: "Competent", [Difficulty.HARD]: "Expert" },
  error: { title: "System Failure", btn_reset: "System Reset" }
};

const KO_TRANSLATIONS: TranslationData = {
  ...ENGLISH_BASE,
  common: { 
    btn_back: "뒤로", 
    confirm_exit: "퀴즈를 종료하시겠습니까? 진행 상황이 손실됩니다.", 
    confirm_home: "홈 화면으로 이동하시겠습니까? 진행 상황이 초기화됩니다.",
    confirm_exit_app: "앱을 종료하시겠습니까?",
    close: "닫기" 
  },
  intro: { 
    human_label: "인간", 
    ai_label: "인공지능", 
    title: "AI vs Human",
    desc: "전문 분야를 선택하고 인간의 직관이 여전히 우위임을 증명하십시오.", 
    btn_start: "테스트 시작",
    btn_continue: "저장된 프로필로 계속하기",
    btn_reset: "프로필 초기화"
  },
  profile: {
    title: "대상자 프로필", desc: "사용자의 국가별 문화 특성 및 교육 수준 최적화를 위해 사용됩니다.",
    label_gender: "성별", label_age: "연령대", label_nationality: "국적", btn_submit: "프로필 확정", skip: "건너뛰기",
    genders: { Male: "남성", Female: "여성", Other: "기타" },
    ages: { "Under 18": "18세 미만", "18-24": "18-24세", "25-34": "25-34세", "35-44": "35-44세", "45-54": "45-54세", "55+": "55세 이상" },
    nationalities: { other: "다른 국가 선택..." }
  },
  topics: {
    ...ENGLISH_BASE.topics,
    title_select: "영역 선택", title_config: "세부 분야 선택", 
    desc_select: "도전하고자 하는 영역을 선택하세요.",
    btn_refresh: "새로고침", 
    btn_next_step: "세부 분야 선택",
    label_custom: "", ph_custom: "", label_field: "세부 분야", label_difficulty: "난이도", label_topics_selected: "개 분야 선택됨", btn_start_sim: "테스트 시작",
    categories: {
      [TOPIC_IDS.HISTORY]: "역사", [TOPIC_IDS.SCIENCE]: "과학", [TOPIC_IDS.ARTS]: "예술", [TOPIC_IDS.GENERAL]: "일반 상식", [TOPIC_IDS.GEOGRAPHY]: "지리", [TOPIC_IDS.MOVIES]: "영화", [TOPIC_IDS.MUSIC]: "음악", [TOPIC_IDS.GAMING]: "게임", [TOPIC_IDS.SPORTS]: "스포츠", [TOPIC_IDS.TECH]: "기술", [TOPIC_IDS.MYTHOLOGY]: "신화", [TOPIC_IDS.LITERATURE]: "문학", [TOPIC_IDS.NATURE]: "자연", [TOPIC_IDS.FOOD]: "음식", [TOPIC_IDS.SPACE]: "우주", [TOPIC_IDS.PHILOSOPHY]: "철학"
    },
    subtopics: {
      [TOPIC_IDS.HISTORY]: ["고대 이집트", "로마 제국", "제2차 세계대전", "냉전", "르네상스", "산업 혁명", "프랑스 혁명", "미국 내전", "봉건 일본", "바이킹", "아즈텍 제국", "몽골 제국", "십자군", "빅토리아 시대", "선사 시대", "공공 역사"],
      [TOPIC_IDS.SCIENCE]: ["양자 역학", "유전학", "유기 화학", "신경 과학", "합성생물학", "천문학", "지구 시스템", "에너지 시스템", "해양 생물학", "진화론", "입자 물리학", "생물정보학", "행성 건강", "기후 과학", "로봇 공학", "생태학"],
      [TOPIC_IDS.ARTS]: ["인상주의", "르네상스 예술", "AI 아트 & 프롬프트 디자인", "초현실주의", "디지털 일러스트레이션", "모더니즘", "조각", "그래픽 디자인", "패션 코어 트렌드", "모바일 콘텐츠 제작", "스트리트 & 공공 미술", "몰입형 아트 경험", "추상 표현주의", "세라믹 리바이벌", "모던 캘리그래피", "고딕 건축"],
      [TOPIC_IDS.GENERAL]: ["AI 규제", "크리에이터 이코노미", "발명품", "세계 수도", "통화", "노벨상", "공포증", "브랜드 로고", "암호화폐", "바이럴 트렌드", "보드 게임", "카드 게임", "슈퍼히어로", "디지털 웰빙", "개인형 AI 어시스턴트", "EV 브랜드"],
      [TOPIC_IDS.GEOGRAPHY]: ["수도", "랜드마크", "산맥", "강", "사막", "섬", "화산", "국기", "인구 통계", "기후대", "대양", "미국 주", "유럽 국가", "메가시티", "아프리카 국가", "지정학적 핫스팟"],
      [TOPIC_IDS.MOVIES]: ["오스카", "SF", "공포", "마블 시네마틱 유니버스", "스타워즈", "픽사", "스트리밍 오리지널", "게임 원작 영화", "유명 감독", "영화 사운드트랙", "컬트 클래식", "애니메이션 영화", "프랑스 영화", "A24 & 인디 시네마", "특수 효과", "영화 빌런"],
      [TOPIC_IDS.MUSIC]: ["락앤롤", "팝 음악", "K-팝 5세대", "아프로비츠", "힙합", "라틴 우르바노", "EDM", "하이퍼팝 & 디지코어", "R&B 리바이벌", "컨트리 팝 크로스오버", "영화·TV 스코어", "음악 프로덕션 & DAW", "AI 음악 도구", "바이럴 챌린지 송", "로파이 & 칠 비트", "글로벌 페스티벌 앤섬"],
      [TOPIC_IDS.GAMING]: ["닌텐도", "플레이스테이션", "엑스박스", "PC 게임", "RPG", "FPS", "라이브 서비스 게임", "레트로 게임", "e스포츠", "마인크래프트", "포켓몬", "젤다", "마리오", "인디 게임", "크리에이터 게임", "크로스플랫폼 게임"],
      [TOPIC_IDS.SPORTS]: ["축구", "농구", "야구", "테니스", "골프", "포뮬러 1", "올림픽", "복싱", "MMA", "크리켓", "럭비", "수영", "겨울 스포츠", "스케이트보드", "여성 스포츠", "월드컵"],
      [TOPIC_IDS.TECH]: ["인공지능", "스마트폰", "클라우드 컴퓨팅", "소셜 미디어", "코딩", "사이버 보안", "우주 기술", "공간 컴퓨팅", "블록체인", "로봇", "컴퓨터 하드웨어", "빅데이터", "스타트업", "AI 안전성", "게이밍 기술", "생성형 AI 앱"],
      [TOPIC_IDS.MYTHOLOGY]: ["그리스 신화", "북유럽 신화", "이집트 신화", "로마 신화", "일본 설화", "중국 신화", "켈트 신화", "아즈텍 신화", "힌두 신화", "북미 원주민", "신화 리텔링", "다크 아카데미아 로어", "지하 세계", "창세 신화", "신들의 판테온", "트릭스터"],
      [TOPIC_IDS.LITERATURE]: ["셰익스피어", "고전 소설", "디스토피아 소설", "판타지", "SF 도서", "시", "공포", "미스터리", "만화 및 망가", "노벨 문학상", "동화", "그리스 서사시", "러시아 문학", "미국 문학", "영국 문학", "연재형 웹픽션"],
      [TOPIC_IDS.NATURE]: ["포유류", "조류", "곤충", "해양 생물", "리와일딩", "열대 우림", "사막", "극한 기상", "수분매개 정원", "도시 생물다양성", "국립공원", "생존 기술", "기후 적응", "멸종 위기종", "균류 & 균사체", "블루 카본 생태계"],
      [TOPIC_IDS.FOOD]: ["이탈리아 요리", "프랑스 요리", "멕시코 음식", "일본 음식", "중국 음식", "인도 음식", "한식", "디저트", "내추럴 와인", "스페셜티 커피", "고단백 식단", "길거리 음식", "패스트 푸드", "아티장 베이킹", "비건", "논알코올 음료"],
      [TOPIC_IDS.SPACE]: ["태양계", "블랙홀", "화성", "달 경제", "별자리", "별", "은하", "우주 비행사", "뉴 스페이스 경제", "우주 망원경", "외계 행성", "중력", "로켓", "상업 우주비행", "우주 정거장", "빅뱅"],
      [TOPIC_IDS.PHILOSOPHY]: ["윤리학", "논리학", "형이상학", "실존주의", "스토아학파", "허무주의", "정치 철학", "동양 철학", "기술 철학", "의식 연구", "공리주의", "미학", "인식론", "AI 정렬 철학", "디지털 윤리", "역설"]
    }
  },
  quiz: { 
    label_target: "목표", label_info: "정보", 
    btn_next: "다음 문제", 
    btn_finish: "결과 분석",
    btn_analyze: "중간 분석 실행",
    btn_start_next_topic_prefix: "",
    btn_start_next_topic_suffix: " 분야 테스트 시작",
    ai_status: "AI STATUS",
    ai_calculating: "생각 중...",
    ai_answer_found: "답변 도출 완료",
    ai_done: "AI 완료"
  },
  results: {
    badge_complete: "분석 완료", label_percentile: "글로벌 백분위", label_correct: "정답 수", label_cohort: "집단 분석", label_template: "결과 템플릿", label_bottom: "하위 1%", label_top: "상위", btn_retry: "재시도", btn_share: "결과 공유", btn_save: "이미지 저장",
    btn_next_topic: "다음 주제:", 
    header_aggregate: "종합 리포트",
    label_sync: "AI 지식 일치도",
    header_breakdown: "상세 분석",
    label_fact: "팩트:",
    label_missed: "오답",
    label_ai_observer: "AI 관찰자",
    unit_avg: "평균",
    unit_pts: "점",
    suffix_global: "글로벌",
    tab_analysis: "분석",
    tab_details: "상세",
    tab_trends: "트렌드",
    page_summary: "평가 요약",
    page_details: "상세 분석",
    page_trends: "성장 트렌드",
    click_for_details: "상세 보기",
    popup_question: "문제",
    popup_your_answer: "나의 답변",
    popup_correct_answer: "정답",
    popup_ai_comment: "AI 분석 코멘트",
    level_ai: "AI 대비 수준",
    level_global: "글로벌 수준",
    section_growth: "성장 그래프",
    section_gap: "AI 실력 격차",
    section_weakness: "약점 분석",
    label_gap_avg: "평균 격차",
    msg_weakness: "취약 분야:",
    msg_advice: "기초 원리에 집중하여 등급을 올리십시오.",
    chart: { accuracy: "정확도", speed: "속도", cohort: "집단위치", logic: "논리력", intuition: "직관력" }
  },
  loading: { 
    gen_vectors: "AI와의 대결 준비 중...", 
    analyzing: "신경망 데이터 분석 중...",
    sync: "동기화 중...",
    logs: [
      "신경망 초기화 중...",
      "보안 프로토콜 연결...",
      "글로벌 데이터베이스 접근...",
      "주제 벡터 로딩...",
      "난이도 매트릭스 조정...",
      "파형 동기화...",
      "가상 뉴런 할당...",
      "전투 준비 완료."
    ]
  },
  difficulty: { [Difficulty.EASY]: "초급", [Difficulty.MEDIUM]: "중급", [Difficulty.HARD]: "고급" },
  error: { title: "시스템 오류", btn_reset: "시스템 재설정" }
};

const JA_TRANSLATIONS: TranslationData = {
  ...ENGLISH_BASE,
  common: { 
    btn_back: "戻る", 
    confirm_exit: "クイズを終了しますか？進行状況は失われます。", 
    confirm_home: "ホームに戻りますか？現在の進行状況は失われます。",
    confirm_exit_app: "アプリを終了しますか？",
    close: "閉じる" 
  },
  intro: { 
    human_label: "人間", 
    ai_label: "AI", 
    title: "AI vs Human",
    desc: "専門分野を選択し、人間の直感がいまだに優位であることを証明してください。", 
    btn_start: "テスト開始",
    btn_continue: "保存されたプロフィールで続行",
    btn_reset: "プロフィールを初期化"
  },
  profile: {
    title: "被験者プロフィール", desc: "文化的・教育적背景の最適化に使用されます。",
    label_gender: "性別", label_age: "年齢層", label_nationality: "国籍", btn_submit: "確定", skip: "スキップ",
    genders: { Male: "男性", Female: "女性", Other: "その他" },
    ages: { "Under 18": "18歳未満", "18-24": "18-24歳", "25-34": "25-34歳", "35-44": "35-44歳", "45-54": "45-54歳", "55+": "55歳以上" },
    nationalities: { other: "他の国を選択..." }
  },
  topics: {
    ...ENGLISH_BASE.topics,
    title_select: "ドメイン選択", title_config: "詳細分野の選択", 
    desc_select: "挑戦する領域を選択してください。",
    btn_refresh: "更新", 
    btn_next_step: "詳細分野の選択",
    label_custom: "", ph_custom: "", label_field: "特定分野", label_difficulty: "難易度", label_topics_selected: "個の分野を選択", btn_start_sim: "テスト開始",
    categories: {
      [TOPIC_IDS.HISTORY]: "歴史", [TOPIC_IDS.SCIENCE]: "科学", [TOPIC_IDS.ARTS]: "芸術", [TOPIC_IDS.GENERAL]: "一般常識", [TOPIC_IDS.GEOGRAPHY]: "地理", [TOPIC_IDS.MOVIES]: "映画", [TOPIC_IDS.MUSIC]: "音楽", [TOPIC_IDS.GAMING]: "ゲーム", [TOPIC_IDS.SPORTS]: "スポーツ", [TOPIC_IDS.TECH]: "テクノロジー", [TOPIC_IDS.MYTHOLOGY]: "神話", [TOPIC_IDS.LITERATURE]: "文学", [TOPIC_IDS.NATURE]: "自然", [TOPIC_IDS.FOOD]: "料理", [TOPIC_IDS.SPACE]: "宇宙", [TOPIC_IDS.PHILOSOPHY]: "哲学"
    },
    subtopics: {
      [TOPIC_IDS.HISTORY]: ["古代エジプト", "ローマ帝国", "第二次世界大戦", "冷戦", "ルネサンス", "産業革命", "フランス革命", "アメリカ南北戦争", "封建時代の日本", "バイキング", "アズテック帝国", "モンゴル帝国", "十字軍", "ビクトリア朝", "先史時代", "パブリックヒストリー"],
      [TOPIC_IDS.SCIENCE]: ["量子力学", "遺伝学", "有機化学", "神経科学", "合成生物学", "天文学", "地球システム", "エネルギーシステム", "海洋生物学", "進化論", "素粒子物理学", "バイオインフォマティクス", "プラネタリーヘルス", "気候科学", "ロボット工学", "生態学"],
      [TOPIC_IDS.ARTS]: ["印象派", "ルネサンス美術", "AIアート＆プロンプトデザイン", "シュルレアリスム", "デジタルイラスト", "モダニズム", "彫刻", "グラフィックデザイン", "ファッションコアトレンド", "モバイルコンテンツ制作", "ストリート＆パブリックアート", "没入型アート体験", "抽象表現主義", "セラミックリバイバル", "モダンカリグラフィー", "ゴシック建築"],
      [TOPIC_IDS.GENERAL]: ["AI規制", "クリエイターエコノミー", "発明", "世界の首都", "通貨", "ノーベル賞", "恐怖症", "ブランドロゴ", "暗号資産", "バイラルトレンド", "ボードゲーム", "カードゲーム", "スーパーヒーロー", "デジタルウェルビーイング", "パーソナルAIアシスタント", "EVブランド"],
      [TOPIC_IDS.GEOGRAPHY]: ["首都", "ランドマーク", "山脈", "川", "砂漠", "島", "火山", "国旗", "人口統計", "気候帯", "海洋", "米国の州", "欧州の国々", "メガシティ", "アフリカの諸国", "地政学ホットスポット"],
      [TOPIC_IDS.MOVIES]: ["オスカー", "SF", "ホラー", "マーベル・シネマティック・ユニバース", "スター・ウォーズ", "ピクサー", "ストリーミングオリジナル", "ゲーム原作映画", "有名監督", "映画音楽", "カルト・クラシック", "アニメ映画", "フランス映画", "A24・インディーシネマ", "特殊効果", "映画のヴィラン"],
      [TOPIC_IDS.MUSIC]: ["ロックンロール", "ポップ・ミュージック", "K-POP第5世代", "アフロビーツ", "ヒップホップ", "ラテン・ウルバーノ", "EDM", "ハイパーポップ＆ディジコア", "R&Bリバイバル", "カントリー・ポップ・クロスオーバー", "映画・TVスコア", "音楽制作＆DAW", "AI音楽ツール", "バイラルチャレンジ曲", "ローファイ＆チルビーツ", "グローバルフェス・アンセム"],
      [TOPIC_IDS.GAMING]: ["任天堂", "プレイステーション", "Xbox", "PCゲーム", "RPG", "FPS", "ライブサービスゲーム", "レトロゲーム", "eスポーツ", "マインクラフト", "ポケモン", "ゼルダ", "マリオ", "インディーゲーム", "クリエイターゲーム", "クロスプラットフォームゲーム"],
      [TOPIC_IDS.SPORTS]: ["サッカー", "バスケットボール", "野球", "テニス", "ゴルフ", "F1", "オリンピック", "ボクシング", "総合格闘技", "クリケット", "ラグビー", "水泳", "ウィンタースポーツ", "スケートボード", "女子スポーツ", "ワールドカップ"],
      [TOPIC_IDS.TECH]: ["人工知能", "スマートフォン", "クラウドコンピューティング", "ソーシャルメディア", "コーディング", "サイバーセキュリティ", "宇宙技術", "空間コンピューティング", "ブロックチェーン", "ロボット", "コンピュータハードウェア", "ビッグデータ", "スタートアップ", "AI安全性", "ゲーミング技術", "生成AIアプリ"],
      [TOPIC_IDS.MYTHOLOGY]: ["ギリシャ神話", "北欧神話", "エジプト神話", "ローマ神話", "日本伝承", "中国神話", "ケルト神話", "アズテック神話", "ヒンドゥー神話", "ネイティブ・アメリカン", "神話リテリング", "ダークアカデミア・ロア", "冥界", "創世神話", "神々のパンテオン", "トリックスター"],
      [TOPIC_IDS.LITERATURE]: ["シェイクスピア", "古典小説", "ディストピア小説", "ファンタジー", "SF小説", "詩", "ホラー", "ミステリー", "コミック・漫画", "ノーベル賞作家", "おとぎ話", "ギリシャ叙事詩", "ロシア文学", "アメリカ文学", "イギリス文学", "連載型ウェブフィクション"],
      [TOPIC_IDS.NATURE]: ["哺乳類", "鳥類", "昆虫", "海洋生物", "リワイルディング", "熱帯雨林", "砂漠", "異常気象", "ポリネーターガーデン", "都市生物多様性", "国立公園", "生存技術", "気候適応", "絶滅危惧種", "菌類＆菌糸体", "ブルーカーボン生態系"],
      [TOPIC_IDS.FOOD]: ["イタリア料理", "フランス料理", "メキシコ料理", "日本料理", "中華料理", "インド料理", "韓国料理", "デザート", "ナチュラルワイン", "スペシャルティコーヒー", "高タンパク食", "ストリートフード", "ファストフード", "アーティザンベーキング", "ヴィーガン", "ノンアルコールドリンク"],
      [TOPIC_IDS.SPACE]: ["太陽系", "ブラックホール", "火星", "月面経済", "星座", "星", "銀河", "宇宙飛行士", "ニュースペース経済", "宇宙望遠鏡", "系外惑星", "重力", "ロケット", "商業宇宙飛行", "宇宙ステーション", "ビッグバン"],
      [TOPIC_IDS.PHILOSOPHY]: ["倫理学", "論理学", "形而上学", "実存主義", "ストア派", "虚無主義", "政治哲学", "東洋哲学", "技術哲学", "意識研究", "功利主義", "美学", "認識論", "AIアライメント哲学", "デジタル倫理", "パラドックス"]
    }
  },
  quiz: { 
    label_target: "目標", label_info: "情報", 
    btn_next: "次の問題", 
    btn_finish: "結果分析",
    btn_analyze: "中間分析を実行",
    btn_start_next_topic_prefix: "",
    btn_start_next_topic_suffix: "分野テスト開始",
    ai_status: "AI STATUS",
    ai_calculating: "計算中...",
    ai_answer_found: "回答生成完了",
    ai_done: "AI完了"
  },
  results: {
    badge_complete: "分析完了", label_percentile: "世界ランク", label_correct: "正解数", label_cohort: "集団分析", label_template: "結果テンプレート", label_bottom: "下位 1%", label_top: "上位", btn_retry: "リトライ", btn_share: "結果を共有", btn_save: "画像を保存",
    btn_next_topic: "次のテーマ:", 
    header_aggregate: "総合レポート",
    label_sync: "AI知識一致度",
    header_breakdown: "詳細分析",
    label_fact: "事実:",
    label_missed: "不正解",
    label_ai_observer: "AIオブザーバー",
    unit_avg: "平均",
    unit_pts: "点",
    suffix_global: "位",
    tab_analysis: "分析",
    tab_details: "詳細",
    tab_trends: "傾向",
    page_summary: "評価概要",
    page_details: "詳細分析",
    page_trends: "成長記録",
    click_for_details: "詳細を見る",
    popup_question: "問題",
    popup_your_answer: "あなたの回答",
    popup_correct_answer: "正解",
    popup_ai_comment: "AI分析コメント",
    level_ai: "AI対比レベル",
    level_global: "グローバルレベル",
    section_growth: "成長グラフ",
    section_gap: "対AIスコア差",
    section_weakness: "弱点分析",
    label_gap_avg: "平均差",
    msg_weakness: "最弱分野:",
    msg_advice: "基礎原理に集中して評価を上げてください。",
    chart: { accuracy: "正確性", speed: "速度", cohort: "集団位置", logic: "論理力", intuition: "直感力" }
  },
  loading: { 
    gen_vectors: "AIとの対決を準備中...", 
    analyzing: "ニューラルリンク接続中...",
    sync: "同期中...",
    logs: [
      "ニューラルネットワーク初期化...",
      "ハンドシェイク: [安全]",
      "グローバルDBアクセス...",
      "トピックベクトル読み込み...",
      "難易度マトリックス調整...",
      "波形同期中...",
      "仮想ニューロン割り当て...",
      "エンゲージ準備完了."
    ]
  },
  difficulty: { [Difficulty.EASY]: "初級", [Difficulty.MEDIUM]: "中級", [Difficulty.HARD]: "上級" },
  error: { title: "システムエラー", btn_reset: "システムリセット" }
};

const ES_TRANSLATIONS: TranslationData = {
  ...ENGLISH_BASE,
  common: { 
    btn_back: "Volver", 
    confirm_exit: "¿Estás seguro de que quieres salir? Se perderá el progreso.", 
    confirm_home: "¿Volver al inicio? Se perderá el progreso actual.",
    confirm_exit_app: "¿Quieres salir de la aplicación?",
    close: "Cerrar" 
  },
  intro: { 
    human_label: "Humano", 
    ai_label: "IA", 
    title: "AI vs Human",
    desc: "Selecciona un campo de experiencia y demuestra que la intuición humana sigue reinando.", 
    btn_start: "Comenzar Prueba",
    btn_continue: "Continuar con Perfil Guardado",
    btn_reset: "Reiniciar Perfil"
  },
  topics: {
    ...ENGLISH_BASE.topics,
    desc_select: "Selecciona los dominios que deseas desafiar.",
  },
  results: {
    ...ENGLISH_BASE.results,
    label_sync: "Nivel de Conocimiento",
    page_summary: "Resumen",
    page_details: "Detalles",
    page_trends: "Tendencias",
    tab_trends: "Tendencias",
    click_for_details: "Ver detalles",
    popup_question: "Pregunta",
    popup_your_answer: "Tu Respuesta",
    popup_correct_answer: "Respuesta Correcta",
    popup_ai_comment: "Análisis de IA",
    level_ai: "Nivel IA",
    level_global: "Nivel Global",
    section_growth: "Trayectoria",
    section_gap: "Brecha Humano vs IA",
    section_weakness: "Análisis de Debilidad",
    label_gap_avg: "Brecha Media",
    msg_weakness: "Área más débil:",
    msg_advice: "Concéntrate en los principios básicos.",
  },
  loading: {
    gen_vectors: "PREPARANDO BATALLA CONTRA IA...",
    analyzing: "ANALIZANDO DATOS...",
    sync: "SINCRONIZANDO...",
    logs: [
      "INICIALIZANDO RED NEURONAL...",
      "PROTOCOLO: [SEGURO]",
      "ACCEDIENDO BASE DE DATOS...",
      "CARGANDO VECTORES...",
      "CALIBRANDO DIFICULTAD...",
      "SINCRONIZANDO ONDAS...",
      "ASIGNANDO NEURONAS...",
      "LISTO PARA COMBATE."
    ]
  }
};

const FR_TRANSLATIONS: TranslationData = {
  ...ENGLISH_BASE,
  common: { 
    btn_back: "Retour", 
    confirm_exit: "Voulez-vous vraiment quitter ? La progression sera perdue.", 
    confirm_home: "Retourner à l'accueil ? La progression actuelle sera perdue.",
    confirm_exit_app: "Voulez-vous quitter l'application ?",
    close: "Fermer" 
  },
  intro: { 
    human_label: "Humain", 
    ai_label: "IA", 
    title: "AI vs Human",
    desc: "Sélectionnez un domaine d'expertise et prouvez que l'intuition humaine règne toujours en maître.", 
    btn_start: "Commencer le test",
    btn_continue: "Continuer avec le profil enregistré",
    btn_reset: "Réinitialiser le profil"
  },
  topics: {
    ...ENGLISH_BASE.topics,
    desc_select: "Sélectionnez les domaines que vous souhaitez défier.",
  },
  results: {
    ...ENGLISH_BASE.results,
    label_sync: "Niveau de Connaissance",
    page_summary: "Résumé",
    page_details: "Détails",
    page_trends: "Tendances",
    tab_trends: "Tendances",
    click_for_details: "Voir détails",
    popup_question: "Question",
    popup_your_answer: "Votre Réponse",
    popup_correct_answer: "Bonne Réponse",
    popup_ai_comment: "Analyse IA",
    level_ai: "Niveau IA",
    level_global: "Niveau Global",
    section_growth: "Trajectoire",
    section_gap: "Écart Humain vs IA",
    section_weakness: "Analyse des Faiblesses",
    label_gap_avg: "Écart Moyen",
    msg_weakness: "Domaine le plus faible:",
    msg_advice: "Concentrez-vous sur les principes fondamentaux.",
  },
  loading: {
    gen_vectors: "PRÉPARATION DU COMBAT CONTRE L'IA...",
    analyzing: "ANALYSE DES DONNÉES...",
    sync: "SYNCHRONISATION...",
    logs: [
      "INITIALISATION RÉSEAU NEURONAL...",
      "PROTOCOLE: [SÉCURISÉ]",
      "ACCÈS BASE DE DONNÉES...",
      "CHARGEMENT VECTEURS...",
      "CALIBRAGE DIFFICULTÉ...",
      "SYNCHRONISATION ONDES...",
      "ALLOCATION NEURONES...",
      "PRÊT À ENGAGER."
    ]
  }
};

const ZH_TRANSLATIONS: TranslationData = {
  ...ENGLISH_BASE,
  common: { 
    btn_back: "返回", 
    confirm_exit: "确定要退出测验吗？进度将会丢失。", 
    confirm_home: "返回主页？当前进度将丢失。",
    confirm_exit_app: "您要退出应用程序吗？",
    close: "关闭" 
  },
  intro: { 
    human_label: "人类", 
    ai_label: "人工智能", 
    title: "AI vs Human",
    desc: "选择专业领域，证明人类直觉仍然至高无上。", 
    btn_start: "开始测试",
    btn_continue: "继续使用已保存的档案",
    btn_reset: "重置档案数据"
  },
  profile: {
    title: "受试者档案", desc: "用于优化文化和教育背景。",
    label_gender: "性别", label_age: "年龄组", label_nationality: "国籍", btn_submit: "确认档案", skip: "跳过并继续",
    genders: { Male: "男性", Female: "女性", Other: "其他" },
    ages: { "Under 18": "18岁以下", "18-24": "18-24岁", "25-34": "25-34岁", "35-44": "35-44岁", "45-54": "45-54岁", "55+": "55岁以上" },
    nationalities: { other: "选择其他国家..." }
  },
  topics: {
    ...ENGLISH_BASE.topics,
    title_select: "选择领域", title_config: "选择子主题", 
    desc_select: "选择您想要挑战的领域。",
    btn_refresh: "刷新", 
    btn_next_step: "选择子主题",
    label_custom: "", ph_custom: "", label_field: "特定领域", label_difficulty: "难度", label_topics_selected: "个已选主题", btn_start_sim: "开始测试",
    categories: {
      [TOPIC_IDS.HISTORY]: "历史", [TOPIC_IDS.SCIENCE]: "科学", [TOPIC_IDS.ARTS]: "艺术", [TOPIC_IDS.GENERAL]: "通识", [TOPIC_IDS.GEOGRAPHY]: "地理", [TOPIC_IDS.MOVIES]: "电影", [TOPIC_IDS.MUSIC]: "音乐", [TOPIC_IDS.GAMING]: "游戏", [TOPIC_IDS.SPORTS]: "体育", [TOPIC_IDS.TECH]: "科技", [TOPIC_IDS.MYTHOLOGY]: "神话", [TOPIC_IDS.LITERATURE]: "文学", [TOPIC_IDS.NATURE]: "自然", [TOPIC_IDS.FOOD]: "美食", [TOPIC_IDS.SPACE]: "太空", [TOPIC_IDS.PHILOSOPHY]: "哲学"
    },
    subtopics: {
      [TOPIC_IDS.HISTORY]: ["古埃及", "罗马帝国", "第二次世界大战", "冷战", "文艺复兴", "工业革命", "法国大革命", "美国内战", "封建日本", "维京人", "阿兹特克帝国", "蒙古帝国", "十字军东征", "维多利亚时代", "史前时代", "公共史学"],
      [TOPIC_IDS.SCIENCE]: ["量子物理", "遗传学", "有机化学", "神经科学", "合成生物学", "天文学", "地球系统", "能源系统", "海洋生物学", "进化论", "粒子物理学", "生物信息学", "行星健康", "气候科学", "机器人学", "生态学"],
      [TOPIC_IDS.ARTS]: ["印象派", "文艺复兴艺术", "AI 艺术与提示词设计", "超现实主义", "数字插画", "现代主义", "雕塑", "平面设计", "时尚核心趋势", "移动内容创作", "街头与公共艺术", "沉浸式艺术体验", "抽象表现主义", "陶瓷复兴", "现代书法", "哥特式建筑"],
      [TOPIC_IDS.GENERAL]: ["AI 监管", "创作者经济", "发明", "世界首都", "货币", "诺贝尔奖", "恐惧症", "品牌标志", "加密货币", "病毒式趋势", "棋盘游戏", "纸牌游戏", "超级英雄", "数字健康", "个人 AI 助手", "EV 品牌"],
      [TOPIC_IDS.GEOGRAPHY]: ["首都", "地标", "山脉", "河流", "沙漠", "岛屿", "火山", "国旗", "人口统计", "气候带", "海洋", "美国各州", "欧洲国家", "超级城市", "非洲国家", "地缘热点"],
      [TOPIC_IDS.MOVIES]: ["奥斯卡", "科幻", "恐怖", "漫威电影宇宙", "星球大战", "皮克斯", "流媒体原创", "游戏改编电影", "著名导演", "电影原声带", "邪典电影", "动画电影", "法国电影", "A24 与独立电影", "特效", "电影反派"],
      [TOPIC_IDS.MUSIC]: ["摇滚乐", "流行音乐", "K-Pop 第五世代", "Afrobeats", "嘻哈", "拉丁 Urbano", "电子舞曲", "Hyperpop 与 Digicore", "R&B 复兴", "乡村流行跨界", "影视配乐", "音乐制作与 DAW", "AI 音乐工具", "挑战赛病毒歌曲", "Lo-fi 与 Chill Beats", "全球音乐节圣歌"],
      [TOPIC_IDS.GAMING]: ["任天堂", "PlayStation", "Xbox", "PC游戏", "RPG", "FPS", "长线运营游戏", "复古游戏", "电子竞技", "我的世界", "精灵宝可梦", "塞尔达传说", "马里奥", "独立游戏", "创作者游戏", "跨平台游戏"],
      [TOPIC_IDS.SPORTS]: ["足球", "篮球", "棒球", "网球", "高尔夫", "一级方程式", "奥运会", "拳击", "综合格斗", "板球", "橄榄球", "游泳", "冬季运动", "滑板", "女子体育", "世界杯"],
      [TOPIC_IDS.TECH]: ["人工智能", "智能手机", "云计算", "社交媒体", "编程", "网络安全", "太空技术", "空间计算", "区块链", "机器人", "计算机硬件", "大数据", "初创公司", "AI 安全", "游戏技术", "生成式 AI 应用"],
      [TOPIC_IDS.MYTHOLOGY]: ["希腊神话", "北欧神话", "埃及神话", "罗马神话", "日本民间传说", "中国神话", "凯尔特神话", "阿兹特克神话", "印度神话", "美洲原住民", "神话重述", "黑暗学院传说", "冥界", "创世神话", "诸神体系", "恶作剧之神"],
      [TOPIC_IDS.LITERATURE]: ["莎士比亚", "经典小说", "反乌托邦小说", "奇幻", "科幻书籍", "诗歌", "恐怖", "悬疑", "漫画", "诺贝尔奖得主", "童话", "希腊史诗", "俄罗斯文学", "美国文学", "英国文学", "连载网文"],
      [TOPIC_IDS.NATURE]: ["哺乳动物", "鸟类", "昆虫", "海洋生物", "生态复野", "雨林", "沙漠", "极端天气", "传粉花园", "城市生物多样性", "国家公园", "生存技能", "气候适应", "濒危物种", "真菌与菌丝体", "蓝碳生态系统"],
      [TOPIC_IDS.FOOD]: ["意大利美食", "法国美食", "墨西哥美食", "日本料理", "中国美食", "印度美食", "韩国料理", "甜点", "自然酒", "精品咖啡", "高蛋白饮食", "街头小吃", "快餐", "手工烘焙", "素食", "无酒精饮品"],
      [TOPIC_IDS.SPACE]: ["太阳系", "黑洞", "火星", "月球经济", "星座", "恒星", "星系", "宇航员", "新太空经济", "太空望远镜", "系外行星", "重力", "火箭", "商业航天", "空间站", "大爆炸"],
      [TOPIC_IDS.PHILOSOPHY]: ["伦理学", "逻辑学", "形而上学", "实存主义", "斯多葛学派", "虚无主义", "政治哲学", "东方哲学", "技术哲学", "意识研究", "功利主义", "美学", "认识论", "AI 对齐哲学", "数字伦理", "悖论"]
    }
  },
  quiz: { 
    label_target: "目标", label_info: "信息", 
    btn_next: "下一题", 
    btn_finish: "分析结果",
    btn_analyze: "执行中间分析",
    btn_start_next_topic_prefix: "开始",
    btn_start_next_topic_suffix: " 测试",
    ai_status: "AI状态",
    ai_calculating: "计算中...",
    ai_answer_found: "答案已生成",
    ai_done: "AI完成"
  },
  results: {
    badge_complete: "分析完成", label_percentile: "全球排名", label_correct: "正确答案数", label_cohort: "群体分析", label_template: "结果模板", label_bottom: "后 1%", label_top: "前", btn_retry: "重试", btn_share: "分享结果", btn_save: "保存图片",
    btn_next_topic: "继续下一个主题：", 
    header_aggregate: "综合报告",
    label_sync: "AI知识契合度",
    header_breakdown: "详细细分",
    label_fact: "事实：",
    label_missed: "错误",
    label_ai_observer: "AI 观察员",
    unit_avg: "平均",
    unit_pts: "分",
    suffix_global: "全球",
    tab_analysis: "分析",
    tab_details: "详情",
    tab_trends: "趋势",
    page_summary: "评估摘要",
    page_details: "详细分析",
    page_trends: "成长轨迹",
    click_for_details: "点击查看详情",
    popup_question: "问题",
    popup_your_answer: "你的答案",
    popup_correct_answer: "正确答案",
    popup_ai_comment: "AI 分析评论",
    level_ai: "AI 对比水平",
    level_global: "全球水平",
    section_growth: "成长曲线",
    section_gap: "人机差距",
    section_weakness: "弱点分析",
    label_gap_avg: "平均差距",
    msg_weakness: "最弱领域:",
    msg_advice: "专注于基础原则以提高评分。",
    chart: { accuracy: "准确性", speed: "速度", cohort: "群体定位", logic: "逻辑力", intuition: "直觉力" }
  },
  loading: { 
    gen_vectors: "正在准备与AI的对决...", 
    analyzing: "NEURAL LINK ACTIVE...",
    sync: "同步中...",
    logs: [
      "初始化神经网络...",
      "握手协议: [安全]",
      "访问全球数据库...",
      "加载主题向量...",
      "校准难度矩阵...",
      "同步波形...",
      "分配虚拟神经元...",
      "准备战斗."
    ]
  },
  difficulty: { [Difficulty.EASY]: "初级", [Difficulty.MEDIUM]: "中级", [Difficulty.HARD]: "高级" },
  error: { title: "系统错误", btn_reset: "系统重置" }
};

export const TRANSLATIONS: Record<Language, TranslationData> = {
  en: ENGLISH_BASE,
  ko: KO_TRANSLATIONS,
  ja: JA_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  zh: ZH_TRANSLATIONS
};
