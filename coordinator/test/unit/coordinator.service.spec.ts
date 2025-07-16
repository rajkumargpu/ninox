import { Test } from '@nestjs/testing';
import { CoordinatorService } from '../../src/coordinator.service';

describe('CoordinatorService', () => {
  let service: CoordinatorService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CoordinatorService,
        { provide: 'EMAIL_NOTIFICATIONS', useValue: { emit: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve() }) } },
      ],
    }).compile();
    service = module.get(CoordinatorService);
  });
  it('handleTaskCreated emits notification.email', async () => {
    await service.handleTaskCreated({ taskId: '123', candidateEmail: 'a@b.com' });
    expect((service as any).emailClient.emit).toHaveBeenCalledWith('notification.email', expect.any(Object));
  });
});