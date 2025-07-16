export const EmailWorkerMock = {
  calls: [] as any[],
  receive(job: any) { this.calls.push(job) },
  toHaveReceived(expectation: any) {
    const match = this.calls.some(call => Object.entries(expectation).every(([k,v]) => call[k] === v));
    if (!match) throw new Error(`Expected EmailWorkerMock to have received ${JSON.stringify(expectation)}`);
  }
};
