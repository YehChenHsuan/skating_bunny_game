/**
 * ALICE ESL Phonics P1 - 教材核心單字與學習題庫資料
 * 包含全部 44 個單字閃卡與發音音檔，完全對應本地素材庫
 */

const P1_VOCABULARY = [
  // --- Ff 字母單元 ---
  {
    id: "fish",
    word: "fish",
    letter: "Ff",
    phonics: "/f/",
    zh: "魚",
    image: "P1_flashcards_images/P1_fish.webp",
    audioEn: "P1_flashcards_audios/P1_fish.mp3",
    audioZh: "P1_flashcards_audios/P1_fish_zh.mp3",
    sentence: "The fish can swim.",
    action: "swim"
  },
  {
    id: "frog",
    word: "frog",
    letter: "Ff",
    phonics: "/f/",
    zh: "青蛙",
    image: "P1_flashcards_images/P1_frog.webp",
    audioEn: "P1_flashcards_audios/P1_frog.mp3",
    audioZh: "P1_flashcards_audios/P1_frog_zh.mp3",
    sentence: "The frog can jump.",
    action: "jump"
  },
  {
    id: "face",
    word: "face",
    letter: "Ff",
    phonics: "/f/",
    zh: "臉",
    image: "P1_flashcards_images/P1_face.webp",
    audioEn: "P1_flashcards_audios/P1_face.mp3",
    audioZh: "P1_flashcards_audios/P1_face_zh.mp3",
    sentence: "We wash our face."
  },
  {
    id: "fly",
    word: "fly",
    letter: "Ff",
    phonics: "/f/",
    zh: "飛翔",
    image: "P1_flashcards_images/P1_fly.webp",
    audioEn: "P1_flashcards_audios/P1_fly.mp3",
    audioZh: "P1_flashcards_audios/P1_fly_zh.mp3",
    sentence: "The owl can fly.",
    action: "fly"
  },
  {
    id: "foot",
    word: "foot",
    letter: "Ff",
    phonics: "/f/",
    zh: "腳",
    image: "P1_flashcards_images/P1_foot.webp",
    audioEn: "P1_flashcards_audios/P1_foot.mp3",
    audioZh: "P1_flashcards_audios/P1_foot_zh.mp3",
    sentence: "Look at my foot."
  },
  {
    id: "funny",
    word: "funny",
    letter: "Ff",
    phonics: "/f/",
    zh: "有趣的",
    image: "P1_flashcards_images/P1_funny.webp",
    audioEn: "P1_flashcards_audios/P1_funny.mp3",
    audioZh: "P1_flashcards_audios/P1_funny_zh.mp3",
    sentence: "He is so funny."
  },

  // --- Dd 字母單元 ---
  {
    id: "dog",
    word: "dog",
    letter: "Dd",
    phonics: "/d/",
    zh: "狗",
    image: "P1_flashcards_images/P1_dog.webp",
    audioEn: "P1_flashcards_audios/P1_dog.mp3",
    audioZh: "P1_flashcards_audios/P1_dog_zh.mp3",
    sentence: "The dog can run.",
    action: "run"
  },
  {
    id: "duck",
    word: "duck",
    letter: "Dd",
    phonics: "/d/",
    zh: "鴨子",
    image: "P1_flashcards_images/P1_duck.webp",
    audioEn: "P1_flashcards_audios/P1_duck.mp3",
    audioZh: "P1_flashcards_audios/P1_duck_zh.mp3",
    sentence: "The duck can walk.",
    action: "walk"
  },
  {
    id: "dance",
    word: "dance",
    letter: "Dd",
    phonics: "/d/",
    zh: "跳舞",
    image: "P1_flashcards_images/P1_dance.webp",
    audioEn: "P1_flashcards_audios/P1_dance.mp3",
    audioZh: "P1_flashcards_audios/P1_dance_zh.mp3",
    sentence: "I can dance.",
    action: "dance"
  },
  {
    id: "dish",
    word: "dish",
    letter: "Dd",
    phonics: "/d/",
    zh: "盤子",
    image: "P1_flashcards_images/P1_dish.webp",
    audioEn: "P1_flashcards_audios/P1_dish.mp3",
    audioZh: "P1_flashcards_audios/P1_dish_zh.mp3",
    sentence: "This is a clean dish."
  },
  {
    id: "donkey",
    word: "donkey",
    letter: "Dd",
    phonics: "/d/",
    zh: "驢子",
    image: "P1_flashcards_images/P1_donkey.webp",
    audioEn: "P1_flashcards_audios/P1_donkey.mp3",
    audioZh: "P1_flashcards_audios/P1_donkey_zh.mp3",
    sentence: "The donkey is friendly."
  },
  {
    id: "day",
    word: "day",
    letter: "Dd",
    phonics: "/d/",
    zh: "白天/日子",
    image: "P1_flashcards_images/P1_day.webp",
    audioEn: "P1_flashcards_audios/P1_day.mp3",
    audioZh: "P1_flashcards_audios/P1_day_zh.mp3",
    sentence: "Have a nice day!"
  },

  // --- Hh 字母單元 ---
  {
    id: "hop",
    word: "hop",
    letter: "Hh",
    phonics: "/h/",
    zh: "跳躍",
    image: "P1_flashcards_images/P1_hop.webp",
    audioEn: "P1_flashcards_audios/P1_hop.mp3",
    audioZh: "P1_flashcards_audios/P1_hop_zh.mp3",
    sentence: "The rabbit can hop.",
    action: "hop"
  },
  {
    id: "horse",
    word: "horse",
    letter: "Hh",
    phonics: "/h/",
    zh: "馬",
    image: "P1_flashcards_images/P1_horse.webp",
    audioEn: "P1_flashcards_audios/P1_horse.mp3",
    audioZh: "P1_flashcards_audios/P1_horse_zh.mp3",
    sentence: "The horse runs fast."
  },
  {
    id: "hat",
    word: "hat",
    letter: "Hh",
    phonics: "/h/",
    zh: "帽子",
    image: "P1_flashcards_images/P1_hat.webp",
    audioEn: "P1_flashcards_audios/P1_hat.mp3",
    audioZh: "P1_flashcards_audios/P1_hat_zh.mp3",
    sentence: "He has a big hat."
  },
  {
    id: "heart",
    word: "heart",
    letter: "Hh",
    phonics: "/h/",
    zh: "愛心",
    image: "P1_flashcards_images/P1_heart.webp",
    audioEn: "P1_flashcards_audios/P1_heart.mp3",
    audioZh: "P1_flashcards_audios/P1_heart_zh.mp3",
    sentence: "A warm heart."
  },
  {
    id: "hair",
    word: "hair",
    letter: "Hh",
    phonics: "/h/",
    zh: "頭髮",
    image: "P1_flashcards_images/P1_hair.webp",
    audioEn: "P1_flashcards_audios/P1_hair.mp3",
    audioZh: "P1_flashcards_audios/P1_hair_zh.mp3",
    sentence: "We comb our hair."
  },
  {
    id: "he",
    word: "he",
    letter: "Hh",
    phonics: "/h/",
    zh: "他",
    image: "P1_flashcards_images/P1_he.webp",
    audioEn: "P1_flashcards_audios/P1_he.mp3",
    audioZh: "P1_flashcards_audios/P1_he_zh.mp3",
    sentence: "He is a good boy."
  },

  // --- Rr 字母單元 (主角焦點) ---
  {
    id: "rabbit",
    word: "rabbit",
    letter: "Rr",
    phonics: "/r/",
    zh: "兔子",
    image: "P1_flashcards_images/P1_rabbit.webp",
    audioEn: "P1_flashcards_audios/P1_rabbit.mp3",
    audioZh: "P1_flashcards_audios/P1_rabbit_zh.mp3",
    sentence: "Ted has a rabbit. The rabbit can hop!",
    action: "hop"
  },
  {
    id: "run",
    word: "run",
    letter: "Rr",
    phonics: "/r/",
    zh: "跑步",
    image: "P1_flashcards_images/P1_run.webp",
    audioEn: "P1_flashcards_audios/P1_run.mp3",
    audioZh: "P1_flashcards_audios/P1_run_zh.mp3",
    sentence: "The dog can run.",
    action: "run"
  },
  {
    id: "red",
    word: "red",
    letter: "Rr",
    phonics: "/r/",
    zh: "紅色",
    image: "P1_flashcards_images/P1_red.webp",
    audioEn: "P1_flashcards_audios/P1_red.mp3",
    audioZh: "P1_flashcards_audios/P1_red_zh.mp3",
    sentence: "It is bright red."
  },
  {
    id: "rooster",
    word: "rooster",
    letter: "Rr",
    phonics: "/r/",
    zh: "公雞",
    image: "P1_flashcards_images/P1_rooster.webp",
    audioEn: "P1_flashcards_audios/P1_rooster.mp3",
    audioZh: "P1_flashcards_audios/P1_rooster_zh.mp3",
    sentence: "The rooster wakes us up."
  },
  {
    id: "rectangle",
    word: "rectangle",
    letter: "Rr",
    phonics: "/r/",
    zh: "長方形",
    image: "P1_flashcards_images/P1_rectangle.webp",
    audioEn: "P1_flashcards_audios/P1_rectangle.mp3",
    audioZh: "P1_flashcards_audios/P1_rectangle_zh.mp3",
    sentence: "This shape is a rectangle."
  },
  {
    id: "restaurant",
    word: "restaurant",
    letter: "Rr",
    phonics: "/r/",
    zh: "餐廳",
    image: "P1_flashcards_images/P1_restaurant.webp",
    audioEn: "P1_flashcards_audios/P1_restaurant.mp3",
    audioZh: "P1_flashcards_audios/P1_restaurant_zh.mp3",
    sentence: "We eat at a restaurant."
  },

  // --- Ss 字母單元 ---
  {
    id: "sun",
    word: "sun",
    letter: "Ss",
    phonics: "/s/",
    zh: "太陽",
    image: "P1_flashcards_images/P1_sun.webp",
    audioEn: "P1_flashcards_audios/P1_sun.mp3",
    audioZh: "P1_flashcards_audios/P1_sun_zh.mp3",
    sentence: "Having fun in the sun!"
  },
  {
    id: "swim",
    word: "swim",
    letter: "Ss",
    phonics: "/s/",
    zh: "游泳",
    image: "P1_flashcards_images/P1_swim.webp",
    audioEn: "P1_flashcards_audios/P1_swim.mp3",
    audioZh: "P1_flashcards_audios/P1_swim_zh.mp3",
    sentence: "The fish can swim.",
    action: "swim"
  },
  {
    id: "soar",
    word: "soar",
    letter: "Ss",
    phonics: "/s/",
    zh: "翱翔",
    image: "P1_flashcards_images/P1_soar.webp",
    audioEn: "P1_flashcards_audios/P1_soar.mp3",
    audioZh: "P1_flashcards_audios/P1_soar_zh.mp3",
    sentence: "The eagle can soar.",
    action: "soar"
  },
  {
    id: "see",
    word: "see",
    letter: "Ss",
    phonics: "/s/",
    zh: "看見",
    image: "P1_flashcards_images/P1_see.webp",
    audioEn: "P1_flashcards_audios/P1_see.mp3",
    audioZh: "P1_flashcards_audios/P1_see_zh.mp3",
    sentence: "I see a lot of animals."
  },
  {
    id: "say",
    word: "say",
    letter: "Ss",
    phonics: "/s/",
    zh: "說話",
    image: "P1_flashcards_images/P1_say.webp",
    audioEn: "P1_flashcards_audios/P1_say.mp3",
    audioZh: "P1_flashcards_audios/P1_say_zh.mp3",
    sentence: "What do they say?"
  },
  {
    id: "Sue",
    word: "Sue",
    letter: "Ss",
    phonics: "/s/",
    zh: "蘇 (人名)",
    image: "P1_flashcards_images/P1_Sue.webp",
    audioEn: "P1_flashcards_audios/P1_Sue.mp3",
    audioZh: "P1_flashcards_audios/P1_Sue_zh.mp3",
    sentence: "Her name is Sue."
  },

  // --- Jj 字母單元 ---
  {
    id: "jump",
    word: "jump",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "跳躍",
    image: "P1_flashcards_images/P1_jump.webp",
    audioEn: "P1_flashcards_audios/P1_jump.mp3",
    audioZh: "P1_flashcards_audios/P1_jump_zh.mp3",
    sentence: "The frog can jump.",
    action: "jump"
  },
  {
    id: "juice",
    word: "juice",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "果汁",
    image: "P1_flashcards_images/P1_juice.webp",
    audioEn: "P1_flashcards_audios/P1_juice.mp3",
    audioZh: "P1_flashcards_audios/P1_juice_zh.mp3",
    sentence: "I like orange juice."
  },
  {
    id: "jet",
    word: "jet",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "噴射機",
    image: "P1_flashcards_images/P1_jet.webp",
    audioEn: "P1_flashcards_audios/P1_jet.mp3",
    audioZh: "P1_flashcards_audios/P1_jet_zh.mp3",
    sentence: "The jet flies high."
  },
  {
    id: "jar",
    word: "jar",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "玻璃罐",
    image: "P1_flashcards_images/P1_jar.webp",
    audioEn: "P1_flashcards_audios/P1_jar.mp3",
    audioZh: "P1_flashcards_audios/P1_jar_zh.mp3",
    sentence: "A glass jar."
  },
  {
    id: "jaguar",
    word: "jaguar",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "美洲豹",
    image: "P1_flashcards_images/P1_jaguar.webp",
    audioEn: "P1_flashcards_audios/P1_jaguar.mp3",
    audioZh: "P1_flashcards_audios/P1_jaguar_zh.mp3",
    sentence: "The jaguar runs fast."
  },
  {
    id: "jam",
    word: "jam",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "果醬",
    image: "P1_flashcards_images/P1_jam.webp",
    audioEn: "P1_flashcards_audios/P1_jam.mp3",
    audioZh: "P1_flashcards_audios/P1_jam_zh.mp3",
    sentence: "Sweet berry jam."
  },
  {
    id: "jog",
    word: "jog",
    letter: "Jj",
    phonics: "/dʒ/",
    zh: "慢跑",
    image: "P1_flashcards_images/P1_jog.webp",
    audioEn: "P1_flashcards_audios/P1_jog.mp3",
    audioZh: "P1_flashcards_audios/P1_jog_zh.mp3",
    sentence: "We jog in the morning."
  },

  // --- Kk 字母單元 ---
  {
    id: "kite",
    word: "kite",
    letter: "Kk",
    phonics: "/k/",
    zh: "風箏",
    image: "P1_flashcards_images/P1_kite.webp",
    audioEn: "P1_flashcards_audios/P1_kite.mp3",
    audioZh: "P1_flashcards_audios/P1_kite_zh.mp3",
    sentence: "Fly a colorful kite."
  },
  {
    id: "key",
    word: "key",
    letter: "Kk",
    phonics: "/k/",
    zh: "鑰匙",
    image: "P1_flashcards_images/P1_key.webp",
    audioEn: "P1_flashcards_audios/P1_key.mp3",
    audioZh: "P1_flashcards_audios/P1_key_zh.mp3",
    sentence: "Where is my key?"
  },
  {
    id: "kick",
    word: "kick",
    letter: "Kk",
    phonics: "/k/",
    zh: "踢",
    image: "P1_flashcards_images/P1_kick.webp",
    audioEn: "P1_flashcards_audios/P1_kick.mp3",
    audioZh: "P1_flashcards_audios/P1_kick_zh.mp3",
    sentence: "Kids like to kick the ball.",
    action: "kick"
  },
  {
    id: "kiss",
    word: "kiss",
    letter: "Kk",
    phonics: "/k/",
    zh: "親吻",
    image: "P1_flashcards_images/P1_kiss.webp",
    audioEn: "P1_flashcards_audios/P1_kiss.mp3",
    audioZh: "P1_flashcards_audios/P1_kiss_zh.mp3",
    sentence: "Give mom a kiss."
  },
  {
    id: "kid",
    word: "kid",
    letter: "Kk",
    phonics: "/k/",
    zh: "小孩",
    image: "P1_flashcards_images/P1_kid.webp",
    audioEn: "P1_flashcards_audios/P1_kid.mp3",
    audioZh: "P1_flashcards_audios/P1_kid_zh.mp3",
    sentence: "The kid is playing."
  },
  {
    id: "kim",
    word: "Kim",
    letter: "Kk",
    phonics: "/k/",
    zh: "金 (人名)",
    image: "P1_flashcards_images/P1_kim.webp",
    audioEn: "P1_flashcards_audios/P1_kim.mp3",
    audioZh: "P1_flashcards_audios/P1_kim_zh.mp3",
    sentence: "Kim has a fish."
  },

  // --- 動作補充單元 ---
  {
    id: "walk",
    word: "walk",
    letter: "Ww",
    phonics: "/w/",
    zh: "走路",
    image: "P1_flashcards_images/P1_walk.webp",
    audioEn: "P1_flashcards_audios/P1_walk.mp3",
    audioZh: "P1_flashcards_audios/P1_walk_zh.mp3",
    sentence: "The duck can walk.",
    action: "walk"
  }
];

