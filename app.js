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
const TYPING_DELAY = 300; // ms before showing "Enter" hint

// DOM Elements
const searchInput = document.getElementById('searchInput');
const enterHint = document.getElementById('enterHint');
const filterSection = document.getElementById('filterSection');
const suggestionsSection = document.getElementById('suggestionsSection');
const resultsSection = document.getElementById('resultsSection');
const searchBtn = document.getElementById('searchBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initSearchInput();
  initSuggestions();
  initFilterTags();
  initKeyboardNavigation();
});

/**
 * Search Input Handler
 * Shows suggestions and "Enter" hint while typing
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
      
      // Show "Enter" hint after brief delay
      typingTimer = setTimeout(() => {
        enterHint.classList.add('visible');
      }, TYPING_DELAY);
    } else {
      // Return to initial state
      enterHint.classList.remove('visible');
      if (currentState === AppState.SUGGESTIONS) {
        transitionTo(AppState.INITIAL);
      }
    }
  });
  
  // Handle focus
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0 && currentState === AppState.INITIAL) {
      transitionTo(AppState.SUGGESTIONS);
    }
  });
}

/**
 * Suggestions Click Handler
 */
function initSuggestions() {
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  
  suggestionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const query = item.dataset.query || item.textContent;
      searchInput.value = query;
      transitionTo(AppState.RESULTS);
    });
    
    // Add stagger animation class
    item.classList.add(`stagger-${index + 1}`);
  });
  
  // Quick links
  const quickLinks = document.querySelectorAll('.quick-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', () => {
      transitionTo(AppState.RESULTS);
    });
  });
}

/**
 * Filter Tags Handler
 */
function initFilterTags() {
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Toggle selected state
      tag.classList.toggle('selected');
      
      // Visual feedback
      const icon = tag.querySelector('.icon');
      if (icon && icon.classList.contains('fa-circle')) {
        icon.classList.toggle('fa-circle');
        icon.classList.toggle('fa-circle-check');
      }
    });
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
        enterHint.classList.remove('visible');
        transitionTo(AppState.INITIAL);
      }
    }
  });
  
  // Search button click
  searchBtn.addEventListener('click', () => {
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
        enterHint.classList.remove('visible');
        break;
        
      case AppState.SUGGESTIONS:
        suggestionsSection.classList.add('visible');
        // Animate suggestion items
        animateSuggestionItems();
        break;
        
      case AppState.RESULTS:
        resultsSection.classList.add('visible');
        enterHint.classList.remove('visible');
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
  const items = suggestionsSection.querySelectorAll('.suggestion-item, .quick-link');
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
  enterHint.classList.remove('visible');
  transitionTo(AppState.INITIAL);
}

// Expose reset function globally for debugging
window.resetDemo = resetDemo;
