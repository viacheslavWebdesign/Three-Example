import * as THREE from '/assets/js/three.module.min.js';
import { GLTFLoader } from '/assets/js/GLTFLoader.js';
import TWEEN from '/assets/js/tween.module.js';

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight,
};

const cursor = {
   x: 0,
   y: 0,
}

const loopScene = new THREE.Scene();

const loopGeometry = new THREE.TorusKnotGeometry(1, 0.5, 100, 16);
const loopMaterial = new THREE.MeshBasicMaterial({
   color: 'green',
   wireframe: true,
});
const loopMesh = new THREE.Mesh(loopGeometry, loopMaterial);
loopScene.add(loopMesh);

const loopCamera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height);
loopCamera.position.set(0, 0, 1);
loopScene.add(loopCamera);

const loopCanvas = document.querySelector('.loop');
const loopRenderer = new THREE.WebGLRenderer({ canvas: loopCanvas });
loopRenderer.setSize(sizes.width, sizes.height);
loopRenderer.render(loopScene, loopCamera);

window.addEventListener('mousemove', (event) => {
   cursor.x = event.clientX / sizes.width - 0.5;
   cursor.y = -(event.clientY / sizes.height - 0.5);
});

const rotateLoopMesh = () => {
   new TWEEN.Tween(loopMesh.rotation)
      .to({ y: loopMesh.rotation.y + Math.PI * 2 }, 50000)
      .easing(TWEEN.Easing.Quadratic.Linear)
      .onComplete(rotateLoopMesh)
      .start();
};

rotateLoopMesh();

const tick = () => {
   loopCamera.position.x = cursor.x;
   loopCamera.position.y = cursor.y;
   TWEEN.update();
	loopRenderer.render(loopScene, loopCamera);
	window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	loopCamera.aspect = sizes.width / sizes.height;
	loopCamera.updateProjectionMatrix();
	loopRenderer.setSize(sizes.width, sizes.height);
	loopRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	loopRenderer.render(loopScene, loopCamera);
});