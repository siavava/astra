<template>
  <canvas ref="canvas"/>
  <OptionsCard @speed-changed="onSpeedChange"/>
  <PlanetCard v-if="selectedPlanetCard != null" :planet-info="selectedPlanetCard" @close-card="selectedPlanetCard = null"/>
  <div class="date-display" :class="{disabled: idealizedSpeed}">
      <div class="ico">
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z" fill="#ffffff" class="fill-000000"/></svg>
      </div>
      <p>{{ date }}</p>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
// import PlanetCard from "./PlanetCard.vue";
// import { ref, reactive, computed, onMounted, defineEmits } from 'vue';

// import { PLANETS } from "../constants";
const { data } = await useAsyncData("planets", () => queryContent().where({ _path: "/bodies" }).findOne())

console.log(`data: ${JSON.stringify(data)}`)
const PLANETS = data.value.PLANETS;

const emits = defineEmits(['onSceneLoad']);
const loader = new GLTFLoader();

const canvas = ref(null);
const speed = ref(1);
const idealizedSpeed = ref(true);
const time = ref(0);
const selectedPlanetCard = ref(null);

const state = reactive({
  hoverObject: {
    planet: null,
    outline: null,
  },
  selectedPlanet: null,
  clickedPlanet: null,
});

const date = computed(() => {
  const date = new Date(time.value);
  return `${("0" + date.getDate()).slice(-2)}. ${("0" + (date.getMonth() + 1)).slice(-2)}. ${date.getFullYear()}`;
});

const onSpeedChange = (value) => {
  idealizedSpeed.value = false;
  switch(value) {
      case "realtime":
          speed.value = 1;
          break;
      case "day_sec": 
          speed.value = 86400;
          break;
      case "mon_sec":
          speed.value = 2419200;
          break;
      case "idealized":
          idealizedSpeed.value = true;
          break;
  }
};

const createScene = () => new THREE.Scene();
const createCamera = () => new THREE.PerspectiveCamera(47, window.innerWidth / window.innerHeight, 0.1, 1000);
const createBackgroundScene = () => {
  const backgroundScene = new THREE.Scene();
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './assets/universe.jpg',
    './assets/universe.jpg',
    './assets/universe.jpg',
    './assets/universe.jpg',
    './assets/universe.jpg',
    './assets/universe.jpg',
  ]);
  backgroundScene.background = texture;
  return backgroundScene;
};

const resizeRenderer = (renderer) => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const createRenderer = (scene, camera) => {
  const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      canvas: canvas.value,
      antialias: true,
      alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  resizeRenderer(renderer);
  renderer.autoClearColor = false;
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.render(scene, camera);
  return renderer;
};

const createControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enablePan = false;
  controls.minDistance = 60;
  controls.maxDistance = 500;
  controls.object.rotation.x = -0.841;
  controls.object.rotation.y = 0.528;
  controls.object.rotation.z = 0.513;
  controls.object.position.x = 98.467;
  controls.object.position.y = 125.67;
  controls.object.position.z = 112.32;
  return controls;
};

const setupLighting = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffe8e0, 1.5, 300);
  scene.add(pointLight);
  const textureLoader = new THREE.TextureLoader();
  const textureFlare0 = textureLoader.load("./assets/textures/lensflare0.png");
  const textureFlare1 = textureLoader.load("./assets/textures/lensflare1.png");
  const lensflare = new Lensflare();
  lensflare.layers.enable(1);
  lensflare.addElement(new LensflareElement(textureFlare0, 100));
  lensflare.addElement(new LensflareElement(textureFlare1, 40));
  pointLight.add(lensflare);

  const rectLights = [
      { position: [-12, 0, 0], lookAt: [0, 0, 0] },
      { position: [12, 0, 0], lookAt: [0, 0, 0] },
      { position: [0, 10, 12], lookAt: [0, 0, 0] },
      { position: [0, 10, -12], lookAt: [0, 0, 0] },
      { position: [0, -10, 12], lookAt: [0, 0, 0] },
      { position: [0, -10, -12], lookAt: [0, 0, 0] },
  ];

  rectLights.forEach(light => {
      const rectLight = new THREE.RectAreaLight(0xffffff, 7, 20, 25);
      rectLight.position.set(...light.position);
      rectLight.lookAt(...light.lookAt);
      scene.add(rectLight);
  });

  const dirLights = [
      { position: [-250, 15, 0], lookAt: [0, 0, 0] },
      { position: [250, 15, 0], lookAt: [0, 0, 0] },
      { position: [0, 15, -250], lookAt: [0, 0, 0] },
      { position: [0, 15, 250], lookAt: [0, 0, 0] },
  ];

  dirLights.forEach(light => {
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
      dirLight.position.set(...light.position);
      dirLight.lookAt(...light.lookAt);
      scene.add(dirLight);
  });
};

