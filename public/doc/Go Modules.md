# Go Modules

A **Go module** is a collection of related Go packages that are versioned together.

Go Modules are the standard way to manage dependencies and organize modern Go projects.

If you build a real Go application, you should understand:

```text
go.mod
go.sum
module path
dependencies
versions
go get
go mod tidy
go mod download
```

---

# 1. What Is a Module?

Suppose you create a project:

```text
myapp/
├── main.go
├── user/
│   └── user.go
└── go.mod
```

The entire project can be one Go module.

The module is identified by a **module path**.

Example:

```text
example.com/myapp
```

---

# 2. Creating a Module

Open your terminal:

```bash
mkdir myapp
cd myapp
```

Then:

```bash
go mod init example.com/myapp
```

Go creates:

```text
go.mod
```

---

# 3. What Is go.mod?

A basic `go.mod` might look like:

```go
module example.com/myapp

go 1.25
```

The exact Go version in your file depends on the Go version/toolchain you use.

The module file tells Go:

> This project is the module `example.com/myapp`.

---

# 4. Why Do We Need go.mod?

`go.mod` helps Go understand:

- Project identity
- Go version
- Dependencies
- Dependency versions
- Module requirements

Without proper module management, large Go projects become much harder to maintain.

---

# 5. Module Path

Suppose:

```go
module github.com/siam/myapp
```

Then a package inside:

```text
myapp/
└── calculator/
    └── calculator.go
```

can be imported as:

```go
import "github.com/siam/myapp/calculator"
```

The module path is the base of package import paths inside the module.

---

# 6. Example Project

Structure:

```text
myapp/
├── go.mod
├── main.go
└── calculator/
    └── calculator.go
```

`go.mod`:

```go
module example.com/myapp

go 1.25
```

`calculator/calculator.go`:

```go
package calculator

func Add(a, b int) int {
    return a + b
}
```

`main.go`:

```go
package main

import (
    "fmt"

    "example.com/myapp/calculator"
)

func main() {
    fmt.Println(calculator.Add(10, 20))
}
```

---

# 7. Why Module Path Matters

The import:

```go
import "example.com/myapp/calculator"
```

works because:

```text
module example.com/myapp
```

is declared in `go.mod`.

Then:

```text
example.com/myapp
        ↓
calculator
        ↓
example.com/myapp/calculator
```

---

# 8. Adding an External Dependency

Suppose you want to use an external package.

You can use:

```bash
go get package/path
```

For example:

```bash
go get github.com/google/uuid
```

Go adds the dependency to `go.mod`.

The exact version depends on what is current when you run the command.

---

# 9. Using a Dependency

Example:

```go
package main

import (
    "fmt"

    "github.com/google/uuid"
)

func main() {
    id := uuid.New()

    fmt.Println(id)
}
```

The dependency is downloaded and managed through Go Modules.

---

# 10. go.sum

After adding dependencies, you may also see:

```text
go.sum
```

This file contains cryptographic checksums for module dependencies.

Its purpose includes helping Go verify that downloaded module content matches expected content.

You normally commit `go.sum` to version control along with `go.mod`.

---

# 11. go mod tidy

One of the most useful commands is:

```bash
go mod tidy
```

It:

- Adds missing required dependencies
- Removes unnecessary dependencies
- Updates `go.mod` and `go.sum` as needed

After changing imports, running:

```bash
go mod tidy
```

is often a good cleanup step.

---

# 12. go mod download

You can download dependencies with:

```bash
go mod download
```

This downloads modules required by the module graph.

Useful in environments such as CI/CD.

---

# 13. go mod verify

You can verify downloaded dependencies:

```bash
go mod verify
```

It checks whether downloaded module files have been modified from their expected contents.

---

# 14. go list -m

To see the current module:

```bash
go list -m
```

You might get:

```text
example.com/myapp
```

---

# 15. List All Dependencies

Use:

```bash
go list -m all
```

This displays the module and its dependencies.

---

# 16. View go.mod Information

You can inspect:

```bash
cat go.mod
```

Example:

```text
module example.com/myapp

go 1.25

require github.com/google/uuid v...
```

The actual dependency version is determined by your project.

---

# 17. Direct and Indirect Dependencies

You may see:

