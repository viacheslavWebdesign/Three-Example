import * as THREE from '/assets/js/three.module.min.js';
import { GLTFLoader } from '/assets/js/GLTFLoader.js';
import TWEEN from '/assets/js/tween.module.js';

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight,
};

const cursor = {
   x: 0,
   z: 0,
}

const scene = new THREE.Scene();
const canvas = document.querySelector('.canvas');

const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height);
camera.position.set(0, 10, 0);
camera.rotation.x = -(Math.PI / 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const tubeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
const tubeMaterial = new THREE.MeshBasicMaterial({
   color: 'white',
});
const tube1 = new THREE.Mesh(tubeGeometry, tubeMaterial);
tube1.position.set(5, 0, 0);

const tube2 = tube1.clone();
tube2.position.set(-5, 0, 0);

const tube3 = tube1.clone();
tube3.position.set(0, 3, 0);
tube3.scale.set(1, 1.7, 1);
tube3.rotation.z = Math.PI / 2;

const goal = new THREE.Group();
goal.add(tube1, tube2, tube3);
goal.position.set(0, 0, -6.5);
scene.add(goal);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/assets/textures/grass.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

const floor = new THREE.Mesh(
   new THREE.PlaneGeometry(50, 50),
   new THREE.MeshStandardMaterial({
      map: texture,
   }),
);
floor.position.set(0,0,0);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfff8d4, 2);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const light = new THREE.DirectionalLight(0xfff8d4, 1);
light.position.set(0, 1, 0);
light.castShadow = true;
scene.add(light);


let soccerBall;

const loader = new GLTFLoader();
loader.load(
   '/assets/models/SoccerBall/soccer_ball.gltf', (gltf) => {
      soccerBall = gltf.scene.children[0];
      soccerBall.receiveShadow = true;
      scene.add(soccerBall);
   }
);

window.addEventListener('mousemove', (event) => {
   cursor.x = event.clientX / sizes.width - 0.5;
   cursor.z = event.clientY / sizes.height - 0.5;
});

const clock = new THREE.Clock();
let intersections = [];

const tick = () => {
   const delta = clock.getDelta();
   TWEEN.update();

   if (intersections.length > 0){
      soccerBall.rotation.x += -delta * 2;
   }

   camera.position.x = cursor.x;
   camera.position.z = cursor.z;
   
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();

const raycaster = new THREE.Raycaster();
const handleClick = (event) => {
   const pointer = new THREE.Vector2();
   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
   pointer.y = (event.clientY / window.innerHeight) * 2 - 1;

   raycaster.setFromCamera(pointer, camera);
   intersections = raycaster.intersectObject(soccerBall);
   new TWEEN.Tween(soccerBall.position).to({
      x: 0,
      y: 2,
      z: -11,
   }, 3000).easing(TWEEN.Easing.Exponential.Out).start();
};

window.addEventListener('click', handleClick);

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});