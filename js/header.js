document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
});

function renderHeader() {
    // 1. Determine relative path to root based on script location
    // We look for the script tag that loaded this file
    const scripts = document.getElementsByTagName('script');
    let basePath = './';

    for (let script of scripts) {
        if (script.src.includes('header.js')) {
            // If src is "../js/header.js", base path is "../"
            // If src is "js/header.js", base path is "./"
            const src = script.getAttribute('src');
            const jsIndex = src.indexOf('js/header.js');
            if (jsIndex > 0) {
                basePath = src.substring(0, jsIndex);
            } else if (src.indexOf('header.js') > -1) {
                // Case where it might be adjacent or just 'header.js'
                // But usually it will be in js/ folder. 
                // If script is in same folder as html (unlikely for standard setup), we assume ./
            }
            break;
        }
    }

    // 2. Inject HTML
    const headerHTML = `
    <header class="global-header">
        <button class="menu-toggle" aria-label="Open Menu" aria-expanded="false" aria-controls="main-nav">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="brand-name">SmartFitGuide</div>
    </header>

    <div class="nav-overlay" id="nav-overlay"></div>

    <nav class="side-nav" id="main-nav" aria-hidden="true">
        <div class="nav-header">
            <span class="brand-name-nav">SmartFitGuide</span>
            <button class="close-menu" aria-label="Close Menu">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <ul class="nav-list">
            <li><a href="${basePath}index.html" class="nav-item">Home</a></li>
            <li class="nav-item-group">
                <button class="nav-item-accordion" aria-expanded="false">
                    Products
                    <span class="material-symbols-outlined icon-arrow">expand_more</span>
                </button>
                <ul class="nav-accordion-content">
                    <li><a href="${basePath}dumbbells/index.html">Dumbbells</a></li>
                     <li><a href="${basePath}supplements.html">Supplements</a></li>
                    <li><a href="${basePath}resistance-bands/index.html">Resistance Bands</a></li>
                    <li><a href="${basePath}yoga-mats/index.html">Yoga Mats</a></li>
                    <li><a href="${basePath}accessories/index.html">Fitness Accessories</a></li>
                </ul>
            </li>
            <li><a href="${basePath}blog/index.html" class="nav-item">Blog</a></li>
            <li><a href="${basePath}blog/index.html" class="nav-item">Comparisons</a></li> <!-- Pointing to blog for now as placeholder or if specific page exists -->
            <li><span class="nav-item disabled">Quiz (Coming Soon)</span></li>
            <li><a href="${basePath}about/index.html" class="nav-item">About Us</a></li>
        </ul>
    </nav>
    `;

    // Inject styles dynamically if not already present (optional, but good for self-containment)
    // However, plan says we will link CSS in HTML. Let's stick to plan for CSS, but injecting HTML here.

    // Find where to inject - look for a placeholder or just prepend to body
    const placeholder = document.getElementById('global-header');
    if (placeholder) {
        placeholder.innerHTML = headerHTML;
    } else {
        // Fallback: prepend to body
        const div = document.createElement('div');
        div.id = 'global-header';
        div.innerHTML = headerHTML;
        document.body.prepend(div);
    }

    // 3. Logic
    initMenuLogic();
}

function initMenuLogic() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const sideNav = document.querySelector('.side-nav');
    const overlay = document.querySelector('.nav-overlay');
    const accordionBtn = document.querySelector('.nav-item-accordion');
    const body = document.body;

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
    closeMenu.addEventListener('click', closeMenuFunc);
    overlay.addEventListener('click', closeMenuFunc);

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
        // Simple check: if link href ends with current filename
        // Need to be careful with 'index.html' vs '/'
        const href = link.getAttribute('href');
        if (!href) return;

        // Resolve absolute path of link to compare with location
        // Easier: Just check if href path segment matches current path end
        // Clean href of ../
        const cleanHref = href.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');

        if (currentPath.endsWith(cleanHref)) {
            link.classList.add('active');
            // If inside accordion, expand it
            if (link.closest('.nav-accordion-content')) {
                accordionBtn.setAttribute('aria-expanded', 'true');
                accordionBtn.parentElement.classList.add('expanded');
            }
        }
    });
}
