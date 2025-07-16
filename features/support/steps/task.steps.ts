import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import { EmailWorkerMock } from './world';
const feature = loadFeature('features/task_lifecycle.feature');

defineFeature(feature, test => {
  let taskId: string;

  test('Recruiter creates a task and candidate completes', ({ given, when, then }) => {
    given('the API is running', () => {
      // assume services are up
    });

    when(/I create a new task with candidate email "(.+)"/, async (email) => {
      const res = await request('http://localhost:3000').post('/api/tasks').send({ candidateEmail: email, recruiterEmail: 'r@c.com' });
      taskId = res.body.id;
    });

    then(/the Email Worker should receive a notification to "(.+)"/, async (email) => {
      expect(EmailWorkerMock).toHaveReceived({ to: email });
    });

    when('the candidate marks the task In-Progress', async () => {
      await request('http://localhost:3000').patch(`/api/tasks/${taskId}/status`).send({ newStatus: 'In-Progress' });
    });

    then('the coordinator should enqueue an email for recruiter', () => {
      expect(EmailWorkerMock).toHaveReceived({ to: 'r@c.com' });
    });

    when('the candidate marks the task Completed', async () => {
      await request('http://localhost:3000').patch(`/api/tasks/${taskId}/status`).send({ newStatus: 'Completed' });
    });

    then('the coordinator should enqueue a completion email', () => {
      expect(EmailWorkerMock).toHaveReceived({ subject: /completed/ });
    });
  });
});

function expect(EmailWorkerMock: { calls: any[]; receive(job: any): void; toHaveReceived(expectation: any): void; }) {
    throw new Error('Function not implemented.');
}
