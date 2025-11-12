import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';


////////////////////////ESCENA//////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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

//CAMARA y controles///////////////////

const manager = new THREE.LoadingManager();
const loaderFbx = new FBXLoader( manager );

const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.update();

let gamepad;
let moveForward = false;
let moveBackward = false;
const speed = 0.3;
const gravity = 0.01;

const character = new THREE.Object3D();
scene.add(character);
character.add(camera);
camera.position.set(10, 5.6, 30); 

window.addEventListener("gamepadconnected", (event) => {
  console.log("Controlador conectado:", event.gamepad.id);
});

function updateCharacterMovement() {
  const gamepads = navigator.getGamepads();
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

  if (moveForward) character.position.addScaledVector(direction, speed);
  if (moveBackward) character.position.addScaledVector(direction, -speed);



    character.position.y = 1;
    character.position.x = 10;
    character.position.z = 20; // fuera de VR, mantener altura
  }

////////////////PUNTERO////////////////////////
const raycaster = new THREE.Raycaster();
const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(0, 1, -5);
scene.add(enemy);


function shootRay() {
  const origin = new THREE.Vector3();
  camera.getWorldPosition(origin);

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  raycaster.set(origin, direction);

  // 🔹 Revisar colisiones con todos los enemigos activos
  for (let i = 0; i < enemies.length; i++) {
    const enemyObj = enemies[i].enemyMesh;
    if (!enemyObj) continue;

    const intersects = raycaster.intersectObject(enemyObj, true);

    if (intersects.length > 0) {
      console.log("¡Enemigo alcanzado!");
      enemies[i].recibirDisparo();

      // Vibración del control
      if (navigator.vibrate) navigator.vibrate(200);
      break; // salir después del primer impacto
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
    object2.scale.set(0.005, 0.005, 0.005);
    object2.position.set(-10, 0.4, 10);
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
    const enemyInstance = new Enemigo(object2, 0.02);
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

class Enemigo {
  constructor(mesh, speed = 0.03) {
    this.enemyMesh = mesh;
    this.speed = speed;
    this.isChasing = false;
    this.atacando = false;
    this.lives = 2;
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

const Ambientlight = new THREE.AmbientLight( 0xD6D6D6 ); 
scene.add( Ambientlight );

const clock = new THREE.Clock();

const lookAt = new THREE.Vector3().copy(playerPos);
lookAt.y = enemyPos.y; // mantén la misma altura
this.enemyMesh.lookAt(lookAt);


function animate() {
  updateCharacterMovement();
  updatePointer();

  const delta = clock.getDelta();
  if (mixer1) mixer1.update(delta);

  enemies.forEach(enemy => enemy.actualizarPosicion(character));

  renderer.render(scene, camera);
}
