# If container fails to run, then you can use this. If container succeeds and running and you stop it, then don't need this
docker rm $(docker ps -a -q -f status=exited) 

# todo
# docker image rm $(docker ps -a -q -f <something_based_on_name_or_tag>)