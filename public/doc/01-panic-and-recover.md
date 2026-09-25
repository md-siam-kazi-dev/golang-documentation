# Panic and Recover in Go

## Introduction

Go prefers explicit error handling, but sometimes a program reaches a state where it cannot safely continue. For these situations, Go provides **`panic`** and **`recover`**.

Think of them like this:

- `panic` → "Something went seriously wrong. Stop normal execution."
- `recover` → "Catch a panic and regain control."

> **Teacher note:** `panic` is not a replacement for ordinary `error` values. Use errors for expected failures such as invalid input, missing records, or failed database operations.

---

## 1. What Is `panic`?

`panic` stops the normal execution of the current function.

```go
package main

import "fmt"

func main() {
    fmt.Println("Start")

    panic("Something went wrong")

    fmt.Println("End")
}
```

Output:

```text
Start
panic: Something went wrong
```

`"End"` is never printed because execution stops at `panic`.

## 2. What Happens During a Panic?

When a panic happens:

- The current function stops normal execution.
- Deferred functions still run.
- Go returns to the caller.
- The caller also stops normal execution.
- This continues up the call stack.
- If nobody recovers the panic, the program terminates.

Example:

```go
package main

import "fmt"

func third() {
    panic("boom")
}

func second() {
    third()
}

func first() {
    second()
}

func main() {
    first()
}
```

The panic travels:

```text
main()
  ↓
first()
  ↓
second()
  ↓
third()
  ↓
panic
```

## 3. panic With Different Values

A panic can receive any value:

```go
panic("database failed")
```

You can also panic with an integer:

```go
panic(404)
```

Or a custom value:

```go
panic(struct {
    Code    int
    Message string
}{500, "Internal error"})
```

In normal application code, a descriptive string or error value is usually easier to understand.

## 4. What Is recover?

`recover()` allows a deferred function to stop a panic from continuing.

Example:

```go
package main

import "fmt"

func safeFunction() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered:", r)
        }
    }()

    panic("something went wrong")
}

func main() {
    safeFunction()
    fmt.Println("Program continues")
}
```

Output:

```text
Recovered: something went wrong
Program continues
```

## 5. Why Is recover Usually Used With defer?

`recover()` only works when called from a deferred function during a panicking sequence.

Correct:

```go
defer func() {
    if r := recover(); r != nil {
        fmt.Println(r)
    }
}()
```

Simply writing this is not useful for catching a future panic:

```go
recover()
```

The standard pattern is:

```go
defer func() {
    if r := recover(); r != nil {
        // handle panic
    }
}()
```

## 6. Recovering From a Runtime Panic

Some Go operations can cause runtime panics.

For example, indexing outside a slice:

```go
package main

import "fmt"

func main() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered:", r)
        }
    }()

    numbers := []int{10, 20, 30}

    fmt.Println(numbers[10])
}
```

The invalid index causes a panic, and the deferred function recovers it.

## 7. panic vs error

This distinction is very important.

### Use error for expected problems

```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }

    return a / b, nil
}
```

The caller can handle the problem normally:

```go
result, err := divide(10, 0)

if err != nil {
    fmt.Println("Error:", err)
    return
}

fmt.Println(result)
```

### Use panic for exceptional situations

```go
func mustConfig() string {
    config := ""

    if config == "" {
        panic("configuration is missing")
    }

    return config
}
```

## 8. A Web Server Example

A server may use recovery middleware to prevent one panic from crashing the entire process.

Conceptually:

```go
func recoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if r := recover(); r != nil {
                http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            }
        }()

        next.ServeHTTP(w, r)
    })
}
```

This is useful at application boundaries.

## 9. Important Rules

Remember:

```text
error   → expected failure
panic   → exceptional/unrecoverable state
recover → catch a panic
defer   → execute cleanup/recovery logic
```

Avoid using panic for normal validation:

```go
// Usually bad
panic("email is invalid")
```

Prefer:

```go
return fmt.Errorf("invalid email")
```

## Summary

- `panic` interrupts normal execution.
- Deferred functions still execute during panic unwinding.
- `recover` can stop a panic.
- `recover` is normally called inside a deferred function.
- Use `error` for expected problems.
- Use `panic`/`recover` carefully, especially at application boundaries.

### Mental Model

```text
Normal execution
      ↓
    panic
      ↓
deferred functions
      ↓
   recover()
      ↓
continue OR terminate
```
