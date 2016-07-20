This app was built using the MEAN stack.

Features:
- User login
- Persisting user sessions on refresh
- Creating/editing/deleting posts in real time
- Database storage for posts by user
- Admin functionality to see all posts on platform

Process:
- App scaffolding generated using fsg (npm package)
- Two database models: User and Post
- Post has reference to User via 'author' field. This way relationship is 1 to 1 which is easier to manage in Mongo
- Standard CRUD endpoints for each route where needed. User route has a special endpoint to get all posts by user ID
- All ajax calls on the front end abstracted into the Post and User Factories
- Database is seeded with a default admin user. Username: admin, Password: mondorox

Challenges:
- Confirming a session is in place. The logic that gets the current logged in User is in the app.run block, but the states are registered in the app.config which runs before app.run. Therefore, for the /posts state, the posts were not being resolved when trying to get by user. This was solved by fetching the current user from the AuthService directly in the PostsFactory
