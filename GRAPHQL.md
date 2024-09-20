# # Yoga GraphiQL URL: http://192.168.100.29:3000/api/graphql

# mutation { # CREATE USER
#     createUser(
#         groupIds: null, 
#         username: "ticto_marcus", 
#         password: "password1", 
#         name: "Marc Benedict Escatron", 
#         image: null, 
#         email: null, 
#         birthdate: null
#     ) {
#         id
#         groupIds, 
#         username, 
#         password, 
#         name, 
#         image, 
#         email, 
#         birthdate
#     }
# }

# query { # SHOW ALL USERS
#   users {
#     id
#     groupIds
#     username
#     password
#     name
#     image
#     email
#     birthdate
#     createdAt
#     updatedAt
#   }
# }

# query { # SHOW SPECIFIC USER
#   user(id: 1) {
#     id
#     groupIds
#     username
#     password
#     name
#     image
#     email
#     birthdate
#     createdAt
#     updatedAt
#   }
# }

# mutation { # UPDATE USER
#     updateUser(
#         id: 1,
#         groupIds: null, 
#         username: "ticto_marc", 
#         password: "password1", 
#         name: "Marc Benedict Escatron", 
#         image: null, 
#         email: null, 
#         birthdate: null, 
#         updatedAt: null
#     ) {
#         id
#         groupIds, 
#         username, 
#         password, 
#         name, 
#         image, 
#         email, 
#         birthdate, 
#         updatedAt 
#     }
# }

# mutation { # DELETE USER
#     deleteUser(
#         id: 1,
#     ) {
#         id
#     }
# }