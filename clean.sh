# If container fails to run, then you can use this. If container succeeds and running and you stop it, then don't need this
docker rm $(docker ps -a -q -f status=exited) 

# clean images
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
#or
docker image prune
