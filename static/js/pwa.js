
// PWA Install Prompt Handler
let deferredPrompt;
let installButton;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button if it exists
    if (installButton) {
        installButton.style.display = 'block';
    }
    
    // Create install banner if not on iOS
    if (!isIOS()) {
        showInstallBanner();
    }
});

// Handle install button click
function handleInstallClick() {
    if (deferredPrompt) {
        // Show the prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Check if device is iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Check if app is in standalone mode
function isInStandaloneMode() {
    return (window.matchMedia('(display-mode: standalone)').matches) || 
           (window.navigator.standalone) || 
           document.referrer.includes('android-app://');
}

// Show install banner for non-iOS devices
function showInstallBanner() {
    if (isInStandaloneMode() || localStorage.getItem('installBannerDismissed')) {
        return;
    }
    
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--farmington-green);
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
    `;
    
    banner.innerHTML = `
        <div>
            <strong>Install Farmington</strong><br>
            Add to your home screen for the best experience!
            <div style="margin-top: 0.5rem;">
                <button onclick="handleInstallClick()" class="btn btn-light btn-sm me-2">Install</button>
                <button onclick="dismissInstallBanner()" class="btn btn-outline-light btn-sm">Maybe Later</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
}

// Show iOS install instructions
function showIOSInstructions() {
    if (isInStandaloneMode() || !isIOS() || localStorage.getItem('iosInstructionsDismissed')) {
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'ios-install-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 1rem;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 10px; padding: 2rem; max-width: 350px; text-align: center;">
            <h3 style="color: var(--farmington-green); margin-bottom: 1rem;">
                <i class="fas fa-mobile-alt"></i> Install Farmington
            </h3>
            <p style="margin-bottom: 1.5rem; color: #333;">
                To install this app on your iPhone:
            </p>
            <div style="text-align: left; margin-bottom: 1.5rem; color: #555;">
                <p><strong>1.</strong> Tap the share button <i class="fas fa-share" style="color: #007AFF;"></i> in Safari</p>
                <p><strong>2.</strong> Scroll down and tap "Add to Home Screen" <i class="fas fa-plus-square" style="color: #007AFF;"></i></p>
                <p><strong>3.</strong> Tap "Add" to confirm</p>
            </div>
            <button onclick="dismissIOSInstructions()" class="btn btn-primary">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Dismiss install banner
function dismissInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) {
        banner.remove();
        localStorage.setItem('installBannerDismissed', 'true');
    }
}

// Dismiss iOS instructions
function dismissIOSInstructions() {
    const modal = document.getElementById('ios-install-modal');
    if (modal) {
        modal.remove();
        localStorage.setItem('iosInstructionsDismissed', 'true');
    }
}

// Initialize PWA features when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show iOS instructions after a short delay
    if (isIOS()) {
        setTimeout(showIOSInstructions, 3000);
    }
    
    // Add viewport height fix for iOS Safari
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 500);
    });
});
