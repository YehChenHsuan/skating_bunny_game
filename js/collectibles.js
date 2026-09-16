/**
 * 冰上 3D 閃卡浮標、胡蘿蔔與粒子爆炸系統 (Collectibles & Particle System)
 * 升級版：大尺寸高清晰度圖卡、始終正對鏡頭 (Billboard)、文字高對比與零空白防禦
 */

class CollectiblesManager {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.items = []; // 當前冰面上的可收集物
    this.particlePool = []; // 粒子池
    this.textureLoader = new THREE.TextureLoader();

    // 建立粒子群容器
    this.particleGroup = new THREE.Group();
    this.worldScene.scene.add(this.particleGroup);

    // 預先產生粒子網格幾何與材質
    this.initParticleSystem();
  }

  initParticleSystem() {
    this.sparkleGeo = new THREE.DodecahedronGeometry(0.18);
    this.sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffe875 });

    this.iceShardGeo = new THREE.TetrahedronGeometry(0.2);
    this.iceShardMat = new THREE.MeshBasicMaterial({ color: 0x88e2ff, transparent: true, opacity: 0.95 });
  }

  clearAll() {
    this.items.forEach((item) => {
      this.worldScene.scene.remove(item.mesh);
    });
    this.items = [];
  }

  /**
   * 建立大尺寸 3D 閃卡圖案標的（懸浮冰晶寶座）
   */
  spawnFlashcardTarget(vocabItem, x, z, isCorrect) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // 1. 地面發光光環 (統一為優雅水藍色光環，全選項完全一致，絕無洩題顏色差)
    const ringGeo = new THREE.RingGeometry(1.0, 1.35, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    group.add(ring);

    // 2. 懸浮晶柱基底 (Crystal Base)
    const baseGeo = new THREE.CylinderGeometry(0.55, 0.85, 0.6, 6);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xc8efff,
      roughness: 0.1,
      metalness: 0.25,
      transparent: true,
      opacity: 0.85
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;
    group.add(base);

    // 3. 大尺寸閃卡卡牌組 (Billboard Flashcard - 隨攝影機正向面對玩家)
    const cardGroup = new THREE.Group();
    cardGroup.position.y = 2.4; // 懸浮於晶柱上方

    // 卡牌外框純白背板 (全選項完全一致)
    const cardW = 3.2;
    const cardH = 3.2;
    const backGeo = new THREE.PlaneGeometry(cardW + 0.25, cardH + 0.25);
    const backMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const back = new THREE.Mesh(backGeo, backMat);
    cardGroup.add(back);

    // 彩色外框光暈裝飾 (統一深天藍色 #0284c7，全選項完全一致，絕無洩題)
    const borderGeo = new THREE.PlaneGeometry(cardW + 0.35, cardH + 0.35);
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide
    });
    const borderMesh = new THREE.Mesh(borderGeo, borderMat);
    borderMesh.position.z = -0.01;
    cardGroup.add(borderMesh);

    // 建立卡片正面（包含防空白備用 Canvas）
    const frontGeo = new THREE.PlaneGeometry(cardW, cardH);
    // 預設即時繪製高清晰備份畫面，確保任何網路延遲或圖片異常皆 100% 不空白
    const fallbackCanvas = this.createFallbackCardCanvas(vocabItem);
    const fallbackTex = new THREE.CanvasTexture(fallbackCanvas);
    const frontMat = new THREE.MeshBasicMaterial({ map: fallbackTex, side: THREE.DoubleSide });
    const front = new THREE.Mesh(frontGeo, frontMat);
    front.position.z = 0.02;
    cardGroup.add(front);

    // 嘗試非同步載入高解析真實教材圖片
    let imgSrc = null;
    const bookId = window.BOOK_ID || "";
    const bookImages = (window[`${bookId}_FLASHCARD_IMAGES`] || window.FLASHCARD_IMAGES);
    if (bookImages) {
      imgSrc = bookImages[vocabItem.id] || bookImages[vocabItem.word] || bookImages[vocabItem.image];
    }
    if (!imgSrc) {
      imgSrc = vocabItem.image;
    }

    if (imgSrc) {
      this.textureLoader.load(
        imgSrc,
        (tex) => {
          tex.minFilter = THREE.LinearFilter;
          front.material.map = tex;
          front.material.needsUpdate = true;
        },
        undefined,
        () => {
          console.warn(`教材圖片載入失敗，已啟用高對比備份圖卡：${vocabItem.word}`);
        }
      );
    }

    // 4. 超清晰文字看板 (High-Resolution Text Banner Canvas: 512x128)
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 512;
    textCanvas.height = 128;
    const tCtx = textCanvas.getContext("2d");

    // 膠囊底色：深海軍藍，高對比
    tCtx.fillStyle = "#071f38";
    tCtx.roundRect(8, 8, 496, 112, 28);
    tCtx.fill();

    // 亮藍外框
    tCtx.strokeStyle = "#38bdf8";
    tCtx.lineWidth = 6;
    tCtx.roundRect(8, 8, 496, 112, 28);
    tCtx.stroke();

    // 純白大字體單字
    tCtx.fillStyle = "#ffffff";
    tCtx.font = "bold 58px 'Fredoka', 'Outfit', sans-serif";
    tCtx.textAlign = "center";
    tCtx.textBaseline = "middle";
    tCtx.fillText(vocabItem.word.toUpperCase(), 256, 64);

    const textTex = new THREE.CanvasTexture(textCanvas);
    const textGeo = new THREE.PlaneGeometry(3.0, 0.75);
    const textMat = new THREE.MeshBasicMaterial({ map: textTex, transparent: true, side: THREE.DoubleSide });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.y = -1.95; // 位於大圖卡下方
    textMesh.position.z = 0.05;
    cardGroup.add(textMesh);

    group.add(cardGroup);

    // 入場彈出動畫 (GSAP Elastic Pop-up)
    if (typeof gsap !== "undefined") {
      group.scale.set(0.01, 0.01, 0.01);
      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: "back.out(1.8)"
      });
    }

    this.worldScene.scene.add(group);

    const itemData = {
      id: vocabItem.id,
      vocabItem: vocabItem,
      mesh: group,
      cardGroup: cardGroup,
      ring: ring,
      pos: new THREE.Vector3(x, 0, z),
      isCorrect: isCorrect,
      type: "flashcard",
      spawnTime: Date.now()
    };

    this.items.push(itemData);
    return itemData;
  }

  /**
   * 建立防空白備用圖卡 Canvas
   */
  createFallbackCardCanvas(vocabItem) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");

    // 漸層背景
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, "#f0f9ff");
    grad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // 繪製卡片大圖標/首字母
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 130px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const letter = (vocabItem.word || "A").charAt(0).toUpperCase();
    ctx.fillText(letter, 256, 220);

    // 單字名
    ctx.font = "bold 56px sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(vocabItem.word || "", 256, 360);

    return c;
  }

  /**
   * 建立大尺寸 3D Phonics 紅蘿蔔（文字極度清晰大尺寸）
   */
  spawnCarrot(letter, word, x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // 蘿蔔身 (錐體)
    const bodyGeo = new THREE.ConeGeometry(0.45, 1.5, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff6b35, roughness: 0.35 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI;
    body.position.y = 0.95;
    body.castShadow = true;
    group.add(body);

    // 綠色葉子
    const leafGeo = new THREE.ConeGeometry(0.18, 0.75, 6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.4 });
    [-0.18, 0, 0.18].forEach((ang) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(ang * 0.7, 1.8, 0);
      leaf.rotation.z = ang * 2;
      group.add(leaf);
    });

    // 超清晰大尺寸文字看板 (512x160 畫布，64px 大粗體字)
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 512;
    textCanvas.height = 160;
    const tCtx = textCanvas.getContext("2d");

    // 深海軍藍圓角底框 + 橘紅發光粗邊框，字體格外突出
    tCtx.fillStyle = "#071f38";
    tCtx.roundRect(8, 8, 496, 144, 32);
    tCtx.fill();
    tCtx.strokeStyle = "#ff7849";
    tCtx.lineWidth = 8;
    tCtx.roundRect(8, 8, 496, 144, 32);
    tCtx.stroke();

    // 純白大文字
    tCtx.fillStyle = "#ffffff";
    tCtx.font = "bold 68px 'Fredoka', 'Outfit', sans-serif";
    tCtx.textAlign = "center";
    tCtx.textBaseline = "middle";
    tCtx.fillText(word ? word.toUpperCase() : letter, 256, 80);

    const tex = new THREE.CanvasTexture(textCanvas);
    const tagGeo = new THREE.PlaneGeometry(3.2, 1.0);
    const tagMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
    const tagMesh = new THREE.Mesh(tagGeo, tagMat);
    tagMesh.position.y = 2.45; // 懸浮於胡蘿蔔上方
    group.add(tagMesh);

    if (typeof gsap !== "undefined") {
      group.scale.set(0.01, 0.01, 0.01);
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.8)" });
    }

    this.worldScene.scene.add(group);

    const itemData = {
      id: word || letter,
      mesh: group,
      tagMesh: tagMesh,
      pos: new THREE.Vector3(x, 0, z),
      type: "carrot",
      letter: letter,
      word: word,
      spawnTime: Date.now()
    };
    this.items.push(itemData);
    return itemData;
  }

  explodeParticles(x, y, z, isGolden = true) {
    const count = 30; // ★ 優化：從 50 降至 30 提升幀率
    const maxPoolSize = 150; // 粒子池總數上限

    // 若粒子池即將超過上限，先淘汰最舊的粒子
    while (this.particlePool.length + count > maxPoolSize && this.particlePool.length > 0) {
      const oldest = this.particlePool.shift();
      this.particleGroup.remove(oldest.mesh);
    }

    for (let i = 0; i < count; i++) {
      const isGold = Math.random() > 0.35;
      const mesh = new THREE.Mesh(
        isGold ? this.sparkleGeo : this.iceShardGeo,
        isGold ? this.sparkleMat : this.iceShardMat
      );

      mesh.position.set(x, y, z);
      const scale = 0.6 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);

      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.2) * Math.PI;
      const speed = 0.15 + Math.random() * 0.3;

      const pData = {
        mesh: mesh,
        vx: Math.cos(angle) * Math.cos(elevation) * speed,
        vy: (Math.sin(elevation) + 0.7) * speed * 1.2,
        vz: Math.sin(angle) * Math.cos(elevation) * speed,
        rotX: (Math.random() - 0.5) * 0.2,
        rotY: (Math.random() - 0.5) * 0.2,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02
      };

      this.particleGroup.add(mesh);
      this.particlePool.push(pData);
    }
  }

  /**
   * 逐幀更新：閃卡永遠朝向攝影機 (Billboard)，並進行碰撞判定
   */
  update(bunnyPos, bunnyRadius, onCollide) {
    const time = Date.now() * 0.003;
    const cameraQuaternion = this.worldScene.camera.quaternion;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];

      // 1. 核心重點：圖卡組永遠正對攝影機 (Billboard)，完全免除傾角透視變形！
      if (item.cardGroup) {
        item.cardGroup.quaternion.copy(cameraQuaternion);
        item.cardGroup.position.y = 2.4 + Math.sin(time * 2 + item.spawnTime) * 0.2;
      }
      if (item.tagMesh) {
        item.tagMesh.quaternion.copy(cameraQuaternion);
      }
      if (item.mesh && item.type === "carrot") {
        item.mesh.position.y = Math.sin(time * 2.5 + item.spawnTime) * 0.18;
        item.mesh.rotation.y += 0.03;
      }

      // 地面光圈呼吸動畫
      if (item.ring) {
        const s = 1.0 + Math.sin(time * 3) * 0.12;
        item.ring.scale.set(s, s, s);
      }

      // 2. 碰撞偵測 (放大有效半徑至 1.6，碰撞手感更靈敏)
      const distSq =
        (bunnyPos.x - item.pos.x) * (bunnyPos.x - item.pos.x) +
        (bunnyPos.z - item.pos.z) * (bunnyPos.z - item.pos.z);

      const effectiveRadius = 1.6;
      if (distSq < effectiveRadius * effectiveRadius) {
        // 若該物品處於防重複碰撞冷卻期 (例如剛撞到錯誤目標彈開中)，暫時略過
        if (item.lastHitTime && Date.now() - item.lastHitTime < 800) {
          continue;
        }

        if (onCollide) {
          const result = onCollide(item);
          // 若回傳 false (例如撞到錯誤目標或此時不允許碰撞)，記錄冷卻並保留物件不移除
          if (result === false) {
            item.lastHitTime = Date.now();
            continue;
          }
        }

        // 成功觸發有效收集：釋放粒子爆炸並從場景中移除
        this.explodeParticles(item.pos.x, 2.0, item.pos.z, item.isCorrect);
        this.worldScene.scene.remove(item.mesh);
        this.items.splice(i, 1);
      }
    }

    // 3. 更新粒子爆炸
    for (let i = this.particlePool.length - 1; i >= 0; i--) {
      const p = this.particlePool[i];
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;

      p.vy -= 0.009;
      p.mesh.rotation.x += p.rotX;
      p.mesh.rotation.y += p.rotY;

      p.life -= p.decay;
      const s = p.life;
      p.mesh.scale.set(s, s, s);

      if (p.life <= 0 || p.mesh.position.y < -0.2) {
        this.particleGroup.remove(p.mesh);
        this.particlePool.splice(i, 1);
      }
    }
  }
}
