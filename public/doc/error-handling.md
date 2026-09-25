# Error Handling in Go

Error handling is one of the most important parts of writing reliable Go programs.

Go does not use traditional exception handling like:

```text
try
catch
finally
```

Instead, Go normally represents an error using the built-in `error` interface and handles it explicitly.

The common Go style is:

```go
result, err := someFunction()

if err != nil {
    return err
}
```

This looks simple, but understanding it properly is essential for professional Go development.

---

## 1. What Is an Error?

An error means that an operation did not complete successfully.

Examples:

```text
A file does not exist.
A database connection fails.
A user provides invalid input.
A network request fails.
A requested record cannot be found.
```

Go represents these failures using the `error` type.

## 2. The error Interface

The built-in `error` type is an interface:

```go
type error interface {
    Error() string
}
```

Any type that has:

```go
Error() string
```

implements the `error` interface.

For example:

```go
type MyError struct{}

func (MyError) Error() string {
    return "something went wrong"
}
```

Now `MyError` can be used as an `error`.

## 3. Returning an Error

A function can return both a result and an error:

```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }

    return a / b, nil
}
```

Here:

```go
nil
```

means there is no error.

## 4. Checking an Error

Call the function:

```go
result, err := divide(10, 2)

if err != nil {
    fmt.Println("Error:", err)
    return
}

fmt.Println("Result:", result)
```

Output:

```text
Result: 5
```

For invalid input:

```go
result, err := divide(10, 0)

if err != nil {
    fmt.Println("Error:", err)
    return
}
```

Output:

```text
Error: cannot divide by zero
```

## 5. The Most Important Pattern

You will see this pattern everywhere in Go:

```go
value, err := doSomething()

if err != nil {
    return err
}
```

For example:

```go
data, err := os.ReadFile("data.txt")

if err != nil {
    return err
}

fmt.Println(string(data))
```

The idea is:

```text
Call the operation.
Receive the result.
Check err.
Handle the error.
Continue only if the operation succeeded.
```

## 6. nil Means No Error

When a function returns an error:

```go
return nil
```

usually means:

```text
The operation succeeded.
```

Example:

```go
func saveData() error {
    // save data

    return nil
}
```

If something fails:

```go
return errors.New("failed to save data")
```

## 7. Creating Errors with errors.New

The `errors` package provides:

```go
errors.New()
```

Example:

```go
import "errors"

err := errors.New("user not found")
```

Then:

```go
fmt.Println(err)
```

Output:

```text
user not found
```

## 8. Creating Formatted Errors with fmt.Errorf

When an error needs dynamic information, use:

```go
fmt.Errorf()
```

Example:

```go
func getUser(id int) error {
    return fmt.Errorf("user with id %d not found", id)
}
```

If:

```go
getUser(101)
```

the error becomes:

```text
user with id 101 not found
```

## 9. Wrapping Errors with %w

One of the most important Go error-handling features is error wrapping.

Use:

```go
fmt.Errorf("context: %w", err)
```

Example:

```go
func getUser() error {
    err := errors.New("user not found")

    return fmt.Errorf("database query failed: %w", err)
}
```

The resulting message may be:

```text
database query failed: user not found
```

But more importantly, the original error is still available in the error chain.

## 10. Why Error Wrapping Matters

Imagine:

```text
HTTP Handler
    ↓
Service
    ↓
Repository
    ↓
Database
```

The database may return:

```text
connection refused
```

The repository can add context:

```text
query user: connection refused
```

The service can add more:

```text
get user: query user: connection refused
```

The HTTP handler can then log:

```text
request failed: get user: query user: connection refused
```

This gives developers useful debugging information.

## 11. errors.Is

When errors are wrapped, you should not compare them using only:

```go
err == target
```

Instead, use:

```go
errors.Is(err, target)
```

Example:

```go
var ErrNotFound = errors.New("not found")

func findUser() error {
    return fmt.Errorf("database lookup: %w", ErrNotFound)
}
```

Then:

```go
err := findUser()

if errors.Is(err, ErrNotFound) {
    fmt.Println("User was not found")
}
```

Even though the error was wrapped, `errors.Is` can find the original sentinel error.

## 12. Sentinel Errors

A sentinel error is a predefined error value representing a specific condition.

Example:

```go
var ErrNotFound = errors.New("not found")
```

Another:

```go
var ErrUnauthorized = errors.New("unauthorized")
```

Then:

```go
if errors.Is(err, ErrUnauthorized) {
    // handle unauthorized
}
```

