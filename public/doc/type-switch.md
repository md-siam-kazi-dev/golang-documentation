# Type Switch in Go

A **type switch** is a special `switch` statement used to determine the **actual type** stored inside an interface value.

It is especially useful when a function receives an `interface{}` or `any` value and the program needs to behave differently depending on its type.

---

## 1. Why Do We Need a Type Switch?

Consider this function:

```go
func printValue(value any) {
    fmt.Println(value)
}
```

We can pass many different types:

```go
printValue(10)
printValue("Hello")
printValue(true)
printValue(3.14)
```

Inside `printValue`, however, we may want different behavior for each type.

For example:

```text
int     → print it as a number
string  → print it as text
bool    → print it as a boolean
```

A type switch solves this problem.

## 2. Basic Syntax

```go
switch value := value.(type) {
case int:
    // value is int
case string:
    // value is string
case bool:
    // value is bool
default:
    // unknown type
}
```

The important part is:

```go
value.(type)
```

This syntax is only valid inside a type switch.

## 3. Simple Example

```go
package main

import "fmt"

func printType(value any) {
    switch v := value.(type) {
    case int:
        fmt.Println("Integer:", v)

    case string:
        fmt.Println("String:", v)

    case bool:
        fmt.Println("Boolean:", v)

    case float64:
        fmt.Println("Float:", v)

    default:
        fmt.Println("Unknown type")
    }
}

func main() {
    printType(100)
    printType("Go")
    printType(true)
    printType(3.14)
}
```

Output:

```text
Integer: 100
String: Go
Boolean: true
Float: 3.14
```

Notice that `v` automatically has the correct type inside each case.

## 4. How It Works

Suppose we call:

```go
printType(100)
```

The interface contains:

```text
Type  → int
Value → 100
```

The type switch checks:

```go
case int:
```

It matches, so Go executes:

```go
fmt.Println("Integer:", v)
```

Here:

```go
v
```

is an `int`.

## 5. Type Switch vs Normal Switch

A normal switch usually checks values:

```go
switch day {
case "Monday":
    fmt.Println("Start of week")
case "Friday":
    fmt.Println("Weekend is near")
}
```

A type switch checks types:

```go
switch v := value.(type) {
case int:
    fmt.Println("Integer")
case string:
    fmt.Println("String")
}
```

So remember:

```text
Normal switch → checks values
Type switch   → checks types
```

## 6. Using any

In modern Go:

```go
any
```

is an alias for:

```go
interface{}
```

Therefore these are equivalent:

```go
func process(value any) {}
```

and:

```go
func process(value interface{}) {}
```

`any` is usually easier to read.

## 7. Multiple Types in One Case

You can handle several types in the same case:

```go
func check(value any) {
    switch value.(type) {
    case int, int32, int64:
        fmt.Println("Integer type")

    case float32, float64:
        fmt.Println("Floating-point type")

    case string:
        fmt.Println("String type")

    default:
        fmt.Println("Other type")
    }
}
```

When multiple types are listed in one case, the variable declared with `:=` has the interface type rather than one specific case type. If you need the concrete type, use separate cases.

## 8. Type Switch with Structs

A type switch can also distinguish between different struct types.

```go
package main

import "fmt"

type User struct {
    Name string
}

type Product struct {
    Name  string
    Price float64
}

func printData(data any) {
    switch v := data.(type) {
    case User:
        fmt.Println("User:", v.Name)

    case Product:
        fmt.Println("Product:", v.Name)
        fmt.Println("Price:", v.Price)

    default:
        fmt.Println("Unknown data")
    }
}

func main() {
    printData(User{Name: "Siam"})

    printData(Product{
        Name:  "Laptop",
        Price: 800,
    })
}
```

## 9. Type Switch with Pointers

Pointer types are different from their underlying value types.

For example:

```go
type User struct {
    Name string
}
```

These are different types:

```text
User
*User
```

Therefore:

```go
switch v := value.(type) {
case User:
    fmt.Println("User value")

case *User:
    fmt.Println("Pointer to User")
}
```

## 10. Type Switch with Interfaces

Type switches become particularly useful when working with interfaces.

```go
type Animal interface {
    Speak()
}

type Dog struct{}

func (Dog) Speak() {
    fmt.Println("Woof")
}

type Cat struct{}

func (Cat) Speak() {
    fmt.Println("Meow")
}

func describe(animal Animal) {
    switch v := animal.(type) {
    case Dog:
        fmt.Println("This is a dog:", v)

    case Cat:
        fmt.Println("This is a cat:", v)

    default:
        fmt.Println("Unknown animal")
    }
}
```

## 11. Type Switch with nil

You can also check for `nil`:

```go
func check(value any) {
    switch v := value.(type) {
    case nil:
        fmt.Println("Value is nil")

    case int:
        fmt.Println("Integer:", v)

    case string:
        fmt.Println("String:", v)
    }
}
```

Example:

```go
check(nil)
```

Output:

```text
Value is nil
```

## 12. Type Switch vs Type Assertion

A type assertion checks one expected type:

```go
value, ok := data.(string)

if ok {
    fmt.Println(value)
}
```

A type switch checks multiple possible types:

```go
switch value := data.(type) {
case string:
    fmt.Println(value)

case int:
    fmt.Println(value)

case bool:
    fmt.Println(value)
}
```

Use a type assertion when you expect one particular type.

Use a type switch when several types are possible.

## 13. Real-World Example

Imagine an API response processor that can receive different kinds of data:

```go
func processResponse(data any) {
    switch v := data.(type) {
    case string:
        fmt.Println("Message:", v)

    case int:
        fmt.Println("Status code:", v)

    case []string:
        fmt.Println("List:", v)

    case map[string]any:
        fmt.Println("JSON-like object:", v)

    default:
        fmt.Println("Unsupported response type")
    }
}
```

This pattern can be useful when processing dynamic data.

## 14. Common Mistake

This is incorrect outside a type switch:

```go
value.(type)
```

You cannot normally write:

```go
fmt.Println(value.(type))
```

Instead, use a type switch:

```go
switch value.(type) {
case int:
    fmt.Println("int")
}
```

Or use a type assertion when you know the expected type:

```go
number, ok := value.(int)
```

## Summary

A type switch allows Go programs to determine the concrete type stored in an interface.

Basic pattern:

```go
switch v := value.(type) {
case int:
    // int
case string:
    // string
case bool:
    // bool
default:
    // unknown type
}
```

Remember:

- `any` can contain values of different types.
- A type switch checks the concrete type.
- `case int` means the value is an `int`.
- `case string` means the value is a `string`.
- `default` handles unsupported types.
- Type switches are commonly used with interfaces and dynamic values.

## Practice

Create a function:

```go
func describe(value any)
```

It should print different messages for:

- `int`
- `string`
- `float64`
- `bool`
- `[]string`
- `map[string]int`
- unknown types

Try writing it yourself before looking at a solution.
