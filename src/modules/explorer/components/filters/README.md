# SEDA Filter Panel

This module contains the filtering UI for the SEDA explorer. The UI outputs a JSON filter object that is put in the filter store.

## Available Filters

### Region Filtering

Provides a search input to show counties / districts / schools within a selected area.

- Default: United States (all)
- Counties will only allow State selection
- Districts will only allow State / County selection
- Schools will allow State / County / District selection

### Metric Ranges

Provides a select input to select `metric`, options include:

- Average Test Scores
- Learning Rates
- Trend in Scores
- Socioeconomic Status

### Limit Number

Provides a number input to set `n` value

- Default: 2000
- Min: 10
- Max: 15,000
- Any value over 5,000 should show a warning about impacting render time

### School Type Filters

Provides toggles to show / hide schools with certain flags

- Middle / Elementary / Combined
- Charter / Traditional Public / Magnet
- Rural / Suburban / Urban

> Note: These options only appear when viewing "schools"
