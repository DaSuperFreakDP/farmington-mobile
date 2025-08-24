// Mobile-specific JavaScript enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Improve mobile navigation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Close mobile menu when clicking on a link (but not dropdown toggles)
    if (navbarCollapse) {
        navbarCollapse.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link') && !e.target.classList.contains('dropdown-toggle')) {
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

    // Prevent zoom on input focus for iOS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.style.fontSize = '16px';
            }
        });
    }

    // Improve dropdown behavior on all devices
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(function(toggle) {
        toggle.style.cursor = 'pointer';
        toggle.style.touchAction = 'manipulation';

        // Ensure dropdown works properly on all devices
        toggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling that might close the navbar

            // Get the Bootstrap dropdown instance
            const dropdown = bootstrap.Dropdown.getOrCreateInstance(this);

            // Toggle the dropdown
            if (this.getAttribute('aria-expanded') === 'true') {
                dropdown.hide();
            } else {
                dropdown.show();
            }
        });

        // Handle touch events for mobile
        if ('ontouchstart' in window) {
            toggle.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Trigger click after a short delay to prevent double events
                setTimeout(() => {
                    this.click();
                }, 10);
            }, { passive: false });
        }
    });



    // Auto-hide mobile keyboard when scrolling - but not on form pages or when actively typing
    let ticking = false;
    let lastInputTime = 0;

    // Track when user is actively typing
    document.addEventListener('input', function() {
        lastInputTime = Date.now();
    });

    function updateScroll() {
        // Don't blur inputs on form pages or when user just typed
        if (window.location.pathname.includes('/login') || 
            window.location.pathname.includes('/register') ||
            window.location.pathname.includes('/profile') ||
            Date.now() - lastInputTime < 2000) { // Don't blur for 2 seconds after typing
            ticking = false;
            return;
        }

        // Don't blur inputs in league creation/join forms
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA')) {

            // Check if this is a league form input
            const form = document.activeElement.closest('form');
            if (form && (form.innerHTML.includes('league_name') || form.innerHTML.includes('league_code'))) {
                ticking = false;
                return;
            }

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

    // Improve button feedback and ensure touch events work on mobile
    const buttons = document.querySelectorAll('.btn, .badge, .card-link, [data-bs-toggle]:not(.dropdown-toggle)');
    buttons.forEach(function(btn) {
        // Skip input fields and their labels
        if (btn.tagName === 'INPUT' || btn.tagName === 'TEXTAREA' || 
            btn.tagName === 'LABEL' || btn.closest('.form-group') ||
            btn.id === 'message-input') {
            return;
        }

        // Ensure buttons are properly touchable
        btn.style.cursor = 'pointer';
        btn.style.userSelect = 'none';
        btn.style.webkitUserSelect = 'none';
        btn.style.webkitTouchCallout = 'none';

        btn.addEventListener('touchstart', function(e) {
            // Don't interfere with form inputs or chat input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                e.target.id === 'message-input') {
                return;
            }

            this.style.transform = 'scale(0.95)';
            // Prevent double-tap zoom on buttons
            e.preventDefault();
        }, { passive: false });

        btn.addEventListener('touchend', function(e) {
            // Don't interfere with form inputs or chat input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                e.target.id === 'message-input') {
                return;
            }

            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });

        // Ensure click events fire properly on mobile
        btn.addEventListener('touchend', function(e) {
            // Don't interfere with form inputs or chat input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                e.target.id === 'message-input') {
                return;
            }

            // If this is a button that should trigger a click (but not dropdown toggles)
            if ((this.tagName === 'BUTTON' || this.classList.contains('btn') || this.hasAttribute('data-bs-toggle')) 
                && !this.classList.contains('dropdown-toggle')) {
                // Prevent the ghost click
                e.preventDefault();

                // Trigger the click manually after a short delay
                setTimeout(() => {
                    this.click();
                }, 10);
            }
        }, { passive: false });
    });

    // Handle profile settings button
    const profileButton = document.querySelector('.profile-btn');
    if (profileButton) {
        profileButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '/profile';
        });

        profileButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                window.location.href = '/profile';
            }, 10);
        });
    }

    // Ensure form inputs work properly on mobile
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea');
    inputs.forEach(function(input) {
        // Ensure inputs are focusable and typeable
        input.style.touchAction = 'manipulation';
        input.style.webkitUserSelect = 'text';
        input.style.userSelect = 'text';
        input.style.webkitTouchCallout = 'none';

        // Prevent any touch event interference
        input.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });

        input.addEventListener('touchend', function(e) {
            e.stopPropagation();
        }, { passive: true });

        input.addEventListener('focus', function() {
            // Ensure the input stays focused
            setTimeout(() => {
                this.focus();
            }, 10);
        });

        // Special handling for league form inputs and chat input
        if (input.name === 'league_name' || input.name === 'league_code' || input.id === 'message-input') {
            input.addEventListener('click', function(e) {
                e.stopPropagation();
                this.focus();
            });

            input.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                setTimeout(() => {
                    this.focus();
                }, 50);
            }, { passive: true });
        }
    });

    // Add mobile-specific event handlers for better keyboard support
    document.addEventListener('DOMContentLoaded', function() {
        // Handle league form inputs and chat input specifically
        const leagueInputs = document.querySelectorAll('input[name="league_name"], input[name="league_code"], #message-input');

        leagueInputs.forEach(input => {
            // Remove any conflicting styles
            input.style.pointerEvents = 'auto';
            input.style.touchAction = 'manipulation';

            // Prevent default mobile behaviors that might interfere
            input.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, { passive: true });

            input.addEventListener('focus', function() {
                // Ensure the input is visible and keyboard appears
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            // Handle clicking on the input area
            input.addEventListener('click', function(e) {
                e.stopPropagation();
                this.focus();
            });

            // Handle touch events specifically
            input.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.focus();
            });
        });
    });
});