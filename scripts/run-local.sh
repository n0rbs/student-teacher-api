DB_PASSWORD=$1
docker run --name dbsvc-school -p 3306:3306 -e MYSQL_ROOT_PASSWORD=${DB_PASSWORD} -d mysql:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
sleep 1
docker cp ./db.sql dbsvc-school:/
# docker exec dbsvc-school /bin/sh -c "mysql -u root -p<PASSWORD> < /db.sql"