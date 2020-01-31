# Containers - removes 'exited' containers
docker rm $(docker ps -a -q -f status=exited) 

# Images - removes failed image builds. their 'REPOSITORY' attribute says '<none>'
docker image prune

# Images - removes failed image builds. their 'REPOSITORY' attribute says '<none>'
# docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
