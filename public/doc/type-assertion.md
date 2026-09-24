# Go Type Assertion

A **type assertion** allows you to retrieve or check the concrete value stored inside an interface.

It is especially useful with:

- `any`
- `interface{}`
- Interface values
- Dynamic JSON
- Values that can have multiple concrete types

## 1. Why Do We Need Type Assertions?

Consider:

```go
var value any = 100
```

The static type is:

```text
any
```

But the concrete value stored inside it is:

```text
int
```

Conceptually:

```text
value
┌──────────────────────┐
│ Interface            │
│ Type  → int          │
│ Value → 100          │
└──────────────────────┘
```

To use it as an `int`:

```go
number := value.(int)

fmt.Println(number + 10)
```

Output:

```text
110
```

## 2. Basic Syntax

```go
value.(Type)
```

Example:

```go
var value any = "Hello"

text := value.(string)

fmt.Println(text)
```

Output:

```text
Hello
```

The assertion says:

> "I believe the concrete value inside this interface is a string."

## 3. Type Assertions Work on Interface Values

Valid:

```go
var value any = 100

number := value.(int)
```

Invalid:

```go
number := 100

value := number.(int)
```

The second example fails because `number` is already an `int`, not an interface.

## 4. The Dangerous Form

This can panic:

```go
var value any = 100

text := value.(string)
```

The actual type is `int`, but we requested `string`.

```text
Actual type:    int
Requested type: string
                   ↓
                PANIC
```

## 5. Safe Type Assertion: Comma-OK

Go provides a safe form:

```go
value, ok := interfaceValue.(Type)
```

Example:

```go
var value any = 100

number, ok := value.(int)

if ok {
    fmt.Println("Number:", number)
} else {
    fmt.Println("Not an int")
}
```

Output:

```text
Number: 100
```

If the assertion fails:

```go
text, ok := value.(string)
```

then:

```text
text → zero value of string → ""
ok   → false
```

No panic occurs.

## 6. Understanding `ok`

```go
var value any = "Go"

text, ok := value.(string)
```

Because the value is a string:

```text
text = "Go"
ok   = true
```

But:

```go
number, ok := value.(int)
```

results in:

```text
number = 0
ok     = false
```

## 7. Practical Example

```go
func printString(value any) {
    text, ok := value.(string)

    if !ok {
        fmt.Println("Value is not a string")
        return
    }

    fmt.Println("String:", text)
}
```

Usage:

```go
printString("Hello")
printString(100)
```

Output:

```text
String: Hello
Value is not a string
```

## 8. Type Assertion With Structs

```go
type User struct {
    Name string
    Age  int
}

var value any = User{
    Name: "Siam",
    Age:  21,
}

user, ok := value.(User)

if ok {
    fmt.Println(user.Name)
    fmt.Println(user.Age)
}
```

## 9. Type Assertion With Pointers

```go
type User struct {
    Name string
}

user := &User{Name: "Siam"}

var value any = user

u, ok := value.(*User)

if ok {
    fmt.Println(u.Name)
}
```

Notice the `*` because the concrete value is a pointer.

## 10. Type Assertion With Interfaces

```go
type Speaker interface {
    Speak()
}

type Dog struct{}

func (Dog) Speak() {
    fmt.Println("Woof")
}

var speaker Speaker = Dog{}

dog, ok := speaker.(Dog)

if ok {
    fmt.Println("It is a Dog")
    dog.Speak()
}
```

The interface stores a concrete `Dog` value.

## 11. Interface to Another Interface

A type assertion can check whether the concrete value also satisfies another interface.

```go
type Speaker interface {
    Speak()
}

type Walker interface {
    Walk()
}

type Dog struct{}

func (Dog) Speak() {
    fmt.Println("Woof")
}

func (Dog) Walk() {
    fmt.Println("Walking")
}

var speaker Speaker = Dog{}

walker, ok := speaker.(Walker)

if ok {
    walker.Walk()
}
```

This works because the concrete `Dog` satisfies both interfaces.

