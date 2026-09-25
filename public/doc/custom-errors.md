# Custom Errors in Go

A custom error is an error type that you define yourself.

Custom errors are useful when an application needs to return structured information about what went wrong.

Instead of returning only:

```text
invalid input
```

you can create an error containing:

```text
field
message
code
resource
ID
```

This is especially useful in backend applications.

---

## 1. Why Create Custom Errors?

A simple error:

```go
errors.New("invalid email")
```

contains only a message.

But an API may need more information:

```text
Field: email
Code: INVALID_EMAIL
Message: email address is invalid
```

A custom error can store these values.

## 2. Basic Custom Error

Create a struct:

```go
type ValidationError struct {
    Message string
}
```

Then implement:

```go
func (e ValidationError) Error() string {
    return e.Message
}
```

Complete example:

```go
package main

import "fmt"

type ValidationError struct {
    Message string
}

func (e ValidationError) Error() string {
    return e.Message
}

func main() {
    err := ValidationError{
        Message: "email is invalid",
    }

    fmt.Println(err)
}
```

Output:

```text
email is invalid
```

Why does this work?

Because `ValidationError` implements:

```go
Error() string
```

Therefore it satisfies the `error` interface.

## 3. Custom Error with More Information

A useful custom error might contain:

```go
type ValidationError struct {
    Field   string
    Message string
}
```

Implementation:

```go
func (e ValidationError) Error() string {
    return e.Field + ": " + e.Message
}
```

Example:

```go
err := ValidationError{
    Field:   "email",
    Message: "invalid email address",
}

fmt.Println(err)
```

Output:

```text
email: invalid email address
```

## 4. Custom Error with an Error Code

For backend APIs, a code can be useful:

```go
type APIError struct {
    Code    string
    Message string
}
```

Implementation:

```go
func (e APIError) Error() string {
    return e.Message
}
```

Example:

```go
err := APIError{
    Code:    "USER_NOT_FOUND",
    Message: "user was not found",
}
```

The error message is:

```text
user was not found
```

But the application can also inspect:

```go
err.Code
```

to determine the error category.

## 5. Using Custom Errors as error

Because `APIError` implements `Error()`:

```go
func (e APIError) Error() string {
    return e.Message
}
```

it can be returned as:

```go
func getUser() error {
    return APIError{
        Code:    "USER_NOT_FOUND",
        Message: "user was not found",
    }
}
```

The return type is still:

```go
error
```

This is one of the most important concepts:

A custom error type can be returned through the `error` interface.

## 6. Detecting a Custom Error with errors.As

Suppose:

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return e.Field + ": " + e.Message
}
```

A function returns:

```go
func validateUser() error {
    return ValidationError{
        Field:   "email",
        Message: "invalid email",
    }
}
```

Now retrieve the custom error:

```go
err := validateUser()

var validationErr ValidationError

if errors.As(err, &validationErr) {
    fmt.Println("Field:", validationErr.Field)
    fmt.Println("Message:", validationErr.Message)
}
```

Output:

```text
Field: email
Message: invalid email
```

## 7. Why errors.As Is Important

This is usually better than trying to inspect the error string:

```go
if err.Error() == "email: invalid email" {
    // ...
}
```

String comparison is fragile.

Instead:

```go
var validationErr ValidationError

if errors.As(err, &validationErr) {
    // use structured fields
}
```

Now the program depends on the error's type and data rather than an exact text message.

## 8. Custom Error with an HTTP Status

For a web application, you might define:

```go
type APIError struct {
    StatusCode int
    Code       string
    Message    string
}
```

Implementation:

```go
func (e APIError) Error() string {
    return e.Message
}
```

Example:

```go
return APIError{
    StatusCode: 404,
    Code:       "USER_NOT_FOUND",
    Message:    "user not found",
}
```

Then an HTTP handler can inspect it.

```go
err := getUser()

if err != nil {
    var apiErr APIError

    if errors.As(err, &apiErr) {
        http.Error(
            w,
            apiErr.Message,
            apiErr.StatusCode,
        )
        return
    }

    http.Error(
        w,
        "Internal server error",
        http.StatusInternalServerError,
    )
}
```

## 9. A Better API Error Structure

For a real backend, you might use:

```go
type APIError struct {
    StatusCode int
    Code       string
    Message    string
    Field      string
}
```

Example:

```go
err := APIError{
    StatusCode: 400,
    Code:       "INVALID_INPUT",
    Message:    "email address is invalid",
    Field:      "email",
}
```

Now the application has structured information.

## 10. Custom Error with an ID

A database-related error might include an ID:

```go
type UserNotFoundError struct {
    UserID int
}

func (e UserNotFoundError) Error() string {
    return fmt.Sprintf("user %d not found", e.UserID)
}
```

Use it:

```go
func findUser(id int) error {
    return UserNotFoundError{
        UserID: id,
    }
}
```

Now:

```go
err := findUser(101)

var notFound UserNotFoundError

if errors.As(err, &notFound) {
    fmt.Println("Missing user ID:", notFound.UserID)
}
```

Output:

```text
Missing user ID: 101
```

## 11. Custom Errors and Wrapping

Custom errors can also be wrapped.

```go
func repository() error {
    return UserNotFoundError{
        UserID: 101,
    }
}

func service() error {
    err := repository()

    if err != nil {
        return fmt.Errorf("get user: %w", err)
    }

    return nil
}
```

Now the service adds context while preserving the original error.

You can still retrieve the custom error:

```go
err := service()

var notFound UserNotFoundError

