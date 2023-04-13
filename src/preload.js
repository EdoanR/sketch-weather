import assets from '../assets.json';

export default function preloadImageAssets() {
    assets.forEach(path => preloadImage(path));
}

function preloadImage(path) {
    const image = new Image();
    image.src = path;
}