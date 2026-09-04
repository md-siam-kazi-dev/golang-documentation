# Switch Statements in Go

A `switch` statement is useful when you need to compare one value against multiple possible values.

Instead of writing:

```go
if x == 1 {
} else if x == 2 {
} else if x == 3 {
}
```

you can write:

```go
switch x {
case 1:
case 2:
case 3:
}
```

---

# 1. Basic Switch

Syntax:

```go
switch value {
case value1:
    // code

case value2:
    // code

default:
    // code
}
```

Example:

```go
package main

import "fmt"

func main() {
    day := 2

    switch day {
    case 1:
        fmt.Println("Monday")
    case 2:
        fmt.Println("Tuesday")
    case 3:
        fmt.Println("Wednesday")
    default:
        fmt.Println("Invalid day")
    }
}
```

Output:

```text
Tuesday
```

---

# 2. Switch Does Not Need `break`

In many languages, you need `break` to prevent the next case from executing.

Go automatically stops after the matching case.

```go
number := 2

switch number {
case 1:
    fmt.Println("One")
case 2:
    fmt.Println("Two")
case 3:
    fmt.Println("Three")
}
```

Output:

```text
Two
```

Only the matching case runs.

---

# 3. `default`

The `default` case executes when no case matches.

```go
day := 10

switch day {
case 1:
    fmt.Println("Monday")
case 2:
    fmt.Println("Tuesday")
default:
    fmt.Println("Invalid day")
}
```

Output:

```text
Invalid day
```

---

# 4. Multiple Values in One Case

You can put multiple values in one case.

```go
day := "Saturday"

switch day {
case "Saturday", "Sunday":
    fmt.Println("Weekend")
default:
    fmt.Println("Weekday")
}
```

Output:

```text
Weekend
```

---

# 5. Switch with Strings

```go
command := "start"

switch command {
case "start":
    fmt.Println("Starting server")
case "stop":
    fmt.Println("Stopping server")
case "restart":
    fmt.Println("Restarting server")
default:
    fmt.Println("Unknown command")
}
```

---

# 6. Switch with Characters

```go
grade := 'A'

switch grade {
case 'A':
    fmt.Println("Excellent")
case 'B':
    fmt.Println("Good")
case 'C':
    fmt.Println("Average")
default:
    fmt.Println("Unknown grade")
}
```

---

# 7. Expression Switch

Go allows switch cases to contain conditions.

```go
score := 75

switch {
case score >= 80:
    fmt.Println("A+")
case score >= 70:
    fmt.Println("A")
case score >= 60:
    fmt.Println("B")
case score >= 50:
    fmt.Println("C")
default:
    fmt.Println("Fail")
}
```

Output:

```text
A
```

This is called an **expressionless switch**.

It is similar to an `if-else if` chain.

---

# 8. Why Use Expressionless Switch?

Compare:

```go
if score >= 80 {
    fmt.Println("A+")
} else if score >= 70 {
    fmt.Println("A")
} else if score >= 60 {
    fmt.Println("B")
} else {
    fmt.Println("Fail")
}
```

with:

```go
switch {
case score >= 80:
    fmt.Println("A+")
case score >= 70:
    fmt.Println("A")
case score >= 60:
    fmt.Println("B")
default:
    fmt.Println("Fail")
}
```

Both work.

Choose whichever makes the logic clearer.

---

# 9. Switch with Initialization

Like `if`, a switch can have an initialization statement.

```go
switch day := 3; day {
case 1:
    fmt.Println("Monday")
case 2:
    fmt.Println("Tuesday")
case 3:
    fmt.Println("Wednesday")
}
```

---

# 10. Type Switch

Go also supports type switches for interfaces.

Example:

```go
var value any = 42

switch v := value.(type) {
case int:
    fmt.Println("Integer:", v)
case string:
    fmt.Println("String:", v)
case bool:
    fmt.Println("Boolean:", v)
default:
    fmt.Println("Unknown type")
}
```

Output:

```text
Integer: 42
```

Type switches are particularly useful when working with interfaces.

---

# 11. `fallthrough`

Go normally stops after a matching case.

You can explicitly continue into the next case using `fallthrough`.

```go
number := 1

switch number {
case 1:
    fmt.Println("One")
    fallthrough
case 2:
    fmt.Println("Two")
}
```

Output:

```text
One
Two
```

Use `fallthrough` carefully because it can make logic harder to understand.

---

# 12. HTTP Method Example

Switch statements are very useful in backend development.

```go
method := "POST"

switch method {
case "GET":
    fmt.Println("Read data")

case "POST":
    fmt.Println("Create data")

case "PUT":
    fmt.Println("Update data")

case "DELETE":
    fmt.Println("Delete data")

default:
    fmt.Println("Unknown method")
}
```

This kind of logic is common when working with HTTP methods.

---

# 13. Menu Example

```go
choice := 2

switch choice {
case 1:
    fmt.Println("Create account")
case 2:
    fmt.Println("Login")
case 3:
    fmt.Println("Exit")
default:
    fmt.Println("Invalid choice")
}
```

---

# 14. Calculator Example

```go
a := 10
b := 5
operator := "*"

switch operator {
case "+":
    fmt.Println(a + b)

case "-":
    fmt.Println(a - b)

case "*":
    fmt.Println(a * b)

case "/":
    if b != 0 {
        fmt.Println(a / b)
    } else {
        fmt.Println("Cannot divide by zero")
    }

default:
    fmt.Println("Invalid operator")
}
```

---

# 15. When Should You Use `switch`?

Use `switch` when:

- One value has many possible values.
- You are handling commands.
- You are handling HTTP methods.
- You are handling menu choices.
- You are mapping statuses to actions.
- You want cleaner alternatives to long `if-else if` chains.

---

# Key Takeaways

- `switch` compares a value against multiple cases.
- Go automatically stops after a matching case.
- `default` handles unmatched values.
- Multiple values can be placed in one case.
- `switch {}` can replace complex `if-else if` chains.
- `fallthrough` explicitly continues into the next case.
- Type switches are useful with interfaces.