# Routes API

## Development
BaseURL: http://localhost:8000/

sanctum/csrf-cookie

ApiURL: http://localhost:8000/api/

Middleware: auth:sanctum

Prefix: auth
- data GET
- logout GET

Prefix: user
- edit GET
- preferences GET
- edit PUT
- preferences PUT
- {user} GET
- change-password PUT

Prefix: topic
- create POST
- {topic} PUT
- {topic} DELETE

Prefix: post
- create POST
- {post} PUT
- {post} DELETE

Public routes:

Prefix: auth
- register POST
- login POST
- googleauth POST
- googleconfirm POST

Preifx: category
- '' GET
- {category} GET

Prefix: topic
- {topic} GET

Prefix: post
- /topic/{topic} GET (get all posts of one topic)