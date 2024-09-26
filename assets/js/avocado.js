import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js'
import { GLTFLoader } from './GLTFLoader.js';
import TWEEN from './tween.module.js';

document.addEventListener("DOMContentLoaded", function() {


let lastScrollTime = 0;
const SCROLL_DELAY = 2000;

let currentIndex = 0;

let rotationAvocadoRunning = false;
let rotationAvocado;

function getCurrentSlideIndex() {
   const slides = document.querySelectorAll('.slide');
   for (let i = 0; i < slides.length; i++) {
       if (slides[i].classList.contains('active')) {
           return i;
       }
   }
   return -1;
}

function handleScroll(event) {
   const currentTime = new Date().getTime();
   if (currentTime - lastScrollTime < SCROLL_DELAY) {
       return;
   }
   lastScrollTime = currentTime;

   const activeSlide = document.querySelector('.slide.active');
   const nextSlide = activeSlide.nextElementSibling;
   const prevSlide = activeSlide.previousElementSibling;

   if (event.deltaY > 0) {
       if (nextSlide && nextSlide.classList.contains('next')) {
           if (!prevSlide) {
               activeSlide.classList.remove('active');
               activeSlide.classList.add('prev');
               nextSlide.classList.remove('next');
               nextSlide.classList.add('active');

               const newNextSlide = nextSlide.nextElementSibling;
               if (newNextSlide) {
                   newNextSlide.classList.add('next');
               }
           } else {
               prevSlide.classList.remove('prev');
               activeSlide.classList.remove('active');
               activeSlide.classList.add('prev');
               nextSlide.classList.remove('next');
               nextSlide.classList.add('active');

               const newNextSlide = nextSlide.nextElementSibling;
               if (newNextSlide) {
                   newNextSlide.classList.add('next');
               }
           }
       }
   } else {
       if (prevSlide && prevSlide.classList.contains('prev')) {
           if (!nextSlide && prevSlide && prevSlide.classList.contains('prev')) {
               prevSlide.classList.remove('prev');
               prevSlide.classList.add('active');
               activeSlide.classList.remove('active');
               activeSlide.classList.add('next');

               const newPrevSlide = prevSlide.previousElementSibling;
               if (newPrevSlide) {
                   newPrevSlide.classList.add('prev');
               }
           } else if (prevSlide && prevSlide.classList.contains('prev')) {
               nextSlide.classList.remove('next');
               activeSlide.classList.remove('active');
               activeSlide.classList.add('next');
               prevSlide.classList.remove('prev');
               prevSlide.classList.add('active');

               const newPrevSlide = prevSlide.previousElementSibling;
               if (newPrevSlide) {
                   newPrevSlide.classList.add('prev');
               }
           }
       }
   }

   currentIndex = getCurrentSlideIndex();
   if (currentIndex === 0) {
       stopAvocadoRotation();
       controls.enabled = true;
       new TWEEN.Tween(camera.position)
           .to({ x: 0, y: 0, z: 1 }, 1000)
           .easing(TWEEN.Easing.Quadratic.Out)
           .start();
       new TWEEN.Tween(avocado.position)
           .to({ x: 0, y: 0 }, 1000)
           .easing(TWEEN.Easing.Quadratic.Out)
           .start();
       new TWEEN.Tween(avocado.scale)
           .to({ x: 1, y: 1, z: 1 }, 1000)
           .easing(TWEEN.Easing.Quadratic.Out)
           .start();
       new TWEEN.Tween(avocado.rotation)
           .to({ y: 0 }, 1000)
           .easing(TWEEN.Easing.Quadratic.Out)
           .start();
   } else {
       controls.enabled = false;
       stopAvocadoRotation();
       new TWEEN.Tween(camera.position)
           .to({ x: 0, y: 0, z: 1 }, 1000)
           .easing(TWEEN.Easing.Quadratic.Out)
           .start();
       if (currentIndex === 1) {
           new TWEEN.Tween(avocado.rotation)
               .to({ y: Math.PI * 1.75 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .onComplete(startAvocadoRotation)
               .start();
            if (window.innerWidth >= 1024){
               new TWEEN.Tween(avocado.scale)
                  .to({ x: 1.5, y: 1.5, z: 1.5 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
               new TWEEN.Tween(avocado.position)
                  .to({ x: 0.75 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
            } else if (window.innerWidth > 576 && window.innerWidth < 1024){
               new TWEEN.Tween(avocado.scale)
                  .to({ x: 1.5, y: 1.5, z: 1.5 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
               new TWEEN.Tween(avocado.position)
                  .to({ x: 0, y: 0.5 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
            } else if (window.innerWidth <= 576){
               new TWEEN.Tween(avocado.position)
                  .to({ x: 0, y: 0.6 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
            }
       } else if (currentIndex === 2) {
           new TWEEN.Tween(avocado.rotation)
               .to({x: 0, y: Math.PI * -1.75, z: 0 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .onComplete(startAvocadoRotation)
               .start();
            if (window.innerWidth >= 1024){
               new TWEEN.Tween(avocado.scale)
                  .to({ x: 1.5, y: 1.5, z: 1.5 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
               new TWEEN.Tween(avocado.position)
                  .to({ x: -0.75 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
            } else if (window.innerWidth > 576 && window.innerWidth < 1024){
               new TWEEN.Tween(avocado.scale)
                  .to({ x: 1.5, y: 1.5, z: 1.5 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
               new TWEEN.Tween(avocado.position)
                  .to({ x: 0, y: -0.5 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
            } else if (window.innerWidth <= 576){
               new TWEEN.Tween(avocado.scale)
                  .to({ x: 1, y: 1, z: 1 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
               new TWEEN.Tween(avocado.position)
                  .to({ x: 0, y: -0.7 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
            }
       } else if (currentIndex === 3) {
         if (window.innerWidth >= 1024){
            new TWEEN.Tween(avocado.scale)
               .to({ x: 5, y: 5, z: 5 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
            new TWEEN.Tween(avocado.position)
               .to({ x: -0.75, y: 0 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
            new TWEEN.Tween(avocado.rotation)
               .to({ x: 0, y: Math.PI * 2.5,  z: Math.PI * 0.15 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
         } else if (window.innerWidth > 576 && window.innerWidth < 1024){
            new TWEEN.Tween(avocado.scale)
               .to({ x: 5, y: 5, z: 5 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
            new TWEEN.Tween(avocado.position)
               .to({ x: -0.75, y: -0.75 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
            new TWEEN.Tween(avocado.rotation)
               .to({ x: Math.PI * 0.25, y: Math.PI * 2.5,  z: Math.PI * 0.25 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
         } else if (window.innerWidth <= 576){
            new TWEEN.Tween(avocado.scale)
               .to({ x: 3, y: 3, z: 3 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
            new TWEEN.Tween(avocado.position)
               .to({ x: -0.6, y: -0.8 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
            new TWEEN.Tween(avocado.rotation)
               .to({ x: Math.PI * 0.25, y: Math.PI * 2.5,  z: Math.PI * 0.25 }, 1000)
               .easing(TWEEN.Easing.Quadratic.Out)
               .start();
         }
       } else if (currentIndex === 4) {
         new TWEEN.Tween(avocado.position)
             .to({ x: 0, y: -1 }, 1000)
             .easing(TWEEN.Easing.Quadratic.Out)
             .start();
         new TWEEN.Tween(avocado.scale)
             .to({ x: 7, y: 7, z: 7 }, 1000)
             .easing(TWEEN.Easing.Quadratic.Out)
             .start();
         new TWEEN.Tween(avocado.rotation)
             .to({ x: Math.PI * -0.65,  y: 0,  z: Math.PI * 0.5 }, 1000)
             .easing(TWEEN.Easing.Quadratic.Out)
             .start();
         showGuide(1000);
       }
   }
}

function startAvocadoRotation() {
   if (!rotationAvocadoRunning) {
       rotationAvocadoRunning = true;
       rotationAvocado = new TWEEN.Tween(avocado.rotation)
           .to({ y: avocado.rotation.y + Math.PI * 2 }, 10000)
           .easing(TWEEN.Easing.Quadratic.Linear)
           .onComplete(() => {
               if (rotationAvocadoRunning) {
                  rotationAvocadoRunning = false;
                   startAvocadoRotation();
               }
           })
           .start();
   }
}

function stopAvocadoRotation() {
   rotationAvocadoRunning = false;
   if (rotationAvocado) {
       rotationAvocado.stop();
   }
}

setTimeout(() => {
   window.addEventListener('wheel', handleScroll);
 }, 6000);

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight,
};

const cursor = {
   x: 0,
   y: 0,
}

const scene = new THREE.Scene();


const slidePrompt = document.querySelector('.slide-prompt');
const slidePromptText = slidePrompt.textContent;
slidePrompt.textContent = '';
function showPrompt(delayStart = 0){ 
   slidePromptText.split('').forEach((char, index) => {
      const slidePromptChar = document.createElement('span');
      slidePromptChar.textContent = char;
      slidePromptChar.style.opacity = 0;
      slidePrompt.appendChild(slidePromptChar);

      const animatePrompt = new TWEEN.Tween({ opacity: 0 })
      .to({ opacity: 1 }, 500)
      .delay(index * 50)
      .onUpdate(function (object) {
         slidePromptChar.style.opacity = object.opacity;
      });

      setTimeout(() => {
         animatePrompt.start();
       }, delayStart);
   });
}

const slideGuide = document.querySelector('.slide-guide');
const slideGuideText = slideGuide.textContent;
slideGuide.textContent = '';

const characters = slideGuideText.split('').map((char) => {
    const slideGuideChar = document.createElement('span');
    slideGuideChar.textContent = char;
    slideGuideChar.style.opacity = 0;
    slideGuide.appendChild(slideGuideChar);
    return slideGuideChar;
});

function showGuide(delayStart = 0) {
    characters.forEach((slideGuideChar, index) => {
        const animateGuide = new TWEEN.Tween({ opacity: 0 })
            .to({ opacity: 1 }, 500)
            .delay(index * 50)
            .onUpdate(function (object) {
                slideGuideChar.style.opacity = object.opacity;
            });
        setTimeout(() => {
            animateGuide.start();
        }, delayStart);
    });
}

let avocadoModel;
let avocado = new THREE.Group();
const loader = new GLTFLoader();
loader.load(
   './assets/models/Avocado/Avocado.gltf', (gltf) => {
      avocadoModel = gltf.scene.children[0];
      avocadoModel.scale.set(5,5,5);
      const box = new THREE.Box3().setFromObject(avocadoModel);
      const center = new THREE.Vector3();
      box.getCenter(center);
      avocadoModel.position.sub(center);
      avocado.add(avocadoModel);
      scene.add(avocado);

      avocado.position.y = 2;
      avocado.rotation.y = Math.PI * 8;

      const slideEntry = document.querySelectorAll('.slide')[0];
      if (slideEntry) {
            slideEntry.classList.add('entry');
      }
      
      setTimeout(() => {
         new TWEEN.Tween(avocado.rotation)
             .to({ y: 0 }, 2000)
             .easing(TWEEN.Easing.Quadratic.Out)
             .start();


         new TWEEN.Tween(avocado.position)
             .to({ y: -0.025 }, 2000)
             .easing(TWEEN.Easing.Quadratic.Out)
             .onComplete(() => {
                 new TWEEN.Tween(avocado.position)
                     .to({ y: 0 }, 500)
                     .easing(TWEEN.Easing.Quadratic.Out)
                     .start()
                     .onComplete(() => {
                         showPrompt(1000);
                     });
             })
             .start();
     }, 1000);
   }
);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfff8d4, 2);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const light = new THREE.AmbientLight(0xfff8d4, 1);
scene.add(light);


const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height);
camera.position.set(0, 0, 1);
scene.add(camera);

const canvas = document.querySelector('.avocado');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

window.addEventListener('mousemove', (event) => {
   if (currentIndex !== 0 && currentIndex !== 4){
      if (window.innerWidth >= 1024){
         cursor.x = -(event.clientX / sizes.width - 0.5);
         cursor.y = event.clientY / sizes.height - 0.5;
      }
   }
});

const tick = () => {
   const targetX = cursor.x * 0.5;
   const targetY = cursor.y * 0.5;

   if (currentIndex !== 0 && currentIndex !== 4){
      if (window.innerWidth >= 1024){
         camera.position.x += (targetX - camera.position.x) * 0.1;
         camera.position.y += (targetY - camera.position.y) * 0.1;
      }
   }

   TWEEN.update();
   controls.update();
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