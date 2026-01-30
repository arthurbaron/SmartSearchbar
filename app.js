/**
 * AI Searchbar Prototype - Interaction Logic
 * Handles typing detection, screen transitions, and hover states
 */

// State management
const AppState = {
  INITIAL: 'initial',
  SUGGESTIONS: 'suggestions',
  RESULTS: 'results'
};

let currentState = AppState.INITIAL;
let typingTimer = null;
const TYPING_DELAY = 100; // ms before showing enter badge

// Active filters state
let activeFilters = [];

// All available filters
const allFilters = [
  'Informatie over de donatieprocedure',
  'Protocol informatie',
  'Onderzoeksinformatie',
  'PDF',
  'Illustratie of infographic',
  'Scholing en training'
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchInputContainer = document.getElementById('searchInputContainer');
const enterBadge = document.getElementById('enterBadge');
const searchDivider = document.getElementById('searchDivider');
const clearBtn = document.getElementById('clearBtn');
const filterSection = document.getElementById('filterSection');
const suggestionsSection = document.getElementById('suggestionsSection');
const resultsSection = document.getElementById('resultsSection');
const activeFiltersBar = document.getElementById('activeFiltersBar');
const activeFiltersList = document.getElementById('activeFiltersList');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const filterButton = document.getElementById('filterButton');
const filterDropdown = document.getElementById('filterDropdown');

// Suggestion data - common search terms for NTS
const suggestionDatabase = [
  'Donatie bij leven',
  'Donatie bij overlijden', 
  'Donatie aanmelden',
  'Donatieprocedure organen',
  'Donatieprocedure weefsels',
  'Donor worden',
  'Donorregister',
  'Donorformulier',
  'Leverdonatie',
  'Leverdonatie bij leven',
  'Nierdonatie',
  'Nierdonatie bij leven',
  'Orgaandonatie',
  'Orgaantransplantatie',
  'Protocol donatie',
  'Protocol orgaandonatie',
  'Transplantatie procedure',
  'Transplantatiecentrum',
  'Wachtlijst transplantatie',
  'Weefseldonatie',
  'NTS contact',
  'NTS bellen',
  'Voorwaarden donatie',
  'Kosten transplantatie',
  'Hersendood',
  'Bloedtransfusie',
  'Modelprotocol',
  'Scholing NTS',
  'Cross-over programma'
];

// Quick links data
const quickLinksDatabase = [
  { text: 'Veelgestelde vragen over {query}', icon: 'fa-link' },
  { text: '{query}', icon: 'fa-link' },
  { text: 'Voor- en nadelen van {query}', icon: 'fa-link' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initSearchInput();
  initSuggestions();
  initFilterTags();
  initFilterDropdown();
  initKeyboardNavigation();
  initClearButton();
  initActiveFilters();
  
  // Auto-focus the search input so user can type immediately
  searchInput.focus();
});

/**
 * Search Input Handler
 * Shows suggestions and enter badge while typing
 */
function initSearchInput() {
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    
    // Clear previous timer
    clearTimeout(typingTimer);
    
    if (value.length > 0) {
      // Transition to suggestions state
      if (currentState === AppState.INITIAL) {
        transitionTo(AppState.SUGGESTIONS);
      }
      
      // Update suggestions based on input
      updateSuggestions(value);
      
      // Show enter badge and search controls after brief delay
      typingTimer = setTimeout(() => {
        showSearchControls();
      }, TYPING_DELAY);
    } else {
      // Return to initial state
      hideSearchControls();
      if (currentState === AppState.SUGGESTIONS) {
        transitionTo(AppState.INITIAL);
      }
    }
  });
  
  // Handle focus
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0 && currentState === AppState.INITIAL) {
      transitionTo(AppState.SUGGESTIONS);
      updateSuggestions(searchInput.value.trim());
      showSearchControls();
    }
  });
}

/**
 * Update suggestions based on user input
 */
function updateSuggestions(query) {
  // Always create suggestions with user's input + suffix
  const suggestions = [
    { text: `${query} leven`, suffix: 'leven' },
    { text: `${query} overlijden`, suffix: 'overlijden' },
    { text: `${query} aanrijding`, suffix: 'aanrijding' }
  ];
  
  // Update suggestion items in DOM
  const firstSuggestionsRow = suggestionsSection.querySelectorAll('.suggestions-row')[0];
  if (firstSuggestionsRow) {
    const contentCol = firstSuggestionsRow.querySelector('.suggestions-content-col');
    if (contentCol) {
      contentCol.innerHTML = suggestions.map(item => {
        return `<div class="suggestion-item" data-query="${item.text}"><strong>${query}</strong> ${item.suffix}</div>`;
      }).join('');
      
      // Re-attach click handlers
      contentCol.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const selectedQuery = item.dataset.query;
          searchInput.value = selectedQuery;
          transitionTo(AppState.RESULTS);
        });
      });
    }
  }
  
  // Update quick links
  updateQuickLinks(query);
}

