# Simple endpoint tests for local backend
# Usage: run in PowerShell while backend is running

$base = 'http://localhost:4000'

function Json($o) { $o | ConvertTo-Json -Depth 10 }

function Try-Invoke($method, $url, $body = $null, $headers = $null) {
    Write-Host "\n==> $method $url"
    try {
        if ($method -eq 'GET') {
            $resp = Invoke-RestMethod -Uri $url -Method GET -UseBasicParsing -Headers $headers
        } else {
            $json = $null
            if ($body -ne $null) { $json = $body | ConvertTo-Json }
            $resp = Invoke-RestMethod -Uri $url -Method $method -UseBasicParsing -Headers $headers -Body $json -ContentType 'application/json'
        }
        Write-Host "Status: success"
        Write-Host (Json $resp)
        return @{ ok = $true; body = $resp }
    } catch {
        Write-Host "Status: FAILED"
        Write-Host $_.Exception.Message
        return @{ ok = $false; error = $_.Exception.Message }
    }
}

# 1. Root
$r1 = Try-Invoke 'GET' "$base/"

# 2. Products
$r2 = Try-Invoke 'GET' "$base/products"

# 3. Register a new user
$email = "testuser_{0}@example.com" -f ([guid]::NewGuid().ToString().Substring(0,8))
$pw = 'password123'
$body = @{ email = $email; password = $pw; firstName = 'Test'; lastName = 'User' }
$r3 = Try-Invoke 'POST' "$base/auth/register" $body

if ($r3.ok) {
    $token = $r3.body.data.accessToken
    Write-Host "Received accessToken (len=$($token.Length))"

    # 4. Login with same credentials
    $bodyLogin = @{ email = $email; password = $pw }
    $r4 = Try-Invoke 'POST' "$base/auth/login" $bodyLogin

    # 5. Create vendor profile
    if ($r4.ok) {
        $tok = $r4.body.data.accessToken
        $hdrs = @{ Authorization = "Bearer $tok" }
        $vendorBody = @{ businessName = "Test Business"; description = "Created by test script" }
        $r5 = Try-Invoke 'POST' "$base/vendors" $vendorBody $hdrs

        # 6. Get vendor/me
        $r6 = Try-Invoke 'GET' "$base/vendors/me" $null $hdrs
    }
}

Write-Host "\nTests complete. Review outputs above."
