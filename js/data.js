/**
 * ALICE ESL Phonics P1 - 小兔冰上拼讀大冒險題庫
 * 課本學習範圍：Page 04 - 07
 * 主題：Consonants (Ff, Dd, Hh, Rr, Ss, Jj, Kk) & Animal Actions
 */

window.BOOK_ID = "P1";
const P1_VOCABULARY = [
  {
    "id": "Sue",
    "word": "Sue",
    "zh": "Sue",
    "image": "P1_flashcards_images/P1_Sue.webp",
    "audioEn": "P1_flashcards_audios/P1_Sue.mp3",
    "audioZh": "P1_flashcards_audios/P1_Sue_zh.mp3"
  },
  {
    "id": "dance",
    "word": "dance",
    "zh": "dance",
    "image": "P1_flashcards_images/P1_dance.webp",
    "audioEn": "P1_flashcards_audios/P1_dance.mp3",
    "audioZh": "P1_flashcards_audios/P1_dance_zh.mp3"
  },
  {
    "id": "day",
    "word": "day",
    "zh": "day",
    "image": "P1_flashcards_images/P1_day.webp",
    "audioEn": "P1_flashcards_audios/P1_day.mp3",
    "audioZh": "P1_flashcards_audios/P1_day_zh.mp3"
  },
  {
    "id": "dish",
    "word": "dish",
    "zh": "dish",
    "image": "P1_flashcards_images/P1_dish.webp",
    "audioEn": "P1_flashcards_audios/P1_dish.mp3",
    "audioZh": "P1_flashcards_audios/P1_dish_zh.mp3"
  },
  {
    "id": "dog",
    "word": "dog",
    "zh": "dog",
    "image": "P1_flashcards_images/P1_dog.webp",
    "audioEn": "P1_flashcards_audios/P1_dog.mp3",
    "audioZh": "P1_flashcards_audios/P1_dog_zh.mp3"
  },
  {
    "id": "donkey",
    "word": "donkey",
    "zh": "donkey",
    "image": "P1_flashcards_images/P1_donkey.webp",
    "audioEn": "P1_flashcards_audios/P1_donkey.mp3",
    "audioZh": "P1_flashcards_audios/P1_donkey_zh.mp3"
  },
  {
    "id": "duck",
    "word": "duck",
    "zh": "duck",
    "image": "P1_flashcards_images/P1_duck.webp",
    "audioEn": "P1_flashcards_audios/P1_duck.mp3",
    "audioZh": "P1_flashcards_audios/P1_duck_zh.mp3"
  },
  {
    "id": "face",
    "word": "face",
    "zh": "face",
    "image": "P1_flashcards_images/P1_face.webp",
    "audioEn": "P1_flashcards_audios/P1_face.mp3",
    "audioZh": "P1_flashcards_audios/P1_face_zh.mp3"
  },
  {
    "id": "fish",
    "word": "fish",
    "zh": "fish",
    "image": "P1_flashcards_images/P1_fish.webp",
    "audioEn": "P1_flashcards_audios/P1_fish.mp3",
    "audioZh": "P1_flashcards_audios/P1_fish_zh.mp3"
  },
  {
    "id": "fly",
    "word": "fly",
    "zh": "fly",
    "image": "P1_flashcards_images/P1_fly.webp",
    "audioEn": "P1_flashcards_audios/P1_fly.mp3",
    "audioZh": "P1_flashcards_audios/P1_fly_zh.mp3"
  },
  {
    "id": "foot",
    "word": "foot",
    "zh": "foot",
    "image": "P1_flashcards_images/P1_foot.webp",
    "audioEn": "P1_flashcards_audios/P1_foot.mp3",
    "audioZh": "P1_flashcards_audios/P1_foot_zh.mp3"
  },
  {
    "id": "frog",
    "word": "frog",
    "zh": "frog",
    "image": "P1_flashcards_images/P1_frog.webp",
    "audioEn": "P1_flashcards_audios/P1_frog.mp3",
    "audioZh": "P1_flashcards_audios/P1_frog_zh.mp3"
  },
  {
    "id": "funny",
    "word": "funny",
    "zh": "funny",
    "image": "P1_flashcards_images/P1_funny.webp",
    "audioEn": "P1_flashcards_audios/P1_funny.mp3",
    "audioZh": "P1_flashcards_audios/P1_funny_zh.mp3"
  },
  {
    "id": "hair",
    "word": "hair",
    "zh": "hair",
    "image": "P1_flashcards_images/P1_hair.webp",
    "audioEn": "P1_flashcards_audios/P1_hair.mp3",
    "audioZh": "P1_flashcards_audios/P1_hair_zh.mp3"
  },
  {
    "id": "hat",
    "word": "hat",
    "zh": "hat",
    "image": "P1_flashcards_images/P1_hat.webp",
    "audioEn": "P1_flashcards_audios/P1_hat.mp3",
    "audioZh": "P1_flashcards_audios/P1_hat_zh.mp3"
  },
  {
    "id": "he",
    "word": "he",
    "zh": "he",
    "image": "P1_flashcards_images/P1_he.webp",
    "audioEn": "P1_flashcards_audios/P1_he.mp3",
    "audioZh": "P1_flashcards_audios/P1_he_zh.mp3"
  },
  {
    "id": "heart",
    "word": "heart",
    "zh": "heart",
    "image": "P1_flashcards_images/P1_heart.webp",
    "audioEn": "P1_flashcards_audios/P1_heart.mp3",
    "audioZh": "P1_flashcards_audios/P1_heart_zh.mp3"
  },
  {
    "id": "hop",
    "word": "hop",
    "zh": "hop",
    "image": "P1_flashcards_images/P1_hop.webp",
    "audioEn": "P1_flashcards_audios/P1_hop.mp3",
    "audioZh": "P1_flashcards_audios/P1_hop_zh.mp3"
  },
  {
    "id": "horse",
    "word": "horse",
    "zh": "horse",
    "image": "P1_flashcards_images/P1_horse.webp",
    "audioEn": "P1_flashcards_audios/P1_horse.mp3",
    "audioZh": "P1_flashcards_audios/P1_horse_zh.mp3"
  },
  {
    "id": "jaguar",
    "word": "jaguar",
    "zh": "jaguar",
    "image": "P1_flashcards_images/P1_jaguar.webp",
    "audioEn": "P1_flashcards_audios/P1_jaguar.mp3",
    "audioZh": "P1_flashcards_audios/P1_jaguar_zh.mp3"
  },
  {
    "id": "jam",
    "word": "jam",
    "zh": "jam",
    "image": "P1_flashcards_images/P1_jam.webp",
    "audioEn": "P1_flashcards_audios/P1_jam.mp3",
    "audioZh": "P1_flashcards_audios/P1_jam_zh.mp3"
  },
  {
    "id": "jar",
    "word": "jar",
    "zh": "jar",
    "image": "P1_flashcards_images/P1_jar.webp",
    "audioEn": "P1_flashcards_audios/P1_jar.mp3",
    "audioZh": "P1_flashcards_audios/P1_jar_zh.mp3"
  },
  {
    "id": "jet",
    "word": "jet",
    "zh": "jet",
    "image": "P1_flashcards_images/P1_jet.webp",
    "audioEn": "P1_flashcards_audios/P1_jet.mp3",
    "audioZh": "P1_flashcards_audios/P1_jet_zh.mp3"
  },
  {
    "id": "jog",
    "word": "jog",
    "zh": "jog",
    "image": "P1_flashcards_images/P1_jog.webp",
    "audioEn": "P1_flashcards_audios/P1_jog.mp3",
    "audioZh": "P1_flashcards_audios/P1_jog_zh.mp3"
  },
  {
    "id": "juice",
    "word": "juice",
    "zh": "juice",
    "image": "P1_flashcards_images/P1_juice.webp",
    "audioEn": "P1_flashcards_audios/P1_juice.mp3",
    "audioZh": "P1_flashcards_audios/P1_juice_zh.mp3"
  },
  {
    "id": "jump",
    "word": "jump",
    "zh": "jump",
    "image": "P1_flashcards_images/P1_jump.webp",
    "audioEn": "P1_flashcards_audios/P1_jump.mp3",
    "audioZh": "P1_flashcards_audios/P1_jump_zh.mp3"
  },
  {
    "id": "key",
    "word": "key",
    "zh": "key",
    "image": "P1_flashcards_images/P1_key.webp",
    "audioEn": "P1_flashcards_audios/P1_key.mp3",
    "audioZh": "P1_flashcards_audios/P1_key_zh.mp3"
  },
  {
    "id": "kick",
    "word": "kick",
    "zh": "kick",
    "image": "P1_flashcards_images/P1_kick.webp",
    "audioEn": "P1_flashcards_audios/P1_kick.mp3",
    "audioZh": "P1_flashcards_audios/P1_kick_zh.mp3"
  },
  {
    "id": "kid",
    "word": "kid",
    "zh": "kid",
    "image": "P1_flashcards_images/P1_kid.webp",
    "audioEn": "P1_flashcards_audios/P1_kid.mp3",
    "audioZh": "P1_flashcards_audios/P1_kid_zh.mp3"
  },
  {
    "id": "kim",
    "word": "kim",
    "zh": "kim",
    "image": "P1_flashcards_images/P1_kim.webp",
    "audioEn": "P1_flashcards_audios/P1_kim.mp3",
    "audioZh": "P1_flashcards_audios/P1_kim_zh.mp3"
  },
  {
    "id": "kiss",
    "word": "kiss",
    "zh": "kiss",
    "image": "P1_flashcards_images/P1_kiss.webp",
    "audioEn": "P1_flashcards_audios/P1_kiss.mp3",
    "audioZh": "P1_flashcards_audios/P1_kiss_zh.mp3"
  },
  {
    "id": "kite",
    "word": "kite",
    "zh": "kite",
    "image": "P1_flashcards_images/P1_kite.webp",
    "audioEn": "P1_flashcards_audios/P1_kite.mp3",
    "audioZh": "P1_flashcards_audios/P1_kite_zh.mp3"
  },
  {
    "id": "rabbit",
    "word": "rabbit",
    "zh": "rabbit",
    "image": "P1_flashcards_images/P1_rabbit.webp",
    "audioEn": "P1_flashcards_audios/P1_rabbit.mp3",
    "audioZh": "P1_flashcards_audios/P1_rabbit_zh.mp3"
  },
  {
    "id": "rectangle",
    "word": "rectangle",
    "zh": "rectangle",
    "image": "P1_flashcards_images/P1_rectangle.webp",
    "audioEn": "P1_flashcards_audios/P1_rectangle.mp3",
    "audioZh": "P1_flashcards_audios/P1_rectangle_zh.mp3"
  },
  {
    "id": "red",
    "word": "red",
    "zh": "red",
    "image": "P1_flashcards_images/P1_red.webp",
    "audioEn": "P1_flashcards_audios/P1_red.mp3",
    "audioZh": "P1_flashcards_audios/P1_red_zh.mp3"
  },
  {
    "id": "restaurant",
    "word": "restaurant",
    "zh": "restaurant",
    "image": "P1_flashcards_images/P1_restaurant.webp",
    "audioEn": "P1_flashcards_audios/P1_restaurant.mp3",
    "audioZh": "P1_flashcards_audios/P1_restaurant_zh.mp3"
  },
  {
    "id": "rooster",
    "word": "rooster",
    "zh": "rooster",
    "image": "P1_flashcards_images/P1_rooster.webp",
    "audioEn": "P1_flashcards_audios/P1_rooster.mp3",
    "audioZh": "P1_flashcards_audios/P1_rooster_zh.mp3"
  },
  {
    "id": "run",
    "word": "run",
    "zh": "run",
    "image": "P1_flashcards_images/P1_run.webp",
    "audioEn": "P1_flashcards_audios/P1_run.mp3",
    "audioZh": "P1_flashcards_audios/P1_run_zh.mp3"
  },
  {
    "id": "say",
    "word": "say",
    "zh": "say",
    "image": "P1_flashcards_images/P1_say.webp",
    "audioEn": "P1_flashcards_audios/P1_say.mp3",
    "audioZh": "P1_flashcards_audios/P1_say_zh.mp3"
  },
  {
    "id": "see",
    "word": "see",
    "zh": "see",
    "image": "P1_flashcards_images/P1_see.webp",
    "audioEn": "P1_flashcards_audios/P1_see.mp3",
    "audioZh": "P1_flashcards_audios/P1_see_zh.mp3"
  },
  {
    "id": "soar",
    "word": "soar",
    "zh": "soar",
    "image": "P1_flashcards_images/P1_soar.webp",
    "audioEn": "P1_flashcards_audios/P1_soar.mp3",
    "audioZh": "P1_flashcards_audios/P1_soar_zh.mp3"
  },
  {
    "id": "sun",
    "word": "sun",
    "zh": "sun",
    "image": "P1_flashcards_images/P1_sun.webp",
    "audioEn": "P1_flashcards_audios/P1_sun.mp3",
    "audioZh": "P1_flashcards_audios/P1_sun_zh.mp3"
  },
  {
    "id": "swim",
    "word": "swim",
    "zh": "swim",
    "image": "P1_flashcards_images/P1_swim.webp",
    "audioEn": "P1_flashcards_audios/P1_swim.mp3",
    "audioZh": "P1_flashcards_audios/P1_swim_zh.mp3"
  },
  {
    "id": "walk",
    "word": "walk",
    "zh": "walk",
    "image": "P1_flashcards_images/P1_walk.webp",
    "audioEn": "P1_flashcards_audios/P1_walk.mp3",
    "audioZh": "P1_flashcards_audios/P1_walk_zh.mp3"
  }
];