```go
require (
    github.com/google/uuid v1.x.x
    example.com/some-library v1.x.x // indirect
)
```

A direct dependency is something your code imports directly.

An indirect dependency is typically required by another dependency.

---

# 18. Updating Dependencies

You can request an update using:

```bash
go get -u package/path
```

Then clean the module files:

```bash
go mod tidy
```

For production projects, dependency updates should be reviewed rather than blindly updating everything.

---

# 19. Removing a Dependency

If your code no longer imports a dependency, run:

```bash
go mod tidy
```

Go can remove dependencies that are no longer required.

---

# 20. Go Module Cache

Go stores downloaded modules in a module cache.

You can find the cache location using:

```bash
go env GOMODCACHE
```

You normally don't need to manually manage this cache.

---

# 21. Go Environment

You can inspect Go environment variables:

```bash
go env
```

For example:

```bash
go env GOPATH
go env GOMOD
go env GOROOT
```

`GOMOD` can show which `go.mod` file is being used by the current directory.

---

# 22. Running a Module

From the module root:

```bash
go run .
```

Go finds the module and builds/runs the package in the current directory.

If your executable is in a subdirectory:

```bash
go run ./cmd/server
```

---

# 23. Building a Module

You can build the current package:

```bash
go build .
```

Or build a specific package:

```bash
go build ./cmd/server
```

---

# 24. Testing a Module

Run all tests:

```bash
go test ./...
```

The:

```text
./...
```

pattern means packages recursively under the current module.

This is very common in CI pipelines.

---

# 25. Formatting a Module

Format Go code:

```bash
gofmt -w .
```

Or format individual files:

```bash
gofmt -w main.go
```

Many editors perform formatting automatically.

---

# 26. Module and Package Relationship

This distinction is extremely important.

A **package** is a collection of Go source files in a directory.

A **module** is a collection of related packages managed and versioned together.

Think:

```text
Module
│
├── Package A
├── Package B
├── Package C
└── Package D
```

For example:

```text
myapp/
│
├── go.mod
│
├── main.go
│
├── user/
│   └── user.go
│
├── auth/
│   └── auth.go
│
└── database/
    └── database.go
```

The whole project can be one module containing several packages.

---

# 27. Module vs Package

| Concept | Module | Package |
|---|---|---|
| Purpose | Dependency/version management | Code organization |
| Defined by | `go.mod` | `package` declaration |
| Can contain | Multiple packages | Go source files |
| Has version | Yes | Not independently required |
| Importable | Packages inside it are imported | Yes |
| Example | `github.com/user/project` | `auth` |

---

# 28. Module Versioning

Modules can have versions such as:

```text
v1.0.0
v1.2.0
v2.0.0
```

Go's module system uses semantic versioning conventions.

A major version change can require a different module path.

For example, a module at version 2 or later commonly uses:

```go
module example.com/project/v2
```

Then consumers import:

```go
import "example.com/project/v2"
```

---

# 29. Semantic Versioning

Versions generally follow:

```text
MAJOR.MINOR.PATCH
```

For example:

```text
v1.4.2
```

means:

```text
1 → major
4 → minor
2 → patch
```

Conceptually:

```text
Major → potentially breaking API changes
Minor → backward-compatible features
Patch → backward-compatible fixes
```

---

# 30. Local Module Development

Sometimes you have two local modules:

```text
workspace/
├── app/
└── mylibrary/
```

Your application may depend on your local library during development.

Go provides the `replace` directive.

Example:

```go
module example.com/app

go 1.25

require example.com/mylibrary v0.0.0

replace example.com/mylibrary => ../mylibrary
```

Now Go uses the local directory instead of downloading that module version.

This is useful during local development.

---

# 31. Replace Directive

General syntax:

```go
replace module/path => ../local/path
```

Example:

```go
replace github.com/example/library => ../library
```

Be careful with `replace` directives in shared production modules. They are often useful for local development but may not belong in a published module.

---

# 32. Private Modules

In professional development, you may use private Git repositories.

Go supports private modules, but you may need to configure:

```bash
GOPRIVATE
```

For example:

```bash
go env -w GOPRIVATE=github.com/mycompany/*
```

This tells Go that matching module paths are private.

Authentication for your Git host may also need to be configured.

---

