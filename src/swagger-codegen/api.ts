// tslint:disable
/**
 * opencensus/proto/exporter/exporter.proto
 * No description provided (generated by Swagger Codegen
 * https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: version not set
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


// import * as url from "url";
// import * as portableFetch from "portable-fetch";
// import {Configuration} from './configuration';

const BASE_PATH =
    'http://opencensusd.endpoints.opencensus-web-test.cloud.goog'.replace(
        /\/+$/, '');

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|',
};

// /**
//  *
//  * @export
//  * @interface FetchAPI
//  */
// export interface FetchAPI {
//   (url: string, init?: any): Promise<Response>;
// }

// /**
//  *
//  * @export
//  * @interface FetchArgs
//  */
// export interface FetchArgs {
//   url: string;
//   options: any;
// }

// /**
//  *
//  * @export
//  * @class BaseAPI
//  */
// export class BaseAPI {
//   protected configuration: Configuration;

//   constructor(
//       configuration?: Configuration, protected basePath: string = BASE_PATH,
//       protected fetch: FetchAPI = portableFetch) {
//     if (configuration) {
//       this.configuration = configuration;
//       this.basePath = configuration.basePath || this.basePath;
//     }
//   }
// };

// /**
//  *
//  * @export
//  * @class RequiredError
//  * @extends {Error}
//  */
// export class RequiredError extends Error {
//   name: 'RequiredError'
//   constructor(public field: string, msg?: string) {
//     super(msg);
//   }
// }

/**
 *
 * @export
 * @interface DistributionValueBucket
 */
export interface DistributionValueBucket {
  /**
   * The number of values in each bucket of the histogram, as described in
   * bucket_bounds.
   * @type {string}
   * @memberof DistributionValueBucket
   */
  count?: string;
  /**
   * If the distribution does not have a histogram, then omit this field.
   * @type {DistributionValueExemplar}
   * @memberof DistributionValueBucket
   */
  exemplar?: DistributionValueExemplar;
}

/**
 * Exemplars are example points that may be used to annotate aggregated
 * Distribution values. They are metadata that gives information about a
 * particular value added to a Distribution bucket.
 * @export
 * @interface DistributionValueExemplar
 */
export interface DistributionValueExemplar {
  /**
   * Value of the exemplar point. It determines which bucket the exemplar
   * belongs to.
   * @type {number}
   * @memberof DistributionValueExemplar
   */
  value?: number;
  /**
   * The observation (sampling) time of the above value.
   * @type {Date}
   * @memberof DistributionValueExemplar
   */
  timestamp?: Date;
  /**
   * Contextual information about the example value.
   * @type {{ [key: string]: string; }}
   * @memberof DistributionValueExemplar
   */
  attachments?: {[key: string]: string;};
}

/**
 *
 * @export
 * @interface ExporterExportMetricsRequest
 */
export interface ExporterExportMetricsRequest {
  /**
   *
   * @type {Array&lt;MetricsMetric&gt;}
   * @memberof ExporterExportMetricsRequest
   */
  metrics?: Array<MetricsMetric>;
}

/**
 *
 * @export
 * @interface ExporterExportMetricsResponse
 */
export interface ExporterExportMetricsResponse {}

/**
 *
 * @export
 * @interface ExporterExportSpanRequest
 */
export interface ExporterExportSpanRequest {
  /**
   *
   * @type {Array&lt;TraceSpan&gt;}
   * @memberof ExporterExportSpanRequest
   */
  spans?: Array<TraceSpan>;
}

/**
 *
 * @export
 * @interface ExporterExportSpanResponse
 */
export interface ExporterExportSpanResponse {}

/**
 * Distribution contains summary statistics for a population of values. It
 * optionally contains a histogram representing the distribution of those values
 * across a set of buckets.
 * @export
 * @interface MetricsDistributionValue
 */
