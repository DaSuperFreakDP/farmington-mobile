
// Mobile-specific JavaScript enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Improve mobile navigation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Close mobile menu when clicking on a link
    if (navbarCollapse) {
        navbarCollapse.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse && window.innerWidth < 992) {
                    bsCollapse.hide();
                }
            }
        });
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // Recalculate viewport height for iOS Safari
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 500);
    });
    
    // Set initial viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Improve touch scrolling on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    // Add pull-to-refresh prevention
    let startY = 0;
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].pageY;
    });
    
    document.addEventListener('touchmove', function(e) {
        const y = e.touches[0].pageY;
        // Prevent pull-to-refresh if at top of page, but not when input is focused
        if (startY <= 10 && y > startY && window.pageYOffset === 0) {
            const activeElement = document.activeElement;
            if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) {
                e.preventDefault();
            }
        }
    });
    
    // Prevent zoom on input focus for iOS and ensure proper input handling
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.style.fontSize = '16px';
                e.target.style.webkitAppearance = 'none';
                e.target.style.webkitBorderRadius = '0';
            }
        });
    }
    
    // Fix all input and textarea elements for mobile
    document.addEventListener('DOMContentLoaded', function() {
        const allInputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea, input[type="number"]');
        allInputs.forEach(function(input) {
            input.style.fontSize = '16px';
            input.style.webkitAppearance = 'none';
            input.style.webkitBorderRadius = '0';
            input.setAttribute('autocomplete', 'off');
            
            // Prevent viewport zoom on focus
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
    });
    
    // Improve dropdown behavior on touch devices
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            // Ensure dropdown opens on first touch on mobile
            if (window.innerWidth < 992) {
                e.preventDefault();
                const dropdown = bootstrap.Dropdown.getOrCreateInstance(this);
                dropdown.toggle();
            }
        });
        
        // Prevent dropdown from closing immediately on mobile
        toggle.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
    });
    
    // Improve dropdown menu positioning on mobile
    document.addEventListener('shown.bs.dropdown', function(e) {
        const dropdown = e.target.querySelector('.dropdown-menu');
        if (dropdown && window.innerWidth < 992) {
            dropdown.style.position = 'absolute';
            dropdown.style.right = '0';
            dropdown.style.left = 'auto';
            dropdown.style.transform = 'none';
        }
    });
    
    // Auto-hide mobile keyboard when scrolling - but not on login/register/chat pages
    let ticking = false;
    function updateScroll() {
        // Don't blur inputs on login/register/profile/chat pages
        if (window.location.pathname.includes('/login') || 
            window.location.pathname.includes('/register') ||
            window.location.pathname.includes('/profile') ||
            window.location.pathname.includes('/league_chat')) {
            ticking = false;
            return;
        }
        
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA')) {
            document.activeElement.blur();
        }
        ticking = false;
    }
    
    document.addEventListener('scroll', function() {
        if (!ticking && window.innerWidth < 768) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });
    
    // Improve button feedback on mobile
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
});
