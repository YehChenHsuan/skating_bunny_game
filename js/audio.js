/**
 * ESL 音訊與音效管理器 (Audio & SFX Controller)
 * 結合 Web Audio API 即時合成音效與 HTML5 Audio 教材真人發音
 * 修正：統一語音通道管理，徹底防止語音重疊播放
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.voiceAudio = null;    // 單字語音通道
    this.currentAudio = null;  // 句子朗讀通道
    this.currentWordItem = null;
    this.isBgmPlaying = false;
    this.lastSkateTime = 0;
    this._zhDelayTimer = null; // 中文語音延遲計時器，停止時需清除

    // 延遲初始化 Web Audio，配合瀏覽器使用者手勢政策
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  }

  resumeAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      // 靜音時立即停止所有語音通道
      this.stopAllVoice();
    }
    return this.isMuted;
  }

  /**
   * 統一停止所有語音通道（voiceAudio + currentAudio + 中文延遲計時器）
   * 所有播放方法開頭必須先呼叫此函式，確保不會有任何語音重疊
   */
  stopAllVoice() {
    // 清除中文語音延遲計時器
    if (this._zhDelayTimer) {
      clearTimeout(this._zhDelayTimer);
      this._zhDelayTimer = null;
    }

    // 停止 speechSynthesis (備援用)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 停止單字語音通道
    if (this.voiceAudio) {
      this.voiceAudio.onended = null; // 移除回呼防止觸發後續連鎖
      this.voiceAudio.onerror = null;
      this.voiceAudio.pause();
      try { this.voiceAudio.currentTime = 0; } catch (e) {}
      this.voiceAudio = null;
    }

    // 停止句子朗讀通道
    if (this.currentAudio) {
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio.pause();
      try { this.currentAudio.currentTime = 0; } catch (e) {}
      this.currentAudio = null;
    }

    this.currentWordItem = null;
  }

  /**
   * 查詢是否有語音正在播放
   * @returns {boolean}
   */
  isVoicePlaying() {
    const voicePlaying = this.voiceAudio && !this.voiceAudio.paused && !this.voiceAudio.ended;
    const sentencePlaying = this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended;
    return !!(voicePlaying || sentencePlaying);
  }

  /**
   * 播放冰刀滑冰磨擦音效 (Swoosh)
   */
  playSkate() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastSkateTime < 180) return; // 避免過度密集觸發
    this.lastSkateTime = now;

    this.resumeAudio();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      // 使用帶通濾波白噪音模擬冰刀劃過冰面之沙沙聲
      const bufferSize = this.audioCtx.sampleRate * 0.12;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(3.0, t);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      whiteNoise.start(t);
    } catch (e) {
      // 靜默處理音訊環境異常
    }
  }

  /**
   * 播放跳躍彈跳音效 (Boing / Hop)
   */
  playJump() {
    if (this.isMuted) return;
    this.resumeAudio();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // 快速音調上升模擬彈簧跳躍
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(650, t + 0.22);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch (e) {}
  }

  /**
   * 播放答對/收集冰晶音效 (Chime / Bell)
   */
  playSuccess() {
    if (this.isMuted) return;
    this.resumeAudio();
    if (!this.audioCtx) return;

    try {
      // C6 - E6 - G6 和弦音
      const notes = [1046.5, 1318.5, 1567.98, 2093.0];
      notes.forEach((freq, idx) => {
        const t = this.audioCtx.currentTime + idx * 0.06;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.46);
      });
    } catch (e) {}
  }

  /**
   * 播放答錯提示音 (溫和低音咚聲，不挫折幼兒)
   */
  playWrong() {
    if (this.isMuted) return;
    this.resumeAudio();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.2);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch (e) {}
  }

  /**
   * 播放連擊升調激勵音效
   */
  playCombo(comboCount) {
    if (this.isMuted) return;
    this.resumeAudio();
    if (!this.audioCtx) return;

    try {
      const baseFreq = Math.min(1200, 440 + comboCount * 60);
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.18);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.23);
    } catch (e) {}
  }

  /**
   * 播放單字美語真人發音（可選擇是否接續中文釋義）
   * 修正：開頭先呼叫 stopAllVoice() 停止所有已在播放的語音
   * @param {Object} item - P1_VOCABULARY 項目
   * @param {boolean} includeZh - 是否在英文播放後接著播放中文
   * @param {Function} onEnded - 播放結束回呼
   */
  playWordAudio(item, includeZh = false, onEnded = null) {
    if (this.isMuted || !item) return;

    // ★ 修正核心：停止所有正在播放的語音（包括句子通道），防止重疊
    this.stopAllVoice();

    this.currentWordItem = item;
    const audio = new Audio(item.audioEn);
    this.voiceAudio = audio;

    audio.onended = () => {
      if (includeZh && item.audioZh) {
        // 延遲 300ms 播放中文解釋，並記錄計時器以供中途取消
        this._zhDelayTimer = setTimeout(() => {
          this._zhDelayTimer = null;
          if (this.isMuted || this.currentWordItem !== item) return;
          const zhAudio = new Audio(item.audioZh);
          this.voiceAudio = zhAudio;
          zhAudio.onended = () => {
            if (onEnded) onEnded();
          };
          zhAudio.play().catch(() => {});
        }, 300);
      } else {
        if (onEnded) onEnded();
      }
    };

    audio.play().catch(err => {
      console.warn("Audio play prevented:", err);
    });
  }

  /**
   * 播放指定路徑的音檔（通用備援方法）
   * 修正：原 speakSentence() 的 fallback 路徑呼叫此方法但未定義
   * @param {string} filePath - 音檔檔案路徑
   * @param {Function} onEnded - 播放結束回呼
   */
  playAudioFile(filePath, onEnded = null) {
    if (this.isMuted || !filePath) {
      if (onEnded) onEnded();
      return;
    }

    // 停止所有語音防止重疊
    this.stopAllVoice();

    const audio = new Audio(filePath);
    this.currentAudio = audio;

    audio.onended = () => { if (onEnded) onEnded(); };
    audio.onerror = () => {
      console.warn("playAudioFile 載入失敗：", filePath);
      if (onEnded) onEnded();
    };
    audio.play().catch(e => {
      console.warn("playAudioFile 播放失敗：", e);
      if (onEnded) onEnded();
    });
  }

  /**
   * 朗讀完整句子 (使用預先合成之 Google Cloud Neural2 最高品質音檔)
   * 修正：開頭改用 stopAllVoice() 同時停止兩個通道
   * @param {string} text - 英文句子
   * @param {Function} onEnded - 朗讀結束回呼
   */
  speakSentence(text, onEnded = null) {
    if (this.isMuted || !text) {
      if (onEnded) onEnded();
      return;
    }

    // ★ 修正核心：停止所有語音通道，防止與 playWordAudio 重疊
    this.stopAllVoice();

    const clean = text.trim();
    const map = window.SENTENCES_AUDIO_MAP || {};
    const audioPath = map[clean] || map[clean.replace(/,\s*/g, ' ')];

    if (audioPath) {
      this.currentAudio = new Audio(audioPath);
      this.currentAudio.onended = () => { if (onEnded) onEnded(); };
      this.currentAudio.onerror = () => { if (onEnded) onEnded(); };
      this.currentAudio.play().catch(e => {
        if (onEnded) onEnded();
      });
    } else {
      // 嘗試播放單字音檔備援（使用新增的 playAudioFile 方法）
      const book = window.BOOK_ID || "P1";
      const fb = book + "_flashcards_audios/" + book + "_" + clean.toLowerCase() + ".mp3";
      this.playAudioFile(fb, onEnded);
    }
  }

  /**
   * 停止當前正在播放的教材語音或句子朗讀
   * 修正：委派給 stopAllVoice() 統一管理，確保兩個通道都被清理
   */
  stopVoice() {
    this.stopAllVoice();
  }
}

// 匯出單例
const Sound = new SoundController();
