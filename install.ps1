yarn install
yarn install:front
yarn build
yarn build:front

if (!(Test-Path -Path ".\dist\public\dashboard") -and !(Test-Path -Path ".\dist\public\svrwidget")) {
    New-Item -Path ".\dist\public\dashboard" -ItemType Directory
    New-Item -Path ".\dist\public\svrwidget" -ItemType Directory
}

Move-Item -Path ".\views\dashboard\build\*" -Destination ".\dist\public\dashboard" 
Move-Item -Path ".\views\svrwidget\build\*" -Destination ".\dist\public\svrwidget" 

