export class AggregateFilterDto {
  /** Optional current status to filter by */
  state?: string;
  /** ISO date string (inclusive) for the start of the range */
  from?: string;
  /** ISO date string (inclusive) for the end of the range */
  to?: string;
}