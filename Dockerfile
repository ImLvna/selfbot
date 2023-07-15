FROM node:18

# install python and make
RUN apt-get update && \
  apt-get install -y python3 build-essential && \
  apt-get purge -y --auto-remove

RUN groupadd -r runner && \
  useradd --create-home --home /home/runner -r -g runner runner

USER runner
WORKDIR /home/runner

COPY --chown=runner:runner package.json yarn.lock ./
RUN yarn install
VOLUME [ "/home/runner" ]

COPY --chown=runner:runner  . .

RUN yarn run build

ENTRYPOINT [ "yarn", "run", "prod" ]
