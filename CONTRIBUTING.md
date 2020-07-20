# Contributing to the Educational Opportunity Explorer

The following is a set of guidelines for contributing to the [Educational Opportunity Explorer](https://edopportunity.org/explorer).  The Educational Opportunity Explorer is hosted and managed by [Hyperobjekt](https://hyperobjekt.com/). These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Packages in use](#packages-in-use)
  * [Application Structure](#application-structure)
  * [Application State](#application-state)
  * [Environment Variables](#environment-variables)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Features](#suggesting-features)
  * [Making a Contribution](#making-a-contribution)
  * [Pull Requests](#pull-requests)

[Deploying the explorer](#deploying-the-explorer)
  * [Code Lifecycle](#code-lifecycle)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [React Component Styleguide](#react-component-styleguide)

[Resources](#resources)

## What should I know before I get started?

### Packages In Use

The main libraries and frameworks used in this project include:

  - React
  - Redux (for application state)
  - [Material UI](https://material-ui.com/) (for base components)
  - [Mapbox](https://mapbox.com): provided map styles and vector tile hosting.
  - MapboxGL (for map rendering)
  - [E-Charts](https://www.echartsjs.com/) (for scatterplots)
  - [Algolia](https://www.algolia.com/) (for search)

Some pieces of functionality have been separated into their own separate module so they can be reused on the container site.  These modules are:

  - `react-seda-scatterplot`: provides base functionality for rendering charts with SEDA data
  - `react-seda-search`: allows searching locations in SEDA data

Relevant, but not included in this project is the [Educational Opportunity Website](https://github.com/Hyperobjekt/seda-site).  Any issues relevant to the website that are not in the explorer should be filed there.

### Application Structure

#### Constants (`src/constants`)

The constants folder contains the configuration values and language used within the explorer.

Common tasks relevant to this folder include:
  - updating some text used in the explorer (`en.js`)
  - updating the links in the fly open menu (`site.js`)
  - updating options related to the seda data, such as scatterplot ranges (`dataOptions.js`)

#### Components (`/src/components`)

This structure of the `/src/components` folder is based on [atomic design principles](https://bradfrost.com/blog/post/atomic-web-design/) as described below:


  - **Atoms** (`src/components/atoms`): smallest base components (e.g. icons, markers)
  - **Molecules** (`/src/components/molecules`): small components build from one or more atom components (e.g. Panel, Card, etc.)
  - **Organisms** (`/src/components/organisms`): organisms tie together molecules and atoms to provide more complex but isolated functionality (e.g. Header, SiteMenu, Scatterplot, etc.)
  - **Templates** (`/src/components/templated`): templates determine how the organisms, molecules and atoms are arranged on a page. (e.g. Section)

All of the components in the atomic design structure (atoms, molecules, organisms, templates) are [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). Presentational components are  components that render based on the props provided and do not depend on connecting to the data store or loading / mutating data.

##### Connected Components(`/src/components/seda`)

Unlike all the presentational components listed above, these components are connected to the state data store provided by Redux. (e.g. `SedaHeader`) 
  
Connected components are responsible for getting data from the application state and providing it to the presentational components to render the current view.

> **tangent:** structuring components this way has been working okay for me (lane), but i'm not convinced it is the best way. the goal has been to keep the presentational components separate so that they could be utilized in future project if need be.  open to changes or discussion on slack if anyone has suggestions.

#### Modules (`/src/modules`)

This folder contains reducers and selectors for getting and mutating data in the application state, or router.

Common tasks relative to this folder would include:
  - making modifications to routing behaviour (`router.js`)
  - adding custom getters for configuration based on the `dataOptions` constant. (`config.js`)
  - adding / modifying reducers that mutate application state based on actions (all reducers referenced in `index.js`)

#### Actions (`/src/actions`)

This folder contains all actions that are dispatched to the reducers to handle application state mutation.

#### Other Folders

  - `/src/hooks`: contains any custom hooks that are used in the project
  - `/src/css`: styles for components in the project
  - `/src/style`: contains the material UI theme for setting overrides to the material UI components.
  - `/src/utils`: contains general purpose utility functions and data fetching from map tiles
  - `/src/views`: contains default `App` component and page component for the explorer.

### Application State

The application state is managed by Redux.  The store is configured in `/src/store.js` contains middleware for:

  - Sending events to analytics when certain actions happen.
  - Saving user selections to local storage so they are restored when the user returns.

The application is only read and mutated by [connected components](#connected-components). The application state is structured as follows:

```js
{
  map: {
    coords: {}, // contains x / y coords for the tooltip
    viewport: {}, // contains parameters for the current view of the map
    idMap: {} // contains a mapping of feature IDs on the map to school IDs in the data set
  },
  scatterplot: {
    data: {
      schools: {}, // school data stored here
      districts: {}, // districts data stored here
      counties: {} // counties data stored here
    },
    loaded: {}, // tracks loading status for scatterplots
    error: false // true if error fetching data
  },
  search: {
    results: {}, // contains current results for search
    errorMessage: null // contains error message if there's an error fetching from search
  },
  selected: {
    all: [], // all selected location IDs
    counties: [], // all selected county IDs
    districts: [], // selected district IDs
    schools: [] // selected schoold IDs
  },
  features: {}, // contains all features that full data has been loaded for
  ui: {
    menuOpen: false, // true when menu is open
    helpOpen: false, // true when help is open
    embedOpen: false, // true when embed dialog is open
    legendType: 'chart', // legend type to show on map
    shareLinkOpen: false, //  true if share link dialog open
    reportLoading: false, // true if report is loading
    reportError: false // true if there is an error generating report
  },
  active: {}, // contains the active feature
  tooltip: {
    xVar: 'all_ses', // contains x variable to show in tooltip
    yVar: 'all_avg' // contains y variable to show in tooltip
  },
  help: [],
  flagged: {
    sped: [], // IDs of special ed schools
    lep: [], // IDs of language program schools
    gifted: [] // IDs of gifted schools
  },
  loading: [] // contains IDs of data that is still loading
}
```

### Environment Variables

Before you can get everything running you will need to create a local environment variables file called `.env.local`.  This file contains API keys used for accessing Mapbox, Algolia, and other services used within the application.  The `.env.local` file contains the following variables:

```
REACT_APP_MAPBOX_ACCESS_TOKEN=
REACT_APP_MAPBOX_USER=
REACT_APP_ALGOLIA_ID=
REACT_APP_ALGOLIA_KEY=
REACT_APP_DATA_ENDPOINT=https://data.edopportunity.org/dev/
REACT_APP_BUILD_ID=dev
REACT_APP_SUBFOLDER=
```

If you require any of these values, ask for them on Slack.

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

Before development begins, the work item should have an issue that has been flagged as ready for development.  If the work item is a new feature, it should have an approved spec outlining the functionality that will be developed and a wireframe showing what it will look like.

#### Local development

Create a branch in your repository using a name based on what type of contribution is being made:

  - **Feature**: `feature/issue-{ISSUE_ID}`
  - **Change**: `change/issue-{ISSUE_ID}`
  - **Fix**: `fix/issue-{ISSUE_ID}`

Perform all of your development in this local branch.  When you are ready, push the branch to GitHub.

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

  1. **Development**: development happens locally and is pushed to branches in the repository named by the contribution type (see [Local Development](#local-development)).  When local development is complete a pull request is submitted to the master branch.
  2. **Master**: the `master` branch contains the working copy of the current code base. once your code is merged into the `master` branch a live copy can be viewed at dev.edopportunity.org/explorer (IN PROGRESS)
  3. **Staging**: when a new version of the working copy in the `master` branch is ready to be deployed, it is merged into the `staging` branch.  a live copy of the code in the staging environment can be seen at staging.edopportunity.org/explorer
  4. **Production**: once the new version has been tested and approved on the staging site it is merged into the `production` branch.  code in the `production` branch is deployed to the live version of the explorer at edopportunity.org/explorer



## Styleguides

### Git Commit Messages

* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### React Component Styleguide

When creating React components

  - :white_check_mark: opt for using functional components with hooks over class based components
  - :white_check_mark: opt to keep presentation logic separate from application logic by using presentational and container components.

### Styling / CSS

  - if modifying the style of a base component provided by React Material, do so in the Material Theme used by the app (`/src/style/materialTheme.js`)
  - all other styles should be in `/src/css` and placed accordingly based on the atomic design structure

## Resources

The following are some complementary resources to the concepts and frameworks used in this application:

  - [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux): Free Redux introductory course, Redux is used for state management in the app.
  - [Atomic Design Overview](https://bradfrost.com/blog/post/atomic-web-design/): Atomic design is the methodology for the design system and determines how the components and styles are structured.

