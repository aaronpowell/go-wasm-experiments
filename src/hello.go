package main

import (
	"fmt"
	"strconv"
	"syscall/js"
)

var global = js.Global()

func add(i []js.Value) {
	value1 := i[0].String()
	value2 := i[1].String()

	cb := i[2]

	int1, _ := strconv.Atoi(value1)
	int2, _ := strconv.Atoi(value2)

	cb.Call("cb", js.Null(), int1+int2+int1)
}

func registerCallbacks() {
	js.Global().Set("add", js.NewCallback(add))
}

func main() {
	c := make(chan struct{}, 0)
	fmt.Println("Hello, WebAssembly!")
	registerCallbacks()

	<-c
}