# 33. Vendor Directory

Go can copy dependencies into a local `vendor` directory:

```bash
go mod vendor
```

You may then have:

```text
project/
├── go.mod
├── go.sum
├── vendor/
└── main.go
```

Vendor mode can be useful in environments where dependencies need to be stored with the source tree.

Modern Go projects commonly rely on the module cache instead, but `vendor` remains supported.

---

# 34. Common Commands

Here are the commands you should memorize:

### Create a module

```bash
go mod init example.com/myapp
```

### Add/update a dependency

```bash
go get package/path
```

### Clean dependencies

```bash
go mod tidy
```

### Download dependencies

```bash
go mod download
```

### Verify dependencies

```bash
go mod verify
```

### Show module

```bash
go list -m
```

### Show all modules

```bash
go list -m all
```

### Vendor dependencies

```bash
go mod vendor
```

---

# 35. Typical Go Project Workflow

When starting a new project:

```bash
mkdir myapp
cd myapp

go mod init example.com/myapp
```

Create:

```text
main.go
```

Then run:

```bash
go run .
```

When you add dependencies:

```bash
go get package/path
```

After changing dependencies:

```bash
go mod tidy
```

Run tests:

```bash
go test ./...
```

Build:

```bash
go build .
```

---

# 36. Example Real Backend Module

Suppose you're building a Go REST API.

Your project might look like:

```text
course-api/
├── go.mod
├── go.sum
│
├── cmd/
│   └── server/
│       └── main.go
│
├── internal/
│   ├── auth/
│   ├── user/
│   ├── course/
│   ├── enrollment/
│   └── database/
│
└── migrations/
```

`go.mod` might start with:

```go
module github.com/yourname/course-api

go 1.25
```

Dependencies can then be managed through the module system.

---

# 37. Why Go Modules Matter for Backend Developers

If you are building real Go applications, you will constantly work with dependencies such as:

```text
PostgreSQL drivers
HTTP routers
JWT libraries
Validation libraries
UUID libraries
Logging libraries
Testing tools
```

Go Modules make these dependencies reproducible and manageable.

For example:

```text
Your application
       │
       ├── PostgreSQL driver
       ├── JWT library
       ├── UUID library
       └── Router
```

The module system records the required dependency versions.

---

# 38. Common Mistakes

### Mistake 1: Forgetting to initialize the module

Running:

```bash
go run .
```

before creating `go.mod` can cause module-related problems depending on your environment.

Create the module:

```bash
go mod init example.com/myapp
```

---

### Mistake 2: Wrong import path

If:

```go
module github.com/siam/myapp
```

then your local package:

```text
calculator/
```

is imported as:

```go
import "github.com/siam/myapp/calculator"
```

not:

```go
import "./calculator"
```

Modern Go module code should use module-aware import paths rather than old relative imports.

---

### Mistake 3: Manually editing dependency versions unnecessarily

Prefer commands such as:

```bash
go get
go mod tidy
```

and inspect the resulting changes.

---

### Mistake 4: Forgetting go.sum

When your project uses dependencies, `go.sum` is normally committed to version control.

---

# 39. go.mod Is Not Just a Dependency List

A beginner may think:

```text
go.mod = dependency file
```

But it is more than that.

It defines the module identity and contains module requirements and other module-related directives.

Think:

```text
go.mod
   │
   ├── Module identity
   ├── Go/toolchain information
   ├── Dependencies
   ├── Version requirements
   └── Module directives
```

---

# 40. Final Mental Model

Think of a Go project like this:

```text
                MODULE
                  │
          ┌───────┴───────┐
          │               │
       PACKAGE          PACKAGE
          │               │
       files            files
          │
          └──── imports ──┘
```

And:

```text
go.mod
   ↓
defines module
   ↓
manages dependencies
   ↓
controls module versions
```

---

# 41. Summary

The most important things to remember are:

```text
Module
go.mod
go.sum
module path
dependencies
go get
go mod tidy
go mod download
go mod verify
go list
replace
semantic versioning
```

The basic workflow is:

```bash
go mod init example.com/myapp
go get package/path
go mod tidy
go test ./...
go build .
```

Once you understand Go Modules, you can confidently move from small Go programs to real-world multi-package applications and backend projects.