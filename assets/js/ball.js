const sizes = {
   width: window.innerWidth,
   height: window.innerHeight,
};

const cursor = {
   x: 0,
   z: 0,
}
/*
 *
 * SET UP MOTION PARAMS
 *
 */

var degrees = 0;
var power = 0;
var directionX = 1;
var directionY = 1;
var canBeAnimated = true;

var wrap = document.getElementsByClassName('capabilities-wrap')[0];

var angleRad = degrees * Math.PI / 180;
var velocityX = Math.cos(angleRad) * power;
var velocityY = Math.sin(angleRad) * power;
var velocityZ = 1;

var friction = 0.987;
var gravity = 1;
var bounciness = 0;

var ballRadius = 3.5;
var ballCircumference = Math.PI * ballRadius * 2;
var ballVelocity = new THREE.Vector3();
var ballRotationAxis = new THREE.Vector3(0, 1, 0);

var ball = null;
var interaction = null;

var gWidth = $(wrap).width();
var gHeight = $(wrap).height();
var ratio = gWidth / gHeight;
var renderer;
var canv;
var camera;

var withDescBlock = $(wrap).hasClass('with-desc');

var borders = [20, 15.4];

/**
------------------------------------
 **/
Math.degrees = function(radians) {
    return radians*(180/Math.PI);
}

var x1, x2, y1, y2;

function getAngle (x1, y1, x2, y2) {
    var distY = Math.abs(y2-y1); //opposite
    var distX = Math.abs(x2-x1); //adjacent
    var dist = Math.sqrt((distY*distY)+(distX*distX)); //hypotenuse,
    if (distY !== 0 && dist !== 0) {
        var val = distY/dist;
        var aSine = Math.asin(val);
        return Math.degrees(aSine);
    } else {
        return false;
    }
}

function getPower (x1, y1, x2, y2) {
    var distY = Math.abs(y2-y1);
    var distX = Math.abs(x2-x1);
    var dist = Math.sqrt((distY*distY)+(distX*distX));

    return dist;
}
/**
 ------------------------------------
 **/