/**
 * Highlight matching text in suggestion
 */
function highlightMatch(text, query) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) {
    return text;
  }
  
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  
  return `${before}<strong>${match}</strong>${after}`;
}

/**
 * Update quick links based on query
 */
function updateQuickLinks(query) {
  const quickLinksRow = suggestionsSection.querySelectorAll('.suggestions-row')[1];
  if (quickLinksRow) {
    const contentCol = quickLinksRow.querySelector('.suggestions-content-col');
    if (contentCol) {
      const links = [
        `Veelgestelde vragen over <strong>${query}</strong>`,
        `<strong>${query}</strong>`,
        `Voor- en nadelen van <strong>${query}</strong>`
      ];
      
      contentCol.innerHTML = links.map(linkText => `
        <a href="#" class="quick-link-item">
          <i class="fa-solid fa-link link-icon"></i>
          <span>${linkText}</span>
          <i class="fa-solid fa-arrow-right arrow-icon"></i>
        </a>
      `).join('');
      
      // Re-attach click handlers
      contentCol.querySelectorAll('.quick-link-item').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          transitionTo(AppState.RESULTS);
        });
      });
    }
  }
}

/**
 * Show search controls (enter badge, divider, close button)
 */
function showSearchControls() {
  enterBadge.classList.add('visible');
  searchDivider.classList.add('visible');
  clearBtn.classList.add('visible');
  searchInputContainer.classList.add('active');
}

/**
 * Hide search controls
 */
function hideSearchControls() {
  enterBadge.classList.remove('visible');
  searchDivider.classList.remove('visible');
  clearBtn.classList.remove('visible');
  searchInputContainer.classList.remove('active');
}

/**
 * Clear button handler
 */
function initClearButton() {
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    hideSearchControls();
    transitionTo(AppState.INITIAL);
    searchInput.focus();
  });
}

/**
 * Suggestions Click Handler
 */
function initSuggestions() {
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  
  suggestionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const query = item.dataset.query || item.textContent.trim();
      searchInput.value = query;
      transitionTo(AppState.RESULTS);
    });
    
    // Add stagger animation class
    item.classList.add(`stagger-${index + 1}`);
  });
  
  // Quick link items
  const quickLinkItems = document.querySelectorAll('.quick-link-item');
  quickLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      transitionTo(AppState.RESULTS);
    });
  });
  
  // Filter button
  const filterButton = document.getElementById('filterButton');
  if (filterButton) {
    filterButton.addEventListener('click', () => {
      // Could open a filter modal or expand filter options
      console.log('Filter button clicked');
    });
  }
}

/**
 * Filter Tags Handler
 */
function initFilterTags() {
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const filterName = tag.querySelector('span').textContent;
      addFilter(filterName);
    });
  });
}

/**
 * Filter Dropdown Handler
 */
function initFilterDropdown() {
  // Toggle dropdown on filter button click
  filterButton.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('hidden');
    filterButton.classList.toggle('open');
  });
  
  // Handle dropdown item clicks
  const dropdownItems = document.querySelectorAll('.filter-dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const filterName = item.dataset.filter;
      addFilter(filterName);
      filterDropdown.classList.add('hidden');
      filterButton.classList.remove('open');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!filterButton.contains(e.target) && !filterDropdown.contains(e.target)) {
      filterDropdown.classList.add('hidden');
      filterButton.classList.remove('open');
    }
  });
}

/**
 * Initialize active filters bar
 */
function initActiveFilters() {
  // Clear all filters button
  clearFiltersBtn.addEventListener('click', () => {
    clearAllFilters();
  });
}

/**
 * Add a filter
 */
function addFilter(filterName) {
  if (activeFilters.includes(filterName)) return;
  
  activeFilters.push(filterName);
  updateActiveFiltersUI();
  updateFilterTagsVisibility();
  updateDropdownItemsState();
}

/**
 * Remove a filter
 */
function removeFilter(filterName) {
  activeFilters = activeFilters.filter(f => f !== filterName);
  updateActiveFiltersUI();
  updateFilterTagsVisibility();
  updateDropdownItemsState();
}

/**
 * Clear all filters
 */
function clearAllFilters() {
  activeFilters = [];
  updateActiveFiltersUI();
  updateFilterTagsVisibility();
  updateDropdownItemsState();
}

/**
 * Update the active filters bar UI
 */
