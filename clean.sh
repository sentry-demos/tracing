# Removes exited containers
docker rm $(docker ps -a -q -f status=exited) 

# Removes images that didn't build successfully. they're marked as '<none>'
docker image prune

# or run:
# docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
