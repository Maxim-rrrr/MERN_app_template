import { useCallback, useState } from "react";

/**
 * https://usehooks.com/useToggle/
 * 
 * По сути, этот хук делает то, что он принимает параметр со значением true или false и переключает 
 * это значение на противоположное. Это полезно, когда мы хотим выполнить какое-либо действие с 
 * противоположным действием, например: показать и скрыть модальное окно, 
 * показать больше / показать меньше текста, открыть / закрыть боковое меню.
 */

// Usage
// function App() {
//     // Call the hook which returns, current value and the toggler function
//     const [isTextChanged, setIsTextChanged] = useToggle();

//     return (
//         <button onClick={setIsTextChanged}>{isTextChanged ? 'Toggled' : 'Click to Toggle'}</button>
//     );
// }

// Hook
// Parameter is the boolean, with default "false" value
const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setState((state) => !state), []);

  return [state, toggle];
};

export default useToggle;
