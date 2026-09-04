# Installation and Setup

Before writing Go programs, you need to install the Go toolchain and configure your development environment.

---

## Check Whether Go Is Already Installed

Open your terminal and run:

```bash
go version
```

If Go is installed, you should see something similar to:

```text
go version go1.x.x linux/amd64
```

The exact version may be different.

You can also check where Go is installed:

```bash
which go
```

---

## Installing Go on Linux

On Ubuntu or another Linux distribution, you can install Go using the official Go distribution.

After installation, verify:

```bash
go version
```

You should see your installed Go version.

---

## Installing Go on Windows

Download and install the Go installer for Windows.

After installation, open PowerShell or Command Prompt and run:

```powershell
go version
```

---

## Installing Go on macOS

Go can be installed using the official installer or a package manager.

After installation:

```bash
go version
```

---

## Go Workspace

Modern Go projects use **Go modules**.

A typical Go project might look like:

```text
myproject/
├── go.mod
├── go.sum
└── main.go
```

You don't need to keep all projects inside a special `GOPATH` directory.

---

## Create Your First Go Project

Create a directory:

```bash
mkdir myproject
```

Move into it:

```bash
cd myproject
```

Initialize a Go module:

```bash
go mod init myproject
```

This creates:

```text
go.mod
```

The file may look like:

```go
module myproject

go 1.XX
```

The Go version depends on the version you have installed.

---

## What Is `go.mod`?

`go.mod` defines your Go module and its dependencies.

For example:

```go
module myproject

go 1.XX
```

Later, when your project uses external packages, their dependencies can be recorded here.

---

## Useful Go Commands

### Check Go Version

```bash
go version
```

### Get Go Environment Information

```bash
go env
```

### Format Code

```bash
go fmt
```

### Build a Program

```bash
go build
```

### Run a Program

```bash
go run .
```

### Test Code

```bash
go test ./...
```

### Download Dependencies

```bash
go mod download
```

### Clean Dependencies

```bash
go mod tidy
```

---

## Recommended Editor

You can write Go code using many editors.

Popular choices include:

- Visual Studio Code
- GoLand
- Vim
- Neovim

For beginners, **Visual Studio Code + the official Go extension** is a good choice.

---

## Verify Your Setup

Run:

```bash
go version
go env
```

Then create a project:

```bash
mkdir hello-go
cd hello-go
go mod init hello-go
```

If these commands work successfully, your Go environment is ready.

---

## Next Step

Now that Go is installed, let's write and run our **first Go program**.