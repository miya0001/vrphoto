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

    var pgeometry = new THREE.Geometry();
    for ( var n = 0; n < 1000; n++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = ( Math.random() - 0.5 ) * 20;
        vertex.y = ( Math.random() + 0.08 ) * 20;
        vertex.z = ( Math.random() - 0.5 ) * 20;
        pgeometry.vertices.push( vertex );
    }
    var pmaterial = new THREE.PointsMaterial( {
        size: 0.01,
        color: 0xFFFFE0,
        blending: THREE.AdditiveBlending,
        transparent: true,
        fog: true
    } );
    var particles = new THREE.Points( pgeometry, pmaterial );
    particles.fog = new THREE.FogExp2( 0xffffff, 1 );
    scene.add( particles );

    animate();
}

function animate( timestamp ) {
    controls.update();
    manager.render( scene, camera, timestamp );
    requestAnimationFrame( animate );
}
