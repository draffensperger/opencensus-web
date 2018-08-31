/**
 *
 */
export interface DistributionValueBucket {
  /**
   * The number of values in each bucket of the histogram, as described in
   * bucket_bounds.
   */
  count?: string;
  /**
   * If the distribution does not have a histogram, then omit this field.
   */
  exemplar?: DistributionValueExemplar;
}

/**
 * Exemplars are example points that may be used to annotate aggregated
 * Distribution values. They are metadata that gives information about a
 * particular value added to a Distribution bucket.
 */
export interface DistributionValueExemplar {
  /**
   * Value of the exemplar point. It determines which bucket the exemplar
   * belongs to.
   */
  value?: number;
  /**
   * The observation (sampling) time of the above value.
   */
  timestamp?: Date;
  /**
   * Contextual information about the example value.
   */
  attachments?: {[key: string]: string;};
}

/**
 *
 */
export interface ExporterExportMetricsRequest {
  /**
   *
   */
  metrics?: MetricsMetric[];
}

/**
 *
 */
export interface ExporterExportMetricsResponse {}

/**
 * Distribution contains summary statistics for a population of values. It
 * optionally contains a histogram representing the distribution of those values
 * across a set of buckets.
 */
export interface MetricsDistributionValue {
  /**
   * The number of values in the population. Must be non-negative. This value
   * must equal the sum of the values in bucket_counts if a histogram is
   * provided.
   */
  count?: string;
  /**
   * The arithmetic mean of the values in the population. If count is zero then
   * this field must be zero.
   */
  mean?: number;
  /**
   * Sum[i=1..n]((x_i - mean)^2)  Knuth, \"The Art of Computer Programming\",
   * Vol. 2, page 323, 3rd edition describes Welford's method for accumulating
   * this sum in one pass.  If count is zero then this field must be zero.
   */
  sumOfSquaredDeviation?: number;
  /**
   * (-infinity, bucket_bounds[i]) for i == 0 [bucket_bounds[i-1],
   * bucket_bounds[i]) for 0 < i < N-2 [bucket_bounds[i-1], +infinity) for i ==
   * N-1  i.e. an underflow bucket (number 0), zero or more finite buckets (1
   * through N - 2, and an overflow bucket (N - 1), with inclusive lower bounds
   * and exclusive upper bounds.  If bucket_bounds has no elements (zero size),
   * then there is no histogram associated with the Distribution. If
   * bucket_bounds has only one element, there are no finite buckets, and that
   * single element is the common boundary of the overflow and underflow
   * buckets. The values must be monotonically increasing.  Don't change bucket
   * boundaries within a timeseries if your backend doesn't support this.
   */
  bucketBounds?: number[];
  /**
   * If the distribution does not have a histogram, then omit this field. If
   * there is a histogram, then the sum of the values in the Bucket counts must
   * equal the value in the count field of the distribution.
   */
  buckets?: DistributionValueBucket[];
}

/**
 *
 */
export interface MetricsLabelValue {
  /**
   * The value for the label.
   */
  value?: string;
  /**
   * If false the value field is ignored and considered not set. This is used to
   * differentiate a missing label from an empty string.
   */
  hasValue?: boolean;
}

/**
 * Defines a Metric which has one or more timeseries.
 */
export interface MetricsMetric {
  /**
   * The definition of the Metric. For now, we send the full MetricDescriptor
   * every time in order to keep the protocol stateless, but this is one of the
   * places where we can make future changes to make the protocol more
   * efficient.
   */
  metricDescriptor?: MetricsMetricDescriptor;
  /**
   * One or more timeseries for a single metric, where each timeseries has one
   * or more points.
   */
  timeseries?: MetricsTimeSeries[];
}

/**
 * Defines a metric type and its schema.
 */
export interface MetricsMetricDescriptor {
  /**
   * The metric type, including its DNS name prefix. It must be unique.
   */
  name?: string;
  /**
   * A detailed description of the metric, which can be used in documentation.
   */
  description?: string;
  /**
   * The unit in which the metric value is reported. Follows the format
   * described by http://unitsofmeasure.org/ucum.html.
   */
  unit?: string;
  /**
   *
   */
  type?: MetricsMetricDescriptorType;
  /**
   * The label keys associated with the metric descriptor.
   */
  labelKeys?: MetricsLabelKey[];
}

/**
 * The kind of metric. It describes how the data is reported.  A gauge is an
 * instantaneous measurement of a value.  A cumulative measurement is a value
 * accumulated over a time interval. In a time series, cumulative measurements
 * should have the same start time and increasing end times, until an event
 * resets the cumulative value to zero and sets a new start time for the
 * following points.   - UNSPECIFIED: Do not use this default value.  -
 * GAUGE_INT64: Integer gauge.  - GAUGE_DOUBLE: Floating point gauge.  -
 * CUMULATIVE_INT64: Integer cumulative measurement.  - CUMULATIVE_DOUBLE:
 * Floating point cumulative measurement.  - CUMULATIVE_DISTRIBUTION:
 * Distribution cumulative measurement.
 */
export enum MetricsMetricDescriptorType {
  UNSPECIFIED = 'UNSPECIFIED' as any,
  GAUGEINT64 = 'GAUGE_INT64' as any,
  GAUGEDOUBLE = 'GAUGE_DOUBLE' as any,
  CUMULATIVEINT64 = 'CUMULATIVE_INT64' as any,
  CUMULATIVEDOUBLE = 'CUMULATIVE_DOUBLE' as any,
  CUMULATIVEDISTRIBUTION = 'CUMULATIVE_DISTRIBUTION' as any
}

/**
 * A timestamped measurement.
 */
export interface MetricsPoint {
  /**
   * The moment when this point was recorded. If not specified, the timestamp
   * will be decided by the backend.
   */
  timestamp?: Date;
  /**
   * A 64-bit integer.
   */
  int64Value?: string;
  /**
   * A 64-bit double-precision floating-point number.
   */
  doubleValue?: number;
  /**
   * A distribution value.
   */
  distributionValue?: MetricsDistributionValue;
}

/**
 * A collection of data points that describes the time-varying values of a
 * metric.
 */
export interface MetricsTimeSeries {
  /**
   * Must be present for cumulative metrics. The time when the cumulative value
   * was reset to zero. The cumulative value is over the time interval
   * [start_timestamp, timestamp]. If not specified, the backend can use the
   * previous recorded value.
   */
  startTimestamp?: Date;
  /**
   * The set of label values that uniquely identify this timeseries. Applies to
   * all points. The order of label values must match that of label keys in the
   * metric descriptor.
   */
  labelValues?: MetricsLabelValue[];
  /**
   * The data points of this timeseries. Point.value type MUST match the
   * MetricDescriptor.type.
   */
  points?: MetricsPoint[];
}
/**
 * Defines a label key associated with a metric descriptor.
 */
export interface MetricsLabelKey {
  /**
   * The key for the label.
   */
  key?: string;
  /**
   * A human-readable description of what this label key represents.
   */
  description?: string;
}
