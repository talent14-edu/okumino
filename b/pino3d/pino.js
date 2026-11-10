// Pinokyo: a procedural clay-style wooden toy figure for Okumino (site B).
// Original design. Hierarchy root > body > {hips, legs, torso, arms, head > {face, nose, hat}}.
// Every joint is a Group placed at its pivot, so poses are plain rotations.
// Left/right pairs are reflections: side s = +1 is the character's left (+X), s = -1 its right.
// The figure faces +Z; root.rotation.y turns it (positive = toward screen right).

function createPino(THREE) {
  const woodTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 256);
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 26; i++) {
      const y0 = rnd() * 256, a = 3 + rnd() * 7, f = .02 + rnd() * .03, w = .8 + rnd() * 1.6;
      g.strokeStyle = `rgba(150,90,40,${.05 + rnd() * .08})`; g.lineWidth = w;
      g.beginPath();
      for (let x = 0; x <= 256; x += 4) { const y = y0 + Math.sin(x * f + i) * a; x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  })();

  const M = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: .36, clearcoat: .8, clearcoatRoughness: .22, ...o });
  const mat = {
    wood: M('#F0B276', { map: woodTex, roughness: .42, clearcoat: .6 }),
    hair: M('#5A3220', { roughness: .45 }),
    joint: M('#DC8E4E', { roughness: .4 }),
    red: M('#E8391E', { sheen: .4, sheenColor: new THREE.Color('#ff9a7a') }),
    saffron: M('#FFB020'),
    sage: M('#5FA83E', { sheen: .3, sheenColor: new THREE.Color('#c8f0a8') }),
    cream: M('#FFF4E2', { roughness: .5 }),
    shoe: M('#3A2218', { roughness: .28, clearcoat: .9 }),
    cheek: M('#F59A8B', { roughness: .7, clearcoat: 0, transparent: true, opacity: .8 }),
    eye: M('#1E1210', { roughness: .12, clearcoat: 1, clearcoatRoughness: .05 }),
    glint: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    brow: M('#6B3A22', { roughness: .6 }),
    mouth: M('#8C2B1E', { roughness: .4 }),
    leaf: M('#5E9A45', { sheen: .3 })
  };

  const mesh = (geo, m, pos, scale, rot) => {
    const o = new THREE.Mesh(geo, m); o.castShadow = true; o.receiveShadow = true;
    if (pos) o.position.set(...pos); if (scale) o.scale.set(...scale); if (rot) o.rotation.set(...rot);
    return o;
  };
  const grp = (pos) => { const g = new THREE.Group(); if (pos) g.position.set(...pos); return g; };
  const sph = (r, seg = 40) => new THREE.SphereGeometry(r, seg, Math.round(seg * .75));
  const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 10, 28);

  const root = grp(), body = grp(); root.add(body);
  const parts = { root, body };

  // ── hips + shorts
  body.add(mesh(sph(.37), mat.red, [0, 1.06, 0], [1, .62, .9]));

  // ── legs (hip > knee > ankle)
  for (const s of [1, -1]) {
    const k = s > 0 ? 'L' : 'R';
    const hip = grp([s * .17, .95, 0]); body.add(hip);
    hip.add(mesh(sph(.16), mat.red, [0, -.06, 0], [1, 1.05, 1]));
    hip.add(mesh(cap(.092, .2), mat.wood, [0, -.21, 0]));
    const knee = grp([0, -.36, 0]); hip.add(knee);
    knee.add(mesh(sph(.098), mat.joint));
    knee.add(mesh(cap(.086, .18), mat.wood, [0, -.17, 0]));
    const ankle = grp([0, -.34, 0]); knee.add(ankle);
    ankle.add(mesh(sph(.18), mat.shoe, [0, -.1, .07], [1, .68, 1.45]));
    parts['hip' + k] = hip; parts['knee' + k] = knee; parts['ankle' + k] = ankle;
  }

  // ── torso: vest, collar, buttons
  const torso = grp([0, 1.15, 0]); body.add(torso); parts.torso = torso;
  torso.add(mesh(cap(.35, .2), mat.sage, [0, .3, 0], [1, 1, .86]));
  torso.add(mesh(new THREE.TorusGeometry(.19, .075, 18, 40), mat.cream, [0, .66, 0], [1, 1, .9], [Math.PI / 2, 0, 0]));
  torso.add(mesh(sph(.048), mat.saffron, [0, .38, .3]));
  torso.add(mesh(sph(.048), mat.saffron, [0, .22, .296]));
  torso.add(mesh(new THREE.CylinderGeometry(.1, .11, .14, 24), mat.wood, [0, .72, 0]));

  // ── arms (shoulder > elbow > hand)
  for (const s of [1, -1]) {
    const k = s > 0 ? 'L' : 'R';
    const sh = grp([s * .42, .52, 0]); torso.add(sh); sh.rotation.z = s * .22;
    sh.add(mesh(sph(.09), mat.joint));
    sh.add(mesh(cap(.068, .18), mat.wood, [0, -.16, 0]));
    const el = grp([0, -.31, 0]); sh.add(el);
    el.add(mesh(sph(.08), mat.joint));
    el.add(mesh(cap(.064, .16), mat.wood, [0, -.14, 0]));
    const hand = grp([0, -.29, 0]); el.add(hand);
    hand.add(mesh(sph(.11), mat.wood, [0, -.03, 0], [1, 1.08, .88]));
    hand.add(mesh(sph(.045), mat.wood, [-s * .07, .0, .06], [1, 1.3, 1]));   // thumb, mirrored
    parts['shoulder' + k] = sh; parts['elbow' + k] = el; parts['hand' + k] = hand;
  }

  // ── head
  const head = grp([0, .76, 0]); torso.add(head); parts.head = head;
  head.add(mesh(sph(.66, 64), mat.wood, [0, .6, 0], [1, .94, .93]));
  for (const s of [1, -1]) head.add(mesh(sph(.14), mat.wood, [s * .65, .55, -.02], [.55, 1, .8]));
  const face = grp([0, .6, 0]); head.add(face); parts.face = face;
  const eyes = [];
  for (const s of [1, -1]) {
    const e = grp([s * .23, .02, .56]); e.lookAt(new THREE.Vector3(s * .5, .2, 2).add(e.position)); face.add(e);
    e.add(mesh(sph(.13), mat.eye, [0, 0, 0], [1, 1.25, .5]));
    e.add(mesh(sph(.04, 16), mat.glint, [.035, .07, .06]));
    e.add(mesh(sph(.018, 12), mat.glint, [-.04, -.05, .06]));
    eyes.push(e);
    face.add(mesh(cap(.02, .09), mat.brow, [s * .24, .27, .57], [1, 1, 1], [0, 0, Math.PI / 2 - s * .22]));
    face.add(mesh(sph(.12), mat.cheek, [s * .38, -.17, .49], [1, .62, .38], [0, s * .6, 0]));
  }
  parts.eyes = eyes;
  const smile = mesh(new THREE.TorusGeometry(.085, .022, 10, 28, Math.PI), mat.mouth, [0, -.24, .6], [1, 1, 1], [-.25, 0, Math.PI]);
  const oMouth = mesh(new THREE.TorusGeometry(.045, .022, 10, 28), mat.mouth, [0, -.27, .6], [1, 1.25, 1], [-.25, 0, 0]);
  oMouth.visible = false; face.add(smile, oMouth); parts.smile = smile; parts.oMouth = oMouth;

  // nose: cone whose length is nose.scale.z
  const nose = grp([0, -.08, .6]); face.add(nose); parts.nose = nose;
  const ng = new THREE.ConeGeometry(.07, 1, 28); ng.translate(0, .5, 0); ng.rotateX(Math.PI / 2);
  nose.add(mesh(ng, mat.wood));
  nose.add(mesh(sph(.075), mat.wood, [0, 0, 0], [1, 1, .6]));
  const noseLeaf = mesh(sph(.06), mat.leaf, [0, .06, .8], [.45, 1, .2], [0, 0, .5]); noseLeaf.visible = false;
  nose.add(noseLeaf); parts.noseLeaf = noseLeaf;
  nose.scale.z = .34;

  // dark hair tufts under the hat brim, back and sides only
  for (const [a, y, r] of [[2.2, .95, .13], [2.6, .9, .14], [3.0, .88, .15], [3.4, .88, .15], [3.8, .9, .14], [4.1, .95, .13], [1.9, 1.0, .11], [4.4, 1.0, .11]]) {
    head.add(mesh(sph(r), mat.hair, [Math.sin(a) * .56, y, Math.cos(a) * .52], [1, .8, 1]));
  }
  // hat
  const hat = grp([0, .86, -.06]); head.add(hat); hat.rotation.x = -.28; parts.hat = hat;
  hat.add(mesh(new THREE.ConeGeometry(.6, 1.15, 56), mat.red, [0, .55, 0]));
  hat.add(mesh(new THREE.TorusGeometry(.58, .09, 18, 56), mat.saffron, [0, .06, 0], [1, 1, 1], [Math.PI / 2, 0, 0]));
  const tip = grp([0, 1.1, 0]); hat.add(tip);
  tip.add(mesh(sph(.12), mat.leaf, [.06, .1, 0], [.42, 1.15, .22], [0, 0, -.7]));
  tip.add(mesh(sph(.045), mat.red, [0, 0, 0]));

  // ── poses
  const set = (o, x = 0, y = 0, z = 0) => o.rotation.set(x, y, z);
  function rest() {
    root.rotation.set(0, 0, 0); body.position.set(0, 0, 0); body.rotation.set(0, 0, 0);
    torso.rotation.set(0, 0, 0); head.rotation.set(0, 0, 0); hat.rotation.set(-.28, 0, 0);
    for (const k of ['L', 'R']) {
      const s = k === 'L' ? 1 : -1;
      set(parts['hip' + k]); set(parts['knee' + k]); set(parts['ankle' + k]);
      set(parts['shoulder' + k], 0, 0, s * .22); set(parts['elbow' + k]); set(parts['hand' + k]);
    }
    eyes.forEach(e => e.scale.set(1, 1, 1));
    smile.visible = true; oMouth.visible = false; noseLeaf.visible = false; nose.scale.z = .34;
  }
  const poses = {
    ayakta() { // 3/4 to the right, waving with the near (right) hand
      root.rotation.y = .62; head.rotation.set(.05, -.12, .06);
      set(parts.shoulderR, 0, 0, -2.15); set(parts.elbowR, 0, 0, -.75); set(parts.handR, 0, .3, 0);
      set(parts.shoulderL, .1, 0, .3); set(parts.elbowL, -.25, 0, 0);
      set(parts.hipL, 0, 0, .04); set(parts.hipR, 0, 0, -.04);
    },
    kosuyor() { // near-profile run to the right
      root.rotation.y = 1.25; body.position.y = .06; torso.rotation.x = .2; head.rotation.set(-.12, .15, 0); hat.rotation.x = -.62;
      set(parts.hipL, -.95); set(parts.kneeL, .35); set(parts.ankleL, .3);
      set(parts.hipR, .75); set(parts.kneeR, 1.15); set(parts.ankleR, .2);
      set(parts.shoulderL, .95, 0, .12); set(parts.elbowL, -1.25);
      set(parts.shoulderR, -1.0, 0, -.12); set(parts.elbowR, -1.2);
    },
    zipliyor() { // mid-air, arms up
      root.rotation.y = .5; body.position.y = .42; head.rotation.set(-.12, 0, 0); hat.rotation.x = -.15;
      set(parts.shoulderL, 0, 0, 2.3); set(parts.elbowL, 0, 0, .25);
      set(parts.shoulderR, 0, 0, -2.3); set(parts.elbowR, 0, 0, -.25);
      set(parts.hipL, -.55, 0, .12); set(parts.kneeL, 1.15);
      set(parts.hipR, -.2, 0, -.12); set(parts.kneeR, 1.5);
    },
    uzunburun() { // caught lying: long nose, wide eyes, o-mouth, hand to cheek
      root.rotation.y = .9; head.rotation.set(.04, -.05, -.08); hat.rotation.x = -.4;
      eyes.forEach(e => e.scale.set(1.12, 1.18, 1)); smile.visible = false; oMouth.visible = true;
      nose.scale.z = 2.3; noseLeaf.visible = true;
      set(parts.shoulderR, -.35, 0, -.55); set(parts.elbowR, -2.3, 0, 0);
      set(parts.shoulderL, .15, 0, .45); set(parts.elbowL, 0, 0, .3);
    }
  };
  function setPose(name) { rest(); (poses[name] || poses.ayakta)(); }
  setPose('ayakta');
  return { root, parts, setPose, rest, materials: mat };
}

