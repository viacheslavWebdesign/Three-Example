import * as THREE from './three.module.min.js';
import { SVGLoader } from './SVGLoader.js';

document.addEventListener("DOMContentLoaded", function() {
    const sizes = {
        width: 700,
        height: 700,
    };

    const scene = new THREE.Scene();
    const spot = document.querySelector('.spot');

    const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height);
    camera.position.set(130, 0, 370);
    scene.add(camera);

    const loader = new SVGLoader();
    let spotGroup = new THREE.Group();
    
    loader.load('./assets/img/spot.svg', (data) => {
        const paths = data.paths;
        paths.forEach((path) => {
            const shapes = SVGLoader.createShapes(path);
            shapes.forEach((shape) => {
                const geometry = new THREE.ShapeGeometry(shape);
                const color = new THREE.Color(path.color).toArray();
                const vertexShader = `
                    uniform float uTime;
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;
                        vec4 pos = vec4(position, 1.0);
                        pos.x = pos.x * 2.0 - 1.0;
                        pos.y += sin(uTime * 3.0 + pos.x * 0.01) / 0.07;
                        gl_Position = projectionMatrix * modelViewMatrix * pos;
                    }
                `;

                const fragmentShader = `
                    varying vec2 vUv;
                    uniform vec3 uColor;

                    void main() {
                        gl_FragColor = vec4(uColor, 1.0);
                    }
                `;

                const material = new THREE.ShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    uniforms: {
                        uColor: { value: new THREE.Vector3(color[0], color[1], color[2]) },
                        uTime: { value: 0 },
                    },
                    side: THREE.DoubleSide,
                    depthWrite: false,
                });

                const mesh = new THREE.Mesh(geometry, material);
                
                mesh.scale.set(0.5, 0.5, 0.5);
                mesh.scale.y = -1;

                const box = new THREE.Box3().setFromObject(mesh);
                const center = new THREE.Vector3();
                box.getCenter(center);
                mesh.position.sub(center);
                spotGroup.add(mesh); 
            });
        });

        scene.add(spotGroup);
    });

    const renderer = new THREE.WebGLRenderer({ canvas: spot, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        spotGroup.children.forEach(mesh => {
            if (mesh.material.uniforms) {
                mesh.material.uniforms.uTime.value = elapsedTime;
            }
        });
        camera.rotation.z = -(elapsedTime / 8);

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