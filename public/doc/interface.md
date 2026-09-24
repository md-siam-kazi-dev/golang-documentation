# Go Interfaces

Interfaces are one of the most important concepts in Go. They let us write flexible code that works with different concrete types.

## 1. What is an Interface?

An interface defines a set of method signatures.

```go
type Speaker interface {
    Speak()
}
```

This means:

> Any type that has a `Speak()` method can satisfy the `Speaker` interface.

An interface describes **what a type can do**, not what the type is.

## 2. Simple Example

```go
package main

import "fmt"

type Speaker interface {
    Speak()
}

type Dog struct {
    Name string
}

func (d Dog) Speak() {
    fmt.Println(d.Name, "says: Woof!")
}

type Cat struct {
    Name string
}

func (c Cat) Speak() {
    fmt.Println(c.Name, "says: Meow!")
}

func main() {
    var s Speaker

    s = Dog{Name: "Buddy"}
    s.Speak()

    s = Cat{Name: "Milo"}
    s.Speak()
}
```

Output:

```text
Buddy says: Woof!
Milo says: Meow!
```

Both `Dog` and `Cat` satisfy `Speaker`.

## 3. Go Uses Implicit Interface Implementation

Go does not have an `implements` keyword.

You do not write:

```go
type Dog implements Speaker
```

Instead, Go automatically determines whether a type satisfies an interface.

```go
type Speaker interface {
    Speak()
}

type Dog struct{}

func (Dog) Speak() {
    fmt.Println("Woof!")
}
```

Because `Dog` has the required `Speak()` method, it satisfies `Speaker`.

This is called **implicit interface satisfaction**.

## 4. Why Use Interfaces?

Without an interface, you might write:

```go
func printDog(d Dog) {
    d.Speak()
}

func printCat(c Cat) {
    c.Speak()
}
```

With an interface:

```go
func makeSpeak(s Speaker) {
    s.Speak()
}
```

Now:

```go
makeSpeak(Dog{})
makeSpeak(Cat{})
```

The function only cares that the value can `Speak()`.

### Mental Model

```text
             Speaker
                |
        +-------+-------+
        |               |
       Dog             Cat
        |               |
     Speak()          Speak()
```

The interface creates a common contract.

## 5. Interface as a Function Parameter

```go
type Animal interface {
    Sound()
}

type Dog struct{}

func (Dog) Sound() {
    fmt.Println("Woof")
}

type Cat struct{}

func (Cat) Sound() {
    fmt.Println("Meow")
}

func printSound(a Animal) {
    a.Sound()
}

func main() {
    printSound(Dog{})
    printSound(Cat{})
}
```

Output:

```text
Woof
Meow
```

## 6. Multiple Methods

An interface can require multiple methods.

```go
type Employee interface {
    Work()
    GetSalary() float64
}
```

A type must implement **all** required methods.

```go
type Developer struct {
    Salary float64
}

func (d Developer) Work() {
    fmt.Println("Writing code")
}

func (d Developer) GetSalary() float64 {
    return d.Salary
}
```

`Developer` satisfies `Employee`.

## 7. Interface Values

An interface value can contain a concrete value.

```go
var s Speaker
s = Dog{}
```

Conceptually:

```text
Speaker interface value
+----------------------+
| Dynamic Type: Dog    |
| Dynamic Value: Dog{} |
+----------------------+
```

This becomes important when learning **type assertions** and **type switches**.

## 8. Practical Example: Payment System

Interfaces are very useful in backend applications.

```go
type PaymentMethod interface {
    Pay(amount float64) error
}
```

Implementations:

```go
type CardPayment struct{}

func (CardPayment) Pay(amount float64) error {
    fmt.Println("Paid with card:", amount)
    return nil
}

type MobilePayment struct{}

func (MobilePayment) Pay(amount float64) error {
    fmt.Println("Paid with mobile payment:", amount)
    return nil
}
```

One function can process both:

```go
func processPayment(p PaymentMethod, amount float64) error {
    return p.Pay(amount)
}
```

Usage:

```go
processPayment(CardPayment{}, 500)
processPayment(MobilePayment{}, 1000)
```

