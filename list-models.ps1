# List available Gemini models
$apiKey = "AIzaSyC53Otwcfc6RIv2wRz-NmOWikbXhNPM_LY"
$uri = "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey"

Write-Host "Fetching available Gemini models..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $uri -Method Get -TimeoutSec 15
    
    Write-Host "`nSUCCESS! API Key is valid." -ForegroundColor Green
    Write-Host "Available Models:" -ForegroundColor Yellow
    
    foreach ($model in $response.models) {
        if ($model.name -like "*gemini*") {
            Write-Host "- $($model.name) ($($model.version))" -ForegroundColor White
            Write-Host "  Description: $($model.description)" -ForegroundColor Gray
            Write-Host "  Supported Generation Methods: $($model.supportedGenerationMethods -join ', ')" -ForegroundColor DarkGray
            Write-Host ""
        }
    }
} catch {
    Write-Host "`nFAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Details: $errorBody" -ForegroundColor Yellow
        } catch {}
    }
}
