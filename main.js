import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';


////////////////////////ESCENA//////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.fog = new THREE.FogExp2(0x2E2E2E, 0.07);  // Color y densidad


// Crear AudioListener y agregar a la cámara
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

// Crear Audio
const audio = new THREE.Audio(audioListener);

// Cargar el archivo de música
const audioLoader = new THREE.AudioLoader();
audioLoader.load('sonidos/musica.mp3', function(audioBuffer) {
  audio.setBuffer(audioBuffer);
  audio.setLoop(true);           
  audio.setVolume(0.1);        
  audio.play();                 
});


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setAnimationLoop( animate );
				renderer.xr.enabled = true;
				renderer.xr.setReferenceSpaceType( 'local-floor' );
				

				document.body.appendChild( VRButton.createButton( renderer ) );
//sonido//////////////////////
const disparoSound = new Audio('sonidos/escopeta.mp3');
disparoSound.volume = 0.5; 

const zombieSounds = [
  new Audio('sonidos/zombieSS.mp3'),
  
];
const zombieAttackSound = new Audio('sonidos/punch.mp3');
zombieAttackSound.volume = 0.5;

zombieSounds.forEach(s => s.volume = 0.05);

setInterval(() => {
  const s = zombieSounds[Math.floor(Math.random() * zombieSounds.length)];
  s.currentTime = 0;
  s.play();
}, 25000); 

//CAMARA y controles///////////////////

const manager = new THREE.LoadingManager();
const loaderFbx = new FBXLoader( manager );

const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.update();

let gamepad;
let moveForward = false;
let moveBackward = false;
const speed = 0.1;
const gravity = 0.01;

const character = new THREE.Object3D();
scene.add(character);
character.add(camera);
character.position.set(20, 1, 30); 
camera.position.set(10, 5.6, 30); 

const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 2);
spotLight.position.set(0, 0, 0);  // Relativa a la cámara
spotLight.target.position.set(0, 0, -10);  // Apunta hacia adelante
camera.add(spotLight);
camera.add(spotLight.target);

window.addEventListener("gamepadconnected", (event) => {
  console.log("Controlador conectado:", event.gamepad.id);
});

function updateCharacterMovement() {
  const gamepads = navigator.getGamepads();
  
  // Resetear movimiento cada frame
  moveForward = false;
  moveBackward = false;
  
  if (gamepads[0]) {
    const gp = gamepads[0];
    const leftStickY = gp.axes[1];

    moveForward = leftStickY < -0.1;
    moveBackward = leftStickY > 0.1;

    if (gp.buttons[7].value > 0.5) {
      shootRay();
    }
  }

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;  // No moverse verticalmente
  direction.normalize();

  if (moveForward) character.position.addScaledVector(direction, speed);
  if (moveBackward) character.position.addScaledVector(direction, -speed);

  // Solo mantener la altura (Y)
  character.position.y = 0.6;
}

////////////////PUNTERO////////////////////////
const raycaster = new THREE.Raycaster();
const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(0, 1, -5);
scene.add(enemy);


function shootRay() {
    disparoSound.currentTime = 0; // reinicia el sonido si se dispara rápido
disparoSound.play();
  // Origen del disparo
  const origin = new THREE.Vector3();
  camera.getWorldPosition(origin);

  // Dirección del disparo
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  raycaster.set(origin, direction);
  
  // Detectar colisiones con todos los enemigos
  const intersects = raycaster.intersectObjects(scene.children, true);

  for (let i = 0; i < intersects.length; i++) {
    const obj = intersects[i].object;
    
    // Verificar si el objeto tiene una referencia al enemigo
    if (obj.userData.enemyInstance) {
      const enemyInstance = obj.userData.enemyInstance;
      enemyInstance.recibirDisparo();
      
      console.log("¡Enemigo alcanzado!");
      if (navigator.vibrate) navigator.vibrate(200);
      break; // Solo afecta al primer enemigo golpeado
    }
  }
}

//////////////////////// GAMEPAD ////////////////////////
window.addEventListener("gamepadconnected", (event) => {
  console.log("Control conectado:", event.gamepad.id);
});

///////TEXTURA////////

const suelco = new THREE.TextureLoader().load('text/piso.png' ); 
const piedra = new THREE.MeshPhongMaterial( { map:suelco} );

const ladr = new THREE.TextureLoader().load('text/ladrillos.png' ); 
const ladrillo = new THREE.MeshPhongMaterial( { map:ladr} );

const vent = new THREE.TextureLoader().load('text/Ventana.png' ); 
const ventanas1 = new THREE.MeshPhongMaterial( { map:vent} );