The business logic does not need to know which provider is being used.

## 9. Interfaces Help With Testing

Suppose an application sends emails:

```go
type EmailSender interface {
    Send(to string, message string) error
}
```

Production implementation:

```go
type SMTPEmailSender struct{}

func (SMTPEmailSender) Send(to string, message string) error {
    fmt.Println("Sending real email...")
    return nil
}
```

Test implementation:

```go
type FakeEmailSender struct{}

func (FakeEmailSender) Send(to string, message string) error {
    fmt.Println("Fake email sent")
    return nil
}
```

Our service can accept the interface:

```go
func sendWelcomeEmail(sender EmailSender) {
    sender.Send("user@example.com", "Welcome!")
}
```

Testing:

```go
sendWelcomeEmail(FakeEmailSender{})
```

## 10. Small Interfaces

Go encourages small interfaces.

Instead of:

```go
type UserService interface {
    CreateUser()
    DeleteUser()
    UpdateUser()
    Login()
    Logout()
    SendEmail()
    GenerateReport()
}
```

Prefer focused interfaces:

```go
type UserCreator interface {
    CreateUser()
}

type UserDeleter interface {
    DeleteUser()
}
```

Small interfaces are usually easier to implement, test, and reuse.

## 11. `io.Reader`

One of Go's most important standard-library interfaces is:

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}
```

Many different types can implement `io.Reader`, including files, network connections, and buffers.

A function can therefore accept:

```go
func readData(r io.Reader) {
    // Read from r
}
```

The function does not need to know where the data comes from.

## 12. Pointer Receivers and Interfaces

Be careful with pointer receivers.

```go
type User struct {
    Name string
}

func (u *User) Speak() {
    fmt.Println("Hello", u.Name)
}

type Speaker interface {
    Speak()
}
```

Here `*User` satisfies `Speaker`.

```go
var s Speaker

u := User{Name: "Siam"}

s = &u // OK
```

But:

```go
s = u // Compile error
```

because `Speak()` has a pointer receiver.

## 13. Compile-Time Interface Check

You can explicitly ask the compiler to verify a relationship:

```go
var _ Speaker = Dog{}
```

For a pointer implementation:

```go
var _ Speaker = (*User)(nil)
```

This is useful in larger projects.

## 14. Interface Composition

Interfaces can be combined.

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

A type satisfying `ReadWriter` must implement both methods.

## 15. Interfaces in Backend Architecture

Interfaces are useful for separating business logic from infrastructure.

```go
type UserRepository interface {
    CreateUser()
    FindUser()
}
```

A PostgreSQL implementation:

```go
type PostgresUserRepository struct{}

func (PostgresUserRepository) CreateUser() {
    // PostgreSQL code
}

func (PostgresUserRepository) FindUser() {
    // PostgreSQL code
}
```

A test implementation:

```go
type MockUserRepository struct{}

func (MockUserRepository) CreateUser() {}
func (MockUserRepository) FindUser()   {}
```

Your service can depend on:

```go
type UserService struct {
    repo UserRepository
}
```

instead of depending directly on PostgreSQL.

## 16. Important Rules

1. Go interfaces are implemented implicitly.
2. There is no `implements` keyword.
3. A type must implement every required method.
4. Interfaces are often used as function parameters.
5. Small interfaces are usually easier to work with.
6. Pointer receivers affect interface satisfaction.
7. Interfaces are useful for abstraction and testing.
8. An interface value can contain a concrete value.

## 17. Practice Exercise

Create:

```go
type Shape interface {
    Area() float64
}
```

Then create:

```go
type Rectangle struct {
    Width  float64
    Height float64
}

type Circle struct {
    Radius float64
}
```

Implement `Area()` for both.

Then create:

```go
func printArea(s Shape) {
    fmt.Println(s.Area())
}
```

Call:

```go
printArea(Rectangle{10, 5})
printArea(Circle{5})
```

## Summary

An interface defines a **contract of behavior**.

```go
type Speaker interface {
    Speak()
}
```

Any type that provides `Speak()` satisfies the interface.

The biggest idea to remember is:

> **Interfaces describe what a type can do, not what the type is.**
