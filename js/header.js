document.addEventListener('DOMContentLoaded', () => {
    initMenuLogic();
});

function initMenuLogic() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const sideNav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');
    const accordionBtn = document.querySelector('.nav-item-accordion');
    const body = document.body;

    if (!menuToggle || !sideNav || !overlay) return;

    function openMenu() {
        sideNav.classList.add('active');
        overlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        sideNav.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMenuFunc() {
        sideNav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        sideNav.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMenu);

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFunc);
    }

    overlay.addEventListener('click', closeMenuFunc);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideNav.classList.contains('active')) {
            closeMenuFunc();
        }
    });

    // Accordion Logic
    if (accordionBtn) {
        accordionBtn.addEventListener('click', () => {
            const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
            accordionBtn.setAttribute('aria-expanded', !isExpanded);
            accordionBtn.parentElement.classList.toggle('expanded');
        });
    }

    // Active State Highlighting
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-list a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Clean href of ../ and ./ to compare with current path end
        const cleanHref = href.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');

        // Simple matching logic
        if (currentPath.endsWith(cleanHref) || (cleanHref === 'index.html' && currentPath.endsWith('/'))) {
            link.classList.add('active');
            // If inside accordion, expand it
            if (link.closest('.nav-accordion-content')) {
                if (accordionBtn) {
                    accordionBtn.setAttribute('aria-expanded', 'true');
                    accordionBtn.parentElement.classList.add('expanded');
                }
            }
        }
    });
}