export interface MetricsDistributionValue {
  /**
   * The number of values in the population. Must be non-negative. This value
   * must equal the sum of the values in bucket_counts if a histogram is
   * provided.
   * @type {string}
   * @memberof MetricsDistributionValue
   */
  count?: string;
  /**
   * The arithmetic mean of the values in the population. If count is zero then
   * this field must be zero.
   * @type {number}
   * @memberof MetricsDistributionValue
   */
  mean?: number;
  /**
   * Sum[i=1..n]((x_i - mean)^2)  Knuth, \"The Art of Computer Programming\",
   * Vol. 2, page 323, 3rd edition describes Welford's method for accumulating
   * this sum in one pass.  If count is zero then this field must be zero.
   * @type {number}
   * @memberof MetricsDistributionValue
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
   * @type {Array&lt;number&gt;}
   * @memberof MetricsDistributionValue
   */
  bucketBounds?: Array<number>;
  /**
   * If the distribution does not have a histogram, then omit this field. If
   * there is a histogram, then the sum of the values in the Bucket counts must
   * equal the value in the count field of the distribution.
   * @type {Array&lt;DistributionValueBucket&gt;}
   * @memberof MetricsDistributionValue
   */
  buckets?: Array<DistributionValueBucket>;
}

/**
 * Defines a label key associated with a metric descriptor.
 * @export
 * @interface MetricsLabelKey
 */
export interface MetricsLabelKey {
  /**
   * The key for the label.
   * @type {string}
   * @memberof MetricsLabelKey
   */
  key?: string;
  /**
   * A human-readable description of what this label key represents.
   * @type {string}
   * @memberof MetricsLabelKey
   */
  description?: string;
}

/**
 *
 * @export
 * @interface MetricsLabelValue
 */
export interface MetricsLabelValue {
  /**
   * The value for the label.
   * @type {string}
   * @memberof MetricsLabelValue
   */
  value?: string;
  /**
   * If false the value field is ignored and considered not set. This is used to
   * differentiate a missing label from an empty string.
   * @type {boolean}
   * @memberof MetricsLabelValue
   */
  hasValue?: boolean;
}

/**
 * Defines a Metric which has one or more timeseries.
 * @export
 * @interface MetricsMetric
 */
export interface MetricsMetric {
  /**
   * The definition of the Metric. For now, we send the full MetricDescriptor
   * every time in order to keep the protocol stateless, but this is one of the
   * places where we can make future changes to make the protocol more
   * efficient.
   * @type {MetricsMetricDescriptor}
   * @memberof MetricsMetric
   */
  metricDescriptor?: MetricsMetricDescriptor;
  /**
   * One or more timeseries for a single metric, where each timeseries has one
   * or more points.
   * @type {Array&lt;MetricsTimeSeries&gt;}
   * @memberof MetricsMetric
   */
  timeseries?: Array<MetricsTimeSeries>;
}

/**
 * Defines a metric type and its schema.
 * @export
 * @interface MetricsMetricDescriptor
 */
