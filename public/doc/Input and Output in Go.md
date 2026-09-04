# Input and Output in Go

Input and output are fundamental parts of programming.

A program usually:

```text
Input → Processing → Output
```

For example:

```text
User enters age
       ↓
Program checks age
       ↓
Program prints result
```

Go provides the `fmt` package for basic console input and output.

---

# 1. Printing Output

The simplest way to print something is:

```go
fmt.Println()
```

Example:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

Output:

```text
Hello, Go!
```

---

# 2. `fmt.Print`

`fmt.Print()` prints without automatically adding a new line.

```go
fmt.Print("Hello")
fmt.Print("World")
```

Output:

```text
HelloWorld
```

---

# 3. `fmt.Println`

`Println` adds a newline.

```go
fmt.Println("Hello")
fmt.Println("World")
```

Output:

```text
Hello
World
```

---

# 4. `fmt.Printf`

`Printf` lets you format output.

```go
name := "Siam"
age := 21

fmt.Printf("Name: %s\n", name)
fmt.Printf("Age: %d\n", age)
```

Output:

```text
Name: Siam
Age: 21
```

---

# 5. Common Format Verbs

| Verb | Used for |
|---|---|
| `%s` | string |
| `%d` | integer |
| `%f` | floating-point number |
| `%t` | boolean |
| `%v` | general value |
| `%T` | type |

Example:

```go
name := "Siam"
age := 21
price := 99.99
active := true

fmt.Printf("%s\n", name)
fmt.Printf("%d\n", age)
fmt.Printf("%f\n", price)
fmt.Printf("%t\n", active)
```

---

# 6. `%v`

`%v` is useful when you don't want to worry about the exact format verb.

```go
name := "Siam"
age := 21

fmt.Printf("Name: %v, Age: %v\n", name, age)
```

---

# 7. `%T`

Use `%T` to print the type of a value.

```go
age := 21

fmt.Printf("Value: %v\n", age)
fmt.Printf("Type: %T\n", age)
```

Output:

```text
Value: 21
Type: int
```

---

# 8. Taking Input with `fmt.Scan`

You can read user input using:

```go
fmt.Scan()
```

Example:

```go
package main

import "fmt"

func main() {
    var name string

    fmt.Print("Enter your name: ")
    fmt.Scan(&name)

    fmt.Println("Hello", name)
}
```

If the user enters:

```text
Siam
```

Output:

```text
Enter your name: Siam
Hello Siam
```

---

# 9. Why Do We Use `&`?

Notice:

```go
fmt.Scan(&name)
```

We use `&name` because `Scan` needs the **address of the variable** so it can store the input inside it.

You will learn pointers in more detail later.

For now, remember:

```go
fmt.Scan(&variable)
```

---

# 10. Reading Multiple Values

```go
package main

import "fmt"

func main() {
    var name string
    var age int

    fmt.Scan(&name, &age)

    fmt.Println("Name:", name)
    fmt.Println("Age:", age)
}
```

Input:

```text
Siam 21
```

Output:

```text
Name: Siam
Age: 21
```

---

# 11. Reading an Integer

```go
var age int

fmt.Print("Enter age: ")
fmt.Scan(&age)

fmt.Println("Your age is:", age)
```

---

# 12. Reading a Float

```go
var price float64

fmt.Print("Enter price: ")
fmt.Scan(&price)

fmt.Println("Price:", price)
```

---

# 13. Reading a Boolean

```go
var isStudent bool

fmt.Scan(&isStudent)

fmt.Println("Student:", isStudent)
```

Input:

```text
true
```

Output:

```text
Student: true
```

---

# 14. `fmt.Scanln`

`Scanln` reads input until a newline.

```go
var age int

fmt.Scanln(&age)
```

It is useful for simple input but has limitations when handling more complex lines.

---

# 15. `fmt.Scanf`

`Scanf` allows formatted input.

```go
var name string
var age int

fmt.Scanf("%s %d", &name, &age)

fmt.Println(name)
fmt.Println(age)
```

Input:

```text
Siam 21
```

---

# 16. The Important Problem with `fmt.Scan`

`fmt.Scan` reads whitespace-separated tokens.

For example:

```go
var name string

fmt.Scan(&name)
```

If the user enters:

```text
Md Siam
```

the first scan gets:

```text
Md
```

It does not read the entire line as one string.

For full-line input, use `bufio.Reader` or `bufio.Scanner`.

---

# 17. Reading a Full Line

Using `bufio.Reader`:

```go
package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)

    fmt.Print("Enter your full name: ")

    name, _ := reader.ReadString('\n')

    fmt.Println("Hello", name)
}
```

This can read:

```text
Md Siam Kazi
```

as one line.

---

# 18. Simple Calculator

Input:

```text
10 20
```

Program:

```go
package main

import "fmt"

func main() {
    var a, b int

    fmt.Scan(&a, &b)

    fmt.Println("Sum:", a+b)
    fmt.Println("Difference:", a-b)
    fmt.Println("Product:", a*b)
}
```

Output:

```text
Sum: 30
Difference: -10
Product: 200
```

---

# 19. Calculate Rectangle Area

```go
package main

import "fmt"

func main() {
    var length, width float64

    fmt.Print("Enter length: ")
    fmt.Scan(&length)

    fmt.Print("Enter width: ")
    fmt.Scan(&width)

    area := length * width

    fmt.Printf("Area: %.2f\n", area)
}
```

`%.2f` means display two digits after the decimal point.

---

# 20. Input → Processing → Output

This pattern is extremely important.

```go
package main

import "fmt"

func main() {
    // Input
    var a, b int
    fmt.Scan(&a, &b)

    // Processing
    sum := a + b

    // Output
    fmt.Println("Sum:", sum)
}
```

Think of most beginner programming problems this way:

```text
Input
  ↓
Process
  ↓
Output
```

---

# Key Takeaways

- `fmt.Println()` prints with a newline.
- `fmt.Print()` prints without a newline.
- `fmt.Printf()` provides formatted output.
- `fmt.Scan()` reads whitespace-separated input.
- Use `&variable` when scanning into a variable.
- `bufio.Reader` can read complete lines.
- `%s` is used for strings.
- `%d` is used for integers.
- `%f` is used for floating-point numbers.
- `%v` prints a general value.
- `%T` prints the type.