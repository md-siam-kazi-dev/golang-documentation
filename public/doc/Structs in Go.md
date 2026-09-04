# Structs in Go

A **struct** is a custom data type that groups related data together.

For example, a user has:

```text
Name
Email
Age
```

Instead of keeping separate variables:

```go
name := "Siam"
email := "siam@example.com"
age := 21
```

we can create a `User` struct.

---

# 1. Creating a Struct

```go
type User struct {
    Name  string
    Email string
    Age   int
}
```

Now `User` is a new type.

---

# 2. Creating a Struct Value

```go
user := User{
    Name:  "Siam",
    Email: "siam@example.com",
    Age:   21,
}
```

---

# 3. Accessing Fields

Use `.`:

```go
fmt.Println(user.Name)
fmt.Println(user.Email)
fmt.Println(user.Age)
```

---

# 4. Updating Fields

Struct fields can be modified:

```go
user.Age = 22

fmt.Println(user.Age)
```

---

# 5. Positional Struct Literal

You can also write:

```go
user := User{
    "Siam",
    "siam@example.com",
    21,
}
```

However, named fields are generally better:

```go
user := User{
    Name:  "Siam",
    Email: "siam@example.com",
    Age:   21,
}
```

They are easier to read and safer when the struct changes.

---

# 6. Zero Value

If you create:

```go
var user User
```

the fields receive their zero values.

```text
string → ""
int    → 0
bool   → false
```

Example:

```go
fmt.Println(user.Name)
fmt.Println(user.Age)
```

Output:

```text

0
```

---

# 7. Struct With Different Data Types

```go
type Product struct {
    ID          int
    Name        string
    Price       float64
    InStock     bool
}
```

Create:

```go
product := Product{
    ID:      101,
    Name:    "Laptop",
    Price:   85000,
    InStock: true,
}
```

---

# 8. Nested Structs

A struct can contain another struct.

```go
type Address struct {
    City    string
    Country string
}

type User struct {
    Name    string
    Address Address
}
```

Create:

```go
user := User{
    Name: "Siam",
    Address: Address{
        City:    "Dhaka",
        Country: "Bangladesh",
    },
}
```

Access:

```go
fmt.Println(user.Address.City)
```

---

# 9. Struct Methods

Structs become much more powerful when combined with methods.

```go
type User struct {
    Name string
    Age  int
}

func (u User) Greet() {
    fmt.Println("Hello", u.Name)
}
```

Call:

```go
user := User{
    Name: "Siam",
    Age:  21,
}

user.Greet()
```

Output:

```text
Hello Siam
```

---

# 10. Value Receiver

Consider:

```go
func (u User) Birthday() {
    u.Age++
}
```

This does **not** modify the original struct because `u` is a copy.

---

# 11. Pointer Receiver

To modify the original:

```go
func (u *User) Birthday() {
    u.Age++
}
```

Now:

```go
user.Birthday()

fmt.Println(user.Age)
```

The original value changes.

---

# 12. Structs and Pointers

You can create a pointer to a struct:

```go
user := &User{
    Name: "Siam",
    Age:  21,
}
```

Access:

```go
fmt.Println(user.Name)
```

Go automatically dereferences the pointer for field access.

You don't need:

```go
(*user).Name
```

although that is also valid.

---

# 13. Struct Comparison

Structs can be compared if all their fields are comparable.

```go
type Point struct {
    X int
    Y int
}

p1 := Point{10, 20}
p2 := Point{10, 20}

fmt.Println(p1 == p2)
```

Output:

```text
true
```

But a struct containing a slice cannot be compared using `==`.

---

# 14. Struct With Slice

```go
type Student struct {
    Name    string
    Subjects []string
}
```

Create:

```go
student := Student{
    Name: "Siam",
    Subjects: []string{
        "Go",
        "PostgreSQL",
        "DSA",
    },
}
```

---

# 15. Struct With Map

```go
type User struct {
    Name  string
    Scores map[string]int
}
```

Create:

```go
user := User{
    Name: "Siam",
    Scores: map[string]int{
        "Go": 90,
        "DSA": 85,
    },
}
```

Access:

```go
fmt.Println(user.Scores["Go"])
```

---

# 16. Struct as Function Parameter

```go
func printUser(user User) {
    fmt.Println(user.Name)
    fmt.Println(user.Age)
}
```

Call:

```go
user := User{
    Name: "Siam",
    Age:  21,
}

printUser(user)
```

A struct passed by value is copied.

---

# 17. Passing Pointer to Struct

```go
func updateAge(user *User) {
    user.Age = 22
}
```

Call:

```go
updateAge(&user)
```

Now the original struct is modified.

---

# 18. Constructor Pattern

Go does not have traditional constructors like some languages.

Instead, we commonly create constructor-like functions:

```go
func NewUser(name string, age int) User {
    return User{
        Name: name,
        Age:  age,
    }
}
```

Use:

```go
user := NewUser("Siam", 21)
```

---

# 19. Constructor Returning Pointer

You can return a pointer:

```go
func NewUser(name string, age int) *User {
    return &User{
        Name: name,
        Age:  age,
    }
}
```

Use:

```go
user := NewUser("Siam", 21)

fmt.Println(user.Name)
```

---

# 20. Struct Embedding

Go supports embedding.

```go
type Address struct {
    City string
}

type User struct {
    Name string
    Address
}
```

Now:

```go
user := User{
    Name: "Siam",
    Address: Address{
        City: "Dhaka",
    },
}
```

You can access:

```go
fmt.Println(user.City)
```

instead of:

```go
fmt.Println(user.Address.City)
```

This is called **field promotion**.

---

# 21. Struct Tags

Struct tags are extremely important in backend development.

Example:

```go
type User struct {
    Name  string `json:"name"`
    Email string `json:"email"`
    Age   int    `json:"age"`
}
```

These tags tell packages such as `encoding/json` how fields should be represented.

For example:

```go
json.Marshal(user)
```

can produce:

```json
{
    "name": "Siam",
    "email": "siam@example.com",
    "age": 21
}
```

---

# 22. Structs in Backend Development

Structs are heavily used in Go backend applications.

For example:

```go
type User struct {
    ID       string `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
}
```

A request body can be decoded into a struct:

```go
var user User

err := json.NewDecoder(r.Body).Decode(&user)
```

This is one of the most common patterns in Go APIs.

---

# 23. Structs for Database Models

You might have:

```go
type Product struct {
    ID    int
    Name  string
    Price float64
}
```

Then database results can be mapped into the struct.

This makes backend code easier to organize.

---

# 24. Anonymous Struct

You don't always need to create a named type.

```go
user := struct {
    Name string
    Age  int
}{
    Name: "Siam",
    Age:  21,
}
```

This is called an **anonymous struct**.

Useful for small temporary data.

---

# 25. Struct Composition

Instead of inheritance, Go commonly uses composition.

```go
type Engine struct {
    Power int
}

type Car struct {
    Brand string
    Engine
}
```

Now:

```go
car := Car{
    Brand: "Toyota",
    Engine: Engine{
        Power: 150,
    },
}
```

Access:

```go
fmt.Println(car.Power)
```

---

# 26. Important Struct Concepts

You should understand:

```text
struct
fields
methods
value receiver
pointer receiver
nested structs
embedding
composition
struct tags
anonymous structs
constructor functions
```

---

# 27. Mental Model

Think of a struct as a **blueprint**.

```go
type User struct {
    Name string
    Age  int
}
```

And:

```go
user1 := User{}
user2 := User{}
user3 := User{}
```

Each is a separate value created from the same blueprint.

---

# 28. Summary

Structs are Go's primary way to model structured data.

For example:

```go
type User struct {
    ID    int
    Name  string
    Email string
}
```

Structs are everywhere in real Go applications:

```text
HTTP request models
HTTP response models
Database models
Configuration
Business logic
API objects
Service objects
Domain models
```

If you are learning Go backend development, **structs are one of the most important concepts to master.**