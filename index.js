import * as THREE from 'three';
import 'three/examples/js/controls/DeviceOrientationControls.js'; // Import DeviceOrientationControls separately
import * as THREEx from 'ar.js';

const canvas = document.getElementById('canvas1');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
});

const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'data/camera_para.dat',
    detectionMode: 'mono',
});

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

const markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type: 'pattern',
    patternUrl: 'data/pattern-marker.patt',
    changeMatrixMode: 'cameraTransformMatrix',
});

const geom = new THREE.BoxGeometry(20, 20, 20);
const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(geom, mtl);

scene.add(box);

markerControls.addEventListener('markerFound', () => {
    box.visible = true;
});

markerControls.addEventListener('markerLost', () => {
    box.visible = false;
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

arToolkitSource.init(() => {
    setTimeout(() => {
        canvas.style.display = 'block';
        animate();
    }, 200);
});
