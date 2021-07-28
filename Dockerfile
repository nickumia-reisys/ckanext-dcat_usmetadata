ARG CKAN_VERSION=2.8
FROM openknowledge/ckan-dev:${CKAN_VERSION}
ARG CKAN_VERSION

COPY . /srv/app
COPY . /srv/app/src_extensions/
WORKDIR /srv/app/src_extensions/

RUN apk add swig

# python cryptography takes a while to build
RUN if [[ "${CKAN_VERSION}" = "2.8" ]] ; then \
        pip install -r requirements-py2.txt -r dev-requirements.txt -e . ; else \
        pip install -r requirements.txt -r dev-requirements.txt -e . ; fi

WORKDIR /srv/app
