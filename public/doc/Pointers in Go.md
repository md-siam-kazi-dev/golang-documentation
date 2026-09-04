# Pointers in Go

Pointers are one of the most important concepts in Go.

At first, pointers can look confusing:

```go
&
*
```

But the idea is actually simple.

A pointer is a variable that stores the **memory address of another value**.

---

# 1. Normal Variable

Consider:

```go
x := 10
```

Think of memory like:

```text
Memory
----------------
Address     Value
1000        10
```

The variable `x` refers to the value `10`.

---

# 2. Getting the Address

Use `&`:

```go
x := 10

fmt.Println(&x)
```

You will see something similar to:

```text
0xc0000120a0
```

That is a memory address.

So:

```go
&x
```

means:

> Give me the address of x.

---

# 3. Creating a Pointer

```go
x := 10

p := &x
```

Now:

```text
x → 10
↑
p stores the address of x
```

`p` is a pointer.

---

# 4. Pointer Type

You can check:

```go
fmt.Printf("%T\n", p)
```

Output:

```text
*int
```

This means:

> pointer to an int

---

# 5. Dereferencing

Now we use `*`.

```go
x := 10
p := &x

fmt.Println(*p)
```

Output:

```text
10
```

Here:

```go
*p
```

means:

> Go to the address stored in p and get the value there.

---

# 6. The Two Meanings of *

This is extremely important.

## When declaring a pointer

```go
var p *int
```

means:

> p is a pointer to an int.

## When using a pointer

```go
*p
```

means:

> Access the value stored at the pointer's address.

---

# 7. The Two Meanings of &

When used with a variable:

```go
&x
```

means:

> Get the address of x.

Example:

```go
x := 10
p := &x
```

So:

```text
&x → address
p  → address
*p → value
```

---

# 8. Changing a Value Through a Pointer

```go
x := 10
p := &x

*p = 20

fmt.Println(x)
```

Output:

```text
20
```

Why did `x` change?

Because `p` points to `x`.

When you write:

```go
*p = 20
```

you are changing the value stored at `x`'s address.

---

# 9. Visualizing It

```text
x = 10

Address
   ↓
+---------+
|   10    |
+---------+
    ↑
    |
    p
```

After:

```go
*p = 50
```

memory becomes:

```text
+---------+
|   50    |
+---------+
    ↑
    |
    p
```

Therefore:

```go
fmt.Println(x)
```

prints:

```text
50
```

---

# 10. Pointer Declaration

```go
var p *int
```

Initially:

```go
p == nil
```

Check:

```go
if p == nil {
    fmt.Println("Pointer is nil")
}
```

---

# 11. Nil Pointer

A nil pointer doesn't point to a valid value.

```go
var p *int

fmt.Println(p)
```

Output:

```text
<nil>
```

Don't dereference it:

```go
fmt.Println(*p)
```

This causes a runtime panic.

---

# 12. Pointer Example

```go
func main() {
    x := 10

    p := &x

    fmt.Println(x)
    fmt.Println(p)
    fmt.Println(*p)
}
```

You get:

```text
10
memory address
10
```

---

# 13. Passing Pointer to a Function

Suppose:

```go
func change(x int) {
    x = 100
}
```

Calling:

```go
num := 10

change(num)

fmt.Println(num)
```

Output:

```text
10
```

Why?

Because `x` is a copy.

---

# 14. Using a Pointer Parameter

```go
func change(x *int) {
    *x = 100
}
```

Now:

```go
num := 10

change(&num)

fmt.Println(num)
```

Output:

```text
100
```

We pass:

```go
&num
```

because the function expects:

```go
*int
```

---

# 15. Why Pointers Are Useful

Pointers allow functions to modify the original value.

Without pointer:

```go
func change(x int) {
    x = 100
}
```

Original value doesn't change.

With pointer:

```go
func change(x *int) {
    *x = 100
}
```

Original value changes.

---

# 16. Returning a Pointer

You can return a pointer from a function.

```go
func createNumber() *int {
    x := 100
    return &x
}
```

Then:

```go
p := createNumber()

fmt.Println(*p)
```

Output:

```text
100
```

Go's memory management allows this safely; the compiler/runtime ensures the value remains valid when necessary.

---

# 17. Pointer to Struct

Pointers become especially useful with structs.

```go
type User struct {
    Name string
    Age  int
}
```

Create:

```go
user := User{
    Name: "Siam",
    Age:  21,
}

p := &user
```

Access:

```go
fmt.Println(p.Name)
```

Go automatically handles:

```go
(*p).Name
```

for field access.

---

# 18. Updating Struct Through Pointer

```go
p.Age = 22

fmt.Println(user.Age)
```

Output:

```text
22
```

---

# 19. Pointer Receiver

This is very important for methods.

```go
type User struct {
    Name string
    Age  int
}

func (u *User) Birthday() {
    u.Age++
}
```

Now:

```go
user := User{
    Name: "Siam",
    Age: 21,
}

user.Birthday()

fmt.Println(user.Age)
```

Output:

```text
22
```

---

# 20. Why Pointer Receiver?

Because this:

```go
func (u User) Birthday()
```

receives a copy.

But:

```go
func (u *User) Birthday()
```

receives a pointer to the original value.

Therefore changes persist.

---

# 21. Pointer to Pointer

Go can have multiple levels of pointers.

```go
x := 10

p := &x
pp := &p
```

Now:

```text
x
↓
10

p
↓
address of x

pp
↓
address of p
```

Access:

```go
fmt.Println(x)
fmt.Println(*p)
fmt.Println(**pp)
```

