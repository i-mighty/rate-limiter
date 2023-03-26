# API Rate Limiter

Created by Josiah Adegboye.

Made with ❤️, Express, Docker, Redis and MongoDB.

## How to run

First clone the repo with

```
git clone https://github.com/i-mighty/rate-limiter
```

Then

```
cd ./rate-limiter
```

Next, start the services with docker

```
docker-compose up
```

Or start the services individually i.e

```
docker-compose up mongodb //For the mongodb database
docker-compose up server //For the express server
docker-compose up redis //For the redis in memory db
docker-compose up k6 //For the k6 tester
docker-compose up influxdb //For the influxdb database
docker-compose up grafana //For the grafana server
```

## Testing

To run tests, first start all the services by running

```
docker-compose up
```

Next run (in another terminal window)

```
yarn run limit-test
```

Or directly run the bash script:

```
yarn run limit-test
```

Running either of the above from the project root folder runs the k6 test scripts.
Click on the [grafana link](http://localhost:3000/d/k6/k6-load-testing-results) to see the test results.

Created by Josiah Adegboye