const vent2 = new THREE.TextureLoader().load('text/hermosa-foto-de-un-edificio-moderno-azul-con-ventanas-de-vidrio-perfecto-para-arquitectura.jpg' ); 
const ventanas2 = new THREE.MeshPhongMaterial( { map:vent2} );

const neg = new THREE.TextureLoader().load('text/pared n.jpg' ); 
const negri = new THREE.MeshPhongMaterial( { map:neg} );

const reg = new THREE.TextureLoader().load('text/metal.jpg' ); 
const reja = new THREE.MeshPhongMaterial( { map:reg} );

const p = new THREE.TextureLoader().load('text/pasto.png' ); 
const past = new THREE.MeshPhongMaterial( { map:p} );

const aj = new THREE.TextureLoader().load('text/ajedrez.png' ); 
const aje = new THREE.MeshPhongMaterial( { map:aj} );

const pu = new THREE.TextureLoader().load('text/puerta.jpg' ); 
const pur = new THREE.MeshPhongMaterial( { map:pu} );

const texturaArbol = new THREE.TextureLoader().load('text/arbol.png');
const arboles = new THREE.MeshPhongMaterial({
  map: texturaArbol,
  transparent: true,   
  alphaTest: 0.5,        
  side: THREE.DoubleSide  
});

const texturaArbolN = new THREE.TextureLoader().load('text/arbolN.png');
const arbolesN = new THREE.MeshPhongMaterial({
  map: texturaArbolN,
  transparent: true,    
  alphaTest: 0.5,       
  side: THREE.DoubleSide  
});

const arbust = new THREE.TextureLoader().load('text/arbusto.png');
const arbusto = new THREE.MeshPhongMaterial({
  map: arbust,
  transparent: true,       
  alphaTest: 0.5,         
  side: THREE.DoubleSide  
});
const m = new THREE.TextureLoader().load('text/mesa.png');
const mesas = new THREE.MeshPhongMaterial({
  map: m,
  transparent: true,       
  alphaTest: 0.5,         
  side: THREE.DoubleSide  
});

const sky = new THREE.TextureLoader().load('text/lambert3_Base_color.png' ); 
const c = new THREE.MeshPhongMaterial( { map:sky} );

const z1 = new THREE.TextureLoader().load('text/sanpacho/lambert1_Base_color.png');
const z2 = new THREE.TextureLoader().load('text/sanpacho/lambert1_Normal_OpenGL.png');
const z5 = new THREE.TextureLoader().load('text/sanpacho/lambert1_Roughness.png');

const zombie = new THREE.MeshStandardMaterial({
  map: z1,
    normalMap: z2,
    roughnessMap: z5
    
});


//////////////////// PUNTERO (CENTRO DE PANTALLA VR) ////////////////////
const pointerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
const pointerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
pointer.position.set(0, 0, -2);

// Añadimos el puntero a un grupo que estará delante del usuario VR
const vrPointerGroup = new THREE.Group();
vrPointerGroup.add(pointer);
scene.add(vrPointerGroup);

// Sincronizar la posición del puntero con la cámara en cada frame
function updatePointer() {
  const cameraWorldPos = new THREE.Vector3();
  const cameraWorldQuat = new THREE.Quaternion();
  camera.getWorldPosition(cameraWorldPos);
  camera.getWorldQuaternion(cameraWorldQuat);

  vrPointerGroup.position.copy(cameraWorldPos);
  vrPointerGroup.quaternion.copy(cameraWorldQuat);
}


//ESCENA////////////////////////////


/////FBX///////////////

loaderFbx.load("modelos/piedraPiso.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= piedra;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/ladrillos.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= ladrillo;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/ventanas1.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= ventanas1;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/ventanas2.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= ventanas2;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/negros.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= negri;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/rejas.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= reja;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/pasto.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= past;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/ajedre.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= aje;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/puerta.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= pur;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/arboles.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= arboles;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/arbolNORMAL.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= arbolesN;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/arbustos.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= arbusto;
        }
    })
        scene.add(object1)
})
loaderFbx.load("modelos/mesa.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= mesas;
        }
    })
        scene.add(object1)
})

loaderFbx.load("modelos/CIELO.fbx", function(object1){
    object1.scale.x=0.04;
    object1.scale.y=0.04;
    object1.scale.z=0.04;

    object1.position.set(0,0,0)
    object1.rotation.y = 0;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= c;
        }
    })
        scene.add(object1)
})
let mixer1;
loaderFbx.load("modelos/Zombie Walk.fbx", function(object2){
    object2.scale.set(0.004, 0.004, 0.004);
    object2.position.set(-10, 0.3, 10);
    object2.rotation.y = 0;

    object2.traverse(function(child){
        if(child.isMesh){
            child.material = zombie;
        }
    });

    scene.add(object2);
mixer1 = new THREE.AnimationMixer( object2 );

						const action = mixer1.clipAction( object2.animations[ 0 ] );
						action.play();
    // Instanciar Enemigo y guardarlo
    const enemyInstance = new Enemigo(object2, 0.01);
    enemyInstance.mixer = mixer1;
    enemies.push(enemyInstance);

    // Asociar referencia para raycast (cuando se dispare)
    object2.traverse((child) => {
      if (child.isMesh) {
        child.userData.enemyInstance = enemyInstance;
      }
    });
});

