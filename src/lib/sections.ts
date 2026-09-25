export type SectionOverview = {
  /** SEO title for the section hub page. */
  title: string;
  /** Short factual summary shown on the pillar page and used as its description. */
  summary: string;
  /** What the learner will be able to do after the section. */
  outcomes: string[];
};

/**
 * Structural content for the section hub ("pillar") pages, keyed by section
 * slug. High-level and factual — detailed tutorials live on the child pages.
 */
export const SECTION_OVERVIEWS: Record<string, SectionOverview> = {
  "go-fundamentals": {
    title: "Go Fundamentals: Learn Go from Scratch",
    summary:
      "Start from zero: how a Go program is structured, and the basics you will use in every file — variables, data types, control flow and input/output.",
    outcomes: [
      "Write, build and run your first Go program",
      "Declare variables and constants",
      "Work with Go's core data types",
      "Control program flow with if, switch and for",
    ],
  },
  "go-core-programming": {
    title: "Core Go Programming: Functions, Slices, Maps and Structs",
    summary:
      "The building blocks of a Go program: functions, collections, strings, structs, pointers, methods, packages and modules.",
    outcomes: [
      "Define functions with multiple and variadic return values",
      "Work with arrays, slices and maps",
      "Model data with structs, methods and pointers",
      "Organize code into packages and modules",
    ],
  },
  "go-advanced-language-features": {
    title: "Advanced Go: Interfaces, Generics, Errors and Reflection",
    summary:
      "Go's type system and error model: interfaces, embedding, type assertions, generics, reflection and the error handling toolkit.",
    outcomes: [
      "Design with interfaces and embedding",
      "Wrap and inspect errors with errors.Is and errors.As",
      "Write generic functions and types",
      "Inspect values at runtime with reflection",
    ],
  },
  "go-concurrency": {
    title: "Go Concurrency: Goroutines, Channels and Synchronization",
    summary:
      "Run work concurrently with goroutines and channels, and coordinate it safely with the sync package, context and concurrency patterns.",
    outcomes: [
      "Start and coordinate goroutines",
      "Pass data through buffered and unbuffered channels",
      "Synchronize with WaitGroup, Mutex and atomics",
      "Cancel work with context",
      "Recognize race conditions and deadlocks",
    ],
  },
  "go-standard-library": {
    title: "Go Standard Library: Package Guides and Examples",
    summary:
      "Guides to the standard-library packages Go developers reach for most, from fmt and strings to time, io, sort and encoding/json.",
    outcomes: [
      "Format and parse values with fmt and strconv",
      "Process text with strings and regexp",
      "Stream data with io and bufio",
      "Encode and decode JSON",
      "Use time, sort and the container types",
    ],
  },
  "go-file-and-data-handling": {
    title: "Go File and Data Handling: Files, JSON, CSV and XML",
    summary:
      "Read and write files and directories, and work with the data formats Go services exchange — CSV, JSON, XML and configuration files.",
    outcomes: [
      "Read and write files",
      "Walk and manage directories",
      "Parse CSV, JSON and XML",
      "Configure programs with environment variables and config files",
    ],
  },
  "go-testing": {
    title: "Testing in Go: Unit Tests, Benchmarks and Fuzzing",
    summary:
      "Test Go code with the standard testing package: unit and table-driven tests, subtests, helpers, mocks, benchmarks, fuzzing and coverage.",
    outcomes: [
      "Write unit and table-driven tests",
      "Structure subtests and test helpers",
      "Isolate dependencies with mocks",
      "Benchmark and fuzz your code",
      "Measure and improve coverage",
    ],
  },
  "go-http-and-networking": {
    title: "Go HTTP and Networking: Servers, Clients and Protocols",
    summary:
      "Build HTTP servers and clients with net/http, and work with the lower-level networking primitives underneath them.",
    outcomes: [
      "Serve HTTP with handlers and middleware",
      "Build HTTP clients and parse responses",
      "Handle headers, cookies and query/path parameters",
      "Use TCP, UDP and WebSockets",
    ],
  },
  "go-rest-api-development": {
    title: "Building REST APIs in Go: Routing, Auth and Best Practices",
    summary:
      "Design and build REST APIs in Go: routing, CRUD, request validation, status codes, authentication, authorization, rate limiting and versioning.",
    outcomes: [
      "Structure API routes and handlers",
      "Implement CRUD endpoints",
      "Validate requests and shape responses",
      "Add authentication and authorization",
      "Version and rate-limit an API",
    ],
  },
  "go-database-programming": {
    title: "Go Database Programming: database/sql, PostgreSQL and pgx",
    summary:
      "Talk to databases from Go with database/sql and pgx, covering queries, transactions, connection pooling, indexes and migrations.",
    outcomes: [
      "Connect to PostgreSQL from Go",
      "Query and execute with parameters",
      "Manage transactions",
      "Configure connection pooling",
      "Use prepared statements, migrations and ORMs",
    ],
  },
  "go-backend-architecture": {
    title: "Go Backend Architecture: Clean, Layered and Modular Design",
    summary:
      "Organize larger Go services: layering, modularity, clean architecture, the repository pattern, dependency injection and configuration.",
    outcomes: [
      "Structure a Go project",
      "Apply layered and clean architecture",
      "Use the repository and service patterns",
      "Wire dependencies explicitly",
      "Organize configuration, logging and errors",
    ],
  },
  "go-production-development": {
    title: "Go in Production: Deployment, Observability and Security",
    summary:
      "Ship Go services to production: configuration, graceful shutdown, health checks, observability, containers, CI/CD and security.",
    outcomes: [
      "Manage environments and configuration",
      "Shut down gracefully and report health",
      "Add structured logging, metrics and tracing",
      "Containerize and deploy a service",
      "Harden production services",
    ],
  },
  "go-performance-and-internals": {
    title: "Go Performance and Internals: Profiling and Optimization",
    summary:
      "Understand how Go uses memory and CPU, then measure and improve real performance with pprof, benchmarking and the runtime's GC.",
    outcomes: [
      "Reason about the stack, heap and escape analysis",
      "Profile CPU and memory with pprof",
      "Benchmark and compare implementations",
      "Tune the garbage collector",
    ],
  },
  "go-runtime-and-concurrency-internals": {
    title: "Go Runtime Internals: Scheduler, Memory Model and Channels",
    summary:
      "Go beneath the surface: the G-M-P scheduler and work stealing, the memory model, happens-before, and how channels and mutexes are implemented.",
    outcomes: [
      "Understand the G-M-P scheduler and work stealing",
      "Apply the Go memory model and happens-before",
      "See how channels and mutexes work internally",
      "Design advanced concurrent systems",
    ],
  },
  "go-distributed-systems": {
    title: "Distributed Systems in Go: gRPC, Messaging and Caching",
    summary:
      "Build systems that span processes and machines: RPC and gRPC, service discovery, load balancing, caching, messaging and consistency.",
    outcomes: [
      "Reason about distributed system trade-offs",
      "Communicate with RPC and gRPC",
      "Discover and load-balance services",
      "Cache with Redis",
      "Use message queues, Kafka and event-driven patterns",
    ],
  },
  "go-mastery": {
    title: "Advanced Go Mastery: Patterns and Large-Scale Systems",
    summary:
      "Advanced material for experienced Go engineers: design patterns, large-scale systems, runtime and compiler internals, and expert projects.",
    outcomes: [
      "Apply Go design patterns",
      "Architect large-scale systems",
      "Go deeper into runtime and compiler internals",
      "Build libraries, CLIs and microservices",
    ],
  },
};

export function getSectionOverview(
  slug: string,
  sectionTitle?: string,
): SectionOverview {
  const overview = SECTION_OVERVIEWS[slug];
  if (overview) return overview;

  const label = sectionTitle ?? slug;
  return {
    title: label,
    summary: `Guides and tutorials in the ${label} section of the Go documentation.`,
    outcomes: [],
  };
}
