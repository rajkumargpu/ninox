@EventPattern('task.created')
handleTaskCreated(data) { /* enqueue notification.email */ }

@EventPattern('status.updated')
handleStatusUpdated(data) { /* … */ }

@EventPattern('deadline.passed')
handleDeadline(data) { /* … */ }
