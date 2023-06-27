## HOW TO RUN
1. Install Docker
2. Run `docker-compose up --build`
3. API is exposed at port 3000


## Sample Request

```curl
curl --location 'http://127.0.0.1:3000/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "dafasdfasdf@gmail.com",
    "phoneNumber": "9749275960" 
}'
```