All produce:

```text
10
```

---

# 22. Pointers With Arrays

```go
arr := [3]int{10, 20, 30}

p := &arr

fmt.Println(p[0])
```

You can access array elements through the pointer.

---

# 23. Pointers and Slices

Slices already contain a reference to an underlying array.

Example:

```go
nums := []int{1, 2, 3}

func update(nums []int) {
    nums[0] = 100
}

update(nums)

fmt.Println(nums)
```

Output:

```text
[100 2 3]
```

You usually **do not need a pointer to a slice just to modify its elements**.

However, a pointer to a slice can be useful when you need to modify the slice header itself, such as changing the slice variable's length/capacity through a function.

---

# 24. Pointer vs Value

Consider:

```go
func update(user User) {
    user.Age = 30
}
```

The original does not change.

With:

```go
func update(user *User) {
    user.Age = 30
}
```

the original can change.

---

# 25. Pointers and Memory

Suppose:

```go
x := 10
p := &x
```

Conceptually:

```text
x
│
│ address: 0x1000
▼
┌─────────┐
│   10    │
└─────────┘
     ▲
     │
     p
```

When you execute:

```go
*p = 50
```

you change the value at address `0x1000`.

Now:

```text
┌─────────┐
│   50    │
└─────────┘
```

---

# 26. Pointers Are Not the Same as References

Go does not have C++-style references.

Instead, Go has pointers.

You explicitly work with:

```go
&
*
```

Go also has reference-like behavior for types such as:

```text
maps
slices
channels
functions
```

but they are not simply interchangeable with pointers.

---

# 27. Pointer Equality

Pointers can be compared.

```go
x := 10
y := 10

p1 := &x
p2 := &x
p3 := &y

fmt.Println(p1 == p2)
fmt.Println(p1 == p3)
```

The first is `true` because both point to `x`.

The second is `false` because they point to different variables.

---

# 28. When Should You Use Pointers?

Pointers are useful when:

### 1. You need to modify the original value

```go
func update(x *int)
```

### 2. You want to avoid copying a large struct

```go
func process(user *User)
```

### 3. You need a nil value

```go
var user *User
```

### 4. You need pointer receiver methods

```go
func (u *User) Update()
```

### 5. You want to represent optional data

For example:

```go
type User struct {
    Name string
    Age  *int
}
```

`Age == nil` can represent "age not provided."

---

# 29. When You Don't Need a Pointer

Don't use pointers everywhere.

For small values:

```go
func add(a int, b int) int {
    return a + b
}
```

There is usually no reason to use:

```go
func add(a *int, b *int) *int
```

unless the problem specifically requires pointer semantics.

---

# 30. Common Pointer Mistake

This:

```go
var p *int
*p = 10
```

is wrong because `p` is nil.

Correct:

```go
x := 10
p := &x

*p = 20
```

Or allocate memory with `new`:

```go
p := new(int)

*p = 20

fmt.Println(*p)
```

---

# 31. Using new()

`new` allocates a zero-valued value and returns its pointer.

```go
p := new(int)

fmt.Println(*p)
```

Output:

```text
0
```

Then:

```go
*p = 100
```

Now:

```go
fmt.Println(*p)
```

Output:

```text
100
```

---

# 32. new vs make

This distinction is important.

`new` returns a pointer:

```go
p := new(int)
```

Type:

```text
*int
```

`make` initializes certain Go built-in types:

```go
slice
map
channel
```

Example:

```go
numbers := make([]int, 5)
users := make(map[string]int)
```

Don't use `make` for structs or integers.

---

# 33. Pointer and Interface

Pointers can also implement interfaces.

For example:

```go
type Speaker interface {
    Speak()
}

type User struct {
    Name string
}

func (u *User) Speak() {
    fmt.Println("Hello")
}
```

A `*User` implements `Speaker`.

This becomes important when learning Go interfaces.

---

# 34. Pointer in Backend Development

Pointers appear frequently in real Go applications.

For example:

```go
func GetUser(id int) (*User, error) {
    // database logic
}
```

Why return:

```go
*User
```

instead of:

```go
User
```

Possible reasons include:

- Avoiding unnecessary copying
- Representing "no user" with `nil`
- Working naturally with methods
- Returning a reference to the created/result object

A common pattern is:

```go
user, err := GetUser(10)

if err != nil {
    return err
}

fmt.Println(user.Name)
```

---

# 35. The Most Important Pointer Rules

Memorize these:

```go
x := 10
```

Normal value.

```go
&x
```

Address of `x`.

```go
p := &x
```

Pointer to `x`.

```go
*p
```

Value stored at the address in `p`.

```go
*p = 20
```

Change the original value.

```go
var p *int
```

Pointer that currently contains `nil`.

---

# 36. Final Mental Model

Think of:

```go
x := 10
p := &x
```

as:

```text
x
┌──────────┐
│    10    │
└──────────┘
     ▲
     │
     │ address
     │
p ───┘
```

Then:

```go
*p
```

means:

> Follow the pointer and get the value.

And:

```go
*p = 50
```

means:

> Follow the pointer and change that value to 50.

---

# 37. Summary

The pointer system can be remembered very simply:

```text
& → get address

* → pointer type
* → dereference pointer
```

Example:

```go
x := 10

p := &x

fmt.Println(p)   // address
fmt.Println(*p)  // 10

*p = 100

fmt.Println(x)   // 100
```

If you fully understand:

```text
&
*
nil
dereferencing
pointer parameters
pointer returns
pointer receivers
struct pointers
new()
```

then you have a strong foundation for advanced Go programming.