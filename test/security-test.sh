#!/bin/bash


# Load environment variables
if [ -f tourii-backend/.env ]; then
    source tourii-backend/.env
elif [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Validate environment variables
if [ -z "$API_KEYS" ]; then
    echo "Error: API_KEYS not set in .env file"
    exit 1
fi

API_KEY=${API_KEYS%%,*} # Get first API key from the list
API_VERSION="1.0.0"     # Current API version
echo "Using API Key: $API_KEY"
echo "Using API Version: $API_VERSION"

echo -e "\nTesting Security Headers..."
curl -v -s \
    -H "x-api-key: $API_KEY" \
    -H "accept-version: $API_VERSION" \
    http://localhost:4000/test/headers 2>&1 | grep -E "^< " | grep -E "Content-Security-Policy|Cross-Origin|X-"

echo -e "\nTesting Rate Limiting..."
for i in {1..5}
do
    echo -e "\nRequest $i:"
    response=$(curl -w "\nHTTP Status: %{http_code}" -s \
        -H "x-api-key: $API_KEY" \
        -H "accept-version: $API_VERSION" \
        http://localhost:4000/stories/sagas)
    echo "$response"
    if [[ $i -lt 5 ]]; then
        sleep 0.2  # Small delay between requests
    fi
done

echo -e "\nTesting CORS with unauthorized origin..."
curl -H "Origin: https://example.com" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: $API_VERSION" \
     -v http://localhost:4000/test/headers 2>&1 | grep -E "Access-Control-|< HTTP|^< "

echo -e "\nTesting CORS with authorized origin..."
curl -H "Origin: https://app.tourii.xyz" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: $API_VERSION" \
     -v http://localhost:4000/test/headers 2>&1 | grep -E "Access-Control-|< HTTP|^< "

echo -e "\nTesting OPTIONS preflight request..."
curl -X OPTIONS \
     -H "Origin: https://app.tourii.xyz" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, x-api-key, accept-version" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: $API_VERSION" \
     -v http://localhost:4000/test/headers 2>&1 | grep -E "Access-Control-|< HTTP|^< "

echo -e "\nTesting API Key Validation..."
echo "Without API Key:"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "accept-version: $API_VERSION" \
     http://localhost:4000/test/api-key

echo -e "\n\nWith Invalid API Key:"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "x-api-key: invalid-key" \
     -H "accept-version: $API_VERSION" \
     http://localhost:4000/test/api-key

echo -e "\n\nWith Valid API Key:"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: $API_VERSION" \
     http://localhost:4000/test/api-key

echo -e "\nTesting Version Validation..."
echo "Without Version (with valid API key):"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "x-api-key: $API_KEY" \
     http://localhost:4000/test/version

echo -e "\n\nWith Invalid Version:"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: invalid" \
     http://localhost:4000/test/version

echo -e "\n\nWith Old Version:"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: 0.9.0" \
     http://localhost:4000/test/version

echo -e "\n\nWith Current Version:"
curl -s -w "\nHTTP Status: %{http_code}" \
     -H "x-api-key: $API_KEY" \
     -H "accept-version: $API_VERSION" \
     http://localhost:4000/test/version 