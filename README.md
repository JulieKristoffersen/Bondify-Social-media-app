Bondify
Project Goal
To apply JavaScript techniques to implement the front-end functionality for a social media application using the Noroff Social API.

User Stories
User with @noroff.no or @stud.noroff.no email can register a profile

Registered user can login

Authenticated user can create a blog entry

User can view a post content feed

User can filter the post content feed

User can search the post content feed

User can view a post content item by ID

User can create a post content item

User can update a post content item

User can delete a post content item

Setup
Clone this repository

Run:

bash
Copy
Edit
npm install
For development with your CSS framework (Tailwind/Bootstrap/SASS), run:

bash
Kopier
Rediger
npm run css-framework
API
This project uses the Noroff Social API V2.
API documentation and endpoints can be found here:
https://noroff.dev/api/social

The API requires both a JWT token and an API Key for all social endpoints.
You must register an account and login to receive your JWT token.
Create an API Key following the documentation here.

Note: The API supports the HTTP methods GET, POST, PUT, and DELETE for fetching, creating, updating, and deleting social media posts.

Usage
Register using a valid Noroff email address (@noroff.no or @stud.noroff.no).

Login to receive JWT token and API Key stored in localStorage.

View the post feed with filtering and searching features.

Create, update, and delete posts after authentication.

Profile page allows managing your own posts with edit and delete options.

Code Documentation
This project uses JSDoc to document functions. 

Additional Notes
The project uses localStorage for storing JWT tokens and API keys.

Responsive design ensured with CSS frameworks.

Error handling is included to inform users on failed operations.

