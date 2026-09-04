---
name: eBook Finance Tracking System
about: Set up payment/income tracking for 3001.epub
title: 'Feature: eBook Finance Tracking for 3001.epub'
labels: enhancement, feature
assignees: askforkris90
---

## Description
Implement a comprehensive finance tracking system for the 3001.epub ebook that monitors:
- Views/impressions 
- Sales transactions
- Revenue generation
- Income calculations from both views and direct sales

## Acceptance Criteria
- [ ] Create `data/ebooks.json` with metadata for 3001.epub including description, photo, and price
- [ ] Create `js/finance-tracker.js` with functions to:
  - Track views and sales events
  - Calculate total revenue from views and sales
  - Maintain transaction history
  - Export statistics
- [ ] Create `finance-dashboard.html` with a visual dashboard showing:
  - Total revenue summary
  - Total views and sales counts
  - Average revenue per sale
  - eBook metadata and cover image
  - Recent transaction list
- [ ] Create `tests/finance-tracker.test.js` with unit tests for:
  - Revenue calculations
  - Transaction logging
  - Data aggregation functions
- [ ] Update main website to include link to finance dashboard
- [ ] Add documentation in README.md about the finance system

## Implementation Details

### File Structure
```
lankysitemedia/
├── data/
│   └── ebooks.json
├── js/
│   └── finance-tracker.js
├── finance-dashboard.html
├── tests/
│   └── finance-tracker.test.js
└── README.md (updated)
```

### Revenue Model
- **View Revenue**: $0.10 per view (configurable)
- **Sale Revenue**: Full price ($9.99) per purchase
- **Total Revenue** = (Views × View Rate) + (Sales × Price)

## Related Issues
- None currently

## Tasks
- [ ] Create JSON data structure for ebook metadata
- [ ] Implement JavaScript finance tracker module
- [ ] Build visual dashboard interface
- [ ] Write comprehensive tests
- [ ] Update documentation
