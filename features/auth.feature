Feature: Authentication

    Scenario: Authenticate existing user
        Given "users"
            """
            [{"username": "foo", "password": "bar"}]
            """

        When we post to auth
            """
            {"username": "foo", "password": "bar"}
            """

        Then we get "token"
        And we get "user"

    Scenario: Authenticate with wrong password returns error
        Given "users"
            """
            [{"username": "foo", "password": "bar"}]
            """

        When we post to auth
            """
            {"username": "foo", "password": "xyz"}
            """

        Then we get response code 400

    Scenario: Authenticate with non existing username
        Given "users"
            """
            [{"username": "foo", "password": "bar"}]
            """

        When we post to auth
            """
            {"username": "x", "password": "y"}
            """

        Then we get response code 400

    Scenario: Fetch resources without auth token
        When we get "/"
        Then we get response code 200

    Scenario: Fetch users without auth token
        When we get "/users"
        Then we get response code 401
        And we get "Access-Control-Allow-Origin" header
