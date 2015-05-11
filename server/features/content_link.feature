Feature: Link content in takes

    @auth
    Scenario: Send Content and continue from personal space
        Given "desks"
        """
        [{"name": "Sports"}]
        """
        When we post to "archive"
        """
        [{"guid": "123", "type":"text", "headline": "test1", "guid": "123", "state": "draft", "task": {"user": "#CONTEXT_USER_ID#"}}]
        """
        And we post to "/archive/123/move"
        """
        [{"task": {"desk": "#desks._id#", "stage": "#desks.incoming_stage#"}}]
        """
        Then we get OK response
        When we post to "archive/123/link"
        """
        [{}]
        """
        Then we get OK response
        When we get "archive"
        Then we get list with 3 items
        """
        {
            "_items": [
                {
                    "groups": [
                        {"id": "root", "refs": [{"idRef": "main"}]},
                        {
                            "id": "main",
                            "refs": [
                                {
                                    "headline": "test1",
                                    "residRef": "123",
                                    "sequence": 1
                                },
                                {
                                    "headline": "test1",
                                    "sequence": 2
                                }

                            ]
                        }
                    ],
                    "type": "composite",
                    "package_type": "takes"
                },
                {
                    "headline": "test1",
                    "type": "text",
                    "linked_in_packages": [{"package_type": "takes"}]
                },
                {
                    "guid": "123",
                    "headline": "test1",
                    "type": "text",
                    "linked_in_packages": [{"package_type": "takes"}]
                }
            ]
        }
        """
