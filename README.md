# 9292 Pebble app
This repository holds the fundamental basics for a 9292 watch app for the Pebble. The app is currently in the pebble app store.

##Status: no location on various devices
The pebble android app on my OnePlus is not working. Even Swarm has no location access. I cannot update it when Pebble isn't updating their android app.


(update 2016) Not sure what current status is, some apps work now, but for example Swarm still gets no location access.

### Pebble timeline UI/OS
This whole app doesn't make sense anymore.
In the past, you had multiple watchfaces loaded on your watch.
This isn't the case anymore.
The app can stay a watchface, if and only if,
time is added in the top bar (1h work). (look at loading screen, it has already been build)
For now, I do not think I will ever fix this code.
It has worked, but dependancies changed, I'm sorry.
Good luck with it ;)

## What is does
It looks at the location of the user and the hour and day of the week to determine where to go.
(e.g. when in the morning on a workday, it knows you want to go to work)

### Goal
The purpose of this app is to create a watchface, not an app!
This means no buttons work, which makes this app more easy to use.
Just specify the locations (e.g. work) and schedules (e.g. workdays 6-11am)
once and always get the direction,
based on current location.


This is based on my 'Studenten OV'; in the morning I want to get to my University/Internship,
and the remaining time (defaultDestination), it routes me home.
Currently, you can specify as many locations/schedules as you want, and one defaultDestination.

## What to do
Feel free to fork / create pull req.
Notify user when location is not available.
New insight! The HTML page just is not returning any lat and long, maybe it api of google has changed, will be fixed soon!

### Current status
Working and in pebble store. GUI is ugly but functional.

## Contact
Feel free to contact me (in dutch) if you have questions and or suggestions.
