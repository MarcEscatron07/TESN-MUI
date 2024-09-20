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
#   }
# }

# query { # SHOW SPECIFIC USER
#   user(id: 6) {
#     id
#     groupIds
#     username
#     password
#     name
#     image
#     email
#     birthdate
#   }
# }

# mutation { # CREATE USER
#     createUser(
#         groupIds: null, 
#         username: "ticto_mariano", 
#         password: "password7", 
#         name: "Mariano Tambis", 
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

# mutation { # UPDATE USER
#     updateUser(
#         id: 8,
#         groupIds: null, 
#         username: "ticto_head", 
#         password: "password7", 
#         name: "Mariano Tambis", 
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

# mutation { # DELETE USER
#     deleteUser(
#         id: 7,
#     ) {
#         id
#     }
# }