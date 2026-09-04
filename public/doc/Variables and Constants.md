# Variables and Constants

Variables and constants are fundamental building blocks of every Go program.

A **variable** stores a value that can change.

A **constant** stores a value that cannot change after it has been declared.

---

# Variables

A variable is a named location used to store data.

For example:

```go
var age int = 21
```

Here:

```text
var  → declares a variable
age  → variable name
int  → data type
21   → value
```

You can think of it as:

```text
age
 ↓
┌────┐
│ 21 │
└────┘
```

---

# 1. Declaring a Variable

The basic syntax is:

```go
var variableName type
```

Example:

```go
var age int
```

Initially, `age` receives its **zero value**.

For an `int`:

```text
0
```

So:

```go
var age int

fmt.Println(age)
```

Output:

```text
0
```

---

# 2. Assigning a Value

You can assign a value after declaration:

```go
var age int

age = 21
```

Now:

```go
fmt.Println(age)
```

Output:

```text
21
```

You can change it:

```go
age = 22
```

Variables can change.

---

# 3. Declaration and Assignment Together

You can declare and initialize a variable in one line:

```go
var age int = 21
```

Example:

```go
package main

import "fmt"

func main() {
    var age int = 21

    fmt.Println(age)
}
```

---

# 4. Type Inference

Go can determine the type automatically.

Instead of:

```go
var age int = 21
```

you can write:

```go
var age = 21
```

Go understands that `21` is an integer.

Similarly:

```go
var name = "Siam"
var price = 99.99
var active = true
```

Go determines:

```text
name   → string
price  → float64
active → bool
```

---

# 5. Short Variable Declaration

Go provides a convenient syntax:

```go
age := 21
```

This is called a **short variable declaration**.

It is equivalent to:

```go
var age = 21
```

Example:

```go
name := "Siam"
age := 21
isStudent := true
```

This is extremely common in Go code.

---

# Important Rule

The `:=` syntax can only be used **inside functions**.

This is valid:

```go
func main() {
    age := 21
}
```

But this is invalid at package level:

```go
package main

age := 21
```

At package level, use:

```go
var age = 21
```

---

# 6. Multiple Variables

You can declare multiple variables:

```go
var name, city string
```

Or:

```go
var age, score int
```

You can also initialize them:

```go
var name, city string = "Siam", "Dhaka"
```

---

# 7. Multiple Assignment

Go allows multiple assignment:

```go
a, b := 10, 20
```

Now:

```text
a = 10
b = 20
```

Example:

```go
x, y := 10, 20

fmt.Println(x)
fmt.Println(y)
```

Output:

```text
10
20
```

---

# 8. Swapping Variables

Go makes swapping extremely simple.

In many languages you need a temporary variable.

In Go:

```go
a := 10
b := 20

a, b = b, a
```

Now:

```text
a = 20
b = 10
```

---

# 9. Variable Scope

Scope determines where a variable can be accessed.

Example:

```go
func main() {
    age := 21

    fmt.Println(age)
}
```

`age` exists inside `main()`.

You cannot access it outside that function.

---

## Block Scope

Variables declared inside `{}` are generally available only within that block.

```go
func main() {
    if true {
        message := "Hello"

        fmt.Println(message)
    }

    // message is not available here
}
```

---

# 10. Zero Values

One of Go's important features is that variables receive a default value.

Examples:

| Type | Zero Value |
|---|---|
| `int` | `0` |
| `float64` | `0` |
| `bool` | `false` |
| `string` | `""` |
| pointer | `nil` |
| slice | `nil` |
| map | `nil` |

Example:

```go
var age int
var name string
var active bool

fmt.Println(age)
fmt.Println(name)
fmt.Println(active)
```

Output:

```text
0

false
```

The empty line represents the empty string.

---

# Constants

A constant is a value that cannot be changed after declaration.

Use:

```go
const
```

Example:

```go
const pi = 3.14159
```

You can use it:

```go
fmt.Println(pi)
```

---

# 11. Constant with a Type

You can specify the type:

```go
const age int = 21
```

Or let Go infer it:

```go
const age = 21
```

---

# 12. Constants Cannot Be Changed

This is invalid:

```go
const pi = 3.14159

pi = 4
```

The compiler will report an error because constants cannot be reassigned.

---

# 13. Multiple Constants

You can declare multiple constants:

```go
const (
    pi     = 3.14159
    version = 1
    appName = "MyApp"
)
```

This is called a constant block.

---

# 14. When Should You Use Variables?

Use a variable when the value can change.

Example:

```go
score := 0

score = 10
score = 20
score = 30
```

`score` changes, so it should be a variable.

---

# 15. When Should You Use Constants?

Use a constant when the value should remain fixed.

Example:

```go
const maxUsers = 100
const appName = "GoLearn"
```

These values aren't expected to change while the program is running.

---

# 16. Practical Example

Imagine you're building an e-commerce application.

```go
const taxRate = 0.15

price := 1000.0
quantity := 2

total := price * float64(quantity)

fmt.Println("Total:", total)
```

Here:

```text
taxRate → constant
price   → variable
quantity → variable
total   → variable
```

---

# 17. Naming Variables

Go convention recommends using clear names.

Good:

```go
userName := "Siam"
userAge := 21
totalPrice := 500
```

Bad:

```go
x := "Siam"
a := 21
p := 500
```

Short names can be appropriate when the scope is tiny:

```go
for i := 0; i < 10; i++ {
    fmt.Println(i)
}
```

---

# 18. Naming Convention

Go commonly uses **camelCase** for local variables.

```go
userName
totalPrice
firstName
accountBalance
```

Exported identifiers start with uppercase:

```go
UserName
TotalPrice
```

---

# 19. Shadowing

A variable can hide another variable with the same name in an inner scope.

Example:

```go
name := "Siam"

if true {
    name := "Rakib"

    fmt.Println(name)
}

fmt.Println(name)
```

Output:

```text
Rakib
Siam
```

The inner `name` is a different variable that shadows the outer one.

Be careful with shadowing because it can make code confusing.

---

# 20. Complete Example

```go
package main

import "fmt"

const taxRate = 0.15

func main() {
    product := "Laptop"
    price := 50000.0
    quantity := 2

    total := price * float64(quantity)
    tax := total * taxRate
    finalPrice := total + tax

    fmt.Println("Product:", product)
    fmt.Println("Price:", price)
    fmt.Println("Quantity:", quantity)
    fmt.Println("Tax:", tax)
    fmt.Println("Final Price:", finalPrice)
}
```

---

# Exercise

Create variables for:

```text
Name
Age
City
Salary
IsDeveloper
```

Then print them.

After that, create constants for:

```text
Pi
DaysInWeek
AppName
```

Try changing one of the constants and observe the compiler error.

---

# Key Takeaways

```text
var       → declare a variable
:=        → short variable declaration
const     → declare a constant
=         → assign a value
```

Remember:

> **Variables can change. Constants cannot be reassigned.**

Next, we'll learn about **Go's data types**.