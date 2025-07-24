// Configuration for asset paths
// Detects if running on GitHub Pages and adjusts paths accordingly

export const getBasePath = () => {
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname === 'sourav-mac.github.io';
    
    if (isGitHubPages) {
        // On GitHub Pages, use the repository name in the path
        return '/weather/';
    } else {
        // Local development or other hosting
        return '/';
    }
};

export const getAssetPath = (relativePath) => {
    const basePath = getBasePath();
    // Remove leading ./ or / from relative path
    const cleanPath = relativePath.replace(/^\.?\//, '');
    return basePath + cleanPath;
};

// For backward compatibility and easier usage
export const ASSETS = {
    images: (filename) => getAssetPath(`static/images/${filename}`),
    css: (filename) => getAssetPath(`static/css/${filename}`),
    js: (filename) => getAssetPath(`static/js/${filename}`),
    font: (filename) => getAssetPath(`static/font/${filename}`)
};
