# Distinctiveness and Complexity
My final project is a streaming platform named JamsHub built with Django/DjangoRestFramework for the backend and Vite/React for the frontend in addition to the material UI library and Sass for styling.
JamsHub is an app where users with a spotify premium membership can gather in rooms and listen to their favorite content from audio books, podcasts and music tracks by either creating a room or joining an existing one.
The room has a live chat feature built with django channels and web sockets, another feature of the room is that users can also vote to skip the current song.
The spotify content in the room is fetched through soptify's web API and spotify's web SDK in addition to web sockets and django channels for synchronization.
Turnning my project from an idea to a functionnig web application was quite challenging and I will be explainnig the developement process in detail in the following sections.

# What’s contained in each file
## Backend folder:
- **Models.py file:** 
  In models.py in addition to the user model I have my three models: 
  - Room model
  - SpotifyToken model
  - Vote model  
- **Serializers.py file:**
  DjangoRestFramework serializers allow complex data such as querysets and model instances to be converted to native Python datatypes that can then be easily rendered into JSON, XML or other content types, the ModelSerializer class that I use for the User model ans the Room model provides a useful shortcut for creating serializers that deal with model instances and querysets.
- **Views.py file:**
  For the views of my project I m using DjangoRestFramework's generic views that allows me to quickly build API views that map closely to my database models in addition to DjangoRestFramework's APIViews for certain views.
  The file consists of ten views and a function:
  - RegisterUserView: This view is for creating a new user.
  - GetUsername: This view sends a response to the frontend of the username.
  - ListCreateRoom: This view is for creating and listing rooms.
  - HandleRoom: This view is for retrieving, updating and deleting rooms.
  - AuthURL: This view Returns a URL that we can go to, to authenticate our spotify application.
  - spotify_callback function: This function is called due to a request by the spotify server when the authentication is successful, the spotify server provides a code with in the request that I can use to make a post request to save the necessary tokens that allow access to the spotify content.
  - IsAuthenticated: This view checks if the user is already authenticated to spotify or not.
  - StartOrResumeSong: This view is responsible for starting and resuming the jam by sending a post request with the album id and the track id.
  - SearchView: sends a get request with a queryset to spotify to get the search results.
  - AddVote: This view handles deleting, saving or clearing votes in the room.
  - AddOrDeleteGuest: This view handles deleting or saving users in the room.
- **Urls.py file:** 
  In this file I have the url paths for the views.
- **Credentials.py file:**
  This file contains the necessary credentials for authenticating and communicating with spotify through api requests and web sockets. The crendentials are the spotify's client ID and client Secret, the redirect URI and the redirect URL.
- **Routing.py file:**
  This file contains the routes for the consumers, the routes in asynchronous programming are equivalent to the urls in synchronous programing, the frontend intiates a web socket connenction by calling the specific route (the handshake phase), then the consumer accepts the request and handles the rest accordingly.
  I have included four routes in this file for four consumers.
- **Consumers.py file:**
  The consumers is where the asynchronous websocket backend logic is handled.
  The general purpose of consumers is to handle instantanuous/real-time communication that is different from the usual synchronous api requests, it uses a bi-directionnel protocol where server and clients are pushing messages at any time (full duplex communication).
  The four consumers in my file are the following:
  - SyncConsumer: This consumer is designed to establish the synchronization of the jam for all users in the same room and that includes starting the jam and the playback state.
  - GuestConsumer: This consumer tracks the number of guests in the room.
  - VoteConsumer: This consumer tracks the number of votes in the room.
  - ChatConsumer: This consumer is responsible for displaying the messages sent by the users of the room.
- **Util.py file:**
  As it's name suggests the util file has some utilities (functions) that help the spotify views like:
  - Retrieving the user spotify token.
  - Creating or refreshing the spotify tokens.

## Frontend folder:
The frontend folder is a React directory installed by Vite, the necessary files that I have created aside from the default React configuration and modules files are the following:
### components folder:
this folder contains all the components of the app.
- **ProtectedRoute file:**
  This component checks if the user is logged in before redirecting to the homePage by checking the access token first, if it's expired, it uses the refresh token to request a new access token to access the homepage, if the refresh token is also expired, it redirects the user to login in order to get a new refresh and access token.