function updateActiveFiltersUI() {
  // Show/hide the entire filters bar based on active filters
  if (activeFilters.length > 0 && currentState !== AppState.RESULTS) {
    activeFiltersBar.classList.remove('hidden');
    clearFiltersBtn.classList.remove('hidden');
  } else {
    activeFiltersBar.classList.add('hidden');
    clearFiltersBtn.classList.add('hidden');
  }
  
  // Render active filter pills
  activeFiltersList.innerHTML = activeFilters.map(filter => `
    <div class="active-filter-pill" data-filter="${filter}">
      <span>${filter}</span>
      <span class="remove-filter" data-filter="${filter}">
        <i class="fa-solid fa-xmark"></i>
      </span>
    </div>
  `).join('');
  
  // Add click handlers for remove buttons
  activeFiltersList.querySelectorAll('.remove-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFilter(btn.dataset.filter);
    });
  });
}

/**
 * Update filter tags visibility (hide selected ones)
 */
function updateFilterTagsVisibility() {
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    const filterName = tag.querySelector('span').textContent;
    if (activeFilters.includes(filterName)) {
      tag.classList.add('hidden');
    } else {
      tag.classList.remove('hidden');
    }
  });
}

/**
 * Update dropdown items state (mark selected ones)
 */
function updateDropdownItemsState() {
  const dropdownItems = document.querySelectorAll('.filter-dropdown-item');
  
  dropdownItems.forEach(item => {
    const filterName = item.dataset.filter;
    if (activeFilters.includes(filterName)) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

/**
 * Keyboard Navigation
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Enter key - go to results
    if (e.key === 'Enter' && currentState === AppState.SUGGESTIONS) {
      e.preventDefault();
      transitionTo(AppState.RESULTS);
    }
    
    // Escape key - go back
    if (e.key === 'Escape') {
      if (currentState === AppState.RESULTS) {
        transitionTo(AppState.SUGGESTIONS);
      } else if (currentState === AppState.SUGGESTIONS) {
        searchInput.value = '';
        hideSearchControls();
        transitionTo(AppState.INITIAL);
      }
    }
  });
  
  // Enter badge click
  enterBadge.addEventListener('click', () => {
    if (searchInput.value.trim().length > 0) {
      transitionTo(AppState.RESULTS);
    }
  });
}

/**
 * State Transition Handler
 * Manages smooth transitions between screens
 */
function transitionTo(newState) {
  if (currentState === newState) return;
  
  // Update search input based on state
  if (newState === AppState.RESULTS) {
    searchInput.value = searchInput.value || 'Wanneer mag een levend persoon een lever doneren?';
  }
  
  // Hide all sections first
  filterSection.classList.add('hidden');
  filterSection.classList.remove('visible');
  
  suggestionsSection.classList.remove('visible');
  resultsSection.classList.remove('visible');
  
  // Small delay for smooth transition
  setTimeout(() => {
    switch (newState) {
      case AppState.INITIAL:
        filterSection.classList.remove('hidden');
        // Only show filters bar if filters are active
        if (activeFilters.length > 0) {
          activeFiltersBar.classList.remove('hidden');
        } else {
          activeFiltersBar.classList.add('hidden');
        }
        hideSearchControls();
        break;
        
      case AppState.SUGGESTIONS:
        suggestionsSection.classList.add('visible');
        // Only show filters bar if filters are active
        if (activeFilters.length > 0) {
          activeFiltersBar.classList.remove('hidden');
        } else {
          activeFiltersBar.classList.add('hidden');
        }
        // Animate suggestion items
        animateSuggestionItems();
        break;
        
      case AppState.RESULTS:
        resultsSection.classList.add('visible');
        activeFiltersBar.classList.add('hidden');
        hideSearchControls();
        // Animate result sections
        animateResults();
        break;
    }
  }, 150);
  
  currentState = newState;
}

/**
 * Animate suggestion items with stagger effect
 */
function animateSuggestionItems() {
  const items = suggestionsSection.querySelectorAll('.suggestion-item, .quick-link-item');
  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

/**
 * Animate results with stagger effect
 */
function animateResults() {
  const sections = [
    resultsSection.querySelector('.main-result'),
    resultsSection.querySelector('.highlighted-card'),
    resultsSection.querySelector('.related-section'),
    resultsSection.querySelector('.bottom-search')
  ];
  
  sections.forEach((section, index) => {
    if (section) {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        section.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}

/**
 * Reset to initial state (for demo purposes)
 */
function resetDemo() {
  searchInput.value = '';
  hideSearchControls();
  transitionTo(AppState.INITIAL);
}

// Expose reset function globally for debugging
window.resetDemo = resetDemo;
