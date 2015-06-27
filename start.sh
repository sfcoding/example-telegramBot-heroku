#!/bin/bash
#sudo docker build -t test-face .
#sudo docker run -p 8080:80 -v `pwd`:/home/app/src test-face /sbin/my_init -- nodemon src/app.js
sudo docker-compose build
sudo docker-compose up
