/**
 * Content Sections Loader
 * Dynamically loads content sections from separate HTML files
 */

async function loadContentSections(basePrefix, sections) {
    const mainContent = document.querySelector('.official-main');
    if (!mainContent) {
        console.error('Main content container not found');
        return;
    }

    try {
        for (const section of sections) {
            const sectionFile = `sections/${basePrefix}-${section}.html`;
            const response = await fetch(sectionFile);
            
            if (!response.ok) {
                console.error(`Failed to load ${sectionFile}: ${response.statusText}`);
                continue;
            }
            
            const html = await response.text();
            mainContent.insertAdjacentHTML('beforeend', html);
        }
        
        console.log('✓ Content sections loaded successfully');
    } catch (error) {
        console.error('Error loading content sections:', error);
    }
}

// Export for use in dashboard files
window.loadContentSections = loadContentSections;