const getUserDataFor = (planet) => ({
  name: planet.name,
  displayName: planet.displayName,
  caption: planet.caption,
  description: planet.description,
  year: planet.year,
  day: planet.day,
  distanceFromSun: planet.distanceFromSun,
  distance: planet.distance,
  moons: planet.moons,
  meanTemp: planet.meanTemp,
  minTemp: planet.minTemp,
  maxTemp: planet.maxTemp,
  timesLarger: planet.timesLarger,
  orbitObject: planet.orbitObject,
  isPlanet: true,
  orbitalVelocity: planet.orbitalVelocity,
  orbitalRadius: planet.orbitalRadius,
  currentDistance: 2 * Math.PI * planet.orbitalRadius * Math.random(),
  currentRotation: 0,
  planetCircumference: 2 * Math.PI * planet.radius,
  orbitalCircumference: 2 * Math.PI * planet.orbitalRadius,
  scaledOrbitalRadius: planet.scaledOrbitalRadius,
  isPivot: false,
  radius: planet.radius,
  rotationVelocity: planet.rotationVelocity,
});

const createSolarSystem = async (scene) => {
  const planets = [];
  for (const planet of PLANETS) {
      const gltf = await loader.loadAsync(`./assets/gltf/${planet.name}.glb`);
      let updateObject;
      const userData = getUserDataFor(planet);
      if (planet.orbitObject != null) {
          const orbitObject = findOrbitObject(planets, planet.orbitObject);
          gltf.scene.position.z = planet.scaledOrbitalRadius;
          gltf.scene.rotation.z = THREE.MathUtils.degToRad(planet.axialTilt ?? 0);
          const pivot = new THREE.Object3D();
          pivot.name = planet.name;
          pivot.userData = userData;
          pivot.userData.isPivot = true;
          pivot.add(gltf.scene);
          pivot.rotation.x = THREE.MathUtils.degToRad(planet.orbitalInclination);
          updateObject = pivot;
          const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
          material.side = THREE.DoubleSide;
          material.transparent = true;
          material.opacity = 0.15;
          const trajectory = new THREE.Mesh(new THREE.TorusGeometry(planet.scaledOrbitalRadius, 0.05, 8, 64), material);
          trajectory.rotation.x = THREE.MathUtils.degToRad(90);
          pivot.add(trajectory);
          gltf.scene.children[0].userData.trajectory = trajectory;
          gltf.scene.children[0].userData.canHover = true;
          orbitObject.add(pivot);
          planets.push(pivot);
      } else {
          const group = new THREE.Group();
          gltf.scene.rotation.z = THREE.MathUtils.degToRad(planet.axialTilt ?? 0);
          group.add(gltf.scene);
          group.userData = userData;
          gltf.scene.userData.canHover = true;
          group.name = planet.name;
          updateObject = group;
          scene.add(group);
          planets.push(group);
      }
      createUpdateLoop(updateObject);
  }
  return planets;
};

const findOrbitObject = (planets, name) => {
  const planet = planets.find(p => p.name === name);
  if (planet.userData.isPivot) {
      return planet.children.find(p => !p.userData.isPivot);
  }
  return planet;
};

const findMeshPlanet = (mesh) => {
  if (mesh.userData.isPlanet) return mesh;
  return mesh.parent == null ? null : findMeshPlanet(mesh.parent);
};

const createUpdateLoop = (planet) => {
  planet.tick = (e) => {
      if (planet.userData.orbitalRadius !== 0) {
          planet.userData.currentDistance += idealizedSpeed.value
              ? Math.max((e * planet.userData.orbitalVelocity * planet.userData.orbitalRadius / 100), 6000)
              : (planet.userData.orbitalVelocity * e) * speed.value;
          if (planet.userData.currentDistance > planet.userData.orbitalCircumference) {
              planet.userData.currentDistance = planet.userData.currentDistance % planet.userData.orbitalCircumference;
          }
          planet.rotation.y = planet.userData.currentDistance / planet.userData.orbitalCircumference * Math.PI * 2;
      }
      planet.userData.currentRotation += idealizedSpeed.value
          ? (planet.userData.planetCircumference * e * 0.1)
          : (planet.userData.rotationVelocity * e) * speed.value;
      const rY = planet.userData.currentRotation / planet.userData.planetCircumference * Math.PI * 2;
      if (planet.userData.isPivot) {
          planet.children[0].children[0].rotation.y = rY;
      } else {
          planet.children[0].rotation.y = rY;
      }
  };
};

