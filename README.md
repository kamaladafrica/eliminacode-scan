## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Windows Package with docker

To package apps for windows with docker, from project root:

```bash
docker run --rm -ti \
--env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
--env ELECTRON_CACHE="/root/.cache/electron"  \
--env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
-v ${PWD}:/project \
-v ${PWD##*/}-node-modules:/project/node_modules \
-v ~/.cache/electron:/root/.cache/electron \
-v ~/.cache/electron-builder:/root/.cache/electron-builder \
electronuserland/builder:wine
```

Then inside docker:

```bash
yarn package-win
```

## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)
