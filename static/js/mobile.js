// Mobile-specific JavaScript enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Prevent zoom on input focus for iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }

    // Fix mobile input issues
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea, .mobile-input-fix');
    inputs.forEach(input => {
        // Prevent keyboard from dismissing on mobile
        input.addEventListener('blur', function(e) {
            // Only prevent blur if it's not intentional (like clicking submit)
            if (e.relatedTarget && e.relatedTarget.type === 'submit') {
                return;
            }

            // For mobile, add a small delay to prevent accidental blur
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    if (document.activeElement !== input && !input.value) {
                        // Re-focus if needed and no value was entered
                    }
                }, 100);
            }
        });

        // Ensure proper focus handling
        input.addEventListener('focus', function() {
            this.setAttribute('autocomplete', 'off');
            this.setAttribute('autocorrect', 'off');
            this.setAttribute('autocapitalize', 'off');
            this.setAttribute('spellcheck', 'false');
        });

        // Prevent form submission on Enter for certain inputs
        if (input.id === 'message-input') {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = this.closest('form');
                    if (form) {
                        form.dispatchEvent(new Event('submit', { bubbles: true }));
                    }
                }
            });
        }
    });

    // Enhanced touch interactions
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Improve mobile dropdown behavior
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            // Ensure dropdown stays open long enough on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    const menu = this.nextElementSibling;
                    if (menu && menu.classList.contains('dropdown-menu')) {
                        menu.style.position = 'static';
                        menu.style.float = 'none';
                        menu.style.width = '100%';
                    }
                }, 10);
            }
        });
    });

    // Handle mobile keyboard
    let initialViewportHeight = window.innerHeight;

    window.addEventListener('resize', function() {
        // Detect if keyboard is open (viewport height decreased significantly)
        if (window.innerHeight < initialViewportHeight * 0.7) {
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
        }
    });

    // Fix chat input specifically
    const chatInput = document.getElementById('message-input');
    if (chatInput) {
        chatInput.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });

        chatInput.addEventListener('focus', function() {
            // Scroll input into view on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    }
});