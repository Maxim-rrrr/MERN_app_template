import { useState, useEffect, useRef } from "react";

/**
 * https://usehooks.com/useDebounce
 * 
 * Этот хук позволяет отразить любое быстро меняющееся значение. 
 * Отраженное значение будет отражать только последнее значение, 
 * если ловушка useDebounce не вызывалась в течение указанного периода времени. 
 * При использовании вместе с useEffect, как мы это делаем в приведенном 
 * ниже рецепте, вы можете легко гарантировать, что дорогостоящие операции, 
 * такие как вызовы API, не выполняются слишком часто. В приведенном ниже 
 * примере вы можете выполнять поиск в Marvel Comic API и использовать useDebounce 
 * для предотвращения запуска вызовов API при каждом нажатии клавиши. Обязательно 
 * посмотрите демонстрацию CodeSandbox для этого. 
 * Код крючка и вдохновение из github.com/xnimorz/use-debounce .
 */

// // Usage
// function App() {
//   // State and setters for ...
//   // Search term
//   const [searchTerm, setSearchTerm] = useState("");
//   // API search results
//   const [results, setResults] = useState([]);
//   // Searching status (whether there is pending API request)
//   const [isSearching, setIsSearching] = useState(false);
//   // Debounce search term so that it only gives us latest value ...
//   // ... if searchTerm has not been updated within last 500ms.
//   // The goal is to only have the API call fire when user stops typing ...
//   // ... so that we aren't hitting our API rapidly.
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);
//   // Effect for API call
//   useEffect(
//     () => {
//       if (debouncedSearchTerm) {
//         setIsSearching(true);
//         searchCharacters(debouncedSearchTerm).then((results) => {
//           setIsSearching(false);
//           setResults(results);
//         });
//       } else {
//         setResults([]);
//         setIsSearching(false);
//       }
//     },
//     [debouncedSearchTerm] // Only call effect if debounced search term changes
//   );
//   return (
//     <div>
//       <input
//         placeholder="Search Marvel Comics"
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       {isSearching && <div>Searching ...</div>}
//       {results.map((result) => (
//         <div key={result.id}>
//           <h4>{result.title}</h4>
//           <img
//             src={`${result.thumbnail.path}/portrait_incredible.${result.thumbnail.extension}`}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
// // API search function
// function searchCharacters(search) {
//   const apiKey = "f9dfb1e8d466d36c27850bedd2047687";
//   return fetch(
//     `https://gateway.marvel.com/v1/public/comics?apikey=${apiKey}&titleStartsWith=${search}`,
//     {
//       method: "GET",
//     }
//   )
//     .then((r) => r.json())
//     .then((r) => r.data.results)
//     .catch((error) => {
//       console.error(error);
//       return [];
//     });
// }


// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export default useDebounce