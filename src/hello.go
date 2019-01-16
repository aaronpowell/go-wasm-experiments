package main

import (
	"fmt"
	"strconv"
	"syscall/js"
)

var global = js.Global()

func add(i ...js.Value) int {
	ret := 0

	for _, item := range i {
		val, _ := strconv.Atoi(item.String())
		ret += val
	}

	// value1 := i[0].String()
	// value2 := i[1].String()

	// int1, _ := strconv.Atoi(value1)
	// int2, _ := strconv.Atoi(value2)

	// return int1 + int2
	return ret
}

func registerCallbacks() {
	wrapper := func(fn func(args ...js.Value) int) func(args []js.Value) {
		return func(args []js.Value) {
			cb := args[len(args)-1:][0]

			invoker := func(i int) {
				cb.Call("cb", js.Null(), i)
			}

			invoker(fn(args[:len(args)-1]...))
		}
	}

	global.Set("add", js.NewCallback(wrapper(add)))
}

func main() {
	c := make(chan struct{}, 0)
	fmt.Println("Hello, WebAssembly!")
	registerCallbacks()

	<-c
}
