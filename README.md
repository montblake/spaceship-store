# Space Store
This project builds on a simple Express full-CRUD application using Mongoose/MongoDB to persist data for a fictional online store.

Incorporates two models: Products and Users. A simplified inventory/shopping cart system. User authentication and authorization using bcrypt,sessions, and custom middleware.

Additionally, the app links to a text-based browser game called SpaceBattle (on the home page). Eventually the storefront will evolve to tie directly into the game.

The app is read only for an unregistered guest. A logged in user can add products to their shopping cart (changing the inventory numbers) and view the cart. To add or edit products, you must be logged in with admin privileges. To explore the app as a registered user, you can make your own account or you could use:
### sample user
email: guest@guest.com\n
password: guest

### sample admin
email: admin@intergalactic.com\n
password: admin

## Project Personnel
Intergalactic Transport is a project developed by Blake Montgomery, a graduate of General Assembly's Software Engineering Immersive. Blake got his start coding with Standford's pandemic offering "Code in Place", returned for the second edition of "Code in Place" as a volunteer Section Leader, and recently served as an instructional associate at GA's Chicago campus. Once upon a time, he graduated summa cum laude from Middlebury College with a B.A. in Theatre, concentrations in Music and Physics, and a member of the Phi Beta Kappa honor society. After further study at the Dell'Arte School of Physical Theater and the Ecole Internationale du Theatre Jacques Lecoq, he spent many years working in the arts as an actor, director, technician, educator, administrator, and creator.