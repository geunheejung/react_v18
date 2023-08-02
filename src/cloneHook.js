const React = (function () {
  let hooks = [];
  let idx = 0;

  function useState(initialVal) {
    const state = hooks[idx] || initialVal;
    // setState에서 올바른 hooks를 바라볼 수 있도록 idx를 고정시킴.
    const _idx = idx;
    const setState = (newVal) => {
      hooks[_idx] = newVal;
      // idx는 useState가 호출될 때 마다 +1씩 증가되는데, render에 의해 setState가 호출되고 이로 인해 값이 할당되는 시점은
      // 한참 뒤이기에, 시점상의 문제가 있음.
      // 그리고 만약 setState를 하면 index에 의해 hooks에서 값을 가져와 해당 데이터를 바꿔줘야하는데
      // 매번 setState마다 idx가 유지되지 않으면 문제가 있음.
      console.log(hooks);
    };

    idx++;

    return [state, setState];
  }

  function render(Component) {
    const C = Component();
    C.render();
    return C;
  }

  return { useState, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState("apple");

  return {
    render: () => {
      console.log({ count, text });
    },
    click: () => setCount(count + 1),
    type: (word) => setText(word),
  };
}

var App = React.render(Component); // { count: 1, text: 'apple' }
App.click();
var App = React.render(Component); // { count: 1, text: 'apple' } 🥲
App.click();
var App = React.render(Component); // { count: 1, text: 'apple' } 🥲
App.type("orange");
var App = React.render(Component); // { count: 1, text: 'apple' } 🥲
App.type("peach");
var App = React.render(Component); // { count: 1, text: 'apple' } 🥲