This is useful when callers need to make decisions based on an error category.

## 13. errors.As

Sometimes you do not only want to know whether an error matches a particular value.

You want to retrieve a specific error type.

That is where:

```go
errors.As()
```

is useful.

Example:

```go
type ValidationError struct {
    Field string
    Msg   string
}

func (e ValidationError) Error() string {
    return e.Field + ": " + e.Msg
}
```

Now:

```go
err := ValidationError{
    Field: "email",
    Msg:   "invalid email",
}
```

You can check:

```go
var validationErr ValidationError

if errors.As(err, &validationErr) {
    fmt.Println("Field:", validationErr.Field)
    fmt.Println("Message:", validationErr.Msg)
}
```

## 14. errors.Is vs errors.As

Remember this simple rule:

```go
errors.Is
```

Use when you want to know:

```text
Is this error a specific known error?
```

```go
errors.Is(err, ErrNotFound)
```

```go
errors.As
```

Use when you want to know:

```text
Is this error of a specific type, and can I get that typed error?
```

```go
var validationErr ValidationError

errors.As(err, &validationErr)
```

## 15. Handle Errors at the Right Level

Not every function should log an error.

For example:

```go
func getUser() error {
    err := queryDatabase()

    if err != nil {
        return fmt.Errorf("get user: %w", err)
    }

    return nil
}
```

The function adds context and returns the error.

A higher layer might decide how to respond:

```go
err := getUser()

if err != nil {
    log.Println(err)
    http.Error(w, "Internal Server Error", http.StatusInternalServerError)
    return
}
```

A common principle is:

```text
Add useful context when returning an error; handle/log it at the appropriate boundary.
```

Avoid logging the same error repeatedly at every layer unless there is a specific reason.

## 16. Error Handling in HTTP APIs

A Go backend might do:

```go
func handler(w http.ResponseWriter, r *http.Request) {
    user, err := getUser()

    if err != nil {
        if errors.Is(err, ErrNotFound) {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }

        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    fmt.Fprintln(w, user)
}
```

The handler converts internal errors into appropriate HTTP responses.

## 17. Don't Ignore Errors

This is usually a bad idea:

```go
data, _ := os.ReadFile("config.json")
```

The `_` discards the error.

Sometimes ignoring an error is intentional, but you should do it only when you understand why it is safe.

Normally:

```go
data, err := os.ReadFile("config.json")

if err != nil {
    return err
}
```

is better.

## 18. Errors Should Add Context

Compare:

```go
return err
```

with:

```go
return fmt.Errorf("load user profile: %w", err)
```

The second version tells the caller what operation failed.

Good error:

```text
load user profile: database connection refused
```

Less useful:

```text
database connection refused
```

Context is especially valuable in larger applications.

## 19. Don't Expose Sensitive Internal Errors

Suppose a database returns:

```text
pq: password authentication failed for user admin
```

You generally should not send the raw database error to an API client.

Instead:

```go
http.Error(
    w,
    "Internal server error",
    http.StatusInternalServerError,
)
```

Log the detailed internal error securely on the server.

## 20. A Complete Example

```go
package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("user not found")

func findUser(id int) error {
    if id != 1 {
        return fmt.Errorf("find user %d: %w", id, ErrNotFound)
    }

    return nil
}

func getUser(id int) error {
    err := findUser(id)

    if err != nil {
        return fmt.Errorf("get user: %w", err)
    }

    return nil
}

func main() {
    err := getUser(100)

    if err != nil {
        fmt.Println(err)

        if errors.Is(err, ErrNotFound) {
            fmt.Println("Handle as not found")
        }
    }
}
```

Output:

```text
get user: find user 100: user not found
Handle as not found
```

## 21. Summary

Important Go error-handling concepts:

- `error`
- `errors.New()`
- `fmt.Errorf()`
- `%w`
- `errors.Is()`
- `errors.As()`
- sentinel errors
- error wrapping
- contextual errors

The standard pattern is:

```go
value, err := operation()

if err != nil {
    return err
}
```

For wrapping:

```go
return fmt.Errorf("operation failed: %w", err)
```

For checking a known error:

```go
if errors.Is(err, ErrNotFound) {
    // handle
}
```

For checking an error type:

```go
var target MyError

if errors.As(err, &target) {
    // handle
}
```

## Practice

Build a small service with:

```text
handler
   ↓
service
   ↓
repository
```

Make the repository return:

```go
ErrNotFound
```

Wrap it in the service using `%w`, then use `errors.Is` in the handler to return HTTP 404.