const highlightPlanet = (mesh) => {
  if (!mesh.parent.userData.canHover) return;
  mesh.parent.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
          child.material.emissive = new THREE.Color(0x404040);
          child.material.emissiveIntensity = 1.31;
      }
  });
  const trajectory = mesh.parent.userData.trajectory;
  if (trajectory) {
      trajectory.material.opacity = 1;
  }
  return null;
};

const unhighlightPlanet = (mesh) => {
  if (!mesh?.parent.userData.canHover) return;
  mesh.parent.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
          child.material.emissive = new THREE.Color(0x000000);
      }
  });
  const trajectory = mesh.parent.userData.trajectory;
  if (trajectory) {
      trajectory.material.opacity = 0.15;
  }
};

onMounted(async () => {
  time.value = Date.now();
  const scene = createScene();
  const bacakgroundScene = createBackgroundScene();
  const camera = createCamera();
  const renderer = createRenderer(scene, camera);
  setupLighting(scene);
  const controls = createControls(camera, renderer);
  const planets = await createSolarSystem(scene);
  const clock = new THREE.Clock();
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  THREE.Object3D.prototype.tick = (e) => { };

  renderer.autoClear = false;
  camera.layers.enable(1);
  renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      planets.forEach(planet => planet.tick(delta));
      if (state.selectedPlanet) {
          state.selectedPlanet.children[0].getWorldPosition(controls.target);
      }
      controls.update();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets, true);
      if (intersects.length > 0 && state.hoverObject.planet == null) {
          state.hoverObject.planet = intersects[0].object;
          state.hoverObject.outline = highlightPlanet(intersects[0].object);
      }
      else if (intersects.length > 0 && state.hoverObject.planet !== intersects[0].object) {
          unhighlightPlanet(state.hoverObject.planet);
          state.hoverObject.planet = intersects[0].object;
          state.hoverObject.outline = highlightPlanet(intersects[0].object);
      }
      else if (intersects.length === 0 && state.hoverObject.planet != null) {
          unhighlightPlanet(state.hoverObject.planet);
          state.hoverObject.planet = null;
          state.hoverObject.outline = null;
      }
      if (!idealizedSpeed.value) time.value += speed.value * 1000 * delta;
      renderer.clear();
      camera.layers.set(1);
      renderer.render(bacakgroundScene, camera);
      renderer.render(scene, camera);
      camera.layers.set(0);
      renderer.render(scene, camera);
  });

  window.onresize = () => {
      resizeRenderer(renderer);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  };

  canvas.value.addEventListener("mousemove", (e) => {
      e.preventDefault();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  canvas.value.addEventListener("mousedown", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (state.hoverObject.planet != null) {
          const planet = findMeshPlanet(state.hoverObject.planet);
          if (planet) state.clickedPlanet = planet.name;
      }
  });

  canvas.value.addEventListener("mouseup", (e) => {
      if (!state.clickedPlanet) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (state.hoverObject.planet != null) {
          const planet = findMeshPlanet(state.hoverObject.planet);
          if (planet.name !== state.clickedPlanet) {
              state.clickedPlanet = null;
              return;
          }
          if (planet.name === "sun") {
              controls.minDistance = 60;
              controls.maxDistance = 500;
              controls.target.set(0, 0, 0);
          } else {
              const box = new THREE.Box3().setFromObject(planet.children[0].children[0]);
              const diameter = Math.abs(box.max.x - box.min.x);
              controls.minDistance = diameter * 1.25;
              controls.maxDistance = diameter * 2.5;
          }
          selectedPlanetCard.value = planet.userData;
          state.selectedPlanet = planet;
          state.clickedPlanet = null;
      }
  });

  emits('onSceneLoad');
});
</script>

<style lang="sass" scoped>
canvas
  width: 100vw
  height: 100vh

.date-display
  position: absolute
  top: 0
  left: 0
  padding: 1em
  display: flex
  gap: 8px

  &.disabled
    opacity: 0.2

@media (max-width: 560px)
  .date-display 
    top: 16px

</style>
