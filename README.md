# Jam Base Code

Jummy!

This base code is written for Gamedevjs Jam 2026 and adapted from my previous entry for Gamedevjs Jam 2025: [Stasis Doodle](https://supernapie.itch.io/stasis-doodle).

## Development code is in `src`.

Make sure to have node.js and npm installed.

```
npm install
```

Install the dependencies.

```
npm start
```

Run a local development server on http://localhost:4000 serving `src` directly. There is no need to build or watch the code.

There is no hot reloading, so you will need to refresh the page after making changes to the code.

## Build

### Production code is built to `dist`.

```
npm run build
```

Build the production code in `src` with Parcel and output it to `dist`. The `dist` folder is what you will deploy.

See https://parceljs.org/ for more details.

### Clean the `dist` folder.

```
npm run clean
```

## Public test server

During the Jam you can deploy to GitHub pages to share your game with others. Or to test it in different browsers and devices.

`.github/workflows/deploy.yml` is set up to automatically build and deploy to Github pages, on each push. Make sure to add `ACCESS_TOKEN` as a secret in your GitHub repository with a personal access token.

Read more about creating a personal access token here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

## Deploy to itch.io

```
npm run itch
```

Cleans the `dist` folder, builds the production code, and deploys it to itch.io using `butler`.

Make sure to have itch.io's `butler` command line tools installed and you're logged in.

See https://itch.io/docs/butler/ for more details.

Also in package.json, make sure to update the `itch` script with your own itch.io username and game slug.

## Colors

https://coolors.co/ff0000-ff7f00-ffff00-00ff00-0000ff-4b0082-8b00ff
