console.log("WK-Extension loaded");

let savedState = null;

document.addEventListener('keypress', function(e) {
    // Don't trigger if typing in an input field
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) {
        return;
    }

    if (e.key === 'g') {
        const toggles = document.querySelectorAll('.subject-section__toggle');
        const targetToggles = [];

        // Filter for Meaning and Reading sections
        toggles.forEach(toggle => {
            const titleSpan = toggle.querySelector('.subject-section__title-text');
            if (titleSpan && (titleSpan.textContent.trim() === 'Meaning' || titleSpan.textContent.trim() === 'Reading')) {
                targetToggles.push(toggle);
            }
        });

        if (targetToggles.length === 0) return;

        // Check if all targeted sections are currently expanded
        const allExpanded = targetToggles.every(toggle => toggle.getAttribute('aria-expanded') === 'true');

        if (allExpanded && savedState) {
            // Restore previous state
            targetToggles.forEach(toggle => {
                const title = toggle.querySelector('.subject-section__title-text').textContent.trim();
                const wasExpanded = savedState[title];
                
                // If it was NOT expanded, close it (it is currently expanded because allExpanded is true)
                if (wasExpanded === false) {
                    toggle.click();
                }
            });
            savedState = null; // Reset state after restoring
        } else {
            // Save current state and expand all
            if (!allExpanded) {
                savedState = {};
                targetToggles.forEach(toggle => {
                    const title = toggle.querySelector('.subject-section__title-text').textContent.trim();
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    savedState[title] = isExpanded;

                    if (!isExpanded) {
                        toggle.click();
                    }
                });
            }
        }
    }
});