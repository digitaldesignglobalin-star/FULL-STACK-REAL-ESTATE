$ErrorActionPreference = 'Stop'
$dirPath = "D:\developer content\real-estate backup\cloned\FULL-STACK-REAL-ESTATE"

try {
    $items = Get-ChildItem -LiteralPath $dirPath -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'nul' }
    foreach ($item in $items) {
        Write-Host "Found: $($item.FullName)"
        
        # Get handle to file
        $handle = $null
        $type = [System.Diagnostics.Process]::GetCurrentProcess().MainModule.ModuleName
        
        # Try deletion via FileInfo with full control
        $fileInfo = New-Object System.IO.FileInfo($item.FullName)
        $fileInfo.Delete()
        Write-Host "Deleted successfully"
    }
} catch {
    Write-Host "Error: $_"
    
    # Alternative: create empty file and overwrite, then delete
    try {
        $nulPath = Join-Path $dirPath "temp_del.txt"
        [System.IO.File]::WriteAllText($nulPath, "test")
        Remove-Item $nulPath -Force
        Write-Host "Created and deleted temp file successfully"
    } catch {
        Write-Host "Alternative also failed: $_"
    }
}