// Shared stage: soft clay lighting, contact shadow, transparent background.
function createStage(THREE, RoomEnvironment, canvas, { w, h, fov = 28 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .38;
  scene.add(new THREE.HemisphereLight('#fff4e6', '#9a6a50', .5));
  const key = new THREE.DirectionalLight('#fff0dc', 1.55); key.position.set(3, 6, 5); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 8; key.shadow.bias = -.0004;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 5, bottom: -2, near: .5, far: 20 });
  scene.add(key);
  const fill = new THREE.DirectionalLight('#ffe2cf', .55); fill.position.set(-5, 2.5, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 1.1); rim.position.set(-2, 4, -5); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: .2 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const camera = new THREE.PerspectiveCamera(fov, w / h, .1, 100);
  function frame(obj, pad = 1.12) {
    const box = new THREE.Box3().setFromObject(obj); box.min.y = Math.min(box.min.y, 0);
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    const vf = THREE.MathUtils.degToRad(fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    const d = Math.max(s.y / 2 / Math.tan(vf / 2), s.x / 2 / Math.tan(hf / 2)) * pad + s.z / 2;
    camera.position.set(c.x, c.y + s.y * .08, c.z + d); camera.lookAt(c);
  }
  return { renderer, scene, camera, frame, render: () => renderer.render(scene, camera) };
}

window.Pino = { createPino, createStage };
