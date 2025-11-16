// Load Official Dashboard Sidebar
(function() {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;

    fetch('/sidebars/official-sidebar.html')
        .then(response => response.text())
        .then(html => {
            sidebarNav.innerHTML = html;
            initializeSidebarEvents();
        })
        .catch(error => console.error('Error loading official sidebar:', error));

    function initializeSidebarEvents() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                navigateToSection(section);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
})();