- **CreateOrJoin file:**
  This component renders a an h2 tag and a p tag that introduces the user to the website, it also renders the two MUI buttons where the user can either create or join a room.
- **CreateRoomForm file:** 
  This component renders a form where the user can customize the room he wants to create by specifying if the guest can pause and the votes required to skip the song.
- **JoinRoomForm file:**
  This component renders a form where the user can provide the code to join the room with that specific code.
- **RoomFeatures file:**
  This component renders a display of the room features mentionned earlier.
- **SideBar file:** 
  This component renders a sideBar of the app where we can find the title of the app, a list of clickable items (home, contact us, logout).  
- **Picture file:**
  This component Renders a responsive image that represents sharing tracks.
- **Drawer:**
  The Drawer is the sideBar for the mobile version of the web app.
- **AudioPlayer:**
This component creates a visual representation of the track being played in the room from the album picture, the title, the name of the artist, the playback button and a link to the spotify's web app.
It uses different MUI components like the Card, IconButton and Typographie.
- **MPSeaarch:**
  This component creates a visual representation of the search results, the spotify server responds with an array with 20 items.
  I chose to display only 2 items in a single page for better cordination with the app's design, and I used the MUI pagination component for a smooth transition between the pages.
- **MP/MobileMP:**
  The MP(Music Player) is the component responsible for displaying all the spotify's content from the connection flow with the Spotify Web SDK, the audioPlayer and the search results in the created room
  The MobileMP is mobile version of the MP component.
- **JoinedMP/MobileJoinedMP:**
  the JoinedMP is the Joined room version of the MP component, the main difference is there is no search component in this because choosing the jam in the room can only be done by the host and not the guest.
  The MobileJoinedMP is mobile version of the JoinedMP component.
- **RoomInfo:**
  The RoomInfo is where the information about the room are displayed, where the user can vote to skip the song, and where the host can delete the room.
- **JoinedRoomInfo:**
  This component is the same as the RoomInfo component except that instead of the deleting room, the guest has a leave room button.
- **RoomChat:**
  This component is where responsible for establishing and displaying the messages of the chat in the room. 
### pages folder:
The pages folder is where I have all the pages of my project, the pages are jsx functions that renders the styled/responsive page components:
- **HomePage file:** 
  The homePage is the first interaction of the user with the web app, so I tried to make it as descriptive of the nature of the app as possible, it renders the **SideBar**, the **RoomFeatures**, the **Picture**, the **JoinRoomForm**, the **CreateRoomForm** and the **CreateOrJoin** components.
- **LoginPage file:**
  The LoginPage renders a form where the user can provide his username and password to login to the website.
- **RegisterPage file:** 
  The RegisterPage renders a form where the user can provide a username and password to register to the website.
- **RoomCreatedPage file:**
  The RoomCreatedPage is the room page where the user gets redirected when creating a new one, the user is the host of the room that contains the **RoomInfo**, the **MP**, and **LiveChat** components.
  The host can skip the song at anytime, and can also participate in the vote to skip the current song.
  The host does not have the option of leaving the room but can delete it at anytime. 
- **RoomJoinedPage file:**
  The RoomJoinedPage is the room page where the user gets redirected when joinning a room, the user is a guest in the room that contains the **JoinedRoomInfo**, the **JoinedMP**, and **LiveChat** components.
  The guest can vote to skip the song and interact with other guests in the room chat.
  The guest can leave the room at anytime.
- **ErrorPage file:** 
  The error page is renderd when random urls are requested that dosen't exist in the backend.
### api.js file:
The api.js file is where I setup my axios for api requests, I use an interceptor to add an Authorization header to each request if the ACCESS_TOKEN is available in localStorage.
### App.jsx file:
This file is where the routing of the pages is configured.
### constants.js:
This file is declaring two contants the ACCESS_TOKEN and REFRESH_TOKEN.
### main.jsx file:
This file is where I am rendering the App in the root div of the DOM and wrapping it in MUI dark mode theme.

# Additional information:  
- Some files are not described because they are React/Django configuratrion or styling files.
- The users authentication is acheived through jwt tokens.
- The app requires from the users a spotify premium membership.
