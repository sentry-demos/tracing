# react
Run in it's own Node container, served on a port

## Run
1. ~~docker build -t react:1.5 .~~
2. docker build --build-arg AUTH_TOKEN=1234567 -t react:1.5 .
3. docker run --rm --name=react -p 5000:5000 react:1.5serve

#### Design Decisions
**The multi-stage build build**  
Can build it first `npm run deploy` then put static asset in the Dockerfile/build, this way only 1 build going on in docker

Can run the web build `npm run deploy` inside of the the docker container (less preferred?)

debates:  
https://medium.com/greedygame-engineering/so-you-want-to-dockerize-your-react-app-64fbbb74c217  
and  
https://dev.to/peterj/run-a-react-app-in-a-docker-container-kjn

Decided to not serve index.html from a flask endpoint. This would require the React bundle build + Flask server to all happen in the same container. If you're only developing for 1 of those apps then shouldn't have to re-deploy/build all together:  
https://medium.com/@riken.mehta/full-stack-tutorial-flask-react-docker-420da3543c91


## Troubleshooting
ignoring 'node_modules', 'build' or not

Node should be 12.14.1 LTS https://nodejs.org/en/ or 10.15.3