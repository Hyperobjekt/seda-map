# Contributing to the Educational Opportunity Explorer

The following is a set of guidelines for contributing to the [Educational Opportunity Explorer](https://edopportunity.org/explorer). The Educational Opportunity Explorer is hosted and managed by [Hyperobjekt](https://hyperobjekt.com/). These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table Of Contents
- [Table Of Contents](#table-of-contents)
- [What should I know before I get started?](#what-should-i-know-before-i-get-started)
  - [Packages In Use](#packages-in-use)
  - [Application Structure](#application-structure)
    - [Constants (`src/modules/explorer/app/constants`)](#constants-srcmodulesexplorerappconstants)
    - [Modules (`/src/modules`)](#modules-srcmodules)
  - [Application State](#application-state)
  - [Environment Variables](#environment-variables)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Making a Contribution](#making-a-contribution)
    - [Local development](#local-development)
  - [Pull requests](#pull-requests)
- [Deploying the explorer](#deploying-the-explorer)
  - [Code lifecycle](#code-lifecycle)
- [Coding Style](#coding-style)
  - [React Component Styleguide](#react-component-styleguide)
  - [Styling / CSS](#styling--css)

## What should I know before I get started?

### Packages In Use

The main libraries and frameworks used in this project include:

- React
- [Zustand](https://github.com/pmndrs/zustand) (for hook based application state management)
- [Material UI](https://material-ui.com/) (for base components)
- [Mapbox](https://mapbox.com): provided map styles and vector tile hosting.
- MapboxGL (for map rendering)
- [E-Charts](https://www.echartsjs.com/) (for scatterplots)
- [Algolia](https://www.algolia.com/) (for search)

Relevant, but not included in this project is the [Educational Opportunity Website](https://github.com/Hyperobjekt/seda-site). Any issues relevant to the website that are not in the explorer should be filed there.

### Application Structure

#### Constants (`src/modules/explorer/app/constants`)

The constants folder contains the configuration values and language used within the explorer.

Common tasks relevant to this folder include:

- updating the links in the fly open menu (`site.js`)
- updating configuration options (`metrics.js`, `regions.js`, `demographics.js`)

#### Modules (`/src/modules`)

The application structure attempts to maintain a modularized approach, where pieces of functionality are contained within their own module.

- `/src/modules`: most modules in this folder are general purpose and do not contain application logic for SEDA or the explorer, with the exception of the `/explorer` module.
- `/src/modules/explorer`: this folder contains modules for the explorer that have application logic specific to the explorer
  - `./app/`: contains configuration, hooks, selectors used throughout the entire application. also contains components for the application layout.
  - `./compare/`: location comparison dialog module
  - `./errors/`: error messaging module, with components and hooks for displaying error messages to the user
  - `./filters/`: components and hooks used for filtering data in the explorer
  - `./help/`: components and hooks used for the help panel
  - `./loader/`: components and hooks that handle loading data for the explorer
  - `./location/`: components and hooks for the location panel and selected locations
  - `./map/`: module for the explorer map
  - `./menu/`: module for the site menu
  - `./panels/`: module for various side panels used in the explorer
  - `./routing/`: module for handling routing in the explorer
  - `./scatterplot/`: module for the explorer scatterplots
  - `./search/`: module for SEDA data search
  - `./sharing/`: module for social sharing components of the explorer
  - `./tooltip/`: module for the tooltip displayed when hovering map / scatterplot

### Application State

Application state is managed through a few different zustand stores, located in `/src/modules/explorer/app/hooks`

- `useDataOptions.js`: store for selected data options
- `useSiteStore.js`: store for site configuration (menu and social sharing)
- `useUiStore.js`: store for UI state settings (e.g. active dialogs, chart visibility)

When using data from the stores, it is important to only pull the data needed in order to prevent additional re-renders. There are a number of helper hooks that combine selections from the stores above that should cover most cases of selections from the stores.

### Environment Variables

Before you can get everything running you will need to create a local environment variables file called `.env.local`. This file contains API keys used for accessing Mapbox, Algolia, and other services used within the application. The `.env.local` file contains the following variables:

```sh
REACT_APP_MAPBOX_ACCESS_TOKEN=    # mapbox token 
REACT_APP_MAPBOX_USER=            # mapbox username
REACT_APP_ALGOLIA_ID=             # algolia ID for search
REACT_APP_ALGOLIA_KEY=            # algolia key for search
REACT_APP_DATA_ENDPOINT=          # endpoint with static data files
REACT_APP_SHOW_PR=                # 1 to show Puerto Rico data, 0 to hide
REACT_APP_TILESET_SUFFIX=         # suffix used for the tileset name (e.g. 4-1-0 for v4.1.0 tilesets)
```

If you require any of these values, ask for them on Slack or look in the "Hyperobjekt Assets" folder on drive (Hyperobjekt Assets > SEDA > Development).

## How Can I Contribute?

### Reporting Bugs

If you have identified a bug in the Educational Opportunity Explorer, [create an issue](https://github.com/Hyperobjekt/seda-map/issues/new/choose) for the bug using the "Bug Report" template.

### Suggesting Features

This section guides you through submitting a new feature request for the Educational Opportunity Explorer, including completely new features and minor improvements to existing functionality.

To suggest a new feature, [create an issue](https://github.com/Hyperobjekt/seda-map/issues/new/choose) for the bug using the "Feature Request" template.

### Making a Contribution

To contribute to the code base, first assign yourself to the corresponding issue on the [issues page](https://github.com/Hyperobjekt/seda-map/issues).

Contributions can been classified as:

- **Feature**: introduces new functionality to the application
- **Change**: changes or enhances existing functionality in the application
- **Fix**: fixes a bug in the application

Before development begins, the work item should have an issue that has been flagged as ready for development. If the work item is a new feature, it should have an approved spec outlining the functionality that will be developed and a wireframe showing what it will look like.

#### Local development

Create a branch in your repository using a name based on what type of contribution is being made:

- **Feature**: `feature/issue-{ISSUE_ID}`
- **Change**: `change/issue-{ISSUE_ID}`
- **Fix**: `fix/issue-{ISSUE_ID}`

Perform all of your development in this local branch. When you are ready, push the branch to GitHub.

### Pull requests

Create a pull request of your branch to the `master` branch whenever you have code that:

- is ready to be merged into the code base
- requires some review or have questions from another team member

If the feature or code is not ready, mark it with "WIP" (work in progress) in the title or as a label.

If you require a review of the code, assign someone on the team as a reviewer.

Once your code is ready to be merged into the code base, mark it for review by another team mate

Before a pull request is approved it must meet the following requirements:

- must pass linting, tests, or any other checks performed in Travis CI.
- must have code used for debugging purposes removed (e.g. `console.log`) or handled in a way that it does not print to the console in a production environment
- must follow conventions established for the project, or provide reason for bypassing conventions

## Deploying the explorer

### Code lifecycle

When deploying new code to the explorer, the code will proceed through the following steps:

1. **Development**: development happens locally and is pushed to branches in the repository named by the contribution type (see [Local Development](#local-development)). When local development is complete a pull request is submitted to the master branch.
2. **Master**: the `master` branch contains the working copy of the current code base. once your code is merged into the `master` branch a live copy can be viewed at dev.edopportunity.org/explorer
3. **Staging**: when a new version of the working copy in the `master` branch is ready to be deployed, it is merged into the `staging` branch. a live copy of the code in the staging environment can be seen at staging.edopportunity.org/explorer
4. **Production**: once the new version has been tested and approved on the staging site it is merged into the `production` branch. code in the `production` branch is deployed to the live version of the explorer at edopportunity.org/explorer

## Coding Style

### React Component Styleguide

When creating React components

- :white_check_mark: opt for using functional components with hooks over class based components
- :white_check_mark: opt to keep presentation logic separate from application logic by using presentational and container components.

typically we try to follow patterns used throughout the [React Patterns](https://reactpatterns.com/) website.

### Styling / CSS

- if modifying the style of a base component provided by React Material, do so in the Material Theme used by the app (`/src/style/theme.js`)
- styling specific to components is done on the component levels using [React Material Styles](https://material-ui.com/styles/basics/), typically with the [Higher-order Component API](https://material-ui.com/styles/basics/#higher-order-component-api), but feel free to use whichever method you feel is suited to the piece you are developing.
