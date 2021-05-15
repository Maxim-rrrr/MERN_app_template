import { useState, useEffect, useRef } from "react";

/**
 * https://usehooks.com/usePrevious
 * 
 * Один из часто возникающих вопросов: 
 * «При использовании хуков, как мне получить предыдущее значение props или состояния?» . 
 * С компонентами класса React у вас есть метод componentDidUpdate, 
 * который получает предыдущие реквизиты и состояние в качестве аргументов, 
 * или вы можете обновить переменную экземпляра (this.previous = value) и 
 * ссылаться на нее позже, чтобы получить предыдущее значение. Итак, как 
 * мы можем сделать это внутри функционального компонента, у которого нет 
 * методов жизненного цикла или экземпляра для хранения значений? Крючки на помощь! 
 * Мы можем создать собственный хук, который использует хук useRef внутри 
 * для хранения предыдущего значения. См. Рецепт ниже со встроенными комментариями. 
 * Вы также можете найти этот пример в официальном FAQ по React Hooks .
 */

// // Usage
// function App() {
//   // State value and setter for our example
//   const [count, setCount] = useState(0);
//   // Get the previous value (was passed into hook on last render)
//   const prevCount = usePrevious(count);
//   // Display both current and previous count value
//   return (
//     <div>
//       <h1>
//         Now: {count}, before: {prevCount}
//       </h1>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//     </div>
//   );
// }

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export default usePrevious