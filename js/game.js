/**
 * ESL 遊戲核心狀態機與教學邏輯控制器 (Main Game Engine)
 * 升級亮點：
 * 1. 提示卡文字可由 HUD 切換開啟/關閉（關閉時考驗純聽力）
 * 2. 字母尋寶：需收集完全部該字母單字才過關、對的得分+單字語音、錯的扣分+錯誤聲(不播語音)
 * 3. 動作大跳躍：依據句子真人發音、支援提示卡隱藏訓練聽力
 * 4. 卡片位置真隨機生成，嚴格遠離主角當前座標防原地連刷
 */

class ESLBunnyGame {
  constructor() {
    this.currentMode = "WORD_CATCH"; // "WORD_CATCH" | "PHONICS_CHALLENGE" | "ACTION_HOP"
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.stars = 0;
    this.round = 0;
    this.maxRounds = 10;
    this.isBilingual = true;
    this.showPromptHint = true; // 提示卡文字顯示開關 (true: 開啟提示, false: 隱藏提示純聽力)
    this.isPaused = false;
    this.reviewedWords = [];
    this.audioRetryTimer = null; // 答錯重播計時器，碰撞時需取消以防重疊
    this.wordAudioDelayTimer = null; // 音效→語音延遲計時器

    this.currentQuestion = null;
    this.canCollide = false;

    // 核心元件初始化
    this.scene = new WorldScene("game-canvas-container");
    this.sound = Sound;
    this.bunny = new BunnyCharacter(this.scene, this.sound);
    this.collectibles = new CollectiblesManager(this.scene);

    this.bindControls();
    this.bindUI();
    this.initOrientationHandler();

    this.lastFrameTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);