// 自然發音/首音分組（對應課本 Page 04 - 07）
const PHONICS_GROUPS = {
  "Ff": [
    "fish",
    "frog",
    "face",
    "fly",
    "foot",
    "funny"
  ],
  "Dd": [
    "dog",
    "duck",
    "dance",
    "dish",
    "donkey",
    "day"
  ],
  "Hh": [
    "hop",
    "horse",
    "hat",
    "he"
  ],
  "Rr": [
    "rabbit",
    "run",
    "red",
    "rooster",
    "rectangle",
    "restaurant"
  ],
  "Ss": [
    "sun",
    "swim",
    "soar",
    "see",
    "say"
  ],
  "Jj": [
    "jump",
    "juice",
    "jet",
    "jar",
    "jog"
  ],
  "Kk": [
    "kite",
    "key",
    "kick",
    "kiss",
    "kid"
  ]
};

// 課文動作與問答情境題庫
const ANIMAL_ACTION_QUESTIONS = [
  {
    "sentence": "Kim has a fish. The fish can swim.",
    "question": "What can the fish do?",
    "ttsPrompt": "Kim has a fish. The fish can swim. What can the fish do?",
    "options": [
      "swim",
      "hop",
      "run"
    ],
    "correct": "swim"
  },
  {
    "sentence": "Ted has a rabbit. The rabbit can hop.",
    "question": "What can the rabbit do?",
    "ttsPrompt": "Ted has a rabbit. The rabbit can hop. What can the rabbit do?",
    "options": [
      "hop",
      "swim",
      "fly"
    ],
    "correct": "hop"
  },
  {
    "sentence": "Diego has a dog. The dog can run.",
    "question": "What can the dog do?",
    "ttsPrompt": "Diego has a dog. The dog can run. What can the dog do?",
    "options": [
      "run",
      "fly",
      "hop"
    ],
    "correct": "run"
  },
  {
    "sentence": "Paul has an owl. The owl can fly.",
    "question": "What can the owl do?",
    "ttsPrompt": "Paul has an owl. The owl can fly. What can the owl do?",
    "options": [
      "fly",
      "walk",
      "swim"
    ],
    "correct": "fly"
  },
  {
    "sentence": "Zac has a duck. The duck can walk.",
    "question": "What can the duck do?",
    "ttsPrompt": "Zac has a duck. The duck can walk. What can the duck do?",
    "options": [
      "walk",
      "swim",
      "fly"
    ],
    "correct": "walk"
  }
];

// 全域掛載相容變數
if (typeof window !== "undefined") {
  window.P1_VOCABULARY = P1_VOCABULARY;
  window.PHONICS_GROUPS = PHONICS_GROUPS;
  window.ANIMAL_ACTION_QUESTIONS = ANIMAL_ACTION_QUESTIONS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    P1_VOCABULARY,
    PHONICS_GROUPS,
    ANIMAL_ACTION_QUESTIONS
  };
}
