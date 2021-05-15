import { useMemo } from "react";

import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import queryString from "query-string";


/**
 * https://usehooks.com/useRouter/
 * 
 * Если вы используете React Router вы могли заметить , 
 * что в последнее время добавили ряд полезных hooks, в частности useParams, 
 * useLocation, useHistoryи использование useRouteMatch. Но давайте посмотрим, 
 * сможем ли мы сделать это еще проще, заключив их в одну useRouter ловушку, 
 * которая предоставляет только те данные и методы, которые нам нужны. 
 * В этом рецепте мы показываем, насколько легко составить несколько хуков и 
 * объединить их возвращенное состояние в один объект. Для библиотек, таких как 
 * React Router, есть смысл предлагать выбор низкоуровневых хуков, поскольку 
 * использование только нужного хука может свести к минимуму ненужные повторные отрисовки. 
 * Тем не менее, иногда вам нужен более простой опыт разработчика, и настраиваемые хуки упрощают это.
 */

// // Usage
// function MyComponent() {
//   // Get the router object
//   const router = useRouter();
//   // Get value from query string (?postId=123) or route param (/:postId)
//   console.log(router.query.postId);
//   // Get current pathname
//   console.log(router.pathname);
//   // Navigate with with router.push()
//   return <button onClick={(e) => router.push("/about")}>About</button>;
// }

// Hook
function useRouter() {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  // Return our custom router object
  // Memoize so that a new object is only returned if something changes
  return useMemo(() => {
    return {
      // For convenience add push(), replace(), pathname at top level
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      match,
      location,
      history,
    };
  }, [params, match, location, history]);
}

export default useRouter