    this.showStartScreen();
  }

  /**
   * 手機直立防護與橫向全螢幕引導
   */
  initOrientationHandler() {
    const overlay = document.getElementById("orientation-lock-overlay");
    const btn = document.getElementById("btn-force-landscape");

    const checkOrientation = () => {
      if (!overlay) return;
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait) {
        overlay.style.display = "flex";
      } else {
        overlay.style.display = "none";
      }
    };

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkOrientation, 150);
    });
    checkOrientation();

    if (btn) {
      btn.addEventListener("click", async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          }
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape").catch(() => {});
          }
        } catch (e) {
          console.log("Orientation lock info:", e);
        }
      });
    }
  }

  bindControls() {
    window.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".hud-interactive") || e.target.closest(".modal-card")) return;
      this.sound.resumeAudio();
      this.bunny.jump();
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.sound.resumeAudio();
        this.bunny.jump();
      }
    });
  }

  bindUI() {
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.switchMode(mode);
      });
    });

    const speakBtn = document.getElementById("btn-speak-again");
    if (speakBtn) {
      speakBtn.addEventListener("click", () => {
        this.repeatQuestionAudio();
      });
    }

    // 提示卡開啟/關閉切換按鈕
    const hintToggle = document.getElementById("toggle-hint");
    if (hintToggle) {
      hintToggle.addEventListener("click", () => {
        this.showPromptHint = !this.showPromptHint;
        hintToggle.classList.toggle("active", this.showPromptHint);
        hintToggle.querySelector(".hint-label").innerText = this.showPromptHint ? "提示: 開啟" : "提示: 關閉";
        this.updatePromptCard();
      });
    }

    // 雙語發音開關
    const langToggle = document.getElementById("toggle-bilingual");
    if (langToggle) {
      langToggle.addEventListener("click", () => {
        this.isBilingual = !this.isBilingual;
        langToggle.classList.toggle("active", this.isBilingual);
        langToggle.querySelector(".toggle-label").innerText = this.isBilingual ? "語音雙語" : "純美語";
      });
    }

    const muteBtn = document.getElementById("btn-mute");
    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        const muted = this.sound.toggleMute();
        muteBtn.classList.toggle("muted", muted);
      });
    }

    const startBtn = document.getElementById("btn-start-game");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.sound.resumeAudio();
        document.getElementById("start-modal").classList.add("hidden");
        this.startNewGame();
      });
    }

    const restartBtn = document.getElementById("btn-restart-game");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        document.getElementById("gameover-modal").classList.add("hidden");
        this.startNewGame();
      });
    }
  }

  showStartScreen() {
    const modal = document.getElementById("start-modal");
    if (modal) modal.classList.remove("hidden");
  }

  startNewGame() {
    this.score = 0;
    this.combo = 0;
    this.stars = 0;
    this.round = 0;
    this.reviewedWords = [];
    // 清除殘留的音訊計時器，防止跨局語音重疊
    if (this.audioRetryTimer) { clearTimeout(this.audioRetryTimer); this.audioRetryTimer = null; }
    if (this.wordAudioDelayTimer) { clearTimeout(this.wordAudioDelayTimer); this.wordAudioDelayTimer = null; }
    this.sound.stopAllVoice();
    this.updateHUD();
    this.nextRound();
  }

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
    this.startNewGame();
  }

  nextRound() {
    this.round++;
    if (this.round > this.maxRounds) {
      this.endGame();
      return;
    }

    this.canCollide = false;
    this.collectibles.clearAll();

    if (this.currentMode === "WORD_CATCH") {
      this.setupWordCatchRound();
    } else if (this.currentMode === "PHONICS_CHALLENGE") {
      this.setupPhonicsRound();
    } else if (this.currentMode === "ACTION_HOP") {
      this.setupActionHopRound();
    }

    // 延遲 500ms 待卡牌彈出後再開啟碰撞判定
    setTimeout(() => {
      this.canCollide = true;
    }, 500);

    this.updateHUD();
  }

  /**
   * 隨機生成卡牌座標（保證遠離主角目前位置，防止原地連刷）
   */
  generateRandomPositions(count, minDistToBunny = 6.5, minDistBetween = 5.5) {
    const positions = [];
    const maxAttempts = 200;
    const bunnyX = this.bunny.pos.x;
    const bunnyZ = this.bunny.pos.z;

    const minX = -10.5, maxX = 10.5;
    const minZ = -8.5, maxZ = 8.5;

    for (let i = 0; i < count; i++) {
      let valid = false;
      let attempts = 0;
      let chosenPos = null;

      while (!valid && attempts < maxAttempts) {
        attempts++;
        const rx = minX + Math.random() * (maxX - minX);
        const rz = minZ + Math.random() * (maxZ - minZ);

        // 遠離兔子當前位置
        const distBunnySq = (rx - bunnyX) * (rx - bunnyX) + (rz - bunnyZ) * (rz - bunnyZ);
        if (distBunnySq < minDistToBunny * minDistToBunny) {
          continue;
        }

        // 遠離已生成之其他卡牌
        let tooCloseToOthers = false;
        for (const p of positions) {
          const distSq = (rx - p[0]) * (rx - p[0]) + (rz - p[1]) * (rz - p[1]);
          if (distSq < minDistBetween * minDistBetween) {
            tooCloseToOthers = true;
            break;
          }
        }

        if (!tooCloseToOthers) {
          valid = true;
          chosenPos = [rx, rz];
        }
      }

      if (!chosenPos) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 7.5 + Math.random() * 2;
        chosenPos = [Math.cos(angle) * radius, Math.sin(angle) * radius];
      }

      positions.push(chosenPos);
    }

    return positions;
  }

  /**
   * 模式一：聽音尋字關卡
   */
  setupWordCatchRound() {
    const book = window.BOOK_ID || "P1";
    const vocabList = window[`${book}_VOCABULARY`] || window.P1_VOCABULARY || [];
    const targetIdx = Math.floor(Math.random() * vocabList.length);
    const targetItem = vocabList[targetIdx];
    this.currentQuestion = {
      type: "word",
      targetItem: targetItem
    };
    this.reviewedWords.push(targetItem);

    // 挑選 2 個干擾字
    const distractors = vocabList.filter((v) => v.id !== targetItem.id);
    this.shuffleArray(distractors);
    const chosenDistractors = distractors.slice(0, 2);

    const candidates = [targetItem, ...chosenDistractors];
    this.shuffleArray(candidates);

    const positions = this.generateRandomPositions(candidates.length, 6.5, 5.5);

    candidates.forEach((vocab, idx) => {
      const [x, z] = positions[idx];
      const isTarget = vocab.id === targetItem.id;
      this.collectibles.spawnFlashcardTarget(vocab, x, z, isTarget);
    });

    this.updatePromptCard();

    setTimeout(() => {
      this.sound.playWordAudio(targetItem, false);
    }, 400);
  }

  /**
   * 模式二：Phonics 首字母胡蘿蔔大挑戰
   * 特色：必須收集全部該字母的單字才過關、對的得分+語音、錯的扣分+錯誤音
   */
  setupPhonicsRound() {
    const letters = Object.keys(PHONICS_GROUPS);
    const targetLetter = letters[Math.floor(Math.random() * letters.length)];
    const targetWordList = PHONICS_GROUPS[targetLetter];

    // 挑選 3 個該字母開頭的正確單字
    this.shuffleArray(targetWordList);
    const correctWords = targetWordList.slice(0, 3);

    // 挑選 2 個其他字母的單字干擾項
    const otherWords = [];
    letters.forEach((l) => {
      if (l !== targetLetter) {
        otherWords.push(...PHONICS_GROUPS[l]);
      }
    });
    this.shuffleArray(otherWords);
    const wrongWords = otherWords.slice(0, 2);

    const allWords = [...correctWords, ...wrongWords];
    this.shuffleArray(allWords);

    this.currentQuestion = {
      type: "phonics",
      targetLetter: targetLetter,
      correctWords: correctWords,
      remainingWords: [...correctWords], // 尚未被吃掉的正確單字
      totalNeeded: correctWords.length,
      collectedCount: 0
    };

    const spawnPositions = this.generateRandomPositions(allWords.length, 6.5, 4.8);

    const book = window.BOOK_ID || "P1";
    const vocabList = window[`${book}_VOCABULARY`] || window.P1_VOCABULARY || [];
    allWords.forEach((w, idx) => {
      const [x, z] = spawnPositions[idx];
      const isCorrect = correctWords.includes(w);
      const vocabItem = vocabList.find(v => v.word.toLowerCase() === w.toLowerCase()) || {
        id: w,
        word: w,
        image: `${book}_flashcards_images/${book}_${w}.webp`,
        audioEn: `${book}_flashcards_audios/${book}_${w}.mp3`,
        audioZh: `${book}_flashcards_audios/${book}_${w}_zh.mp3`
      };
      const item = this.collectibles.spawnCarrot(targetLetter, w, x, z);
      item.isCorrect = isCorrect;
      item.word = w;
      item.vocabItem = vocabItem;
    });

    this.updatePromptCard();

    // 語音提示字母音
    setTimeout(() => {
      this.sound.speakSentence(`Collect all carrots starting with ${targetLetter}`);
    }, 400);
  }

  /**
   * 模式三：動物動作句型大挑戰
   * 特色：依照完整句子朗讀、可開啟/關閉提示卡
   */
  setupActionHopRound() {
    const qData = ANIMAL_ACTION_QUESTIONS[Math.floor(Math.random() * ANIMAL_ACTION_QUESTIONS.length)];
    this.currentQuestion = {
      type: "action",
      qData: qData
    };

    const positions = this.generateRandomPositions(qData.options.length, 6.5, 5.5);
    const book = window.BOOK_ID || "P1";
    const vocabList = window[`${book}_VOCABULARY`] || window.P1_VOCABULARY || [];

    qData.options.forEach((optWord, idx) => {
      const vocab = vocabList.find((v) => v.word.toLowerCase() === optWord.toLowerCase()) || {
        id: optWord,
        word: optWord,
        image: `${book}_flashcards_images/${book}_${optWord}.webp`,
        audioEn: `${book}_flashcards_audios/${book}_${optWord}.mp3`,
        audioZh: `${book}_flashcards_audios/${book}_${optWord}_zh.mp3`
      };
      const [x, z] = positions[idx];
      const isCorrect = optWord.toLowerCase() === qData.correct.toLowerCase();
      this.collectibles.spawnFlashcardTarget(vocab, x, z, isCorrect);
    });

    this.updatePromptCard();

    // 依照句子朗讀發音！
    setTimeout(() => {
      this.sound.speakSentence(`${qData.sentence} ... ${qData.question}`);
    }, 400);
  }

  /**
   * 依據「提示卡開關 (showPromptHint)」更新中間提示卡介面
   */
  updatePromptCard() {
    const promptText = document.getElementById("hud-prompt-text");
    const promptSub = document.getElementById("hud-prompt-sub");
    if (!promptText || !promptSub || !this.currentQuestion) return;

    if (this.currentMode === "WORD_CATCH") {
      const targetItem = this.currentQuestion.targetItem;
      if (this.showPromptHint) {
        promptText.innerText = `Find: "${targetItem.word}"`;
        // 修正：letter/phonics 欄位在 P1_VOCABULARY 中不存在，改用首字母與單字本身做備援
        const letter = targetItem.letter || targetItem.word.charAt(0).toUpperCase();
        const phonics = targetItem.phonics || targetItem.word;
        promptSub.innerText = `Phonics: ${letter} ${phonics} • Glide to the card!`;
      } else {
        promptText.innerText = `Listen & Find! 🎧`;
        promptSub.innerText = `Click 📢 to replay sound • Choose the right card!`;
      }
    } else if (this.currentMode === "PHONICS_CHALLENGE") {
      const q = this.currentQuestion;
      const letter = q.targetLetter;
      promptText.innerText = `Catch [ ${letter} ] (${q.collectedCount} / ${q.totalNeeded})`;
      if (this.showPromptHint) {
        promptSub.innerText = `Find words starting with ${letter}! Need: ${q.remainingWords.join(", ")}`;
      } else {
        promptSub.innerText = `Collect all carrots starting with ${letter}! Remaining: ${q.remainingWords.length}`;
      }
    } else if (this.currentMode === "ACTION_HOP") {
      const qData = this.currentQuestion.qData;
      if (this.showPromptHint) {
        promptText.innerText = qData.question;
        promptSub.innerText = qData.sentence;
      } else {
        promptText.innerText = `Listen to the sentence! 🎧`;
        promptSub.innerText = `Click 📢 to replay sentence • Pick the action!`;
      }
    }
  }

  repeatQuestionAudio() {
    if (!this.currentQuestion) return;

    if (this.currentMode === "WORD_CATCH") {
      this.sound.playWordAudio(this.currentQuestion.targetItem, this.isBilingual);
    } else if (this.currentMode === "PHONICS_CHALLENGE") {
      this.sound.speakSentence(`Find words starting with letter ${this.currentQuestion.targetLetter}`);
    } else if (this.currentMode === "ACTION_HOP") {
      const qData = this.currentQuestion.qData;
      this.sound.speakSentence(`${qData.sentence} ... ${qData.question}`);
    }
  }

  handleCollision(item) {
    if (!this.canCollide) return false;

    // ★ 修正：每次新碰撞先取消上一次的答錯重播計時器，防止語音重疊
    if (this.audioRetryTimer) {
      clearTimeout(this.audioRetryTimer);
      this.audioRetryTimer = null;
    }
    if (this.wordAudioDelayTimer) {
      clearTimeout(this.wordAudioDelayTimer);
      this.wordAudioDelayTimer = null;
    }

    if (this.currentMode === "PHONICS_CHALLENGE") {
      // ===== 模式二：字母尋寶專屬判定邏輯 =====
      const q = this.currentQuestion;
      if (!q) return false;

      if (item.isCorrect) {
        // --- 答對吃下正確胡蘿蔔 ---
        const wordIdx = q.remainingWords.indexOf(item.word);
        if (wordIdx !== -1) {
          q.remainingWords.splice(wordIdx, 1);
        }
        q.collectedCount++;

        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        const earned = 100 + this.combo * 20;
        this.score += earned;

        // ★ 修正：先播音效，延遲 350ms 後再播單字語音，防止音效與語音重疊
        try {
          this.sound.playSuccess();
          if (item.vocabItem) {
            this.wordAudioDelayTimer = setTimeout(() => {
              this.wordAudioDelayTimer = null;
              this.sound.playWordAudio(item.vocabItem, this.isBilingual);
            }, 350);
          } else {
            this.wordAudioDelayTimer = setTimeout(() => {
              this.wordAudioDelayTimer = null;
              this.sound.speakSentence(item.word);
            }, 350);
          }
        } catch (audioErr) {
          console.warn("Carrot audio error safely ignored:", audioErr);
        }

        this.updateHUD();
        this.updatePromptCard();

        // 檢查是否已收集全部該字首單字 (數量達到或剩餘單字全清空)
        if (q.remainingWords.length === 0 || q.collectedCount >= q.totalNeeded) {
          // 全部收集完成！鎖定碰撞並過關進下一關
          this.canCollide = false;
          this.bunny.jump();
          this.showFeedbackToast(`🌟 All [ ${q.targetLetter} ] Collected! +${earned}`, "correct");
          setTimeout(() => {
            this.nextRound();
          }, 1800);
        } else {
          // 還有未收集的正確胡蘿蔔，保持 canCollide = true 允許連續流暢收集！
          this.showFeedbackToast(`🥕 Got "${item.word}"! (${q.remainingWords.length} left)`, "correct");
        }
        return true; // 成功收集，允許從場景移除
      } else {
        // --- 撞到錯誤胡蘿蔔：扣分、播錯誤聲、不播放語音 ---
        this.combo = 0;
        this.score = Math.max(0, this.score - 50); // 扣分保護 (最低 0 分)
        this.sound.playWrong(); // 僅發出錯誤聲，絕不播放單字語音！

        this.showFeedbackToast(`❌ Oops! -50 (Not [${q.targetLetter}])`, "wrong");

        // 將小兔彈回
        this.bunny.vel.x = -this.bunny.vel.x * 1.5;
        this.bunny.vel.z = -this.bunny.vel.z * 1.5;

        this.updateHUD();
        return false; // 錯誤胡蘿蔔保留在冰面上，不被吃掉
      }
    }

    // ===== 模式一與模式三判定邏輯 =====
    if (item.isCorrect) {
      this.canCollide = false;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      const earnedScore = 100 + this.combo * 20;
      this.score += earnedScore;

      // ★ 修正：先播音效(成功+連擊)，延遲 350ms 後才播單字語音，避免重疊
      this.sound.playSuccess();
      this.sound.playCombo(this.combo);
      this.bunny.jump();

      if (item.vocabItem) {
        this.wordAudioDelayTimer = setTimeout(() => {
          this.wordAudioDelayTimer = null;
          this.sound.playWordAudio(item.vocabItem, this.isBilingual);
        }, 350);
      }

      this.showFeedbackToast(`🎉 Excellent! +${earnedScore}`, "correct");

      setTimeout(() => {
        this.nextRound();
      }, 1600);
      return true; // 允許移除正確卡片
    } else {
      this.combo = 0;
      this.sound.playWrong();
      this.showFeedbackToast("Oops, try again!", "wrong");

      this.bunny.vel.x = -this.bunny.vel.x * 1.5;
      this.bunny.vel.z = -this.bunny.vel.z * 1.5;

      // ★ 修正：使用 audioRetryTimer 管理延遲重播，下次碰撞時可取消
      this.audioRetryTimer = setTimeout(() => {
        this.audioRetryTimer = null;
        this.repeatQuestionAudio();
      }, 500);
      return false; // 錯誤卡牌不移除
    }
  }

  showFeedbackToast(text, type) {
    const toast = document.getElementById("feedback-toast");
    if (!toast) return;
    toast.innerText = text;
    toast.className = `feedback-toast show ${type}`;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.className = "feedback-toast";
    }, 1400);
  }

  updateHUD() {
    const scoreEl = document.getElementById("hud-score");
    const comboEl = document.getElementById("hud-combo");
    const roundEl = document.getElementById("hud-round");

    if (scoreEl) scoreEl.innerText = this.score;
    if (comboEl) {
      comboEl.innerText = `${this.combo}x`;
      comboEl.parentElement.classList.toggle("fever", this.combo >= 3);
    }
    if (roundEl) roundEl.innerText = `${Math.min(this.round, this.maxRounds)} / ${this.maxRounds}`;
  }

  endGame() {
    this.sound.playSuccess();
    const modal = document.getElementById("gameover-modal");
    if (!modal) return;

    let starCount = 1;
    if (this.score >= 1200) starCount = 3;
    else if (this.score >= 700) starCount = 2;

    document.getElementById("final-score").innerText = this.score;
    document.getElementById("final-combo").innerText = this.maxCombo;

    const starsContainer = document.getElementById("final-stars");
    if (starsContainer) {
      starsContainer.innerHTML = "⭐".repeat(starCount) + "☆".repeat(3 - starCount);
    }

    const reviewList = document.getElementById("review-word-list");
    if (reviewList) {
      reviewList.innerHTML = "";
      // ★ 修正：使用 Map 以 id 做 key 去重，Set 對物件 reference 比較無效
      const wordMap = new Map();
      this.reviewedWords.forEach((w) => {
        if (w && w.id && !wordMap.has(w.id)) {
          wordMap.set(w.id, w);
        }
      });
      wordMap.forEach((w) => {
        const chip = document.createElement("div");
        chip.className = "word-chip";
        chip.innerHTML = `<span>${w.word}</span> <small>${w.zh || ""}</small>`;
        chip.addEventListener("click", () => {
          this.sound.playWordAudio(w, true);
        });
        reviewList.appendChild(chip);
      });
    }

    modal.classList.remove("hidden");

    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  loop(timestamp) {
    requestAnimationFrame(this.loop);
    if (this.isPaused) return;

    this.bunny.update(this.scene.targetPos);
    this.scene.updateGuideLine(this.bunny.pos, this.scene.targetPos);
    this.collectibles.update(this.bunny.pos, 1.4, (item) => this.handleCollision(item));
    this.scene.render();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.game = new ESLBunnyGame();
});