// 字母分類群組（用於 Phonics 首字母尋寶模式）
const PHONICS_GROUPS = {
  "Rr": ["rabbit", "run", "red", "rooster", "rectangle", "restaurant"],
  "Ff": ["fish", "frog", "face", "fly", "foot", "funny"],
  "Dd": ["dog", "duck", "dance", "dish", "donkey", "day"],
  "Hh": ["hop", "horse", "hat", "heart", "hair", "he"],
  "Ss": ["sun", "swim", "soar", "see", "say", "Sue"],
  "Jj": ["jump", "juice", "jet", "jar", "jaguar", "jam", "jog"],
  "Kk": ["kite", "key", "kick", "kiss", "kid", "kim"]
};

// 動物與動作句型配對題庫（依據課本第 6、7、14、26 頁）
const ANIMAL_ACTION_QUESTIONS = [
  {
    animal: "rabbit",
    animalZh: "兔子",
    action: "hop",
    actionZh: "跳躍 (Hop)",
    sentence: "Ted has a rabbit. The rabbit can hop!",
    question: "What can the rabbit do?",
    options: ["hop", "swim", "fly"],
    correct: "hop"
  },
  {
    animal: "dog",
    animalZh: "小狗",
    action: "run",
    actionZh: "奔跑 (Run)",
    sentence: "Diego has a dog. The dog can run!",
    question: "What can the dog do?",
    options: ["run", "fly", "hop"],
    correct: "run"
  },
  {
    animal: "fish",
    animalZh: "魚",
    action: "swim",
    actionZh: "游泳 (Swim)",
    sentence: "Kim has a fish. The fish can swim!",
    question: "What can the fish do?",
    options: ["swim", "run", "hop"],
    correct: "swim"
  },
  {
    animal: "frog",
    animalZh: "青蛙",
    action: "jump",
    actionZh: "跳躍 (Jump)",
    sentence: "Josh has a frog. The frog can jump!",
    question: "What can the frog do?",
    options: ["jump", "fly", "dance"],
    correct: "jump"
  },
  {
    animal: "duck",
    animalZh: "鴨子",
    action: "walk",
    actionZh: "走路 (Walk)",
    sentence: "Zac has a duck. The duck can walk!",
    question: "What can the duck do?",
    options: ["walk", "swim", "fly"],
    correct: "walk"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { P1_VOCABULARY, PHONICS_GROUPS, ANIMAL_ACTION_QUESTIONS };
}