if errors.As(err, &notFound) {
    fmt.Println("User ID:", notFound.UserID)
}
```

This is one of the major advantages of `%w`.

## 12. Pointer vs Value Custom Errors

You may define:

```go
func (e ValidationError) Error() string {
    return e.Message
}
```

or:

```go
func (e *ValidationError) Error() string {
    return e.Message
}
```

These choices affect which forms implement `error`.

With a value receiver:

```go
func (e ValidationError) Error() string
```

both:

```go
ValidationError
```

and:

```go
*ValidationError
```

can satisfy the interface.

With a pointer receiver:

```go
func (e *ValidationError) Error() string
```

the pointer type:

```go
*ValidationError
```

satisfies `error`, but the value type does not.

For custom errors, choose deliberately and keep the style consistent.

## 13. Custom Error Constructor

Constructors can make custom errors easier to create.

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return e.Field + ": " + e.Message
}

func NewValidationError(field, message string) ValidationError {
    return ValidationError{
        Field:   field,
        Message: message,
    }
}
```

Now:

```go
err := NewValidationError(
    "email",
    "invalid email address",
)
```

## 14. Custom Error with Unwrap

A custom error can wrap another error.

Example:

```go
type DatabaseError struct {
    Operation string
    Err       error
}
```

Implement:

```go
func (e DatabaseError) Error() string {
    return fmt.Sprintf(
        "%s failed: %v",
        e.Operation,
        e.Err,
    )
}

func (e DatabaseError) Unwrap() error {
    return e.Err
}
```

Now the underlying error remains accessible.

Example:

```go
var ErrConnection = errors.New("database connection failed")

err := DatabaseError{
    Operation: "query user",
    Err:       ErrConnection,
}
```

Then:

```go
if errors.Is(err, ErrConnection) {
    fmt.Println("Database connection problem")
}
```

works because `Unwrap()` exposes the underlying error.

## 15. Complete Backend Example

Let's create a small example with:

```text
Handler
   ↓
Service
   ↓
Repository
```

### Repository

```go
type UserNotFoundError struct {
    UserID int
}

func (e UserNotFoundError) Error() string {
    return fmt.Sprintf("user %d not found", e.UserID)
}

func repository(id int) error {
    return UserNotFoundError{
        UserID: id,
    }
}
```

### Service

```go
func service(id int) error {
    err := repository(id)

    if err != nil {
        return fmt.Errorf("get user: %w", err)
    }

    return nil
}
```

### Handler

```go
func handler(id int) {
    err := service(id)

    if err != nil {
        var notFound UserNotFoundError

        if errors.As(err, &notFound) {
            fmt.Println("404 - user not found")
            fmt.Println("User ID:", notFound.UserID)
            return
        }

        fmt.Println("500 - internal server error")
        return
    }

    fmt.Println("User found")
}
```

Call:

```go
handler(101)
```

Possible output:

```text
404 - user not found
User ID: 101
```

This demonstrates a professional error flow:

```text
Repository
    ↓
Custom Error
    ↓
Service
    ↓
Wrap with %w
    ↓
Handler
    ↓
errors.As
    ↓
HTTP response
```

## 16. Custom Error vs Sentinel Error

These solve slightly different problems.

### Sentinel Error

Use a predefined error value:

```go
var ErrNotFound = errors.New("not found")
```

Then:

```go
if errors.Is(err, ErrNotFound) {
    // handle
}
```

This is useful when you only need to identify a condition.

### Custom Error

Use a custom type:

```go
type UserNotFoundError struct {
    UserID int
}
```

This is useful when you need structured information.

For example:

```text
User ID
Field
Status Code
Error Code
Operation
```

## 17. When Should You Create a Custom Error?

Do not create a custom error type for every possible failure.

A custom error is useful when callers need information beyond the message.

Good reasons:

- The caller needs a specific field.
- The caller needs an error code.
- The caller needs an HTTP status.
- The caller needs an ID.
- The caller needs to distinguish an error category.
- The error has structured metadata.
- The error wraps another error with additional context.

For a simple condition, this may be enough:

```go
var ErrNotFound = errors.New("not found")
```

## 18. Common Mistake: Checking Error Strings

Avoid:

```go
if err.Error() == "user not found" {
    // ...
}
```

Why?

Because changing the message:

```text
user not found
```

to:

```text
requested user does not exist
```

would break the logic.

Prefer:

```go
errors.Is(err, ErrNotFound)
```

or:

```go
var notFound UserNotFoundError

errors.As(err, &notFound)
```

## 19. Custom Errors in a Go Project

A backend project might organize errors like:

```text
internal/
├── handler/
├── service/
├── repository/
└── apperror/
    ├── validation.go
    ├── not_found.go
    └── database.go
```

For example:

```go
package apperror

type UserNotFoundError struct {
    UserID int
}

func (e UserNotFoundError) Error() string {
    return fmt.Sprintf("user %d not found", e.UserID)
}
```

This keeps application-specific error types organized.

The exact package structure depends on the project; the important idea is to keep error definitions easy to discover and consistent.

## Summary

Custom errors are normal Go types that implement:

```go
Error() string
```

Basic example:

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return e.Field + ": " + e.Message
}
```

Use:

```go
errors.As()
```

when you need to retrieve a custom error type.

Use:

```go
errors.Is()
```

when you need to identify a known error value.

Use:

```go
fmt.Errorf("context: %w", err)
```

to add context while preserving the original error.

Use:

```go
Unwrap()
```

when designing a custom error that itself wraps another error.

## Practice Project

Build a small user API error system with these custom errors:

- `ValidationError`
- `UserNotFoundError`
- `UnauthorizedError`
- `DatabaseError`

Each should contain useful structured information.

Then create:

```text
repository → service → handler
```

and make sure errors can travel through all three layers while preserving their original type.

The handler should use:

```go
errors.Is()
```

and:

```go
errors.As()
```

to decide how the error should be handled.
