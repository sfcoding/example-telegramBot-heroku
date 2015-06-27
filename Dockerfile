# Use phusion/passenger-full as base image. To make your builds reproducible, make
# sure you lock down to a specific version, not to `latest`!
FROM phusion/passenger-full:0.9.15

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

#Install Latex
#RUN apt-get update && apt-get install texlive-latex-base texlive-latex-extra texlive-latex-recommended texlive-base texlive-science texlive-xetex texlive-lang-italian texlive-lang-english -y

### In Dockerfile:
RUN mkdir -p /etc/my_init.d
ADD build/start_node.sh /etc/my_init.d/start_node.sh

RUN npm install -g nodemon

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install && cp -a /tmp/node_modules /home/app

WORKDIR /home/app

EXPOSE 80

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
