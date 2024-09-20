# {
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

# {
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

# mutation {
#   createUser(
#     groupIds: null
#     username: "ticto_mariano"
#     password: "password7"
#     name: "Mariano Tambis"
#     image: null
#     email: null
#     birthdate: null
#   ) {
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

# mutation {
#   updateUser(
#     id: 8
#     groupIds: null
#     username: "ticto_head"
#     password: "password7"
#     name: "Mariano Tambis"
#     image: null
#     email: null
#     birthdate: null
#   ) {
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

# mutation {
#   deleteUser(id: 7) {
#     id
#   }
# }