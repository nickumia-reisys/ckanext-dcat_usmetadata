[![CircleCI](https://circleci.com/gh/GSA/ckanext-dcat_usmetadata.svg?style=svg)](https://circleci.com/gh/GSA/ckanext-dcat_usmetadata)

# ckanext-dcat_usmetadata

This extension provides a new dataset form for [inventory.data.gov](https://inventory.data.gov/). The form is tailored to managing metadata  meeting the [DCAT-US Schema](https://resources.data.gov/resources/dcat-us/).


## Usage


### Dependencies

This module currently depends on the [USMetadata app](https://github.com/GSA/USMetadata) for server-side validation and rendering.
Make sure it is enabled in CKAN's plugins.


### Installation

To install this package, activate CKAN virtualenv (e.g. "source /path/to/virtenv/bin/activate"), then run

```
(virtualenv) pip install -e git+https://github.com/GSA/ckanext-dcat_usmetadata@master#egg=ckanext-dcat_usmetadata
(virtualenv) python setup.py develop
```

In your CKAN .ini file add `dcat_usmetadata` to your enabled plugins:

`ckan.plugins = [YOUR PLUGINS HERE...] dcat_usmetadata`


## Development

### Prerequisites

These tools are required for development.

- [Node.js](https://nodejs.org/) 12.x
- [GNU Make](https://www.gnu.org/software/make/)

Install global dependencies.

    $ make setup


### Setup

Install Node.js dependencies.

    $ yarn install

Build the JS application.

    $ yarn run build

Build the docker containers.

    $ make build

Run the tests.

    $ make test


## Testing

Run `make test` to run the tests locally inside a docker container

You need to have docker and docker-compose installed locally for the tests to run.

## Building the App

Build and move latest builds of JS code:

```
# make sure to run it from root directory of the project
$ npm run build
```

## Metadata App

The Metadata APP is a [Create React App](https://create-react-app.dev/)-bootstrapped project.

To run the app use `make app-up`

### Development

We recommend using [cosmos](https://reactcosmos.org/) for development.

Run CKAN locally (`make up`) and get the Admin user's API Key. Add a test org for development purposes and get the id. Add these values to indicated place in `/metadata-app/src/index.js`.

Run `make app-cosmos` to start the cosmos server, which will watch the `metadata-app/src` directory for changes.

## Local development and end-to-end testing

We use the [inventory app](https://github.com/GSA/inventory-app) locally for development and end-to-end (e2e) testing.

To build the latest JS code and update assets in the CKAN extension, you can run the following command from the root directory of this project:

```
$ yarn build
```

For convenience, we have prepared a single script that you can run to perform end-to-end tests locally. Don't forget to `yarn build` prior to running e2e tests:

```
$ yarn e2e
```

Note, it may be necessary to remove cached images when rebuilding the inventory app docker container, in order to ensure that the new usmetadata-app template is included in the build. If you want to make sure that you aren't using cached builds, you can try:

```
$ docker-compose build --no-cache --pull ckanext-dcat_usmetadata_app
```

With the dcat_usmetadata extension running in the inventory app, use the following command to run e2e tests:

```
$ npx cypress run
```

To run e2e tests interactively use:

```
$ npx cypress open
```

## Ways to Contribute

The Data.gov team manages all Data.gov updates, bugs, and feature additions via GitHub's public [issue tracker](https://github.com/GSA/ckanext-dcat_usmetadata/issues) in this repository.

If you do not already have a GitHub account, you can [sign up for GitHub here](https://github.com/). In the spirit of open source software, everyone is encouraged to help improve this project. Here are some ways you can contribute:

* by reporting bugs
* by suggesting new features
* by translating content to a new language
* by writing or editing documentation
* by writing specifications
* by writing code and documentation (no pull request is too small: fix typos, add code comments, clean up inconsistent whitespace)
* by reviewing pull requests.
* by closing issues

### Submit Great Issues

* Before submitting a new issue, check to make sure a similar issue isn't already open. If one is, contribute to that issue thread with your feedback.
* When submitting a bug report, please try to provide as much detail as possible, i.e. a screenshot or gist that demonstrates the problem, the technology you are using, and any relevant links.

### Ready for your Help
Issues labeled [help wanted](https://github.com/GSA/data.gov/labels/help%20wanted) make it easy for you to find ways you can contribute today.

## Public Domain
This project constitutes a work of the United States Government and is not subject to domestic copyright protection under 17 USC § 105. Additionally, we waive copyright and related rights in the work worldwide through the CC0 1.0 [Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
