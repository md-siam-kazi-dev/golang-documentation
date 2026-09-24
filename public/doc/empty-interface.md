# Go Empty Interface

The **empty interface** is an interface with zero required methods.

In modern Go, it is usually written as:

```go
any
```

The older form is:

```go
interface{}
```

These mean the same thing.

## 1. What Is an Empty Interface?

A normal interface might require a method:

```go
type Speaker interface {
    Speak()
}
```

An empty interface has no methods:

```go
interface{}
```

Therefore, **every Go value can be stored in it**.

Modern Go code usually uses:

```go
any
```

## 2. Basic Example

```go
package main

import "fmt"

func main() {
    var value any

    value = 100
    fmt.Println(value)

    value = "Hello Go"
    fmt.Println(value)

    value = true
    fmt.Println(value)

    value = []int{1, 2, 3}
    fmt.Println(value)
}
```

Output:

```text
100
Hello Go
true
[1 2 3]
```

## 3. `any` Is an Alias

These are equivalent:

```go
var x any
```

and:

```go
var x interface{}
```

For modern Go code, prefer `any`.

## 4. Why Can Every Type Satisfy `any`?

An interface defines requirements.

```go
type Speaker interface {
    Speak()
}
```

A type needs `Speak()`.

But:

```go
interface{}
```

requires nothing.

Therefore:

```text
int       → any ✓
string    → any ✓
bool      → any ✓
struct    → any ✓
slice     → any ✓
map       → any ✓
function  → any ✓
pointer   → any ✓
```

## 5. Function Parameters

You can accept any value:

```go
func printValue(value any) {
    fmt.Println(value)
}
```

Usage:

```go
printValue(100)
printValue("Hello")
printValue(true)
printValue([]int{1, 2, 3})
```

## 6. Logging Example

```go
func logValue(value any) {
    fmt.Println("LOG:", value)
}

func main() {
    logValue("User logged in")
    logValue(404)
    logValue(true)
    logValue(map[string]string{
        "user": "Siam",
    })
}
```

## 7. The Important Trade-off

With:

```go
func printValue(value any)
```

the compiler does not know the concrete type inside the function.

This will not work:

```go
func printValue(value any) {
    fmt.Println(value + 10)
}
```

because `value` might be a string, bool, slice, struct, etc.

To work with the concrete type, we can use a **type assertion** or **type switch**.

## 8. Empty Interface and Type Assertion

```go
var value any = 100

number := value.(int)

fmt.Println(number + 10)
```

Output:

```text
110
```

The syntax:

```go
value.(int)
```

means that we expect the concrete value to be an `int`.

## 9. Safe Type Assertion

This can panic:

```go
value := any(100)

text := value.(string)
```

Use the comma-ok form when the type may be different:

```go
value := any(100)

text, ok := value.(string)

if ok {
    fmt.Println("String:", text)
} else {
    fmt.Println("Value is not a string")
}
```

Output:

```text
Value is not a string
```

## 10. Empty Interface With Multiple Values

A slice can contain different types:

```go
values := []any{
    10,
    "Go",
    true,
    3.14,
}
```

Loop:

```go
for _, value := range values {
    fmt.Println(value)
}
```

## 11. Dynamic Configuration Example

```go
type Config struct {
    Key   string
    Value any
}
```

Now values can have different types:

```go
configs := []Config{
    {
        Key:   "port",
        Value: 8080,
    },
    {
        Key:   "debug",
        Value: true,
    },
    {
        Key:   "app_name",
        Value: "Go API",
    },
}
```

## 12. JSON and `any`

`any` is common when decoding JSON with an unknown or dynamic structure.

```go
package main

import (
    "encoding/json"
    "fmt"
)

func main() {
    data := []byte(`{
        "name": "Siam",
        "age": 21,
        "active": true
    }`)

    var result map[string]any

    err := json.Unmarshal(data, &result)
    if err != nil {
        panic(err)
    }

    fmt.Println(result)
}
```

