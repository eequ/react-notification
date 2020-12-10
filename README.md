## Introduction

Display notifications without effort. Errors, warnings, or important information about applications actions.
For example, if a file failed to upload an error notification should appear.

Its features:

- Multiple notifications at once
- Custom icons and color for each state
- Change the placement of notifications (any of viewport's corners)
- They persist during page navigations
- Control over autoclose (you can even force manual close)
- Actions inside the notification element
- Provide any react code as notification content
- Responsive and custom design
- They are not part of components, so we don't bother with the state each time
- `useNotification` hook that returns elements holder with context accessible issue
- Update the content of the notification even after what is displayed
- Animated on appearance/close
- Just call the `notification` function, anywhere. No extra code required, ever.

<br/>

## Quick Start

```JSX
import notification from "notification";

const Example = () => {
  const notify = () => {
    notification.info({
      message: "Information title",
      description: "This is the content of the notification.",
      onClick: () => console.log("Notification Clicked!"),
      duration: 3,
    });
  };

  return (
    <>
      <div>hello {data.name}!</div>
      <button onClick={notify}>Click me!</button>
    </>
  );
};
```

<br/>

## Usage

Inside components, import the module:

```
import notification from "notification";
```

### API

```js
notification.info({ message, description, actions, duration });
```

#### Parameters

- `message`: string for the notification header
- `content`: JSX elements rendered inside notification body
- `actions`: buttons as actions for notifications

#### Options

- `onClick`: function that will be called on notification click
- `duration = 3`: can be used to specify how long the notification stays open. After the duration time elapses, the notification closes automatically. To prevent autoclose, provide duration value as 0.
- `placement = rightBottom`: a notification box can appear on any corner of the viewport by providnig values: `topRight`, `bottomRight`, `bottomLeft` or `topLeft`
- `type`: deprecated, as it must be used with-in function call (ex: `notification.error({ ... })`)

<br/>

We can use `notification.useNotification` to get `holder` with context accessible issue.

```JSX
import { createContext } from "react";
import notification from "notification";

const Context = createContext({ name: "Default" });

const Example = () => {
  const [api, holder] = notification.useNotification();

  const openNotification = () => {
    api.info({
      message: "Notification",
      content: (
        <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>
      ),
    });
  };

  return (
    <Context.Provider value={{ name: "Eequ Mentor" }}>
      {holder}

      <button onClick={() => openNotification()}>topLeft</button>
    </Context.Provider>
  );
};

export default Example;
```
