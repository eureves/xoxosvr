yarn install
yarn install:front
yarn build
yarn build:front

if (!(Test-Path -Path ".\dist\public\dashboard") -and !(Test-Path -Path ".\dist\public\svrwidget")) {
    New-Item -Path ".\dist\public\dashboard" -ItemType Directory
    New-Item -Path ".\dist\public\svrwidget" -ItemType Directory
} else {
    Remove-Item -Path ".\dist\public\dashboard\*" -Recurse -Force
    Remove-Item -Path ".\dist\public\svrwidget\*" -Recurse -Force
}

Move-Item -Force -Path ".\views\dashboard\build\*" -Destination ".\dist\public\dashboard\" 
Move-Item -Force -Path ".\views\svrwidget\build\*" -Destination ".\dist\public\svrwidget\" 

