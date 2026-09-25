# Reflection in Go

## Introduction

Reflection allows a Go program to inspect information about values and types at runtime.

The main package is:

```go
import "reflect"
```

Reflection can answer questions such as:

- What is the runtime type of this value?
- What kind of value is this?
- How many fields does this struct have?
- What is the name of a struct field?
- What are the struct tags?

Reflection is powerful, but it should be used carefully.

## 1. What Is Reflection?

Normally, Go's type system is heavily checked at compile time.

Reflection lets a program inspect values while it is running.

Example:

```go
value := 100

fmt.Println(reflect.TypeOf(value))
```

Output:

```text
int
```

## 2. reflect.TypeOf

`reflect.TypeOf()` returns information about a value's type.

```go
fmt.Println(reflect.TypeOf(10))
fmt.Println(reflect.TypeOf("Go"))
fmt.Println(reflect.TypeOf(3.14))
fmt.Println(reflect.TypeOf(true))
```

Output:

```text
int
string
float64
bool
```

## 3. reflect.ValueOf

`reflect.ValueOf()` gives a reflection value.

```go
value := reflect.ValueOf(100)

fmt.Println(value)
fmt.Println(value.Type())
fmt.Println(value.Kind())
```

You can think of:

```text
TypeOf  → "What type is this?"

ValueOf → "Give me a reflection value representing this value."
```

## 4. Type vs Kind

This distinction is important.

### Type

The exact Go type:

```go
type UserID int
```

Then:

```go
id := UserID(10)

fmt.Println(reflect.TypeOf(id))
```

Output:

```text
main.UserID
```

### Kind

The general category:

```go
fmt.Println(reflect.ValueOf(id).Kind())
```

Output:

```text
int
```

So:

```text
Type → UserID
Kind → int
```

## 5. Common Kinds

Some common `reflect.Kind` values:

```go
reflect.Int
reflect.String
reflect.Bool
reflect.Float64
reflect.Slice
reflect.Array
reflect.Map
reflect.Struct
reflect.Pointer
reflect.Interface
reflect.Func
```

Example:

```go
value := reflect.ValueOf([]int{1, 2, 3})

fmt.Println(value.Kind())
```

Output:

```text
slice
```

## 6. Reflection With Structs

Consider:

```go
type User struct {
    Name string
    Age  int
}
```

You can inspect it:

```go
user := User{
    Name: "Siam",
    Age:  21,
}

value := reflect.ValueOf(user)
typeInfo := value.Type()

fmt.Println(typeInfo.Name())
fmt.Println(typeInfo.NumField())
```

Output:

```text
User
2
```

## 7. Inspecting Struct Fields

```go
for i := 0; i < value.NumField(); i++ {
    field := value.Field(i)

    fmt.Println(
        typeInfo.Field(i).Name,
        field.Type(),
        field.Interface(),
    )
}
```

This can print information about each field.

## 8. Struct Tags

Reflection is commonly used to inspect struct tags.

```go
type User struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}
```

Read a tag:

```go
field, _ := reflect.TypeOf(User{}).FieldByName("Name")

fmt.Println(field.Tag.Get("json"))
```

Output:

```text
name
```

This idea is heavily used by libraries.

Examples include serialization and validation libraries.

## 9. Reflection and Pointers

Suppose:

```go
user := &User{
    Name: "Siam",
    Age:  21,
}
```

The value is a pointer.

You can inspect it:

```go
value := reflect.ValueOf(user)

fmt.Println(value.Kind())
```

Output:

```text
ptr
```

To inspect the underlying value:

```go
value = value.Elem()

fmt.Println(value.Kind())
```

Now the kind is:

```text
struct
```

## 10. Changing Values With Reflection

Reflection can modify a value when the reflected value is addressable and settable.

```go
x := 10

value := reflect.ValueOf(&x).Elem()

value.SetInt(20)

fmt.Println(x)
```

Output:

```text
20
```

Why does this work?

```go
&x
```

gives reflection access to the variable.

Then:

```go
Elem()
```

gets the actual value.

## 11. Checking CanSet

Before modifying a reflection value, you can check:

```go
if value.CanSet() {
    value.SetInt(20)
}
```

This is safer than assuming a value is settable.

## 12. Calling Functions With Reflection

Reflection can call a function dynamically.

```go
func Add(a, b int) int {
    return a + b
}
```

Then:

```go
fn := reflect.ValueOf(Add)

args := []reflect.Value{
    reflect.ValueOf(10),
    reflect.ValueOf(20),
}

result := fn.Call(args)

fmt.Println(result[0].Int())
```

Output:

```text
30
```

This is powerful but less readable and usually slower than a direct function call.

## 13. Reflection Example: Generic Struct Printer

```go
func PrintFields(value any) {
    v := reflect.ValueOf(value)

    if v.Kind() == reflect.Pointer {
        v = v.Elem()
    }

    if v.Kind() != reflect.Struct {
        return
    }

    t := v.Type()

    for i := 0; i < v.NumField(); i++ {
        fmt.Println(
            t.Field(i).Name,
            v.Field(i).Interface(),
        )
    }
}
```

Usage:

```go
user := User{
    Name: "Siam",
    Age:  21,
}

PrintFields(user)
```

## 14. When Reflection Is Useful

Reflection can be appropriate for:

- serialization frameworks
- dependency injection
- ORM libraries
- validation libraries
- generic tooling
- inspecting struct tags
- debugging tools

## 15. Why Avoid Reflection When Possible?

Reflection can make code:

- harder to read
- harder to refactor
- easier to break at runtime
- more complex
- slower than direct operations

Prefer normal Go code when the types are known.

## 16. Reflection Mental Model

Think:

```text
Normal Go
    ↓
Compiler knows the type

Reflection
    ↓
Program asks about the type at runtime
```

Key functions:

```go
reflect.TypeOf(value)
reflect.ValueOf(value)
```

## 17. Summary

Reflection lets Go programs inspect and sometimes modify values at runtime.

Remember:

```text
TypeOf → runtime type
ValueOf → reflection value
Kind   → broad category
Elem   → underlying value
CanSet → whether value can be modified
```

Use reflection when it solves a real problem, not simply because it is interesting.
