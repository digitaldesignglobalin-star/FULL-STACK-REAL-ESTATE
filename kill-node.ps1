Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "D:\developer content\real-estate backup\cloned\FULL-STACK-REAL-ESTATE\.next" -ErrorAction SilentlyContinue
Write-Host "Done"