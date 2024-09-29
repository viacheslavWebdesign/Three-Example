import * as THREE from './three.module.min.js';
import { SVGLoader } from './SVGLoader.js';

document.addEventListener("DOMContentLoaded", function(){

const sizes = {
   width: 700,
   height: 700,
};

const scene = new THREE.Scene();
const spot = document.querySelector('.spot');

const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height);
camera.position.set(0, 0, 380);
scene.add(camera);

const loader = new SVGLoader();
let spotElement;
let spotGroup = new THREE.Group();
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
            mesh.scale.y = -0.9;
            spotElement = mesh;
            const box = new THREE.Box3().setFromObject(spotElement);
            const center = new THREE.Vector3();
            box.getCenter(center);
            spotElement.position.sub(center);
            spotGroup.add(spotElement);
            scene.add(spotGroup);
        });
    });
});


const renderer = new THREE.WebGLRenderer({ canvas: spot, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);


const clock = new THREE.Clock();

const tick = () => {
   const elapsedTime = clock.getElapsedTime();
   spotGroup.rotation.x = Math.sin(elapsedTime / 2) * Math.PI / 24;
   spotGroup.rotation.z = Math.cos(elapsedTime / 16);
   spotGroup.scale.x = 0.95 - Math.sin(elapsedTime / 2) * 0.05;
   spotGroup.scale.y = 0.85 - Math.cos(elapsedTime / 2) * 0.25;
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

});