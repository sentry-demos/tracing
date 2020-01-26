docker stop flask;
# docker rm $(docker ps -a -q -f status=exited) <--- don't need this line if you run container with '--rem''
docker image rm flask:1501

# docker image rm $(docker ps -a -q -f <something_based_on_name_or_tag>)