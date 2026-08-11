const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const projectRoot = context.opts.projectRoot;
    const platformAndroid = path.join(projectRoot, 'platforms/android');

    // 1. Copy MainActivity.java
    const targetJava = path.join(platformAndroid, 'app/src/main/java/com/aura/webview/MainActivity.java');
    const sourceJava = path.join(projectRoot, 'native/MainActivity.java');
    if (fs.existsSync(sourceJava) && fs.existsSync(path.dirname(targetJava))) {
        fs.copyFileSync(sourceJava, targetJava);
        console.log('>>> [Aura Hook] Successfully patched MainActivity.java!');
    }

    // 2. Copy network_security_config.xml & patch AndroidManifest.xml for cleartext traffic
    const resXmlDir = path.join(platformAndroid, 'app/src/main/res/xml');
    if (!fs.existsSync(resXmlDir)) {
        fs.mkdirSync(resXmlDir, { recursive: true });
    }
    const sourceNsConfig = path.join(projectRoot, 'native/network_security_config.xml');
    const targetNsConfig = path.join(resXmlDir, 'network_security_config.xml');
    if (fs.existsSync(sourceNsConfig)) {
        fs.copyFileSync(sourceNsConfig, targetNsConfig);
        console.log('>>> [Aura Hook] Copied network_security_config.xml!');
    }

    // 3. Patch AndroidManifest.xml to add usesCleartextTraffic="true" and networkSecurityConfig
    const manifestPath = path.join(platformAndroid, 'app/src/main/AndroidManifest.xml');
    if (fs.existsSync(manifestPath)) {
        let manifest = fs.readFileSync(manifestPath, 'utf8');
        if (!manifest.includes('android:usesCleartextTraffic="true"')) {
            manifest = manifest.replace('<application', '<application android:usesCleartextTraffic="true" android:networkSecurityConfig="@xml/network_security_config"');
            fs.writeFileSync(manifestPath, manifest, 'utf8');
            console.log('>>> [Aura Hook] Successfully patched AndroidManifest.xml for cleartext traffic!');
        }
    }
};
