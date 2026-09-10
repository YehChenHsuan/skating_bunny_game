/**
 * 3D 溜冰小兔角色控制器 (Bunny Character & Physics Controller)
 * 整合：GLB 模型載入、程序化卡通兔兔備用 Mesh、牽引動力學、翻滾跳躍與耳朵彈性物理
 */

class BunnyCharacter {
  constructor(scene, soundController) {
    this.scene = scene;
    this.sound = soundController;

    // 角色根節點
    this.mesh = new THREE.Group();
    this.mesh.position.set(0, 0, 0);
    this.scene.scene.add(this.mesh);

    // 物理運動狀態
    this.pos = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.speed = 0;
    this.targetRotation = 0;
    this.currentRotation = 0;

    // 跳躍狀態
    this.isJumping = false;
    this.jumpY = 0;
    this.jumpRotX = 0;
    this.jumpTween = null;

    // 動態耳朵節點參照
    this.leftEar = null;
    this.rightEar = null;
    this.bodyMesh = null;

    // 直接建置專屬 3D 程序化卡通溜冰小兔（零外部相依、秒速載入）
    this.buildProceduralBunny();
  }

  loadGLBModel() {
    let hasLoaded = false;
    // 3 秒超時保障
    const fallbackTimer = setTimeout(() => {
      if (!hasLoaded) {
        console.log("GLB 模型載入超時，自動切換至高品質程序化 3D 卡通小兔。");
        this.buildProceduralBunny();
      }
    }, 3000);

    if (typeof THREE.GLTFLoader !== "undefined") {
      const loader = new THREE.GLTFLoader();
      const modelUrl = "https://assets.codepen.io/264161/rabbit6.glb";

      loader.load(
        modelUrl,
        (gltf) => {
          if (hasLoaded) return;
          hasLoaded = true;
          clearTimeout(fallbackTimer);

          const model = gltf.scene;
          model.scale.set(1.4, 1.4, 1.4);
          model.position.y = 0;

          // 遍歷設定陰影與材質，並隱藏自帶的胡蘿蔔物件
          model.traverse((child) => {
            const name = (child.name || "").toLowerCase();

            // 隱藏 GLB 自帶的胡蘿蔔與葉子物件
            if (name.includes("carrot") || name.includes("leaf") || name.includes("leaves") || name.includes("carotte")) {
              child.visible = false;
              if (child.scale) child.scale.set(0, 0, 0);
              return;
            }

            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              // 尋找耳朵物件以進行物理動力學擺動
              if (name.includes("ear_l") || name.includes("earleft") || name.includes("ear1")) {
                this.leftEar = child;
              } else if (name.includes("ear_r") || name.includes("earright") || name.includes("ear2")) {
                this.rightEar = child;
              }
            }
          });

          this.mesh.add(model);
          this.bodyMesh = model;
          console.log("成功載入 Yakudoo 原版 3D 兔兔 GLB 模型！");
        },
        undefined,
        (err) => {
          if (hasLoaded) return;
          hasLoaded = true;
          clearTimeout(fallbackTimer);
          console.warn("無法取得遠端 GLB，啟動程序化 3D 兔兔模型：", err);
          this.buildProceduralBunny();
        }
      );
    } else {
      this.buildProceduralBunny();
    }
  }

  /**
   * 建構精美 Procedural 3D 卡通溜冰兔兔（100% 離線可用，自適應全設備）
   */
  buildProceduralBunny() {
    // 若已掛載模型則略過
    if (this.bodyMesh) return;

    const bunnyGroup = new THREE.Group();
    bunnyGroup.scale.set(1.2, 1.2, 1.2);

    // 1. 身體 (水藍色微橢圓造型)
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.7, 1.1, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x54c4f8,
      roughness: 0.3,
      metalness: 0.05,
      flatShading: true
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    bunnyGroup.add(body);

    // 肚子白肚皮
    const bellyGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const belly = new THREE.Mesh(bellyGeo, bellyMat);
    belly.scale.set(0.8, 1.0, 0.4);
    belly.position.set(0, 0.8, 0.45);
    bunnyGroup.add(belly);

    // 2. 頭部
    const headGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 1.6, 0.1);
    head.castShadow = true;
    bunnyGroup.add(head);

    // 圓滾滾大眼睛 (左/右)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a2530 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const pupilGeo = new THREE.SphereGeometry(0.04, 8, 8);

    [-0.24, 0.24].forEach((xPos) => {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(xPos, 1.7, 0.6);
      bunnyGroup.add(eye);

      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(xPos + (xPos > 0 ? 0.02 : -0.02), 1.74, 0.68);
      bunnyGroup.add(pupil);
    });

    // 粉紅微翹小鼻子
    const noseGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xff7b95, roughness: 0.3 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 1.55, 0.7);
    bunnyGroup.add(nose);

    // 3. 雙長耳朵（帶有樞紐節點供物理搖晃）
    const earGeo = new THREE.ConeGeometry(0.18, 1.1, 8);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x54c4f8, roughness: 0.3, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: 0xffadc0, roughness: 0.4 });
    const earInnerGeo = new THREE.ConeGeometry(0.1, 0.8, 8);

    // 左耳
    this.leftEar = new THREE.Group();
    this.leftEar.position.set(-0.25, 2.05, 0.1);
    const lEarMesh = new THREE.Mesh(earGeo, earMat);
    lEarMesh.position.y = 0.5;
    lEarMesh.castShadow = true;
    this.leftEar.add(lEarMesh);
    const lInner = new THREE.Mesh(earInnerGeo, earInnerMat);
    lInner.position.set(0, 0.45, 0.08);
    this.leftEar.add(lInner);
    this.leftEar.rotation.z = 0.2;
    bunnyGroup.add(this.leftEar);

    // 右耳
    this.rightEar = new THREE.Group();
    this.rightEar.position.set(0.25, 2.05, 0.1);
    const rEarMesh = new THREE.Mesh(earGeo, earMat);
    rEarMesh.position.y = 0.5;
    rEarMesh.castShadow = true;
    this.rightEar.add(rEarMesh);
    const rInner = new THREE.Mesh(earInnerGeo, earInnerMat);
    rInner.position.set(0, 0.45, 0.08);
    this.rightEar.add(rInner);
    this.rightEar.rotation.z = -0.2;
    bunnyGroup.add(this.rightEar);

    // 4. 圓球毛茸尾巴
    const tailGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const tail = new THREE.Mesh(tailGeo, bellyMat);
    tail.position.set(0, 0.6, -0.65);
    tail.castShadow = true;
    bunnyGroup.add(tail);

    // 5. 雙腳與銀色冰刀 (Skate Blades)
    const bladeGeo = new THREE.BoxGeometry(0.04, 0.12, 0.8);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd0e6f2, metalness: 0.85, roughness: 0.15 });

    [-0.3, 0.3].forEach((xPos) => {
      // 腳掌
      const footGeo = new THREE.SphereGeometry(0.18, 10, 10);
      const foot = new THREE.Mesh(footGeo, bodyMat);
      foot.scale.set(0.8, 0.5, 1.3);
      foot.position.set(xPos, 0.2, 0.1);
      foot.castShadow = true;
      bunnyGroup.add(foot);

      // 冰刀刀刃
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(xPos, 0.06, 0.1);
      bunnyGroup.add(blade);
    });

    this.mesh.add(bunnyGroup);
    this.bodyMesh = bunnyGroup;
  }

  /**
   * 觸發跳躍與空中 360 度迴旋翻滾 (Hop & Spin!)
   */
  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.sound.playJump();

    if (typeof gsap !== "undefined") {
      // 向上垂直拋物線跳躍
      gsap.to(this, {
        jumpY: 3.2,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: () => {
          if (this.leftEar) this.leftEar.rotation.x = -0.6;
          if (this.rightEar) this.rightEar.rotation.x = -0.6;
        },
        onComplete: () => {
          gsap.to(this, {
            jumpY: 0,
            duration: 0.35,
            ease: "bounce.out",
            onComplete: () => {
              this.isJumping = false;
              this.jumpRotX = 0;
              if (this.leftEar) this.leftEar.rotation.x = 0;
              if (this.rightEar) this.rightEar.rotation.x = 0;
            }
          });
        }
      });

      // 360 度前空翻迴轉
      gsap.to(this, {
        jumpRotX: Math.PI * 2,
        duration: 0.7,
        ease: "power1.inOut"
      });
    } else {
      // GSAP 未就緒之原生拋物線備份
      this.jumpY = 2.5;
      setTimeout(() => {
        this.jumpY = 0;
        this.isJumping = false;
      }, 600);
    }
  }

  /**
   * 物理牽引更新：根據游標目標座標進行彈性加速、慣性滑行與冰痕記錄
   */
  update(targetPos) {
    // 計算與目標之差距向量
    const dx = targetPos.x - this.pos.x;
    const dz = targetPos.z - this.pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // 彈性牽引力 (距離越遠加速度越大，極速有限制)
    const spring = 0.035;
    const friction = 0.88;

    this.vel.x += dx * spring;
    this.vel.z += dz * spring;

    this.vel.x *= friction;
    this.vel.z *= friction;

    // 更新位置
    this.pos.x += this.vel.x;
    this.pos.z += this.vel.z;
    this.speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.z * this.vel.z);

    // 當速度足夠時發出滑冰磨冰音效並記錄冰面劃痕
    if (this.speed > 0.04 && !this.isJumping) {
      this.sound.playSkate();
      this.scene.drawIceScratch(this.pos.x, this.pos.z, this.currentRotation, this.speed);
    }

    // 朝向目標移動方向旋轉 (帶有平滑角速度插值)
    if (this.speed > 0.02) {
      this.targetRotation = Math.atan2(this.vel.x, this.vel.z);
      // 角度最短路徑插值
      let diff = this.targetRotation - this.currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.currentRotation += diff * 0.18;
    }

    // 更新 Mesh 位置與旋轉
    this.mesh.position.set(this.pos.x, this.jumpY, this.pos.z);
    this.mesh.rotation.y = this.currentRotation;

    // 滑行時向內傾斜 (Bank angle)
    const tilt = -this.vel.x * 0.4;
    this.mesh.rotation.z = tilt;

    // 空中空翻旋轉
    if (this.isJumping) {
      this.mesh.rotation.x = this.jumpRotX;
    } else {
      this.mesh.rotation.x = 0;
    }

    // 耳朵軟體彈動物理 (根據速度後傾)
    if (!this.isJumping) {
      const earTilt = -Math.min(0.7, this.speed * 1.5);
      if (this.leftEar) {
        this.leftEar.rotation.x = earTilt;
        this.leftEar.rotation.z = 0.2 + Math.sin(Date.now() * 0.008) * 0.05;
      }
      if (this.rightEar) {
        this.rightEar.rotation.x = earTilt;
        this.rightEar.rotation.z = -0.2 - Math.sin(Date.now() * 0.008) * 0.05;
      }
    }
  }
}