## 12. Type Assertion vs Type Conversion

These are different concepts.

### Type Conversion

```go
var number int = 100

var decimal float64 = float64(number)
```

This converts one concrete type into another.

### Type Assertion

```go
var value any = 100

number := value.(int)
```

This extracts a concrete type from an interface.

Remember:

```text
Type conversion:
int → float64

Type assertion:
any/interface → int
```

## 13. Checking Multiple Types

A type assertion can check one type:

```go
if text, ok := data.(string); ok {
    fmt.Println(text)
}
```

If many types are possible, a **type switch** is usually cleaner:

```go
switch value := data.(type) {
case string:
    fmt.Println("String:", value)
case int:
    fmt.Println("Integer:", value)
case bool:
    fmt.Println("Boolean:", value)
default:
    fmt.Println("Unknown")
}
```

## 14. Type Assertion With Maps

Suppose:

```go
data := map[string]any{
    "name": "Siam",
    "age":  21,
}
```

The expression:

```go
data["name"]
```

has type `any`.

Therefore:

```go
name, ok := data["name"].(string)

if ok {
    fmt.Println(name)
}
```

## 15. JSON Example

```go
package main

import (
    "encoding/json"
    "fmt"
)

func main() {
    data := []byte(`{
        "name": "Siam",
        "active": true
    }`)

    var result map[string]any

    err := json.Unmarshal(data, &result)
    if err != nil {
        panic(err)
    }

    name, ok := result["name"].(string)

    if ok {
        fmt.Println("Name:", name)
    }

    active, ok := result["active"].(bool)

    if ok {
        fmt.Println("Active:", active)
    }
}
```

Output:

```text
Name: Siam
Active: true
```

## 16. JSON Number Gotcha

When JSON is decoded into `any`, numbers are normally represented as `float64`.

For:

```json
{
    "age": 21
}
```

this may fail:

```go
age, ok := data["age"].(int)
```

Instead:

```go
age, ok := data["age"].(float64)
```

This is a common beginner mistake.

If you need precise JSON number handling, the `encoding/json` package also provides `json.Decoder.UseNumber()`.

## 17. Type Assertion in an HTTP API

Imagine an API receives dynamic data:

```go
func processData(data any) {
    user, ok := data.(User)

    if !ok {
        fmt.Println("Expected User")
        return
    }

    fmt.Println("Processing:", user.Name)
}
```

The function checks the concrete type before using it.

## 18. Type Assertion With `nil`

Be careful with interfaces and `nil`.

```go
var value any = nil

fmt.Println(value == nil)
```

Output:

```text
true
```

A failed safe assertion returns the zero value plus `false`.

## 19. Common Mistake: Ignoring `ok`

Avoid this when the type is uncertain:

```go
name := data["name"].(string)
```

If `name` is not a string, the program can panic.

Prefer:

```go
name, ok := data["name"].(string)

if !ok {
    return
}
```

## 20. When Should You Use Type Assertions?

Type assertions are useful when:

- You have an interface value.
- You need the concrete value.
- You need to check a possible concrete type.
- You are processing dynamic data.
- You are working with `any`.
- You need behavior specific to a concrete type.

Do not use them unnecessarily. If the type is already known, use the concrete type directly.

## 21. Mental Model

Imagine an interface as a box:

```text
any
┌─────────────────────────┐
│ Concrete Type: User     │
│ Concrete Value: {...}   │
└─────────────────────────┘
```

A type assertion asks:

> "Is the thing inside this box a User?"

```go
user, ok := value.(User)
```

If yes:

```text
user → actual User
ok   → true
```

If no:

```text
user → zero value
ok   → false
```

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

Then rewrite the solution using a type switch.

## Summary

A type assertion extracts or checks the concrete type stored inside an interface.

Basic:

```go
value.(Type)
```

Safe:

```go
value, ok := interfaceValue.(Type)
```

Remember:

> **Type assertion is about getting a concrete type out of an interface value.**

Mental model:

```text
Interface
    ↓
Type assertion
    ↓
Concrete type
```