window.onload = function() {
    /*
     * SET UP
     */
    //set the scene
    var scene = new THREE.Scene();

    //set the camera
    camera = new THREE.PerspectiveCamera(35, ratio, 0.1, 1000);
    camera.position.z = 50;

    //set the light
    var light = new THREE.SpotLight(0xffffff, 0.8);
    light.castShadow = true;
    light.position.set(30, 30, 200);
    scene.add(light);

    var light2 = new THREE.AmbientLight( 0xfff8d4, 1);
    scene.add( light2 );

    //  set the renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor( 0x000000, 0 );

    renderer.setSize(gWidth, gHeight);
    wrap.appendChild(renderer.domElement);

    /*
     * ADD MESH TO SCENE
     */
    //make a checkerboard texture for the ball...
    canv = document.createElement('canvas')
    canv.width = gWidth;
    canv.height = gHeight;

    interaction = new THREE.Interaction(renderer, scene, camera);

   const textureLoader = new THREE.TextureLoader();
   const texture = textureLoader.load('/assets/textures/grass.jpg');
   texture.wrapS = THREE.RepeatWrapping;
   texture.wrapT = THREE.RepeatWrapping;
   texture.repeat.set( 4, 4 );

   const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
         map: texture,
      }),
   );
   floor.position.set(0,0,0);
   floor.receiveShadow = true;
   scene.add(floor);

    //add ball
    var loader = new THREE.GLTFLoader();

    loader.load('/assets/models/SoccerBall/soccer_ball.gltf', function ( gltf ) {
        ball = gltf.scene.children[0];
        ball.receiveShadow = true;
        scene.add(ball);

        ball.scale.x = 2;
         ball.scale.y = 2;
         ball.scale.z = 2;
         ball.position.x = 0;
         ball.position.y = 0;

        ball.on('mousemove', function(ev) {
            if (canBeAnimated) {
                angleRad = degrees * Math.PI / 180;
                velocityX = Math.cos(angleRad) * power;
                velocityY = Math.sin(angleRad) * power;

                velocityX *= directionX;
                velocityY *= directionY;

                canBeAnimated = false;
            }
        });
        ball.on('touchstart', function(ev) {
            x2 = ev.intersects[0].point.x * 4;
            y2 = ev.intersects[0].point.y;

            x1 = ev.intersects[1].point.x * 4;
            y1 = ev.intersects[1].point.y;

            if (y2-y1 < 0) {
                directionY = -1;
            } else {
                directionY = 1;
            }

            if (x2-x1 < 0) {
                directionX = -1;
            } else {
                directionX = 1;
            }

            var angle = getAngle(x1, y1, x2, y2);
            if (angle !== false) {
                degrees = angle;
            }

            var pwr = getPower(x1, y1, x2, y2);
            if (!isNaN(pwr)) {
                if (pwr > 1) {
                    pwr = 1;
                }

                if (pwr < 0) {
                    pwr = 0;
                }

                power = pwr;
            }

            if (canBeAnimated) {
                angleRad = degrees * Math.PI / 180;
                velocityX = Math.cos(angleRad) * power;
                velocityY = Math.sin(angleRad) * power;

                velocityX *= directionX;
                velocityY *= directionY;

                canBeAnimated = false;
            }
        });

        /*
         * setting up rotation axis
         */
        var rotation_matrix = null;

        var setQuaternions = function() {
            setMatrix();
            ball.rotation.set(Math.PI * 0.55, Math.PI * 0.1, Math.PI * 1.9); // Set initial rotation
            ball.matrix.makeRotationFromEuler(ball.rotation); // Apply rotation to the object's matrix
        }

        var setMatrix = function() {
            rotation_matrix = new THREE.Matrix4().makeRotationZ(angleRad); // Animated rotation will be in .01 radians along object's X axis
        }

        setQuaternions();

        render();
    } );


    /*
     *
     * ANIMATION STEP
     *
     */
    var render = function() {
        // add velocity to ball
        ball.position.x += velocityX;
        ball.position.z += velocityZ;
        ball.position.y += velocityY;

        //validate if ball is stop moving
        if (Math.abs(velocityX) < 0.4 && Math.abs(velocityY) < 0.4) {
            canBeAnimated = true;
        }

        // handle boucing effect
        if (ball.position.z < 1) {
            velocityZ *= -bounciness;
            ball.position.z = 1;
        }

        // Figure out the rotation based on the velocity and radius of the ball...
        ballVelocity.set(velocityX, velocityY, velocityZ);
        ballRotationAxis.set(0, 0, 1).cross(ballVelocity).normalize();
        var velocityMag = ballVelocity.length();
        var rotationAmount = velocityMag * (Math.PI * 2) / ballCircumference;
        ball.rotateOnWorldAxis(ballRotationAxis, rotationAmount)

        //reducing speed by friction
        angleRad *= friction;
        velocityX *= friction;
        velocityY *= friction;
        velocityZ *= friction;

        //validate ball is withing its borders otherwise go in the mirror direction
        if (Math.abs(ball.position.x) > borders[0]) {
            velocityX *= -1;
            ball.position.x = (ball.position.x < 0) ? borders[0] * -1 : borders[0];
        }

        if (Math.abs(ball.position.y) > borders[1]) {
            velocityY *= -1;
            ball.position.y = (ball.position.y < 0) ? borders[1] * -1 : borders[1];
        }

        // reduce ball height with gravity
        velocityZ -= gravity;

        //render the page
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    const tick = () => {
      camera.position.x = cursor.x;
      camera.position.y = cursor.y;
   
      
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
   };
   
   tick();
}

$(wrap).mousemove(function(e) {
    x2 = x1;
    y2 = y1;

    x1 = e.pageX;
    y1 = e.pageY;

    if (x2 == undefined) {
        x2 = x1;
    }

    if (y2 == undefined) {
        y2 = y1;
    }

    if (y2-y1 < 0) {
        directionY = -1;
    } else {
        directionY = 1;
    }

    if (x2-x1 < 0) {
        directionX = 1;
    } else {
        directionX = -1;
    }

    var angle = getAngle(x1, y1, x2, y2);
    if (angle !== false) {
        degrees = angle;
    }

    var pwr = getPower(x1, y1, x2, y2);

    if (!isNaN(pwr)) {
        pwr /= 10;

        if (pwr > 1) {
            pwr = 1;
        }

        if (pwr < 0) {
            pwr = 0;
        }

        power = pwr;
    }
});

window.addEventListener('resize', function(event){
    gWidth = $(wrap).width();
    gHeight = $(wrap).height();
    ratio = gWidth / gHeight;
    camera.aspect = ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(gWidth, gHeight);
    canv.width = gWidth;
    canv.height = gHeight;

    borders = [27.5, 9.5];

    ball.scale.x = 1;
   ball.scale.y = 1;
   ball.scale.z = 1;
});

window.addEventListener('mousemove', (event) => {
   cursor.x = event.clientX / sizes.width;
   cursor.y = -(event.clientY / sizes.height);
});