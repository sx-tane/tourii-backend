Write-Host "Testing Security Headers..."
$headers = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method GET -Verbose
Write-Host "Security Headers:"
$headers.Headers | Format-Table -AutoSize

Write-Host "`nTesting Rate Limiting..."
for ($i = 1; $i -le 5; $i++) {
    Write-Host "`nRequest $i:"
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/test/rate-limit" -Method GET
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
$headers = @{
    "Origin" = "https://example.com"
}
$response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method GET -Headers $headers
Write-Host "CORS Headers (Unauthorized):"
$response.Headers | Where-Object { $_.Key -like "Access-Control*" } | Format-Table -AutoSize

Write-Host "`nTesting CORS with authorized origin..."
$headers = @{
    "Origin" = "https://app.tourii.xyz"
}
$response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method GET -Headers $headers
Write-Host "CORS Headers (Authorized):"
$response.Headers | Where-Object { $_.Key -like "Access-Control*" } | Format-Table -AutoSize

Write-Host "`nTesting OPTIONS preflight request..."
$headers = @{
    "Origin" = "https://app.tourii.xyz"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "Content-Type"
}
$response = Invoke-WebRequest -Uri "http://localhost:4000/test/headers" -Method OPTIONS -Headers $headers
Write-Host "Preflight Response Headers:"
$response.Headers | Where-Object { $_.Key -like "Access-Control*" } | Format-Table -AutoSize 