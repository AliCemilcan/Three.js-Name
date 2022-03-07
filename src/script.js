import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import  {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
/**
 * FONTS
 * * This is font information
 * ! 2 ways of loading fonts
 * ! This way is importing fonts from node modules 
 * examples/fonts/helvetiker_regular.typeface.json'
 * TODO: Check this website and you can make typeface font using another font's JSON http://gero3.github.io/facetype.js/
 */
/**
 * Base
 */
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const obj_ = []

// document.addEventListener( 'mousemove', onDocumentMouseMove );
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Axes Helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
/**
 * Load your fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log('loaded')
        const textGeometry = new TextGeometry(
            'Ali Cemilcan Ciftarslan',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegment: 1
            }
        )
        /** 
        * * This is how to center geomertry with their vector min and max
        * The  0.02 or 0.03 values coming from textGeometry.boundingBox values. the difference between x min x max or y min y max
         */
        textGeometry.computeBoundingBox()
        //translate will take every vertices and move the shape
        textGeometry.translate(
            
        //    - textGeometry.boundingBox.max.x * 0.5, this is still not correct because of the bevel size
           - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
           - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
           - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        )
        //after cehcking min Vector 3 you can see that x value is not 0 . 3D shape is not in the center of the axesHelper
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)
        //!!! You can basically use this method to center the geometry also
        textGeometry.center()
        


        // const textMaterial = new THREE.MeshBasicMaterial()
        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        material.wireframe = false
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
        
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        // const donutMaterial = new THREE.MeshMatcapMaterial()
        const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        // const cube = new THREE.Mesh( geometry, material );
        console.time('donut')
        for (let i = 0; i < 100; i++){
           
            material.matcap = matcapTexture
            const cube = new THREE.Mesh( geometry, material );
            cube.position.x = (Math.random() - 0.5) * 14
            cube.position.y = (Math.random() - 0.5) * 10
            cube.position.z = (Math.random() - 0.5) * 12
            
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.3) * 14
            donut.position.y = (Math.random() - 0.3) * 10
            donut.position.z = (Math.random() - 0.4) * 12
            
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut, cube)
            obj_.push(donut)
        }
        console.timeEnd('donut')
    }
)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild( renderer.domElement );
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
camera.rotation.y = 90 * Math.PI / 180
camera.rotation.x = 90 * Math.PI / 180
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
// camera.position.set( 0, 20, 0 );
controls.autoRotate = true
controls.update();




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    animate()
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
function animate() {

    // requestAnimationFrame( animate );

    // render();

}
const render = () => {
    const timer = 0.0001 * Date.now();
    // camera.position.x += (mouseX - camera.position.x) * 0.5;
    // camera.position.y += (mouseY - camera.position.y) * 0.5;
    // camera.lookAt(scene.position)
    for ( let i = 0, il = obj_.length; i < il; i ++ ) {

        const sphere = obj_[ i ];

        // sphere.position.x = 5 * Math.cos( timer + i );
        // sphere.position.y = 5 * Math.sin(timer + i * 1.1);
        // sphere.rotation.x =  Math.sin(timer + i * 1.6);
        // sphere.rotation.y =  Math.sin(timer + i * 1.6);

    }

    
}
function onDocumentMouseMove( event ) {

    // mouseX = ( event.clientX - windowHalfX ) / 100;
    // mouseY = ( event.clientY - windowHalfY ) / 100;

}

tick()