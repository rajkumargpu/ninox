export class AggregateMetricsDto {
  totalTasks: number;
  /** Map of status to count, e.g. { Pending: 10, Completed: 5 } */
  countsByState: Record<string, number>;
  /** Average time from creation to completion, in seconds */
  averageCompletionSeconds: number | null;
  /** Median time from creation to completion, in seconds */
  medianCompletionSeconds: number | null;
  /** Total number of Error occurrences across all tasks */
  totalErrors: number;
  /** Average number of errors per task */
  averageErrorCountPerTask: number;
  /** Average number of clarifications per task */
  averageClarificationCountPerTask: number;
  /** Percent of completed tasks that met their deadline */
  percentCompletedWithinDeadline: number | null;
}