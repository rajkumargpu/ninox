Feature: End-to-end task lifecycle
  Scenario: Recruiter creates a task and candidate completes
    Given the API is running
    When I create a new task with candidate email "alice@example.com"
    Then the Email Worker should receive a notification to "alice@example.com"
    When the candidate marks the task InProgress
    Then the coordinator should enqueue an email for recruiter
    When the candidate marks the task Completed
    Then the coordinator should enqueue a completion email