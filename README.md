# Twitch music and video requests from user rewards.

![widget and dashboard preview](https://i.imgur.com/kQTQocY.png)

How to use?

1. Clone repo.
2. Fill the ```.env``` following the ```.env.example```.
3. Install dependencies (with ```install.ps1``` script or ```yarn install```).
4. Build the server and start (with ```start.ps1``` script or ```yarn build && yarn start```).

At localhost:8000/ is the homepage (WIP). Login with twitch.

At localhost:8000/widget is the media widget, add it to the scene in OBS as the Browser source.

At localhost:8000/dashboard is the dashboard, you can add it as the doc in OBS, or just use it in the browser.
