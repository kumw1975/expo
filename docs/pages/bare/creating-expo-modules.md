---
title: Creating Expo modules
---

import { Tab, Tabs } from '~/components/plugins/Tabs';
import { DetailedCodeSamplesTabs, CodeSamplesTabs } from '~/components/plugins/CodeSamplesTabs';

## Introduction

You can read more here: https://blog.expo.dev/a-peek-into-the-upcoming-sweet-expo-module-api-6de6b9aca492

## Module Definition Components

### `name`

Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument. Can be inferred from module's class name, but it's recommended to use it explicitly for clarity.

<CodeSamplesTabs>

```swift
name("MyModuleName")
```

```kotlin
name("MyModuleName")
```

</CodeSamplesTabs>

### `constants`

Sets constant properties on the module. Can take the dictionary or the closure that returns the dictionary.

<CodeSamplesTabs>

```swift
// Created from the dictionary
constants([
  "PI": 3.14159
])

// or returned by the closure
constants {
  return [
    "PI": 3.14159
  ]
}
```

```kotlin
constants(
  mapOf(
    "PI" to 3.14159
  )
)
```

</CodeSamplesTabs>

### `function`

Defines the native function that will be exported to JavaScript. Function's body supports up to 8 arguments — because of the limitations of generics in both Swift and Kotlin, this component is implemented separately for each number of arguments.

<!-- TODO: Two types of functions -->

#### Signatures

- `function(name, body)`

#### Arguments

- **name**: `string` — Name of the function that you'll use in JavaScript to call the function.
- **body**: `(args...) -> ReturnType` — The closure to run when the function is called.

<CodeSamplesTabs>

```swift
function("synchronousFunction") { (message: String) in
  return message
}

function("asynchronousFunction") { (message: String, promise: Promise) in
  DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
    promise.resolve(message)
  }
}
```

</CodeSamplesTabs>

### `events`

Defines event names that the module can send to JavaScript.

<CodeSamplesTabs>

```swift
events("onCameraReady", "onPictureSaved", "onBarCodeScanned", "onFacesDetected")
```

```kotlin
events("onCameraReady", "onPictureSaved", "onBarCodeScanned", "onFacesDetected")
```

</CodeSamplesTabs>

### `viewManager`

