/**
 * Three.js 3D 冰原世界場景管理器 (Scene & Ice Environment)
 * 實作：鏡面冰層、動態冰刀刮痕模擬、飄雪粒子環境與射線追蹤
 */

class WorldScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // 核心 Three.js 物件
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 冰面與刮痕紋理
    this.iceFloor = null;
    this.scratchCanvas = null;
    this.scratchCtx = null;
    this.scratchTexture = null;
    this.floorPlane = null; // 數學射線碰撞平面

    // 環境粒子與裝飾
    this.snowParticles = null;
    this.guideLine = null;

    // 游標射線目標
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.targetPos = new THREE.Vector3(0, 0, 0);

    this.init();
  }

  init() {
    // 1. 建立場景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd7eef9);
    this.scene.fog = new THREE.FogExp2(0xd7eef9, 0.022);

    // 2. 建立透視相機（俯角視角微距拉近，呈現更鮮明之大圖卡與小兔特寫）
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.5, 100);
    this.camera.position.set(0, 13, 16);
    this.camera.lookAt(0, 0, 1.5);

    // 3. 建立 WebGL 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. 設定光影系統
    this.setupLights();

    // 5. 建立動態冰刀刮痕畫布與冰面
    this.setupIceFloor();

    // 6. 建立雪花粒子系統
    this.setupSnow();

    // 7. 建立游標導引虛線
    this.setupGuideLine();

    // 8. 建立周圍雪山與裝飾低多邊形杉樹
    this.setupEnvironmentDecorations();

    // 9. 事件監聽
    this.bindEvents();
  }

  setupLights() {
    // 半球環境光 (天空藍與雪地反光)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbfe3f7, 0.75);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    // 主平行陽光 (帶有柔和陰影)
    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.2);
    dirLight.position.set(12, 22, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    const d = 16;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // 溫和輔助光
    const fillLight = new THREE.DirectionalLight(0x9bd8ff, 0.4);
    fillLight.position.set(-15, 10, -10);
    this.scene.add(fillLight);
  }

  setupIceFloor() {
    const size = 32;
    const canvasRes = 1024;

    // 建立離屏動態刮痕 Canvas
    this.scratchCanvas = document.createElement('canvas');
    this.scratchCanvas.width = canvasRes;
    this.scratchCanvas.height = canvasRes;
    this.scratchCtx = this.scratchCanvas.getContext('2d');

    // 底色填充：平滑冰藍
    this.scratchCtx.fillStyle = '#c5e6f6';
    this.scratchCtx.fillRect(0, 0, canvasRes, canvasRes);

    this.scratchTexture = new THREE.CanvasTexture(this.scratchCanvas);
    this.scratchTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.scratchTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.scratchTexture.minFilter = THREE.LinearFilter;

    // 冰層材質：高光澤微反射 PBR 材質
    const floorGeo = new THREE.PlaneGeometry(size, size, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xddf1fc,
      map: this.scratchTexture,
      roughness: 0.18,
      metalness: 0.05,
      roughnessMap: this.scratchTexture
    });

    this.iceFloor = new THREE.Mesh(floorGeo, floorMat);
    this.iceFloor.rotation.x = -Math.PI / 2;
    this.iceFloor.position.y = 0;
    this.iceFloor.receiveShadow = true;
    this.scene.add(this.iceFloor);

    // 數學平面供射線碰撞精確取點
    this.floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  }

  /**
   * 在冰面上繪製冰刀劃痕
   * @param {number} worldX - 兔子世界座標 X
   * @param {number} worldZ - 兔子世界座標 Z
   * @param {number} angle - 滑行角度
   * @param {number} speed - 當前滑速
   */
  drawIceScratch(worldX, worldZ, angle, speed) {
    if (!this.scratchCtx) return;
    const size = 32;
    const canvasRes = 1024;

    // 轉換世界座標 (-16 ~ +16) 至 Canvas 座標 (0 ~ 1024)
    const cx = ((worldX + size / 2) / size) * canvasRes;
    const cy = ((worldZ + size / 2) / size) * canvasRes;

    this.scratchCtx.save();
    this.scratchCtx.translate(cx, cy);
    this.scratchCtx.rotate(-angle);

    const scratchLen = Math.min(22, 6 + speed * 35);
    const alpha = Math.min(0.65, 0.15 + speed * 0.8);

    // 雙冰刀痕跡
    this.scratchCtx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    this.scratchCtx.lineWidth = 2.2;
    this.scratchCtx.beginPath();
    // 左刀刃
    this.scratchCtx.moveTo(-scratchLen * 0.5, -4);
    this.scratchCtx.lineTo(scratchLen * 0.5, -4);
    // 右刀刃
    this.scratchCtx.moveTo(-scratchLen * 0.5, 4);
    this.scratchCtx.lineTo(scratchLen * 0.5, 4);
    this.scratchCtx.stroke();

    this.scratchCtx.restore();

    this.scratchTexture.needsUpdate = true;
  }

  /**
   * 逐幀緩慢修復冰面痕跡（模擬冰層自我平整融結）
   */
  fadeIceScratches() {
    if (!this.scratchCtx) return;
    const canvasRes = 1024;
    this.scratchCtx.fillStyle = 'rgba(197, 230, 246, 0.008)';
    this.scratchCtx.fillRect(0, 0, canvasRes, canvasRes);
    this.scratchTexture.needsUpdate = true;
  }

  setupSnow() {
    const snowCount = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(snowCount * 3);
    const velocities = [];

    for (let i = 0; i < snowCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36;

      velocities.push({
        y: 0.03 + Math.random() * 0.05,
        x: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 使用圓形發光粒子
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(230, 245, 255, 0.6)');
    grad.addColorStop(1, 'rgba(230, 245, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const snowTex = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.45,
      map: snowTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.snowParticles = new THREE.Points(geometry, material);
    this.snowVelocities = velocities;
    this.scene.add(this.snowParticles);
  }

  updateSnow() {
    if (!this.snowParticles) return;
    const positions = this.snowParticles.geometry.attributes.position.array;
    const count = this.snowVelocities.length;

    for (let i = 0; i < count; i++) {
      const v = this.snowVelocities[i];
      positions[i * 3 + 1] -= v.y;
      positions[i * 3] += v.x;
      positions[i * 3 + 2] += v.z;

      // 落地重置至高空
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 20;
        positions[i * 3] = (Math.random() - 0.5) * 36;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 36;
      }
    }
    this.snowParticles.geometry.attributes.position.needsUpdate = true;
  }

  setupGuideLine() {
    // 連接兔子與游標之半透明虛線（Yakudoo 經典特色）
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(0, 0.1, 0)
    ]);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x4aa3df,
      dashSize: 0.4,
      gapSize: 0.25,
      transparent: true,
      opacity: 0.55
    });
    this.guideLine = new THREE.Line(lineGeo, lineMat);
    this.guideLine.computeLineDistances();
    this.scene.add(this.guideLine);
  }

  updateGuideLine(bunnyPos, targetPos) {
    if (!this.guideLine) return;
    const pos = this.guideLine.geometry.attributes.position.array;
    pos[0] = bunnyPos.x;
    pos[1] = 0.15;
    pos[2] = bunnyPos.z;
    pos[3] = targetPos.x;
    pos[4] = 0.15;
    pos[5] = targetPos.z;
    this.guideLine.geometry.attributes.position.needsUpdate = true;
    this.guideLine.computeLineDistances();
  }

  setupEnvironmentDecorations() {
    // 冰場四週的雪堤雪堆與卡通杉樹
    const treeGroup = new THREE.Group();
    const treePositions = [
      [-13, -12], [-10, -14], [0, -15], [10, -14], [13, -11],
      [-14, 11], [-9, 14], [0, 15], [11, 13], [14, 10],
      [-15, 0], [15, 0], [-14, -5], [14, 6]
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x7c5335 });
    const foliageGeo = new THREE.ConeGeometry(1.2, 2.5, 6);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x76b6b2, flatShading: true, roughness: 0.8 });
    const snowCapGeo = new THREE.ConeGeometry(0.8, 1.2, 6);
    const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.5 });

    treePositions.forEach(([x, z]) => {
      const tree = new THREE.Group();
      const scale = 0.8 + Math.random() * 0.6;

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.6;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.0;
      foliage.castShadow = true;
      tree.add(foliage);

      const snowCap = new THREE.Mesh(snowCapGeo, snowCapMat);
      snowCap.position.y = 2.7;
      snowCap.castShadow = true;
      tree.add(snowCap);

      tree.position.set(x, 0, z);
      tree.scale.set(scale, scale, scale);
      treeGroup.add(tree);
    });

    this.scene.add(treeGroup);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // 桌面滑鼠移動
    window.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));

    // 行動裝置觸控
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  onPointerMove(clientX, clientY) {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hitPoint = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.floorPlane, hitPoint)) {
      // 限制在冰場半徑邊界內 (-12 ~ +12)
      this.targetPos.x = Math.max(-12, Math.min(12, hitPoint.x));
      this.targetPos.z = Math.max(-12, Math.min(12, hitPoint.z));
      this.targetPos.y = 0;
    }
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  render() {
    this.updateSnow();
    this.fadeIceScratches();
    this.renderer.render(this.scene, this.camera);
  }
}
