package main

import (
	"strconv"
	"syscall/js"
)

var global = js.Global()

func add(i ...js.Value) js.Value {
	ret := 0

	for _, item := range i {
		val, _ := strconv.Atoi(item.String())
		ret += val
	}

	return js.ValueOf(ret)
}

func registerCallbacks() {
	wrapper := func(fn func(args ...js.Value) js.Value) func(args []js.Value) {
		return func(args []js.Value) {
			cb := args[len(args)-1:][0]

			ret := fn(args[:len(args)-1]...)

			cb.Invoke(js.Null(), ret)
		}
	}

	global.Set("add", js.NewCallback(wrapper(add)))
}

func main() {
	c := make(chan struct{}, 0)
	println("Web Assembly is ready")
	registerCallbacks()

	<-c
}