Enables the module to be used as a view manager. The view manager definition is built from the components used in the closure passed to the component. Components that are allowed to go inside: [`view`](#view), [`prop`](#prop).

<CodeSamplesTabs>

```swift
viewManager {
  view {
    UIView()
  }

  prop("isHidden") { (view: UIView, hidden: Bool) in
    view.isHidden = hidden
  }
}
```

</CodeSamplesTabs>

### `view`

Defines the factory creating a native view when the module is used as a view.

### `prop`

- **name**: `string` - Name of view prop that you want to define a setter.
- **setter**: `(view: ViewType, value: ValueType) -> ()` - Closure that is invoked when the view rerenders.

Defines a setter for the view prop of given name.

### `onCreate`

Defines module's lifecycle listener that is called right after module initialization. If you need to set up something when the module gets initialized, use this component instead of module's class initializer.

### `onDestroy`

Defines module's lifecycle listener that is called when the module is about to be deallocated. Use it instead of module's class destructor.

### `onStartObserving`

Defines the function that is invoked when the first event listener is added.

### `onStopObserving`

Defines the function that is invoked when all event listeners are removed.

### `onAppContextDestroys`

Creates module's lifecycle listener that is called when the app context owning the module is about to be deallocated.

### `onAppEntersForeground` 🍏

Creates a listener that is called when the app is about to enter the foreground mode.

### `onAppEntersBackground` 🍏

Creates a listener that is called when the app enters the background mode.

<CodeSamplesTabs>

```swift
onAppEntersBackground {
  doSomeCleanup()
}
```

```kotlin
// `onAppEntersBackground` is not supported on Android, you may want to use `onActivityEntersBackground` instead.
```

</CodeSamplesTabs>

### `onAppBecomesActive` 🍏

Creates a listener that is called when the app becomes active again.

### `onActivityEntersForeground` 🤖

### `onActivityEntersBackground` 🤖

### `onActivityDestroys` 🤖

## Arguments

Fundamentally, only some primitive and serializable data can be passed back and forth through the JavaScript runtime. However, usually native modules need to receive custom data structures — more sophisticated than just the dictionary/map where the values are of unknown (`Any`) type and so each value has to be validated and casted on its own. Expo Modules API offers some protocols to make it easier to work with data objects, to provide automatic validation, and finally, to ensure native type-safety on each object member.

### Convertibles

_Convertibles_ are the native types that can be initialized from some specific kind of data received from JavaScript. Such types are allowed to be used as an argument type in `function`'s body. As a good example, when the `CGPoint` type is used as a function argument type, its instance can be created from an array of two numbers (_x_, _y_) or a JavaScript object with numeric `x` and `y` properties.

Some common iOS types from `CoreGraphics` and `UIKit` system frameworks are already made convertible.

| Native Type | TypeScript                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `CGFloat`   | `number`                                                                                                           |
| `CGPoint`   | `{ x: number, y: number }` or `number[]` with _x_ and _y_ coords                                                   |
| `CGSize`    | `{ width: number, height: number }` or `number[]` with _width_ and _height_                                        |
| `CGVector`  | `{ dx: number, dy: number }` or `number[]` with _dx_ and _dy_ vector differentials                                 |
| `CGRect`    | `{ x: number, y: number, width: number, height: number }` or `number[]` with _x_, _y_, _width_ and _height_ values |
| `CGColor`   | color hex strings in formats: `#RRGGBB`, `#RRGGBBAA`, `#RGB`, `#RGBA`                                              |
| `UIColor`   | color hex strings in formats: `#RRGGBB`, `#RRGGBBAA`, `#RGB`, `#RGBA`                                              |

### Records

_Record_ is a convertible type and an equivalent of the dictionary (Swift) or map (Kotlin), but represented as a struct where each field can have its own well-known type and provide the default value.

<CodeSamplesTabs>

```swift
struct FileReadOptions: Record {
  @Field
  var encoding: String = "utf8"

  @Field
  var position: Int = 0

  @Field
  var length: Int?
}

// Now this record can be used as an argument of the functions or the view prop setters.
function("readFile") { (path: String, options: FileReadOptions) -> String in
  // Read the file using given `options`
}
```

</CodeSamplesTabs>

### Enums

With enums we can go even further with the above example (with `FileReadOptions` record) and limit supported encodings to `"utf8"` and `"base64"`. To use an enum as an argument or record field, it must represent a primitive value (e.g. `String`, `Int`) and conform to `EnumArgument`.

<CodeSamplesTabs>

```swift
enum FileEncoding: String, EnumArgument {
  case utf8
  case base64
}

struct FileReadOptions: Record {
  @Field
  var encoding: FileEncoding = .utf8
  // ...
}
```

</CodeSamplesTabs>

## AppDelegate Subscribers

## Module Config

- `platforms` — An array of supported platforms.
- `ios` — Config with options specific to iOS platform
  - `modulesClassNames` — Names of Swift native modules classes to put to the generated modules provider file.
  - `appDelegateSubscribers` — Names of Swift classes that hooks into `ExpoAppDelegate` to receive AppDelegate life-cycle events.
- `android` — Config with options specific to Android platform
  - `modulesClassNames` — Full names (package + class name) of Kotlin native modules classes to put to the generated package provider file.

## Examples

<CodeSamplesTabs>

```swift
public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    name("MyFirstExpoModule")

    function("hello") { (name: String) in
      return "Hello \(name)!"
    }
  }
}
```

```kotlin
class MyModule: Module {

}
```

</CodeSamplesTabs>

For more examples you can take a look on GitHub at some of Expo modules that already use this API:

- `expo-cellular` ([Swift](https://github.com/expo/expo/blob/master/packages/expo-cellular/ios/CellularModule.swift), [Kotlin](https://github.com/expo/expo/blob/master/packages/expo-cellular/android/src/main/java/expo/modules/cellular/CellularModule.kt))
- `expo-linear-gradient` ([Swift](https://github.com/expo/expo/blob/master/packages/expo-linear-gradient/ios/LinearGradientModule.swift))
- `expo-haptics` ([Swift](https://github.com/expo/expo/blob/master/packages/expo-haptics/ios/HapticsModule.swift))
