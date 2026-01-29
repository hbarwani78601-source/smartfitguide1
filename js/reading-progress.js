document.addEventListener('DOMContentLoaded', () => {
    // Reading Progress Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = 'var(--accent)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // Estimated Reading Time
    const article = document.querySelector('.article-content');
    if (article) {
        const text = article.innerText;
        const wpm = 200;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);

        const timeDisplay = document.querySelector('.reading-time');
        if (timeDisplay) {
            timeDisplay.textContent = `${time} min read`;
        }
    }
});
