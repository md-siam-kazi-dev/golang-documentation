# Generic Types in Go

## Introduction

A generic type is a type that accepts one or more type parameters.

This is useful when you want to create reusable data structures such as:

- Stack
- Queue
- Linked List
- Tree
- Result containers
- Cache structures

## 1. Basic Generic Type

```go
type Box[T any] struct {
    Value T
}
```

Here:

```text
Box → type name
T   → type parameter
any → constraint
```

## 2. Creating Different Boxes

```go
intBox := Box[int]{
    Value: 100,
}

stringBox := Box[string]{
    Value: "Hello",
}
```

Both use the same generic definition:

```go
type Box[T any] struct {
    Value T
}
```

But each instance has a different concrete type.

## 3. Generic Type With a Method

```go
type Box[T any] struct {
    Value T
}

func (b Box[T]) Get() T {
    return b.Value
}
```

Usage:

```go
box := Box[int]{Value: 500}

fmt.Println(box.Get())
```

## 4. Generic Stack

A stack follows:

```text
Last In → First Out
```

Let's build one.

```go
type Stack[T any] struct {
    items []T
}
```

### Push

```go
func (s *Stack[T]) Push(value T) {
    s.items = append(s.items, value)
}
```

### Pop

```go
func (s *Stack[T]) Pop() T {
    last := len(s.items) - 1
    value := s.items[last]

    s.items = s.items[:last]

    return value
}
```

Usage:

```go
stack := Stack[int]{}

stack.Push(10)
stack.Push(20)
stack.Push(30)

fmt.Println(stack.Pop())
```

Output:

```text
30
```

## 5. String Stack

The same generic stack works with strings:

```go
stack := Stack[string]{}

stack.Push("Go")
stack.Push("Rust")
stack.Push("Python")

fmt.Println(stack.Pop())
```

Output:

```text
Python
```

No second stack implementation is necessary.

## 6. Why Generic Types Are Useful

Without generics, you might create:

```go
type IntStack struct {
    items []int
}
```

and:

```go
type StringStack struct {
    items []string
}
```

This duplicates structure and methods.

With generics:

```go
type Stack[T any] struct {
    items []T
}
```

one definition supports many types.

## 7. Generic Type With Two Parameters

A type can have multiple parameters.

```go
type Pair[A any, B any] struct {
    First  A
    Second B
}
```

Usage:

```go
pair := Pair[string, int]{
    First:  "Age",
    Second: 21,
}
```

Another:

```go
pair := Pair[int, bool]{
    First: 100,
    Second: true,
}
```

## 8. Generic Linked List

A simple linked-list node:

```go
type Node[T any] struct {
    Value T
    Next  *Node[T]
}
```

Create nodes:

```go
first := &Node[int]{Value: 10}
second := &Node[int]{Value: 20}

first.Next = second
```

Now:

```text
10 → 20 → nil
```

For strings:

```go
first := &Node[string]{Value: "Go"}
second := &Node[string]{Value: "Rust"}

first.Next = second
```

Same structure, different type.

## 9. Generic Type With Constraints

A generic type can use a constraint.

```go
type Number interface {
    int | int64 | float64
}
```

Then:

```go
type NumberBox[T Number] struct {
    Value T
}
```

Valid:

```go
a := NumberBox[int]{Value: 10}
b := NumberBox[float64]{Value: 3.14}
```

A type outside the constraint is rejected.

## 10. Generic Type and Methods

Consider:

```go
type Pair[A any, B any] struct {
    First  A
    Second B
}
```

A method can use those parameters:

```go
func (p Pair[A, B]) GetFirst() A {
    return p.First
}
```

And:

```go
func (p Pair[A, B]) GetSecond() B {
    return p.Second
}
```

## 11. Generic Type vs Interface

Interfaces describe behavior:

```go
type Reader interface {
    Read() error
}
```

Generic types describe reusable type structures:

```go
type Box[T any] struct {
    Value T
}
```

A generic type answers:

> "What type of value does this structure contain?"

An interface answers:

> "What behavior does this value provide?"

## 12. Real-World Use

Generic types can be useful for reusable data structures and libraries.

For example, you might create:

```go
type Result[T any] struct {
    Data  T
    Error error
}
```

Then:

```go
userResult := Result[User]{
    Data: user,
}

productResult := Result[Product]{
    Data: product,
}
```

The same structure works with different application models.

## 13. Teacher Exercise

Create a generic queue:

```go
type Queue[T any] struct {
    items []T
}
```

Implement:

- `Enqueue()`
- `Dequeue()`
- `IsEmpty()`

Then test it with:

```go
Queue[int]
Queue[string]
```

## 14. Summary

Generic types let you build reusable structures.

Important syntax:

```go
type Box[T any] struct {
    Value T
}
```

Remember:

```text
T          → type parameter
any        → accepts any type
constraint → limits allowed types
```

Generic types are especially useful for data structures and reusable libraries.
