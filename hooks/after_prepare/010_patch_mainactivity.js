const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const targetPath = path.join(platformRoot, 'app/src/main/java/com/aura/webview/MainActivity.java');
    const sourcePath = path.join(context.opts.projectRoot, 'native/MainActivity.java');

    if (fs.existsSync(sourcePath) && fs.existsSync(path.dirname(targetPath))) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log('>>> [Aura Hook] Successfully patched MainActivity.java with native TTS and DownloadListener!');
    } else {
        console.log('>>> [Aura Hook] Warning: Source MainActivity.java or Android platform path not found.');
    }
};
