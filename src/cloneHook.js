const React = (() => {
  let hooks = new Map();
  let idx = 0;

  const useState = (initialVal) => {
    const state = hooks.get(idx) || initialVal;

    const setState = (newVal) => {
      if (typeof newVal === "function") {
        const newState = newVal(state);

        hooks.set(idx, newState);
        return;
      }

      hooks.set(idx, newVal);
    };

    idx++;

    return [state, setState];
  };

  const render = (Component) => {
    const C = Component();
    C.render();
    return C;
  };

  return { useState, render };
})();

const Component = () => {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState("apple");

  return {
    render: () => {
      console.log({ count, text });
    },
    click: () => setCount((prev) => prev + 1),
    type: (word) => setText(word),
  };
};

var App = React.render(Component);
App.click();
var App = React.render(Component);
App.type("orange");
var App = React.render(Component);
