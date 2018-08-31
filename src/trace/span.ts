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
export interface Attributes {
  [key: string]: string|number|boolean;
}

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
export class SpanLink {
  /**
   * The relationship of the current span relative to the linked span: child,
   * parent, or unspecified.
   */
  /** A set of attributes on the link. */
  constructor(
      readonly type: SpanLinkType = SpanLinkType.Unspecified,
      readonly attributes: Attributes = {}) {}
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
export interface StackTraceStackFrame {
  /**
   * The fully-qualified name that uniquely identifies the function or method
   * that is active in this frame.
   */
  functionName?: TraceTruncatableString;
  /**
   * An un-mangled function name, if `function_name` is
   * [mangled](http://www.avabodh.com/cxxin/namemangling.html). The name can be
   * fully qualified.
   */
  originalFunctionName?: TraceTruncatableString;
  /**
   * The name of the source file where the function call appears.
   */
  fileName?: TraceTruncatableString;
  /**
   * The line number in `file_name` where the function call appears.
   */
  lineNumber?: string;
  /**
   * The column number where the function call appears, if available. This is
   * important in JavaScript because of its anonymous functions.
   */
  columnNumber?: string;
  /**
   * The binary module from where the code was loaded.
   */
  loadModule?: TraceModule;
  /**
   * The version of the deployed source code.
   */
  sourceVersion?: TraceTruncatableString;
}

/**
 * A collection of stack frames, which can be truncated.
 */
export interface StackTraceStackFrames {
  /**
   * Stack frames in this call stack.
   */
  frame?: StackTraceStackFrame[];
  /**
   * The number of stack frames that were dropped because there were too many
   * stack frames. If this value is 0, then no stack frames were dropped.
   */
  droppedFramesCount?: number;
}

/** A text annotation with a set of attributes. */
export class Annotation {
  /** The time the event occurred. */
  /** A user-supplied message describing the event. */
  /** A set of attributes on the annotation. */
  constructor(
      readonly time: number, readonly description: string,
      readonly attributes: Attributes = {}) {}
}

/** An event describing a message sent/received between Spans. */
export interface MessageEvent {
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
  id?: string;
  /**
   * The number of uncompressed bytes sent or received.
   */
  uncompressedSize?: string;
  /**
   * The number of compressed bytes sent or received. If zero, assumed to be the
   * same size as uncompressed.
   */
  compressedSize?: string;
}

/**
 * Indicates whether the message was sent or received.   - TYPE_UNSPECIFIED:
 * Unknown event type.  - SENT: Indicates a sent message.  - RECEIVED: Indicates
 * a received message.
 * @enum {string}
 */
export enum MessageEventType {
  TYPEUNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  SENT = 'SENT' as any,
  RECEIVED = 'RECEIVED' as any
}

/**
 * A description of a binary module.
 */
export interface TraceModule {
  /**
   * TODO: document the meaning of this field. For example: main binary, kernel
   * modules, and dynamic libraries such as libc.so, sharedlib.so.
   */
  module?: TraceTruncatableString;
  /**
   * A unique identifier for the module, usually a hash of its contents.
   */
  buildId?: TraceTruncatableString;
}

/**
 * A span represents a single operation within a trace. Spans can be nested to
 * form a trace tree. Often, a trace contains a root span that describes the
 * end-to-end latency, and one or more subspans for its sub-operations. A trace
 * can also contain multiple root spans, or none at all. Spans do not need to be
 * contiguous - there may be gaps or overlaps between spans in a trace.
 */
export class Span {
  /**
   * A unique identifier for a trace. All spans from the same trace share the
   * same `trace_id`. The ID is a 16-byte array.  This field is required.
   */
  traceId?: string;
  /**
   * A unique identifier for a span within a trace, assigned when the span is
   * created. The ID is an 8-byte array.  This field is required.
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
   */
  tracestate?: {[key: string]: string;};
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
  name?: TraceTruncatableString;
  /**
   * Distinguishes between spans generated in a particular context. For example,
   * two spans with the same name may be distinguished using `CLIENT` and
   * `SERVER` to identify queueing latency associated with the span.
   */
  kind: SpanKind = SpanKind.Unspecified;
  /**
   * The start time of the span. On the client side, this is the time kept by
   * the local machine where the span execution starts. On the server side, this
   * is the time when the server's application handler starts running.
   */
  startTime?: Date;
  /**
   * The end time of the span. On the client side, this is the time kept by the
   * local machine where the span execution ends. On the server side, this is
   * the time when the server application handler stops running.
   */
  endTime?: Date;
  /**
   * A set of attributes on the span.
   */
  attributes?: Attributes;
  /**
   * A stack trace captured at the start of the span.
   */
  stackTrace?: TraceStackTrace;
  /** Message events list. */
  messageEvents: MessageEvent[] = [];
  /** Span annotations. */
  annotations: Annotation[] = [];

  /** The included links. */
  links: SpanLink[] = [];

  /**
   * An optional final status for this span.
   */
  status?: TraceStatus;
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
 * The call stack which originated this span.
 */
export interface TraceStackTrace {
  /**
   * Stack frames in this stack trace.
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
   */
  stackTraceHashId?: string;
}

/**
 * The `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. This
 * proto's fields are a subset of those of
 * [google.rpc.Status](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto),
 * which is used by [gRPC](https://github.com/grpc).
 */
export interface TraceStatus {
  /**
   * The status code.
   */
  code?: number;
  /**
   * A developer-facing error message, which should be in English.
   */
  message?: string;
}

/**
 * A string that might be shortened to a specified length.
 */
export interface TraceTruncatableString {
  /**
   * The shortened string. For example, if the original string was 500 bytes
   * long and the limit of the string was 128 bytes, then this value contains
   * the first 128 bytes of the 500-byte string. Note that truncation always
   * happens on a character boundary, to ensure that a truncated string is still
   * valid UTF-8. Because it may contain multi-byte characters, the size of the
   * truncated string may be less than the truncation limit.
   */
  value?: string;
  /**
   * The number of bytes removed from the original string. If this value is 0,
   * then the string was not shortened.
   */
  truncatedByteCount?: number;
}
