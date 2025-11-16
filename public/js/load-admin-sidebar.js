// Load Admin Dashboard Sidebar
(function() {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;

    fetch('/sidebars/admin-sidebar.html')
        .then(response => response.text())
        .then(html => {
            sidebarNav.innerHTML = html;
            initializeSidebarEvents();
        })
        .catch(error => console.error('Error loading admin sidebar:', error));

    function initializeSidebarEvents() {
        const sidebarItems = document.querySelectorAll('.sidebar > ul > li');
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                if (typeof handleSectionClick === 'function') {
                    handleSectionClick(section);
                }
                
                // Update active state
                sidebarItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Setup profile and sign out buttons
        const profileBtn = document.getElementById('sidebarProfileBtn');
        const signOutBtn = document.getElementById('sidebarSignOutBtn');

        if (profileBtn && typeof openProfileModal === 'function') {
            profileBtn.addEventListener('click', openProfileModal);
        }

        if (signOutBtn && typeof handleSignOut === 'function') {
            signOutBtn.addEventListener('click', handleSignOut);
        }
    }
})();
