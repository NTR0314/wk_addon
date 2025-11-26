console.log("WK-Extension loaded");

const DEBUG_MODE = false; // Set to false to disable verbose logging
let savedState = null;

document.addEventListener('keypress', function(e) {
    // Debug log for every keypress to ensure listener is active
    // if (DEBUG_MODE) console.log("WK-Extension: Key pressed:", e.key, "Target:", e.target.tagName);

    if (e.key === 'g') {
        if (DEBUG_MODE) console.log("WK-Extension: 'g' detected. Scanning toggles...");
        const toggles = document.querySelectorAll('.subject-section__toggle');
        const targetToggles = [];

        // Filter for Meaning and Reading sections
        toggles.forEach(toggle => {
            const titleSpan = toggle.querySelector('.subject-section__title-text');
            if (titleSpan) {
                const text = titleSpan.textContent.trim();
                if (text === 'Meaning' || /^Reading(s)?$/.test(text)) {
                    targetToggles.push(toggle);
                }
            }
        });

        if (DEBUG_MODE) console.log(`WK-Extension: Found ${targetToggles.length} target toggles.`);
        if (targetToggles.length === 0) return;

        // Check if all targeted sections are currently expanded
        const allExpanded = targetToggles.every(toggle => toggle.getAttribute('aria-expanded') === 'true');
        if (DEBUG_MODE) console.log(`WK-Extension: All Expanded: ${allExpanded}, Saved State Exists: ${!!savedState}`);

        if (allExpanded && savedState) {
            if (DEBUG_MODE) console.log("WK-Extension: Restoring saved state...");
            // Restore previous state
            targetToggles.forEach(toggle => {
                const title = toggle.querySelector('.subject-section__title-text').textContent.trim();
                const wasExpanded = savedState[title];
                
                // If it was NOT expanded, close it (it is currently expanded because allExpanded is true)
                if (wasExpanded === false) {
                    if (DEBUG_MODE) console.log(`WK-Extension: Closing ${title}`);
                    toggle.click();
                }
            });
            savedState = null; // Reset state after restoring
        } else {
            // Save current state and expand all
            if (!allExpanded) {
                if (DEBUG_MODE) console.log("WK-Extension: Saving state and expanding all...");
                savedState = {};
                targetToggles.forEach(toggle => {
                    const title = toggle.querySelector('.subject-section__title-text').textContent.trim();
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    savedState[title] = isExpanded;

                    if (!isExpanded) {
                        if (DEBUG_MODE) console.log(`WK-Extension: Opening ${title}`);
                        toggle.click();
                    } else {
                        if (DEBUG_MODE) console.log(`WK-Extension: ${title} already open.`);
                    }
                });
            } else {
                if (DEBUG_MODE) console.log("WK-Extension: Everything open and no state to restore.");
            }
        }
    }
});