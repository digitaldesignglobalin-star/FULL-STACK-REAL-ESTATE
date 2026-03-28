# Try to delete the nul file using different methods
$path = "D:\developer content\real-estate backup\cloned\FULL-STACK-REAL-ESTATE\nul"

# Method 1: Try to delete using cmd
$cmd = "cmd /C del /F `"$path`""
Invoke-Expression $cmd

# Method 2: Try using Explorer to delete (might prompt but work)
$shell = New-Object -ComObject Shell.Application
$folder = $shell.NameSpace((Split-Path $path))
$item = $folder.ParseName((Split-Path $path -Leaf))
if ($item) {
    $item.InvokeVerb("delete")
}

# Method 3: Check if file still exists
if (Test-Path $path) {
    Write-Host "File still exists"
    # Try getting file info
    $file = Get-Item $path -Force
    Write-Host "File info: $($file.Name), Size: $($file.Length)"
} else {
    Write-Host "File deleted successfully"
}