export interface MetricsMetricDescriptor {
  /**
   * The metric type, including its DNS name prefix. It must be unique.
   * @type {string}
   * @memberof MetricsMetricDescriptor
   */
  name?: string;
  /**
   * A detailed description of the metric, which can be used in documentation.
   * @type {string}
   * @memberof MetricsMetricDescriptor
   */
  description?: string;
  /**
   * The unit in which the metric value is reported. Follows the format
   * described by http://unitsofmeasure.org/ucum.html.
   * @type {string}
   * @memberof MetricsMetricDescriptor
   */
  unit?: string;
  /**
   *
   * @type {MetricsMetricDescriptorType}
   * @memberof MetricsMetricDescriptor
   */
  type?: MetricsMetricDescriptorType;
  /**
   * The label keys associated with the metric descriptor.
   * @type {Array&lt;MetricsLabelKey&gt;}
   * @memberof MetricsMetricDescriptor
   */
  labelKeys?: Array<MetricsLabelKey>;
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
 * @export
 * @enum {string}
 */
export enum MetricsMetricDescriptorType {
  UNSPECIFIED = <any>'UNSPECIFIED',
  GAUGEINT64 = <any>'GAUGE_INT64',
  GAUGEDOUBLE = <any>'GAUGE_DOUBLE',
  CUMULATIVEINT64 = <any>'CUMULATIVE_INT64',
  CUMULATIVEDOUBLE = <any>'CUMULATIVE_DOUBLE',
  CUMULATIVEDISTRIBUTION = <any>'CUMULATIVE_DISTRIBUTION'
}

/**
 * A timestamped measurement.
 * @export
 * @interface MetricsPoint
 */
export interface MetricsPoint {
  /**
   * The moment when this point was recorded. If not specified, the timestamp
   * will be decided by the backend.
   * @type {Date}
   * @memberof MetricsPoint
   */
  timestamp?: Date;
  /**
   * A 64-bit integer.
   * @type {string}
   * @memberof MetricsPoint
   */
  int64Value?: string;
  /**
   * A 64-bit double-precision floating-point number.
   * @type {number}
   * @memberof MetricsPoint
   */
  doubleValue?: number;
  /**
   * A distribution value.
   * @type {MetricsDistributionValue}
   * @memberof MetricsPoint
   */
  distributionValue?: MetricsDistributionValue;
}

/**
 * A collection of data points that describes the time-varying values of a
 * metric.
 * @export
 * @interface MetricsTimeSeries
 */
export interface MetricsTimeSeries {
  /**
   * Must be present for cumulative metrics. The time when the cumulative value
   * was reset to zero. The cumulative value is over the time interval
   * [start_timestamp, timestamp]. If not specified, the backend can use the
   * previous recorded value.
   * @type {Date}
   * @memberof MetricsTimeSeries
   */
  startTimestamp?: Date;
  /**
   * The set of label values that uniquely identify this timeseries. Applies to
   * all points. The order of label values must match that of label keys in the
   * metric descriptor.
   * @type {Array&lt;MetricsLabelValue&gt;}
   * @memberof MetricsTimeSeries
   */
  labelValues?: Array<MetricsLabelValue>;
  /**
   * The data points of this timeseries. Point.value type MUST match the
   * MetricDescriptor.type.
   * @type {Array&lt;MetricsPoint&gt;}
   * @memberof MetricsTimeSeries
   */
  points?: Array<MetricsPoint>;
}

/**
 * A set of attributes, each with a key and a value.
 * @export
 * @interface SpanAttributes
 */
export interface SpanAttributes {
  /**
   * \"/instance_id\": \"my-instance\"     \"/http/user_agent\": \"\"
   * \"/http/server_latency\": 300     \"abc.com/myattribute\": true
   * @type {{ [key: string]: TraceAttributeValue; }}
   * @memberof SpanAttributes
   */
  attributeMap?: {[key: string]: TraceAttributeValue;};
  /**
   * The number of attributes that were discarded. Attributes can be discarded
   * because their keys are too long or because there are too many attributes.
   * If this value is 0, then no attributes were dropped.
   * @type {number}
   * @memberof SpanAttributes
   */
  droppedAttributesCount?: number;
}

/**
 * A pointer from the current span to another span in the same trace or in a
 * different trace. For example, this can be used in batching operations, where
 * a single batch handler processes multiple requests from different traces or
 * when the handler receives a request from a different project.
 * @export
 * @interface SpanLink
 */
export interface SpanLink {
  /**
   * A unique identifier for a trace. All spans from the same trace share the
   * same `trace_id`. The ID is a 16-byte array.
   * @type {string}
   * @memberof SpanLink
   */
  traceId?: string;
  /**
   * A unique identifier for a span within a trace, assigned when the span is
   * created. The ID is an 8-byte array.
   * @type {string}
   * @memberof SpanLink
   */
  spanId?: string;
  /**
   * The relationship of the current span relative to the linked span.
   * @type {SpanLinkType}
   * @memberof SpanLink
   */
  type?: SpanLinkType;
  /**
   * A set of attributes on the link.
   * @type {SpanAttributes}
   * @memberof SpanLink
   */
  attributes?: SpanAttributes;
}

/**
 * The relationship of the current span relative to the linked span: child,
 * parent, or unspecified.   - TYPE_UNSPECIFIED: The relationship of the two
 * spans is unknown, or known but other than parent-child.  - CHILD_LINKED_SPAN:
 * The linked span is a child of the current span.  - PARENT_LINKED_SPAN: The
 * linked span is a parent of the current span.
 * @export
 * @enum {string}
 */
export enum SpanLinkType {
  TYPEUNSPECIFIED = <any>'TYPE_UNSPECIFIED',
  CHILDLINKEDSPAN = <any>'CHILD_LINKED_SPAN',
  PARENTLINKEDSPAN = <any>'PARENT_LINKED_SPAN'
}

/**
 * A collection of links, which are references from this span to a span in the
 * same or different trace.
 * @export
 * @interface SpanLinks
 */
export interface SpanLinks {
  /**
   * A collection of links.
   * @type {Array&lt;SpanLink&gt;}
   * @memberof SpanLinks
   */
  link?: Array<SpanLink>;
  /**
   * The number of dropped links after the maximum size was enforced. If this
   * value is 0, then no links were dropped.
   * @type {number}
   * @memberof SpanLinks
   */
  droppedLinksCount?: number;
}

/**
 * Type of span. Can be used to specify additional relationships between spans
 * in addition to a parent/child relationship.   - SPAN_KIND_UNSPECIFIED:
 * Unspecified.  - SERVER: Indicates that the span covers server-side handling
 * of an RPC or other remote network request.  - CLIENT: Indicates that the span
 * covers the client-side wrapper around an RPC or other remote request.
 * @export
 * @enum {string}
 */
export enum SpanSpanKind {
  SPANKINDUNSPECIFIED = <any>'SPAN_KIND_UNSPECIFIED',
  SERVER = <any>'SERVER',
  CLIENT = <any>'CLIENT'
}

/**
 * A time-stamped annotation or message event in the Span.
 * @export
 * @interface SpanTimeEvent
 */
export interface SpanTimeEvent {
  /**
   * The time the event occurred.
   * @type {Date}
   * @memberof SpanTimeEvent
   */
  time?: Date;
  /**
   * A text annotation with a set of attributes.
   * @type {TimeEventAnnotation}
   * @memberof SpanTimeEvent
   */
  annotation?: TimeEventAnnotation;
  /**
   * An event describing a message sent/received between Spans.
   * @type {TimeEventMessageEvent}
   * @memberof SpanTimeEvent
   */
  messageEvent?: TimeEventMessageEvent;
}

/**
 * A collection of `TimeEvent`s. A `TimeEvent` is a time-stamped annotation on
 * the span, consisting of either user-supplied key-value pairs, or details of a
 * message sent/received between Spans.
 * @export
 * @interface SpanTimeEvents
 */
export interface SpanTimeEvents {
  /**
   * A collection of `TimeEvent`s.
   * @type {Array&lt;SpanTimeEvent&gt;}
   * @memberof SpanTimeEvents
   */
  timeEvent?: Array<SpanTimeEvent>;
  /**
   * The number of dropped annotations in all the included time events. If the
   * value is 0, then no annotations were dropped.
   * @type {number}
   * @memberof SpanTimeEvents
   */
  droppedAnnotationsCount?: number;
  /**
   * The number of dropped message events in all the included time events. If
   * the value is 0, then no message events were dropped.
   * @type {number}
   * @memberof SpanTimeEvents
   */
  droppedMessageEventsCount?: number;
}

/**
 * A single stack frame in a stack trace.
 * @export
 * @interface StackTraceStackFrame
 */
export interface StackTraceStackFrame {
  /**
   * The fully-qualified name that uniquely identifies the function or method
   * that is active in this frame.
   * @type {TraceTruncatableString}
   * @memberof StackTraceStackFrame
   */
  functionName?: TraceTruncatableString;
  /**
   * An un-mangled function name, if `function_name` is
   * [mangled](http://www.avabodh.com/cxxin/namemangling.html). The name can be
   * fully qualified.
   * @type {TraceTruncatableString}
   * @memberof StackTraceStackFrame
   */
  originalFunctionName?: TraceTruncatableString;
  /**
   * The name of the source file where the function call appears.
   * @type {TraceTruncatableString}
   * @memberof StackTraceStackFrame
   */
  fileName?: TraceTruncatableString;
  /**
   * The line number in `file_name` where the function call appears.
   * @type {string}
   * @memberof StackTraceStackFrame
   */
  lineNumber?: string;
  /**
   * The column number where the function call appears, if available. This is
   * important in JavaScript because of its anonymous functions.
   * @type {string}
   * @memberof StackTraceStackFrame
   */
  columnNumber?: string;
  /**
   * The binary module from where the code was loaded.
   * @type {TraceModule}
   * @memberof StackTraceStackFrame
   */
  loadModule?: TraceModule;
  /**
   * The version of the deployed source code.
   * @type {TraceTruncatableString}
   * @memberof StackTraceStackFrame
   */
  sourceVersion?: TraceTruncatableString;
}

/**
 * A collection of stack frames, which can be truncated.
 * @export
 * @interface StackTraceStackFrames
 */
export interface StackTraceStackFrames {
  /**
   * Stack frames in this call stack.
   * @type {Array&lt;StackTraceStackFrame&gt;}
   * @memberof StackTraceStackFrames
   */
  frame?: Array<StackTraceStackFrame>;
  /**
   * The number of stack frames that were dropped because there were too many
   * stack frames. If this value is 0, then no stack frames were dropped.
   * @type {number}
   * @memberof StackTraceStackFrames
   */
  droppedFramesCount?: number;
}

/**
 * A text annotation with a set of attributes.
 * @export
 * @interface TimeEventAnnotation
 */
export interface TimeEventAnnotation {
  /**
   * A user-supplied message describing the event.
   * @type {TraceTruncatableString}
   * @memberof TimeEventAnnotation
   */
  description?: TraceTruncatableString;
  /**
   * A set of attributes on the annotation.
   * @type {SpanAttributes}
   * @memberof TimeEventAnnotation
   */
  attributes?: SpanAttributes;
}

/**
 * An event describing a message sent/received between Spans.
 * @export
 * @interface TimeEventMessageEvent
 */
export interface TimeEventMessageEvent {
  /**
   * The type of MessageEvent. Indicates whether the message was sent or
   * received.
   * @type {TimeEventMessageEventType}
   * @memberof TimeEventMessageEvent
   */
  type?: TimeEventMessageEventType;
  /**
   * An identifier for the MessageEvent's message that can be used to match SENT
   * and RECEIVED MessageEvents. For example, this field could represent a
   * sequence ID for a streaming RPC. It is recommended to be unique within a
   * Span.
   * @type {string}
   * @memberof TimeEventMessageEvent
   */
  id?: string;
  /**
   * The number of uncompressed bytes sent or received.
   * @type {string}
   * @memberof TimeEventMessageEvent
   */
  uncompressedSize?: string;
  /**
   * The number of compressed bytes sent or received. If zero, assumed to be the
   * same size as uncompressed.
   * @type {string}
   * @memberof TimeEventMessageEvent
   */
  compressedSize?: string;
}

/**
 * Indicates whether the message was sent or received.   - TYPE_UNSPECIFIED:
 * Unknown event type.  - SENT: Indicates a sent message.  - RECEIVED: Indicates
 * a received message.
 * @export
 * @enum {string}
 */
export enum TimeEventMessageEventType {
  TYPEUNSPECIFIED = <any>'TYPE_UNSPECIFIED',
  SENT = <any>'SENT',
  RECEIVED = <any>'RECEIVED'
}

/**
 * The value of an Attribute.
 * @export
 * @interface TraceAttributeValue
 */
export interface TraceAttributeValue {
  /**
   * A string up to 256 bytes long.
   * @type {TraceTruncatableString}
   * @memberof TraceAttributeValue
   */
  stringValue?: TraceTruncatableString;
  /**
   * A 64-bit signed integer.
   * @type {string}
   * @memberof TraceAttributeValue
   */
  intValue?: string;
  /**
   * A Boolean value represented by `true` or `false`.
   * @type {boolean}
   * @memberof TraceAttributeValue
   */
  boolValue?: boolean;
}

/**
 * A description of a binary module.
 * @export
 * @interface TraceModule
 */
export interface TraceModule {
  /**
   * TODO: document the meaning of this field. For example: main binary, kernel
   * modules, and dynamic libraries such as libc.so, sharedlib.so.
   * @type {TraceTruncatableString}
   * @memberof TraceModule
   */
  module?: TraceTruncatableString;
  /**
   * A unique identifier for the module, usually a hash of its contents.
   * @type {TraceTruncatableString}
   * @memberof TraceModule
   */
  buildId?: TraceTruncatableString;
}

/**
 * A span represents a single operation within a trace. Spans can be nested to
 * form a trace tree. Often, a trace contains a root span that describes the
 * end-to-end latency, and one or more subspans for its sub-operations. A trace
 * can also contain multiple root spans, or none at all. Spans do not need to be
 * contiguous - there may be gaps or overlaps between spans in a trace.  The
 * next id is 16. TODO(bdrutu): Add an example.
 * @export
 * @interface TraceSpan
 */
export interface TraceSpan {
  /**
   * A unique identifier for a trace. All spans from the same trace share the
   * same `trace_id`. The ID is a 16-byte array.  This field is required.
   * @type {string}
   * @memberof TraceSpan
   */
  traceId?: string;
  /**
   * A unique identifier for a span within a trace, assigned when the span is
   * created. The ID is an 8-byte array.  This field is required.
   * @type {string}
   * @memberof TraceSpan
   */
  spanId?: string;
  /**
   * The `tracestate` field conveys information about request position in
   * multiple distributed tracing graphs.  There can be a maximum of 32 members
   * in the map.  The key must begin with a lowercase letter, and can only
   * contain lowercase letters 'a'-'z', digits '0'-'9', underscores '_', dashes
   * '-', asterisks '*', and forward slashes '/'. For multi-tenant vendors
   * scenarios '@' sign can be used to prefix vendor name. The maximum length
   * for the key is 256 characters.  The value is opaque string up to 256
   * characters printable ASCII RFC0020 characters (i.e., the range 0x20 to
   * 0x7E) except ',' and '='. Note that this also excludes tabs, newlines,
   * carriage returns, etc.  See the https://github.com/w3c/distributed-tracing
   * for more details about this field.
   * @type {{ [key: string]: string; }}
   * @memberof TraceSpan
   */
  tracestate?: {[key: string]: string;};
  /**
   * The `span_id` of this span's parent span. If this is a root span, then this
   * field must be empty. The ID is an 8-byte array.
   * @type {string}
   * @memberof TraceSpan
   */
  parentSpanId?: string;
  /**
   * A description of the span's operation.  For example, the name can be a
   * qualified method name or a file name and a line number where the operation
   * is called. A best practice is to use the same display name at the same call
   * point in an application. This makes it easier to correlate spans in
   * different traces.  This field is required.
   * @type {TraceTruncatableString}
   * @memberof TraceSpan
   */
  name?: TraceTruncatableString;
  /**
   * Distinguishes between spans generated in a particular context. For example,
   * two spans with the same name may be distinguished using `CLIENT` and
   * `SERVER` to identify queueing latency associated with the span.
   * @type {SpanSpanKind}
   * @memberof TraceSpan
   */
  kind?: SpanSpanKind;
  /**
   * The start time of the span. On the client side, this is the time kept by
   * the local machine where the span execution starts. On the server side, this
   * is the time when the server's application handler starts running.
   * @type {Date}
   * @memberof TraceSpan
   */
  startTime?: Date;
  /**
   * The end time of the span. On the client side, this is the time kept by the
   * local machine where the span execution ends. On the server side, this is
   * the time when the server application handler stops running.
   * @type {Date}
   * @memberof TraceSpan
   */
  endTime?: Date;
  /**
   * A set of attributes on the span.
   * @type {SpanAttributes}
   * @memberof TraceSpan
   */
  attributes?: SpanAttributes;
  /**
   * A stack trace captured at the start of the span.
   * @type {TraceStackTrace}
   * @memberof TraceSpan
   */
  stackTrace?: TraceStackTrace;
  /**
   * The included time events.
   * @type {SpanTimeEvents}
   * @memberof TraceSpan
   */
  timeEvents?: SpanTimeEvents;
  /**
   * The inclued links.
   * @type {SpanLinks}
   * @memberof TraceSpan
   */
  links?: SpanLinks;
  /**
   * An optional final status for this span.
   * @type {TraceStatus}
   * @memberof TraceSpan
   */
  status?: TraceStatus;
  /**
   * A highly recommended but not required flag that identifies when a trace
   * crosses a process boundary. True when the parent_span belongs to the same
   * process as the current span.
   * @type {boolean}
   * @memberof TraceSpan
   */
  sameProcessAsParentSpan?: boolean;
  /**
   * An optional number of child spans that were generated while this span was
   * active. If set, allows an implementation to detect missing child spans.
   * @type {number}
   * @memberof TraceSpan
   */
  childSpanCount?: number;
}

/**
 * The call stack which originated this span.
 * @export
 * @interface TraceStackTrace
 */
export interface TraceStackTrace {
  /**
   * Stack frames in this stack trace.
   * @type {StackTraceStackFrames}
   * @memberof TraceStackTrace
   */
  stackFrames?: StackTraceStackFrames;
  /**
   * The hash ID is used to conserve network bandwidth for duplicate stack
   * traces within a single trace.  Often multiple spans will have identical
   * stack traces. The first occurrence of a stack trace should contain both
   * `stack_frames` and a value in `stack_trace_hash_id`.  Subsequent spans
   * within the same request can refer to that stack trace by setting only
   * `stack_trace_hash_id`.  TODO: describe how to deal with the case where
   * stack_trace_hash_id is zero because it was not set.
   * @type {string}
   * @memberof TraceStackTrace
   */
  stackTraceHashId?: string;
}

/**
 * The `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. This
 * proto's fields are a subset of those of
 * [google.rpc.Status](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto),
 * which is used by [gRPC](https://github.com/grpc).
 * @export
 * @interface TraceStatus
 */
export interface TraceStatus {
  /**
   * The status code.
   * @type {number}
   * @memberof TraceStatus
   */
  code?: number;
  /**
   * A developer-facing error message, which should be in English.
   * @type {string}
   * @memberof TraceStatus
   */
  message?: string;
}

/**
 * A string that might be shortened to a specified length.
 * @export
 * @interface TraceTruncatableString
 */
export interface TraceTruncatableString {
  /**
   * The shortened string. For example, if the original string was 500 bytes
   * long and the limit of the string was 128 bytes, then this value contains
   * the first 128 bytes of the 500-byte string. Note that truncation always
   * happens on a character boundary, to ensure that a truncated string is still
   * valid UTF-8. Because it may contain multi-byte characters, the size of the
   * truncated string may be less than the truncation limit.
   * @type {string}
   * @memberof TraceTruncatableString
   */
  value?: string;
  /**
   * The number of bytes removed from the original string. If this value is 0,
   * then the string was not shortened.
   * @type {number}
   * @memberof TraceTruncatableString
   */
  truncatedByteCount?: number;
}


// /**
//  * ExportApi - fetch parameter creator
//  * @export
//  */
// export const ExportApiFetchParamCreator = function(
//     configuration?: Configuration) {
//   return {
//     /**
//      *
//      * @param {ExporterExportMetricsRequest} body  (streaming inputs)
//      * @param {*} [options] Override http request option.
//      * @throws {RequiredError}
//      */
//     exportMetrics(
//         body: ExporterExportMetricsRequest, options: any = {}): FetchArgs {
//       // verify required parameter 'body' is not null or undefined
//       if (body === null || body === undefined) {
//         throw new RequiredError(
//             'body',
//             'Required parameter body was null or undefined when calling
//             exportMetrics.');
//       }
//       const localVarPath = `/v1/export/metrics`;
//       const localVarUrlObj = url.parse(localVarPath, true);
//       const localVarRequestOptions = Object.assign({method: 'POST'},
//       options); const localVarHeaderParameter = {} as any; const
//       localVarQueryParameter = {} as any;

//       // authentication apiKey required
//       if (configuration && configuration.apiKey) {
//         const localVarApiKeyValue = typeof configuration.apiKey ===
//         'function' ?
//             configuration.apiKey('key') :
//             configuration.apiKey;
//         localVarQueryParameter['key'] = localVarApiKeyValue;
//       }

//       localVarHeaderParameter['Content-Type'] = 'application/json';

//       localVarUrlObj.query = Object.assign(
//           {}, localVarUrlObj.query, localVarQueryParameter, options.query);
//       // fix override query string Detail:
//       // https://stackoverflow.com/a/7517673/1077943
//       delete localVarUrlObj.search;
//       localVarRequestOptions.headers =
//           Object.assign({}, localVarHeaderParameter, options.headers);
//       const needsSerialization =
//           (<any>'ExporterExportMetricsRequest' !== 'string') ||
//           localVarRequestOptions.headers['Content-Type'] ===
//           'application/json';
//       localVarRequestOptions.body =
//           needsSerialization ? JSON.stringify(body || {}) : (body || '');

//       return {
//         url: url.format(localVarUrlObj),
//         options: localVarRequestOptions,
//       };
//     }
//     ,
//         /**
//          *
//          * @param {ExporterExportSpanRequest} body  (streaming inputs)
//          * @param {*} [options] Override http request option.
//          * @throws {RequiredError}
//          */
//         exportSpan(body: ExporterExportSpanRequest, options: any = {}):
//             FetchArgs {
//       // verify required parameter 'body' is not null or undefined
//       if (body === null || body === undefined) {
//         throw new RequiredError(
//             'body',
//             'Required parameter body was null or undefined when calling
//             exportSpan.');
//       }
//       const localVarPath = `/v1/export/spans`;
//       const localVarUrlObj = url.parse(localVarPath, true);
//       const localVarRequestOptions = Object.assign({method: 'POST'},
//       options); const localVarHeaderParameter = {} as any; const
//       localVarQueryParameter = {} as any;

//       // authentication apiKey required
//       if (configuration && configuration.apiKey) {
//         const localVarApiKeyValue = typeof configuration.apiKey ===
//         'function' ?
//             configuration.apiKey('key') :
//             configuration.apiKey;
//         localVarQueryParameter['key'] = localVarApiKeyValue;
//       }

//       localVarHeaderParameter['Content-Type'] = 'application/json';

//       localVarUrlObj.query = Object.assign(
//           {}, localVarUrlObj.query, localVarQueryParameter, options.query);
//       // fix override query string Detail:
//       // https://stackoverflow.com/a/7517673/1077943
//       delete localVarUrlObj.search;
//       localVarRequestOptions.headers =
//           Object.assign({}, localVarHeaderParameter, options.headers);
//       const needsSerialization =
//           (<any>'ExporterExportSpanRequest' !== 'string') ||
//           localVarRequestOptions.headers['Content-Type'] ===
//           'application/json';
//       localVarRequestOptions.body =
//           needsSerialization ? JSON.stringify(body || {}) : (body || '');

//       return {
//         url: url.format(localVarUrlObj),
//         options: localVarRequestOptions,
//       };
//     }
//     ,
//   }
// };


// /**
//  * ExportApi - functional programming interface
//  * @export
//  */
// export const ExportApiFp = function(configuration?: Configuration) {
//     return {
//         /**
//          *
//          * @param {ExporterExportMetricsRequest} body  (streaming inputs)
//          * @param {*} [options] Override http request option.
//          * @throws {RequiredError}
//          */
//         exportMetrics(body: ExporterExportMetricsRequest, options?: any):
//         (fetch?: FetchAPI, basePath?: string) =>
//         Promise<ExporterExportMetricsResponse> {
//             const localVarFetchArgs =
//             ExportApiFetchParamCreator(configuration).exportMetrics(body,
//             options); return (fetch: FetchAPI = portableFetch, basePath:
//             string = BASE_PATH) => {
//                 return fetch(basePath + localVarFetchArgs.url,
//                 localVarFetchArgs.options).then((response) => {
//                     if (response.status >= 200 && response.status < 300) {
//                         return response.json();
//                     } else {
//                         throw response;
//                     }
//                 });
//             };
//         },
//         /**
//          *
//          * @param {ExporterExportSpanRequest} body  (streaming inputs)
//          * @param {*} [options] Override http request option.
//          * @throws {RequiredError}
//          */
//         exportSpan(body: ExporterExportSpanRequest, options?: any): (fetch?:
//         FetchAPI, basePath?: string) => Promise<ExporterExportSpanResponse> {
//             const localVarFetchArgs =
//             ExportApiFetchParamCreator(configuration).exportSpan(body,
//             options); return (fetch: FetchAPI = portableFetch, basePath:
//             string = BASE_PATH) => {
//                 return fetch(basePath + localVarFetchArgs.url,
//                 localVarFetchArgs.options).then((response) => {
//                     if (response.status >= 200 && response.status < 300) {
//                         return response.json();
//                     } else {
//                         throw response;
//                     }
//                 });
//             };
//         },
//     }
// };

// /**
//  * ExportApi - factory interface
//  * @export
//  */
// export const ExportApiFactory = function (configuration?: Configuration,
// fetch?: FetchAPI, basePath?: string) {
//     return {
//         /**
//          *
//          * @param {ExporterExportMetricsRequest} body  (streaming inputs)
//          * @param {*} [options] Override http request option.
//          * @throws {RequiredError}
//          */
//         exportMetrics(body: ExporterExportMetricsRequest, options?: any) {
//             return ExportApiFp(configuration).exportMetrics(body,
//             options)(fetch, basePath);
//         },
//         /**
//          *
//          * @param {ExporterExportSpanRequest} body  (streaming inputs)
//          * @param {*} [options] Override http request option.
//          * @throws {RequiredError}
//          */
//         exportSpan(body: ExporterExportSpanRequest, options?: any) {
//             return ExportApiFp(configuration).exportSpan(body,
//             options)(fetch, basePath);
//         },
//     };
// };

// /**
//  * ExportApi - object-oriented interface
//  * @export
//  * @class ExportApi
//  * @extends {BaseAPI}
//  */
// export class ExportApi extends BaseAPI {
//     /**
//      *
//      * @param {} body  (streaming inputs)
//      * @param {*} [options] Override http request option.
//      * @throws {RequiredError}
//      * @memberof ExportApi
//      */
//     public exportMetrics(body: ExporterExportMetricsRequest, options?: any) {
//         return ExportApiFp(this.configuration).exportMetrics(body,
//         options)(this.fetch, this.basePath);
//     }

//     /**
//      *
//      * @param {} body  (streaming inputs)
//      * @param {*} [options] Override http request option.
//      * @throws {RequiredError}
//      * @memberof ExportApi
//      */
//     public exportSpan(body: ExporterExportSpanRequest, options?: any) {
//         return ExportApiFp(this.configuration).exportSpan(body,
//         options)(this.fetch, this.basePath);
//     }

// }
