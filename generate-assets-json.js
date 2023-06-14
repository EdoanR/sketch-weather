// this file write the assets.json
// which is used in the main.jsx to preload the assets from public folder.

import { glob } from 'glob';
import fs from 'fs';

glob('./public/images/**/*.*', {

}).then(files => {
    files = files.map(path => '/sketch-weather' + path.replace(/\\/g, '/').replace(/^public/, ''));
    fs.writeFileSync('assets.json', JSON.stringify(files, null, 2));
    console.log('assets.json generated!');
});