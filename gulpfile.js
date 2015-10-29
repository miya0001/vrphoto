'use strict';

var gulp = require( 'gulp' );
var download = require( "gulp-download" );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var data = require( 'gulp-data' );
var exif = require( 'gulp-exif' );
var extend = require( 'gulp-extend' );
var imageResize = require( 'gulp-image-resize' );

gulp.task( 'download', function () {
    return download( [
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/controls/VRControls.js',
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/effects/VREffect.js',
            'https://raw.githubusercontent.com/borismus/webvr-boilerplate/master/bower_components/webvr-polyfill/build/webvr-polyfill.js',
            'https://raw.githubusercontent.com/borismus/webvr-boilerplate/master/build/webvr-manager.js'
        ] )
        .pipe( concat( 'three-plugins.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( 'lib' ) );
} );

function gpsDecimal( direction, degrees, minutes, seconds ) {
    var d = degrees + minutes / 60 + seconds / ( 60 * 60 );
    return ( direction === 'S' || direction === 'W' ) ? d *= -1 : d;
}

gulp.task( 'exif', function () {
    return gulp.src( 'img/photo.jpg' )
        .pipe( exif() )
        .pipe( data( function ( file ) {
            var filename = file.path.substring( file.path.lastIndexOf( '/' ) + 1 ),
                exif = file.exif.gps,
                calcLat = gpsDecimal.bind( null, exif.GPSLatitudeRef ),
                calcLng = gpsDecimal.bind( null, exif.GPSLongitudeRef ),
                data = {};
            data[filename] = {
                lat: calcLat.apply( null, exif.GPSLatitude ),
                lng: calcLng.apply( null, exif.GPSLongitude ),
                alt: exif.GPSAltitude,
                dir: exif.GPSImageDirection
            };
            file.contents = new Buffer( JSON.stringify( data ) );
        } ) )
        .pipe( extend( 'gps.json', true, '    ' ) )
        .pipe( gulp.dest( './' ) );
} );

gulp.task( 'exifshort', function () {
    return gulp.src( 'img/photo.jpg' )
        .pipe( exif() )
        .pipe( data( function ( file ) {
            var filename = file.path.substring( file.path.lastIndexOf( '/' ) + 1 ),
                data = {};
            data[filename] = file.exif.gps;
            file.contents = new Buffer( JSON.stringify( data ) );
        } ) )
        .pipe( extend( 'gpsshort.json', true, '    ' ) )
        .pipe( gulp.dest( './' ) );
} );

gulp.task( 'resize', ['exif'], function () {
    gulp.src( 'panorama/photo.jpg' )
        .pipe( imageResize( {
            width : 4096,
            crop : false,
            upscale : false
        } ) )
        .pipe( gulp.dest( 'img' ) );
} );

gulp.task( 'default', [ 'download', 'exif', 'resize' ], function () {
    return gulp.src( [
            'node_modules/three/three.min.js',
        ] )
        .pipe( gulp.dest( 'lib' ) );
} );
