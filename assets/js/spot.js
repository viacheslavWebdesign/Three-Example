import * as THREE from './three.module.min.js';
import { SVGLoader } from './SVGLoader.js';

document.addEventListener("DOMContentLoaded", function(){

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight,
};

const scene = new THREE.Scene();
const spot = document.querySelector('.spot');

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
if (window.innerWidth > 576){
    camera.position.set(-100, 0, 800);
} else {
    camera.position.set(-250, 0, 800);
}
scene.add(camera);

const loader = new SVGLoader();
loader.load('./assets/img/spot.svg', (data) => {
    const paths = data.paths;
    paths.forEach((path) => {
        const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        });
    });
});


const renderer = new THREE.WebGLRenderer({ canvas: spot, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const rotationAmplitude = Math.PI / 6;
const scaleAmplitude = 0.001;
const scaleAmplitude2 = 0.25;
const rotationSpeed = 0.005;
let time = 0;

const tick = () => {
   time += rotationSpeed;
   scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
         object.rotation.x = Math.sin(time) * rotationAmplitude;
         object.rotation.y = Math.cos(time) * rotationAmplitude;

         object.rotation.z = Math.sin(time) * rotationAmplitude + Math.PI * 0.65;
         const scaleValue = 1 + Math.sin(time) * scaleAmplitude;
         const scaleValue2 = 1 + Math.sin(time) * scaleAmplitude2;
         object.scale.set(scaleValue * 0.9, scaleValue2, 1);
      }
   });

	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

});