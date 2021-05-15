import { useReducer, useCallback } from "react";

/**
 * https://usehooks.com/useHistory
 * 
 * Этот хук позволяет очень легко добавить в ваше приложение функцию отмены / повтора. 
 * Наш рецепт - это простое приложение для рисования. Он генерирует сетку блоков, 
 * позволяет щелкнуть любой блок, чтобы переключить его цвет, и использует хук useHistory, 
 * чтобы мы могли отменить, повторить или очистить все изменения на холсте. 
 * Посмотрите нашу демонстрацию CodeSandbox . В нашем хуке мы используем useReducer для 
 * хранения состояния вместо useState, что должно быть знакомо всем, 
 * кто использовал redux (подробнее об useReducer читайте в официальной документации ). 
 * Код перехвата был скопирован с небольшими изменениями из отличной библиотеки use-undo , 
 * поэтому, если вы хотите добавить это в свой проект, вы также можете использовать 
 * эту библиотеку через npm.
 */

// // Usage
// function App() {
//   const { state, set, undo, redo, clear, canUndo, canRedo } = useHistory({});
//   return (
//     <div className="container">
//       <div className="controls">
//         <div className="title">👩‍🎨 Click squares to draw</div>
//         <button onClick={undo} disabled={!canUndo}>
//           Undo
//         </button>
//         <button onClick={redo} disabled={!canRedo}>
//           Redo
//         </button>
//         <button onClick={clear}>Clear</button>
//       </div>
//       <div className="grid">
//         {((blocks, i, len) => {
//           // Generate a grid of blocks
//           while (++i <= len) {
//             const index = i;
//             blocks.push(
//               <div
//                 // Give block "active" class if true in state object
//                 className={"block" + (state[index] ? " active" : "")}
//                 // Toggle boolean value of clicked block and merge into current state
//                 onClick={() => set({ ...state, [index]: !state[index] })}
//                 key={i}
//               />
//             );
//           }
//           return blocks;
//         })([], 0, 625)}
//       </div>
//     </div>
//   );
// }
// // Initial state that we pass into useReducer
// const initialState = {
//   // Array of previous state values updated each time we push a new state
//   past: [],
//   // Current state value
//   present: null,
//   // Will contain "future" state values if we undo (so we can redo)
//   future: [],
// };
// // Our reducer function to handle state changes based on action
// const reducer = (state, action) => {
//   const { past, present, future } = state;
//   switch (action.type) {
//     case "UNDO":
//       const previous = past[past.length - 1];
//       const newPast = past.slice(0, past.length - 1);
//       return {
//         past: newPast,
//         present: previous,
//         future: [present, ...future],
//       };
//     case "REDO":
//       const next = future[0];
//       const newFuture = future.slice(1);
//       return {
//         past: [...past, present],
//         present: next,
//         future: newFuture,
//       };
//     case "SET":
//       const { newPresent } = action;
//       if (newPresent === present) {
//         return state;
//       }
//       return {
//         past: [...past, present],
//         present: newPresent,
//         future: [],
//       };
//     case "CLEAR":
//       const { initialPresent } = action;
//       return {
//         ...initialState,
//         present: initialPresent,
//       };
//   }
// };


// Hook
const useHistory = (initialPresent) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  });
  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;
  // Setup our callback functions
  // We memoize with useCallback to prevent unnecessary re-renders
  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: "UNDO" });
    }
  }, [canUndo, dispatch]);
  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: "REDO" });
    }
  }, [canRedo, dispatch]);
  const set = useCallback(
    (newPresent) => dispatch({ type: "SET", newPresent }),
    [dispatch]
  );
  const clear = useCallback(() => dispatch({ type: "CLEAR", initialPresent }), [
    dispatch,
  ]);
  // If needed we could also return past and future state
  return { state: state.present, set, undo, redo, clear, canUndo, canRedo };
};


export default useHistory