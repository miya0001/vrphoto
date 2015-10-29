var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );

document.body.appendChild( renderer.domElement );

var scene, camera, controls, effect, manager;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
controls = new THREE.VRControls( camera );
effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );
manager = new WebVRManager( renderer, effect, { hideButton: false } );

// In the future
// var heading;
// if ( navigator.geolocation ) {
//     navigator.geolocation.getCurrentPosition( function( pos ){
//         heading = pos.coords.heading;
//     } );
// }

init();

function init() {
    var texloader = new THREE.TextureLoader();
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry( 100, 20, 20 ),
        new THREE.MeshBasicMaterial( {
            map: texloader.load( 'img/photo.jpg' )
        } )
    );
    sphere.scale.x = -1;

    scene.add( sphere );

    animate();
}

function animate( timestamp ) {
    controls.update();
    manager.render( scene, camera, timestamp );
    requestAnimationFrame( animate );
}
