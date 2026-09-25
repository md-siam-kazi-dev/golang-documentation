# The unsafe Package in Go

## Introduction

Go normally provides a type-safe way to work with memory.

The `unsafe` package allows controlled access to low-level memory operations that bypass some of Go's normal type-safety guarantees.

Import it with:

```go
import "unsafe"
```

> **Teacher warning:** `unsafe` is advanced Go. You should understand pointers, memory layout, structs, slices, and interfaces before using it seriously.

## 1. Why Does unsafe Exist?

Go is designed to be safe and garbage-collected.

But some low-level tasks require more control.

The `unsafe` package is useful for situations such as:

- low-level systems programming
- interoperability with C
- memory-layout inspection
- specialized performance-sensitive code
- working with runtime-oriented structures

Most application code does not need it.

## 2. unsafe.Sizeof

One of the easiest operations is:

```go
unsafe.Sizeof(value)
```

Example:

```go
package main

import (
    "fmt"
    "unsafe"
)

func main() {
    var x int

    fmt.Println(unsafe.Sizeof(x))
}
```

The result is measured in bytes.

The exact size of some Go types can depend on the target architecture.

## 3. Size of Different Types

```go
var a int8
var b int32
var c int64

fmt.Println(unsafe.Sizeof(a))
fmt.Println(unsafe.Sizeof(b))
fmt.Println(unsafe.Sizeof(c))
```

The sizes reflect the memory representation of those types on the target architecture.

## 4. unsafe.Alignof

`unsafe.Alignof` reports the alignment requirement of a value.

```go
var x int64

fmt.Println(unsafe.Alignof(x))
```

Alignment is important because CPUs and memory systems may have requirements about where certain values are stored.

## 5. unsafe.Offsetof

For struct fields, `unsafe.Offsetof` reports the byte offset of a field from the beginning of the struct.

Example:

```go
type User struct {
    ID   int64
    Age  int32
    Name string
}
```

Then:

```go
fmt.Println(unsafe.Offsetof(User{}.Age))
```

This is a low-level memory-layout operation.

## 6. Why Struct Layout Matters

Suppose:

```go
type Data struct {
    A int64
    B int32
    C int64
}
```

You might assume fields simply occupy memory one after another.

But Go may insert padding for alignment.

Conceptually:

```text
A
padding
B
padding
C
```

The actual layout should be inspected rather than guessed.

This is one reason `unsafe.Sizeof`, `Alignof`, and `Offsetof` exist.

## 7. unsafe.Pointer

The central type in the package is:

```go
unsafe.Pointer
```

It is a pointer that can represent the address of a value without preserving the value's ordinary Go pointer type.

Example:

```go
x := 100

p := unsafe.Pointer(&x)

fmt.Println(p)
```

You have converted:

```text
*int
 ↓
unsafe.Pointer
```

## 8. Converting Back

You can convert an `unsafe.Pointer` back to a pointer type:

```go
x := 100

p := unsafe.Pointer(&x)

intPtr := (*int)(p)

fmt.Println(*intPtr)
```

Output:

```text
100
```

This is powerful because you are manually telling the compiler how to interpret the memory.

## 9. Why This Is Dangerous

Consider:

```go
x := 100

p := unsafe.Pointer(&x)

floatPtr := (*float64)(p)
```

You are telling Go:

> "Treat the memory belonging to this int as a float64."

That does not make the underlying memory a real `float64`.

Using incorrect conversions can lead to invalid results, crashes, or undefined behavior.

## 10. unsafe and Normal Pointers

Normal pointer:

```go
var p *int
```

The compiler knows:

```text
p points to an int
```

Unsafe pointer:

```go
var p unsafe.Pointer
```

The compiler gives you much less type information.

Mental model:

```text
*int
 ↓
typed pointer

unsafe.Pointer
 ↓
raw-ish pointer representation
```

## 11. Example: Inspecting Struct Memory

```go
type User struct {
    ID   int64
    Age  int32
}

func main() {
    user := User{
        ID:  100,
        Age: 21,
    }

    fmt.Println("Size:", unsafe.Sizeof(user))
    fmt.Println("ID offset:", unsafe.Offsetof(user.ID))
    fmt.Println("Age offset:", unsafe.Offsetof(user.Age))
}
```

This can help you understand how Go lays out the struct.

## 12. unsafe.Add

Modern Go provides:

```go
unsafe.Add
```

It can calculate a pointer offset.

Conceptually:

```go
newPointer := unsafe.Add(pointer, offset)
```

This is a low-level operation and should only be used when you understand the memory layout and lifetime of the referenced data.

## 13. unsafe.Slice

Go also provides:

```go
unsafe.Slice
```

It can construct a slice from a pointer and length.

Conceptually:

```go
slice := unsafe.Slice(ptr, length)
```

This is useful for certain low-level interoperability tasks.

## 14. unsafe.StringData and unsafe.String

Modern Go also provides low-level helpers related to strings.

For example:

```go
data := unsafe.StringData("hello")
```

This exposes a pointer to the string's underlying data.

There is also:

```go
unsafe.String(ptr, length)
```

These operations require careful attention to memory lifetime and validity.

## 15. unsafe and Garbage Collection

This is extremely important.

Go has a garbage collector.

When using unsafe pointers, you must still obey Go's pointer and memory rules.

Do not assume that converting a pointer to an integer or manipulating raw addresses gives you manual memory management like C.

`unsafe` does not turn Go into C.

## 16. When Should You Use unsafe?

Use it only when you have a strong reason.

Possible cases:

```text
Low-level libraries
        ↓
C interoperability
        ↓
Memory layout work
        ↓
Specialized performance work
```

For ordinary:

- REST APIs
- Database applications
- Authentication
- Business logic
- Web servers
- CLI applications

you normally do not need `unsafe`.

## 17. unsafe vs reflect

These packages solve different problems.

### Reflection

```go
reflect.TypeOf(value)
```

asks:

> "What type/value information does this object have at runtime?"

### Unsafe

```go
unsafe.Pointer(...)
```

asks more like:

> "How can I work with this memory representation at a low level?"

A simple distinction:

```text
reflect → runtime type/value inspection

unsafe  → low-level memory manipulation
```

## 18. Teacher Rule

Before using `unsafe`, ask:

- Can normal Go solve this?
- Can generics solve this?
- Can reflection solve this?
- Can a normal pointer solve this?
- Do I actually need low-level memory access?

If the answer to one of the first four is yes, prefer the safer solution.

## 19. Summary

The `unsafe` package provides low-level memory operations.

Important APIs include:

```go
unsafe.Pointer
unsafe.Sizeof
unsafe.Alignof
unsafe.Offsetof
unsafe.Add
unsafe.Slice
unsafe.StringData
unsafe.String
```

Remember:

```text
unsafe = powerful + low-level + easy to misuse
```

Use it deliberately and only when normal Go is not appropriate.

### Final Mental Model

```text
Normal Go
    ↓
Safe abstractions

unsafe
    ↓
Lower-level control
    ↓
You become responsible for respecting
Go's memory and pointer rules
```
