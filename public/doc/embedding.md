# Embedding in Go

Embedding is a Go feature that allows one struct or interface to be included inside another type.

Embedding is commonly used to achieve composition, code reuse, and method promotion.

Go does not use traditional class inheritance like Java or C++.

Instead, Go encourages:

```text
Composition over inheritance.
```

---

## 1. Why Embedding?

Suppose we have:

```go
type Person struct {
    Name string
    Age  int
}
```

Now imagine we create:

```go
type Employee struct {
    Name       string
    Age        int
    EmployeeID int
}
```

There is duplicated code.

Embedding lets us reuse `Person`:

```go
type Employee struct {
    Person
    EmployeeID int
}
```

Now `Employee` contains a `Person`.

## 2. Basic Struct Embedding

```go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

type Employee struct {
    Person
    EmployeeID int
}

func main() {
    employee := Employee{
        Person: Person{
            Name: "Siam",
            Age: 21,
        },
        EmployeeID: 101,
    }

    fmt.Println(employee.Name)
    fmt.Println(employee.Age)
    fmt.Println(employee.EmployeeID)
}
```

Output:

```text
Siam
21
101
```

Notice that we wrote:

```go
employee.Name
```

instead of:

```go
employee.Person.Name
```

This happens because fields from an embedded type are promoted.

## 3. What Does Embedding Actually Mean?

When you write:

```go
type Employee struct {
    Person
}
```

`Person` is an embedded field.

Conceptually:

```text
Employee
│
└── Person
    ├── Name
    └── Age
```

The `Person` value is still part of `Employee`.

You can explicitly access it:

```go
employee.Person.Name
```

Or use the promoted field:

```go
employee.Name
```

Both work.

## 4. Initializing an Embedded Struct

You normally initialize an embedded struct using its type name:

```go
employee := Employee{
    Person: Person{
        Name: "Siam",
        Age:  21,
    },
    EmployeeID: 1001,
}
```

You can also initialize it separately:

```go
person := Person{
    Name: "Siam",
    Age:  21,
}

employee := Employee{
    Person:     person,
    EmployeeID: 1001,
}
```

## 5. Embedding Methods

Embedding is especially powerful with methods.

```go
type Person struct {
    Name string
}

func (p Person) SayHello() {
    fmt.Println("Hello, my name is", p.Name)
}

type Employee struct {
    Person
    EmployeeID int
}
```

Now:

```go
employee := Employee{
    Person: Person{
        Name: "Siam",
    },
    EmployeeID: 101,
}

employee.SayHello()
```

Output:

```text
Hello, my name is Siam
```

The method is promoted from `Person` to `Employee`.

## 6. Method Promotion

Think of it like this:

```text
Person
 └── SayHello()

Employee
 ├── Person
 ├── EmployeeID
 └── SayHello()  ← promoted
```

The method still belongs to `Person`.

Go simply allows:

```go
employee.SayHello()
```

instead of:

```go
employee.Person.SayHello()
```

## 7. Embedding Pointer Types

You can also embed a pointer:

```go
type Employee struct {
    *Person
    EmployeeID int
}
```

Example:

```go
person := &Person{
    Name: "Siam",
}

employee := Employee{
    Person:     person,
    EmployeeID: 101,
}

fmt.Println(employee.Name)
```

This works because the fields and methods of the embedded pointer can also be promoted.

Be aware that a `nil` embedded pointer can cause a panic if you access promoted fields or methods that require dereferencing it.

## 8. Composition with Embedding

Embedding is a form of composition.

For example:

```go
type Address struct {
    City    string
    Country string
}

type Person struct {
    Name string
    Address
}
```

Now:

```go
person := Person{
    Name: "Siam",
    Address: Address{
        City:    "Dhaka",
        Country: "Bangladesh",
    },
}

fmt.Println(person.City)
fmt.Println(person.Country)
```

Output:

```text
Dhaka
Bangladesh
```

Here `Person` is composed of an `Address`.

## 9. Multiple Embedded Types

A struct can embed multiple types:

```go
type Name struct {
    FirstName string
    LastName  string
}

type Address struct {
    City    string
    Country string
}

type User struct {
    Name
    Address
}
```

Now:

```go
user := User{
    Name: Name{
        FirstName: "Md",
        LastName:  "Siam",
    },
    Address: Address{
        City:    "Dhaka",
        Country: "Bangladesh",
    },
}

fmt.Println(user.FirstName)
fmt.Println(user.City)
```

## 10. Name Conflicts

Suppose two embedded structs have the same field:

```go
type A struct {
    Name string
}

type B struct {
    Name string
}

type C struct {
    A
    B
}
```

Now this is ambiguous:

```go
fmt.Println(c.Name)
```

Go does not know whether you mean `A.Name` or `B.Name`.

You must explicitly specify:

```go
fmt.Println(c.A.Name)
fmt.Println(c.B.Name)
```

## 11. Outer Fields Have Priority

Consider:

```go
type Person struct {
    Name string
}

type Employee struct {
    Person
    Name string
}
```

Now:

```go
employee.Name
```

refers to:

```go
Employee.Name
```

The field directly declared on `Employee` takes priority over the promoted field.

You can still access:

```go
employee.Person.Name
```

## 12. Embedding Interfaces

Interfaces can also be embedded.

```go
type Reader interface {
    Read()
}

type Writer interface {
    Write()
}

type ReadWriter interface {
    Reader
    Writer
}
```

Now any type implementing both:

```go
Read()
Write()
```

implements:

```go
ReadWriter
```

Example:

```go
type File struct{}

func (File) Read() {
    fmt.Println("Reading...")
}

func (File) Write() {
    fmt.Println("Writing...")
}
```

Then:

```go
var rw ReadWriter = File{}

rw.Read()
rw.Write()
```

## 13. Embedding in the Standard Library

Go's standard library uses embedding heavily.

For example, HTTP handlers and interfaces often use composition to build larger abstractions.

A common pattern is embedding an existing type and extending its behavior.

This is one reason Go code can remain modular without traditional inheritance hierarchies.

## 14. Embedding Is Not Inheritance

This is very important.

Go does not have class inheritance like:

```text
Employee extends Person
```

Instead:

```go
type Employee struct {
    Person
}
```

means:

```text
Employee contains a Person.
```

It does not mean:

```text
Employee is a subclass of Person.
```

You should think:

```text
Inheritance:
"IS-A"

Composition:
"HAS-A"
```

Embedding is primarily a composition mechanism.

## 15. Real-World Example

Imagine a web application:

```go
type Logger struct{}

func (Logger) Log(message string) {
    fmt.Println("[LOG]", message)
}

type Database struct{}

func (Database) Connect() {
    fmt.Println("Database connected")
}

type Server struct {
    Logger
    Database
}
```

Now:

```go
server := Server{}

server.Log("Starting server")
server.Connect()
```

Output:

```text
[LOG] Starting server
Database connected
```

The `Server` is composed of a logger and database.

This style is very useful when designing backend applications.

## 16. Embedding vs Nested Fields

You can write:

```go
type Employee struct {
    Person Person
}
```

This is a normal named field.

Access:

```go
employee.Person.Name
```

Or you can embed:

```go
type Employee struct {
    Person
}
```

Then you can use:

```go
employee.Name
```

The second form promotes the fields and methods.

## Summary

Embedding allows a type to include another type directly.

Example:

```go
type Employee struct {
    Person
}
```

Important concepts:

- Embedding is a composition technique.
- Embedded fields can be accessed through promoted names.
- Methods can also be promoted.
- Multiple types can be embedded.
- Name conflicts require explicit qualification.
- Interfaces can be embedded.
- Embedding is not traditional inheritance.
- Go generally favors composition over inheritance.

## Practice

Create:

```go
type Engine struct {
    Model string
}

func (e Engine) Start() {
    fmt.Println("Engine started")
}

type Car struct {
    Engine
    Brand string
}
```

Then create a `Car` and access:

```go
car.Model
car.Brand
car.Start()
```

Try adding another embedded type such as `GPS`.
