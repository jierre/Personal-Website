# FolioAi
#### Video Demo:  <https://www.youtube.com/watch?v=tQzJM5Lf634>
#### Description:
#### FolioAI

FolioAI is an interactive personal portfolio designed to go beyond the limitations of a traditional static portfolio. Instead of simply displaying information about me, my skills, and my projects, FolioAI allows visitors to actively interact with the website through real-time communication and an AI-powered assistant. The goal of the project was to create a portfolio that feels more like an interactive application while still remaining simple, fast, and easy to navigate.

The website uses a minimalist design because I wanted the content and functionality to remain the main focus. Rather than filling the interface with unnecessary visual elements, I used a clean layout, simple typography, consistent spacing, and subtle transitions. This makes the portfolio easier to navigate and allows visitors to quickly find information about my projects, skills, and experience without being distracted by the design.

#### Features
Interactive Portfolio

The main purpose of FolioAI is to present my skills, projects, and experience in an interactive way. Visitors can scroll through the different sections of the website and learn more about my background, technical skills, projects, and experience. The frontend was built using HTML5, CSS3, and JavaScript, with responsive layouts designed to work across different screen sizes.

The portfolio is structured so that visitors can navigate through the content without having to move between many different pages. This allows the website to function as a single interactive experience where important information can be accessed by simply scrolling through the page. JavaScript is used to add interactive behavior and manage different elements of the interface.

The project section is also designed to give visitors a better understanding of the applications and technologies I have worked with. Rather than only listing projects, the website provides additional information about their purpose, functionality, and technical implementation.

#### Real-Time Community Chat

One of the main interactive features of FolioAI is its real-time community chat. This allows visitors to communicate with each other directly through the portfolio and transforms the website from a simple information page into a more interactive platform.

I used Pusher to handle real-time message broadcasting. When a user submits a message, the request is first sent to the Flask backend. The backend processes and validates the message before allowing it to be broadcast through Pusher. Once the event is broadcast, connected users can receive the message immediately without manually refreshing their browsers.

This means that multiple users can have the chat open at the same time and see new messages as they are sent. The system uses event-based communication instead of requiring the browser to repeatedly request new messages from the server. This provides a smoother experience for users and demonstrates how real-time functionality can be integrated into a web application.

#### Chat Moderation

Because the chat is publicly accessible, allowing users to send anything without moderation could result in inappropriate or abusive messages. To address this problem, FolioAI includes a server-side moderation system that checks messages before they are sent to the global chat.

Every message passes through the Flask backend before it reaches the real-time chat. The project uses glin-profanity to detect profanity and common attempts to bypass filters. This includes techniques such as leetspeak, symbol injection, spacing tricks, and other variations of inappropriate words.

For example, users may attempt to replace letters with numbers or symbols in order to avoid a basic word filter. The moderation system is designed to identify these types of variations rather than relying only on exact word matching.

The moderation system is also connected to Supabase. A bad_words table stores additional words that can be blocked, including custom Tagalog slang and other words that may not be included in the default filter. These words are loaded when the server starts, allowing the active filter to use both the profanity library and the custom database entries.

This also makes it possible to update the custom word list without changing the main filtering logic inside the application. The database therefore acts as a persistent source for additional moderation rules.

If a message is rejected, the Flask backend returns an HTTP 400 response to the frontend. JavaScript then handles the response and displays an appropriate error message to the user. The rejected message is not broadcast to the chat, preventing it from being displayed to other users.

#### AI Assistant

FolioAI also includes an AI assistant powered by Google's Gemini API. Visitors can ask questions about my projects, skills, or the technologies used to build the website.

The assistant provides another way for visitors to explore my portfolio instead of requiring them to manually search through every section. For example, a visitor can ask about how a specific feature was implemented or what technologies were used in a particular project.

The frontend collects the user's question and communicates with the backend, which handles the request to the Gemini API. The response is then returned to the website and displayed through the AI assistant interface.

Integrating the Gemini API also allowed me to gain experience working with an external AI service and understanding how an application can send user input to an API and process the resulting response.

#### Technologies Used

#### Frontend
##### HTML5

HTML5 is used to create the structure of the portfolio and define the different sections and elements displayed to visitors.

##### CSS3

CSS3 is used to control the appearance of the website, including the minimalist layout, typography, spacing, responsiveness, animations, and visual transitions.

##### JavaScript

JavaScript handles the interactive behavior of the website. It is responsible for client-side interactions, sending requests to the backend, handling chat messages, displaying responses, processing errors, and updating elements of the page dynamically.

#### Backend

##### Python

Python is used for the server-side programming of FolioAI. It handles the application's backend logic and communication between the frontend and external services.

##### Flask

Flask is the web framework used to create the backend and API endpoints. It receives requests from the frontend, processes chat messages, performs moderation, communicates with Supabase, and handles requests involving the Gemini API and Pusher.


#### Database

##### Supabase

Supabase is used for persistent data storage. FolioAI uses a Supabase database to store the custom bad_words table used by the chat moderation system. The application retrieves these words and incorporates them into the active moderation system when the server starts.

#### Real-Time Communication

##### Pusher

Pusher is responsible for real-time communication within the community chat. It broadcasts chat events to connected users, allowing messages to appear immediately without requiring page refreshes or constant polling.

#### AI

##### Gemini API

The Gemini API powers the AI assistant. It receives questions from visitors and generates responses that are displayed directly within the portfolio.

#### Project Files

The main frontend files contain the structure, styling, and interactive behavior of the website. The HTML files define the different sections and elements displayed to users, including the portfolio content, project information, chat interface, and AI assistant interface.

The CSS files control the visual presentation of the website. They define the layout, typography, spacing, responsive behavior, animations, transitions, and other visual elements used throughout the portfolio.

The JavaScript files handle the client-side functionality of FolioAI. They manage interactions with the user interface, send requests to the Flask backend, process responses, handle chat submissions, display error messages, and update the page when new information is received.

The Python Flask application contains the server-side logic of FolioAI. It defines the API endpoints used by the frontend, processes incoming requests, performs chat moderation, communicates with Supabase, and handles integrations with external services such as Pusher and Gemini.

The project also contains configuration and dependency files required to run the Flask application and deploy it properly. These files specify the packages and settings needed by the application.

Environment variables are used for sensitive credentials and API keys so that these values are not directly exposed in the source code. This includes credentials required to communicate with external services such as Supabase, Pusher, and Gemini.