///ENEMIGOS///////////////////
const enemies = [];
let lastZombieSpawnTime = 0;
const zombieSpawnInterval = 4000; // 10 segundos en milisegundos
const maxZombies = 12; // Máximo de zombies simultáneos

function spawnZombie() {
  if (enemies.length >= maxZombies) return; // No crear si ya hay demasiados

  // Posición aleatoria alrededor del jugador
  const angle = Math.random() * Math.PI * 2;
  const distance = 20 + Math.random() * 7; // Entre 20 y 30 unidades
  const x = character.position.x + Math.cos(angle) * distance;
  const z = character.position.z + Math.sin(angle) * distance;

  const zombieType = Math.random() > 0.5 ? "Walk" : "Scream";
  const zombieModel = `modelos/Zombie ${zombieType}.fbx`;

  loaderFbx.load(zombieModel, function(object2){
    object2.scale.set(0.004, 0.004, 0.004);
    object2.position.set(x, 0.31, z);
    object2.rotation.y = 0;

    object2.traverse(function(child){
      if(child.isMesh){
        child.material = zombie;
      }
    });

    scene.add(object2);
    const mixer = new THREE.AnimationMixer(object2);
    const action = mixer.clipAction(object2.animations[0]);
    action.play();
    
    // Instanciar Enemigo
    const enemyInstance = new Enemigo(object2, 0.005);
    enemyInstance.mixer = mixer; // Guardar mixer para actualizar en animate
    enemies.push(enemyInstance);

    // Asociar referencia para raycast
    object2.traverse((child) => {
      if (child.isMesh) {
        child.userData.enemyInstance = enemyInstance;
      }
    });
  });
}
class Enemigo {
  constructor(mesh, speed = 0.03) {
    this.enemyMesh = mesh;
    this.speed = speed;
    this.isChasing = false;
    this.atacando = false;
    this.lives = 10;
  }

  actualizarPosicion(personaje) {
    if (!this.enemyMesh) return;

    const enemyPos = this.enemyMesh.position;
    const playerPos = personaje.position;

    const direction = new THREE.Vector3().subVectors(playerPos, enemyPos);
    const distance = direction.length();
    direction.normalize();

    // Comportamiento de persecución
    if (distance < 100) this.isChasing = true;
    else if (distance > 150) this.isChasing = false;

    // Movimiento hacia el jugador
    if (this.isChasing && distance > 2) {
      enemyPos.addScaledVector(direction, this.speed);

      // Rotar hacia el jugador
      const targetRotation = Math.atan2(direction.x, direction.z);
      this.enemyMesh.rotation.y = targetRotation;
    }
    

    // Si está cerca, atacar
    if (distance <= 2) this.atacarJugador();
  }

  atacarJugador() {
    if (!this.atacando) {
      this.atacando = true;
      console.log("¡El zombie atacó al jugador!");
         zombieAttackSound.currentTime = 0;
    zombieAttackSound.play();
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => (this.atacando = false), 1500);
    }
  }

  recibirDisparo() {
    this.lives--;
    console.log("vida enemy", this.lives);
    if (this.lives <= 0) {
      scene.remove(this.enemyMesh);
      const idx = enemies.indexOf(this);
      if (idx !== -1) enemies.splice(idx, 1);
    }
  }
}




///LUCES/////////////

const Ambientlight = new THREE.AmbientLight( 0x3B3B3B ); 
scene.add( Ambientlight );

const clock = new THREE.Clock();

const lookAt = new THREE.Vector3().copy(playerPos);
lookAt.y = enemyPos.y; // mantén la misma altura
this.enemyMesh.lookAt(lookAt);


function animate() {
  updateCharacterMovement();
  updatePointer();

  const currentTime = Date.now();
  
  // Spawnear nuevo zombie cada 10 segundos
  if (currentTime - lastZombieSpawnTime > zombieSpawnInterval) {
    spawnZombie();
    lastZombieSpawnTime = currentTime;
  }

  // Actualizar posiciones y animaciones de zombies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].actualizarPosicion(character);
    if (enemies[i].mixer) {
      enemies[i].mixer.update(0.016); // ~60 FPS
    }
  }

  const delta = clock.getDelta();
  renderer.render( scene, camera );
}
