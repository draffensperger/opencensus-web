export interface Trace {
  /**
   * A unique identifier for a trace. All spans from the same trace share the
   * same `trace_id`. The ID is a 16-byte array encoded as a hex string.
   * This field is required.
   */
  traceId: string;
  /** Base timestamp of the trace. This is in milliseconds since Unix epoch. */
  baseTime: number;
}

export interface SpanContext {
  trace: Trace;
  /**
   * A unique identifier for a span within a trace, assigned when the span is
   * created. The ID is an 8-byte array encoded as a hex string.
   * This field is required.
   */
  spanId: string;
  /** Whether the current trace context has the sampling hint set. */
  isSampled: boolean;
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
   */
  tracestate?: {[key: string]: string;};
}

/**
 * A span represents a single operation within a trace. Spans can be nested to
 * form a trace tree. Often, a trace contains a root span that describes the
 * end-to-end latency, and one or more subspans for its sub-operations. A trace
 * can also contain multiple root spans, or none at all. Spans do not need to be
 * contiguous - there may be gaps or overlaps between spans in a trace.
 */
export interface Span {
  spanContext: SpanContext;
  /**
   * The `span_id` of this span's parent span. If this is a root span, then this
   * field must be empty. The ID is an 8-byte array.
   */
  parentSpanId?: string;
  /**
   * A description of the span's operation.  For example, the name can be a
   * qualified method name or a file name and a line number where the operation
   * is called. A best practice is to use the same display name at the same call
   * point in an application. This makes it easier to correlate spans in
   * different traces.  This field is required.
   */
  name?: string;
  /**
   * Distinguishes between spans generated in a particular context. For example,
   * two spans with the same name may be distinguished using `CLIENT` and
   * `SERVER` to identify queueing latency associated with the span.
   */
  kind?: SpanKind;
  /**
   * The start time of the span. On the client side, this is the time kept by
   * the local machine where the span execution starts. On the server side, this
   * is the time when the server's application handler starts running.
   *
   * This is in milliseconds since the `baseTime` of the associated Trace.
   */
  startTime: number;
  /**
   * The end time of the span. On the client side, this is the time kept by the
   * local machine where the span execution ends. On the server side, this is
   * the time when the server application handler stops running.
   *
   * This is in milliseconds since the `baseTime` of the associated Trace.
   */
  endTime?: number;
  /**
   * A set of attributes on the span.
   */
  attributes?: Attributes;
  /**
   * A stack trace captured at the start of the span.
   */
  stackTrace?: StackFrame[];
  /** Message events list. */
  messageEvents?: MessageEvent[];
  /** Span annotations. */
  annotations?: Annotation[];
  /** The included links. */
  links?: SpanLink[];
  /**
   * An optional final status for this span.
   */
  status?: Status;
  /**
   * A highly recommended but not required flag that identifies when a trace
   * crosses a process boundary. True when the parent_span belongs to the same
   * process as the current span.
   */
  sameProcessAsParentSpan?: boolean;
  /**
   * An optional number of child spans that were generated while this span was
   * active. If set, allows an implementation to detect missing child spans.
   */
  childSpanCount?: number;
}


/**
 * A set of attributes, each with a key and a value.
 *
 * The set of attributes. The value can be a string, an integer, or the
 * Boolean values `true` and `false`. For example:
 *
 *    "/instance_id": "my-instance"
 *    "/http/user_agent": ""
 *    "/http/server_latency": 300
 *    "abc.com/myattribute": true
 */
export interface Attributes { [key: string]: string|number|boolean; }

/**
 * The relationship of the current span relative to the linked span: child,
 * parent, or unspecified.   - TYPE_UNSPECIFIED: The relationship of the two
 * spans is unknown, or known but other than parent-child.  - CHILD_LINKED_SPAN:
 * The linked span is a child of the current span.  - PARENT_LINKED_SPAN: The
 * linked span is a parent of the current span.
 */
export enum SpanLinkType {
  Unspecified = 'TYPE_UNSPECIFIED',
  Child = 'CHILD_LINKED_SPAN',
  Parent = 'PARENT_LINKED_SPAN',
}

