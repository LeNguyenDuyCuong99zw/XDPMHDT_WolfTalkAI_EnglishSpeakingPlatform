$apiKey = "AIzaSyB_YRM4zKSv6cgsld6bu69cDC5vIC8wAg8"
$models = @(
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite-001",
    "gemini-2.0-flash-lite",
    "gemini-exp-1206",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-preview-09-2025",
    "gemini-2.5-flash-lite-preview-09-2025",
    "gemini-3-pro-preview",
    "gemini-3-flash-preview",
    "gemini-3-pro-image-preview",
    "gemini-robotics-er-1.5-preview",
    "gemini-2.5-computer-use-preview-10-2025"
)

Write-Host "=== Checking available Gemini Models for Quota ===" -ForegroundColor Cyan
Write-Host "API Key: ...$($apiKey.Substring($apiKey.Length - 6))" -ForegroundColor Gray

foreach ($model in $models) {
    Write-Host "`nTesting model: $model ... " -NoNewline

    $uri = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$apiKey"
    
    # Simple prompt for text generation
    $body = @{ 
        contents = @(
            @{ 
                parts = @(
                    @{ text = "Hello" }
                ) 
            }
        )
        generationConfig = @{
            maxOutputTokens = 10
        }
    } | ConvertTo-Json -Depth 5

    try {
        $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "OK ✅" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response) {
            $status = $_.Exception.Response.StatusCode.value__
            if ($status -eq 429) {
                Write-Host "429 Rate Limited ⏳" -ForegroundColor Yellow
            } elseif ($status -eq 404) {
                Write-Host "404 Not Found ❌" -ForegroundColor DarkGray
            } else {
                Write-Host "Error $status ❌" -ForegroundColor Red
            }
        } else {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Small pause to avoid hitting rate limits just by testing
    Start-Sleep -Milliseconds 500
}
