# SoPra FS22 - Client of The Game

## Introduction

The Game is a card game invented by Steffen Benndorf where the Goal is to play all cards on the 4 decks in the right order.
The Goal of this software is to be able to play The Game remote und in real time with your friends.

This repository of the Client side of The Game and needs two servers to have a running Game ([main server](https://github.com/sopra-fs22-group-11/SoPra22-group11-TheGame-Server) and [Zoom server](https://zoomvideosdk-signature.herokuapp.com/))

The scope of this project is to have a running application and a playable Game, specifically:
- you can login and adjust your profile
- you can waite in a waiting room until are your friends have joined 
- in the game, all restrictions from the rules are implemented
- a User is able to leave the game at any time
- the users are able to have a voice call during the Game

Out of scope for this project:
- having a bug free application
- playing different games on the same time
- storing on a separate database all the users and scores

## Technologies

### Client

On the client side is written in JavaScript using React and Node.js. For the UI we are using CSS and SCSS.

Tutorials:

- [React documentation](https://reactjs.org/)
- [CSS](https://www.w3schools.com/Css/), [SCSS](https://sass-lang.com/documentation/syntax), and [HTML](https://www.w3schools.com/html/html_intro.asp)!
- [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) offers declarative routing for React. It is a collection of navigational components that fit nicely with the application. 
- [react-hooks](https://reactrouter.com/web/api/Hooks) let you access the router's state and perform navigation from inside your components.

For requesting data from the server, the client uses two different ways. For the login and user organisation we have a REST Interface.
During the Game we are using a Websocket interface to have a bidirectional communication between client and server. There exist a second server for generating the Zoom signature. This request will be done as an HTTP-request.


#### REST Interface

add some rest interfaces


#### Websocket Interface

add some websocket interfaces


### Server

On the Server side we are using Java with bootRun. A detailed description you will find in the [server repository](https://github.com/sopra-fs22-group-11/SoPra22-group11-TheGame-Server)


## High Level components

Header

Game

Sockclient

## Launch & Deployment

### Prerequisites and Installation
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

```npm install```

Run this command before you start your application for the first time. Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Illustrations

## Roadmap

As described above, there are some features which are not scope of this project. The following features can be added to the tool:
- playing different games on the same time
- storing on a separate database all the users and scores
- add on other voice API which is not chargeable

We thank in advance to all the voluntary developer who have fun to improve our Game. Please make sure to tag us :)

## Authors and acknowledgment

Authors of this project:
- [najma98](https://github.com/najma98)
- [saro7890](https://github.com/Saro7890) 
- [mariinja](https://github.com/Mariinja)
- [Desteb](https://github.com/Desteb)
- [tikost](https://github.com/tikost)

We thank the whole TA Team of the SoPra 2022 course which helped us during the creation on this project and our TA Jan Kreischer for supporting us.
> A Special thanks to Lucas Pelloni and Kyrill Hux for working on the template and answering our questions.

## License 