/**
 * A pointer from the current span to another span in the same trace or in a
 * different trace. For example, this can be used in batching operations, where
 * a single batch handler processes multiple requests from different traces or
 * when the handler receives a request from a different project.
 */
export interface SpanLink {
  /**
   * The relationship of the current span relative to the linked span: child,
   * parent, or unspecified.
   */
  type?: SpanLinkType;
  /** A set of attributes on the link. */
  attributes?: Attributes;
}

/**
 * Type of span. Can be used to specify additional relationships between spans
 * in addition to a parent/child relationship.   - SPAN_KIND_UNSPECIFIED:
 * Unspecified.  - SERVER: Indicates that the span covers server-side handling
 * of an RPC or other remote network request.  - CLIENT: Indicates that the span
 * covers the client-side wrapper around an RPC or other remote request.
 */
export enum SpanKind {
  Unspecified = 'SPAN_KIND_UNSPECIFIED',
  Server = 'SERVER',
  Client = 'CLIENT',
}

/**
 * A single stack frame in a stack trace.
 */
export interface StackFrame {
  /**
   * The fully-qualified name that uniquely identifies the function or method
   * that is active in this frame.
   */
  functionName?: string;
  /**
   * An un-mangled function name, if `function_name` is
   * [mangled](http://www.avabodh.com/cxxin/namemangling.html). The name can be
   * fully qualified.
   */
  originalFunctionName?: string;
  /** The name of the source file where the function call appears. */
  fileName?: string;
  /** The line number in `file_name` where the function call appears. */
  lineNumber?: number;
  /**
   * The column number where the function call appears, if available. This is
   * important in JavaScript because of its anonymous functions.
   */
  columnNumber?: number;
  /** The binary module from where the code was loaded. */
  loadModule?: Module;
  /** The version of the deployed source code. */
  sourceVersion?: string;
}

/** A text annotation with a set of attributes. */
export interface Annotation {
  /**
   * The time the event occurred.
   * This is in milliseconds since the `baseTime` of the associated Trace.
   */
  time: number;
  /** A user-supplied message describing the event. */
  description: string;
  /** A set of attributes on the annotation. */
  attributes?: Attributes;
}

/** An event describing a message sent/received between Spans. */
export interface MessageEvent {
  /**
   * The time the event occurred.
   * This is in milliseconds since the `baseTime` of the associated Trace.
   */
  time: number;
  /**
   * The type of MessageEvent. Indicates whether the message was sent or
   * received.
   */
  type?: MessageEventType;
  /**
   * An identifier for the MessageEvent's message that can be used to match SENT
   * and RECEIVED MessageEvents. For example, this field could represent a
   * sequence ID for a streaming RPC. It is recommended to be unique within a
   * Span.
   */
  id?: number;
  /**
   * The number of uncompressed bytes sent or received.
   */
  uncompressedSize?: number;
  /**
   * The number of compressed bytes sent or received. If zero, assumed to be the
   * same size as uncompressed.
   */
  compressedSize?: number;
}

/**
 * Indicates whether the message was sent or received.   - TYPE_UNSPECIFIED:
 * Unknown event type.  - SENT: Indicates a sent message.  - RECEIVED: Indicates
 * a received message.
 */
export enum MessageEventType {
  Unspecified = 'TYPE_UNSPECIFIED',
  Sent = 'SENT',
  Received = 'RECEIVED',
}

/**
 * A description of a binary module.
 */
export interface Module {
  /**
   * TODO: document the meaning of this field. For example: main binary, kernel
   * modules, and dynamic libraries such as libc.so, sharedlib.so.
   */
  module?: string;
  /**
   * A unique identifier for the module, usually a hash of its contents.
   */
  buildId?: string;
}

/**
 * The `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. This
 * proto's fields are a subset of those of
 * [google.rpc.Status](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto),
 * which is used by [gRPC](https://github.com/grpc).
 */
export interface Status {
  /**
   * The status code.
   */
  code?: number;
  /**
   * A developer-facing error message, which should be in English.
   */
  message?: string;
}
