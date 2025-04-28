# Load environment variables
if (Test-Path tourii-backend/.env) {
    Get-Content tourii-backend/.env | ForEach-Object {
        if ($_ -match '^([^#].+)=(.+)$') {
            $key = $matches[1]
            $value = $matches[2]
            Set-Item -Path "Env:$key" -Value $value
        }
    }
} elseif (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#].+)=(.+)$') {
            $key = $matches[1]
            $value = $matches[2]
            Set-Item -Path "Env:$key" -Value $value
        }
    }
} else {
    Write-Host "Error: .env file not found"
    exit 1
}

# Validate environment variables
if (-not $env:API_KEYS) {
    Write-Host "Error: API_KEYS not set in .env file"
    exit 1
}

$API_KEY = $env:API_KEYS.Split(',')[0] # Get first API key from the list
$API_VERSION = "1.0.0"                  # Current API version

Write-Host "Using API Key: $API_KEY"
Write-Host "Using API Version: $API_VERSION"

Write-Host "`nTesting Security Headers..."
$headers = @{
    "x-api-key" = $API_KEY
    "accept-version" = $API_VERSION
}
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method GET -Headers $headers
    Write-Host "Security Headers:"
    $response.Headers | Where-Object { $_.Key -match "Content-Security-Policy|Cross-Origin|X-" } | Format-Table -AutoSize
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`nTesting Rate Limiting..."
for ($i = 1; $i -le 5; $i++) {
    Write-Host "`nRequest $i:"
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/test/rate-limit" -Method GET -Headers $headers
        Write-Host "Status Code: $($response.StatusCode)"
        Write-Host "Rate Limit Headers:"
        $response.Headers | Where-Object { $_.Key -like "X-RateLimit*" } | Format-Table -AutoSize
    }
    catch {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        Write-Host "Rate limit exceeded"
    }
    if ($i -lt 5) {
        Start-Sleep -Milliseconds 200
    }
}

Write-Host "`nTesting CORS with unauthorized origin..."
$corsHeaders = $headers.Clone()
$corsHeaders["Origin"] = "https://example.com"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method GET -Headers $corsHeaders
    Write-Host "CORS Headers (Unauthorized):"
    $response.Headers | Where-Object { $_.Key -like "Access-Control*" } | Format-Table -AutoSize
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "CORS error: Unauthorized origin"
}

Write-Host "`nTesting CORS with authorized origin..."
$corsHeaders["Origin"] = "https://app.tourii.xyz"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method GET -Headers $corsHeaders
    Write-Host "CORS Headers (Authorized):"
    $response.Headers | Where-Object { $_.Key -like "Access-Control*" } | Format-Table -AutoSize
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "CORS error: $($_.Exception.Message)"
}

Write-Host "`nTesting OPTIONS preflight request..."
$preflightHeaders = @{
    "Origin" = "https://app.tourii.xyz"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "Content-Type, x-api-key, accept-version"
    "x-api-key" = $API_KEY
    "accept-version" = $API_VERSION
}
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method OPTIONS -Headers $preflightHeaders
    Write-Host "Preflight Response Headers:"
    $response.Headers | Where-Object { $_.Key -like "Access-Control*" } | Format-Table -AutoSize
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Preflight error: $($_.Exception.Message)"
}

Write-Host "`nTesting API Key Validation..."
Write-Host "Without API Key:"
try {
    $noKeyHeaders = @{ "accept-version" = $API_VERSION }
    Invoke-WebRequest -Uri "http://localhost:4000/test/api-key" -Method GET -Headers $noKeyHeaders
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}

Write-Host "`nWith Invalid API Key:"
try {
    $invalidKeyHeaders = @{
        "x-api-key" = "invalid-key"
        "accept-version" = $API_VERSION
    }
    Invoke-WebRequest -Uri "http://localhost:4000/test/api-key" -Method GET -Headers $invalidKeyHeaders
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}

Write-Host "`nWith Valid API Key:"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/test/api-key" -Method GET -Headers $headers
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`nTesting Version Validation..."
Write-Host "Without Version:"
try {
    $noVersionHeaders = @{ "x-api-key" = $API_KEY }
    Invoke-WebRequest -Uri "http://localhost:4000/test/version" -Method GET -Headers $noVersionHeaders
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}

Write-Host "`nWith Invalid Version:"
try {
    $invalidVersionHeaders = @{
        "x-api-key" = $API_KEY
        "accept-version" = "invalid"
    }
    Invoke-WebRequest -Uri "http://localhost:4000/test/version" -Method GET -Headers $invalidVersionHeaders
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}

Write-Host "`nWith Old Version:"
try {
    $oldVersionHeaders = @{
        "x-api-key" = $API_KEY
        "accept-version" = "0.9.0"
    }
    Invoke-WebRequest -Uri "http://localhost:4000/test/version" -Method GET -Headers $oldVersionHeaders
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}

Write-Host "`nWith Current Version:"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/test/version" -Method GET -Headers $headers
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
} 