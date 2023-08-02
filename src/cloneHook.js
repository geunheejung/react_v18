const React = (function () {
  let hooks = [];
  let idx = 0;

  function useState(initialVal) {
    const state = hooks[idx] || initialVal;
    const _idx = idx;
    const setState = (newVal) => {
      hooks[_idx] = newVal;
    };

    idx++;
    return [state, setState];
  }

  // 즉, render를 호출하면 idx는 다시 초기화하고
  // setState는 useState 했을 당시의 idx를 사용한다인듯.
  function render(Component) {
    idx = 0;
    const C = Component();
    C.render();
    return C;
  }

  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx];
    let hasChanged = true; // default

    if (oldDeps) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }

    // 변경을 감지
    if (hasChanged) {
      cb();
    }

    hooks[idx] = depArray;
    idx++;
  }

  return { useState, render, useEffect };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState("apple");

  React.useEffect(() => {
    console.log("--- 실행됨! ---");
  }, [count]);

  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: (word) => setText(word),
  };
}

var App = React.render(Component); // { count: 1, text: 'apple' }
App.click();
var App = React.render(Component); // { count: 2, text: 'apple' } 😀
App.click();
var App = React.render(Component); // { count: 3, text: 'apple' } 😀
App.type("orange");
var App = React.render(Component); // { count: 3, text: 'orange' } 😀
App.type("peach");
var App = React.render(Component); // { count: 3, text: 'peach' } 😀

// idx가 render될 때마다 초기화 되어야하는 이유는
// 첫째 우리는 초깃값 이후 유지된 state를 원하는데 render될 시 idx가 초기화 되지 않으면 render에 의해
// 다시 useState가 호출될 때 값이 보존되지 않음.