When JSON is decoded into `any`, common mappings are:

- JSON object → `map[string]any`
- JSON array → `[]any`
- JSON string → `string`
- JSON boolean → `bool`
- JSON number → `float64` by default

## 13. Reading Dynamic JSON

```go
var data map[string]any

json.Unmarshal(jsonData, &data)

name, ok := data["name"].(string)

if ok {
    fmt.Println("Name:", name)
}
```

`data["name"]` is `any`, so we use a type assertion.

## 14. Empty Interface in Older Go Code

You may see:

```go
func printData(data interface{}) {
    fmt.Println(data)
}
```

Modern Go usually writes:

```go
func printData(data any) {
    fmt.Println(data)
}
```

They mean the same thing.

## 15. `any` Does Not Mean "No Type"

Consider:

```go
var value any = 100
```

The concrete value is still an `int`.

Conceptually:

```text
any
┌─────────────────────┐
│ Dynamic Type: int   │
│ Dynamic Value: 100  │
└─────────────────────┘
```

`any` does not remove the concrete type.

## 16. Empty Interface vs Normal Interface

Compare:

```go
type Speaker interface {
    Speak()
}
```

with:

```go
type Anything interface{}
```

`Speaker` requires `Speak()`.

`Anything` requires nothing.

Therefore:

```text
Dog{}       → Speaker ✓ if Dog has Speak()
Dog{}       → any ✓

int         → Speaker ✗
int         → any ✓

string      → Speaker ✗
string      → any ✓
```

## 17. Should You Use `any` Everywhere?

No.

Avoid:

```go
func calculate(a any, b any) any
```

when the values should be integers.

Prefer:

```go
func calculate(a int, b int) int
```

Typed code gives you compile-time safety, clearer APIs, and better tooling.

Use `any` when the data genuinely needs to be dynamic.

## 18. `any` vs Generics

Sometimes generics are a better solution.

Using `any`:

```go
func printValues(values []any) {
    for _, value := range values {
        fmt.Println(value)
    }
}
```

Using generics:

```go
func printValues[T any](values []T) {
    for _, value := range values {
        fmt.Println(value)
    }
}
```

Generics preserve the element type.

## 19. Backend Example

Suppose an API response can contain different data:

```go
type Response struct {
    Success bool `json:"success"`
    Data    any  `json:"data"`
}
```

Example:

```go
response := Response{
    Success: true,
    Data: map[string]any{
        "id":   10,
        "name": "Siam",
    },
}
```

Or:

```go
response := Response{
    Success: true,
    Data: []string{
        "Go",
        "PostgreSQL",
        "Docker",
    },
}
```

Use this only when the response really is dynamic. Known API schemas are usually better represented with concrete structs.

## 20. Common Mistake

Avoid blindly asserting:

```go
func double(value any) int {
    return value.(int) * 2
}
```

This panics if the caller passes:

```go
double("hello")
```

Safer:

```go
func double(value any) (int, bool) {
    number, ok := value.(int)

    if !ok {
        return 0, false
    }

    return number * 2, true
}
```

## 21. When Should You Use `any`?

Good use cases:

- Truly dynamic JSON
- Generic logging
- Dynamic configuration
- External data with unknown structure
- APIs that genuinely need dynamic data

Avoid it when:

- The type is already known
- Generics solve the problem
- A normal interface can express the required behavior
- You are using it just to avoid choosing a type

## 22. Practice Exercise

Create:

```go
values := []any{
    10,
    "Go",
    true,
    3.14,
}
```

Loop over the values and use type assertions to print:

```text
Integer: 10
String: Go
Boolean: true
Float: 3.14
```

Then compare your solution with a type switch.

## Summary

The empty interface has no methods:

```go
interface{}
```

Modern Go provides:

```go
any
```

Every Go value can be stored in `any`:

```go
var x any

x = 10
x = "hello"
x = true
```

When retrieving the value, you may need a **type assertion** or **type switch**.

> **`any` gives you flexibility, but you give up some compile-time type information.**
