#!/bin/bash

echo "Testing Security Headers..."
curl -v -s http://localhost:4000/test/headers 2>&1 | grep -E "^< " | grep -E "Content-Security-Policy|Cross-Origin|X-"

echo -e "\nTesting Rate Limiting..."
for i in {1..5}
do
    echo -e "\nRequest $i:"
    response=$(curl -w "\nHTTP Status: %{http_code}" -s http://localhost:4000/test/rate-limit)
    echo "$response"
    if [[ $i -lt 5 ]]; then
        sleep 0.2  # Small delay between requests to ensure they're counted separately
    fi
done

echo -e "\nTesting CORS with unauthorized origin..."
curl -H "Origin: https://example.com" -v http://localhost:4000/test/headers 2>&1 | grep -E "Access-Control-|< HTTP|^< "

echo -e "\nTesting CORS with authorized origin..."
curl -H "Origin: https://app.tourii.xyz" -v http://localhost:4000/test/headers 2>&1 | grep -E "Access-Control-|< HTTP|^< "

echo -e "\nTesting OPTIONS preflight request..."
curl -X OPTIONS -H "Origin: https://app.tourii.xyz" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v http://localhost:4000/test/headers 2>&1 | grep -E "Access-Control-|< HTTP|^< " 