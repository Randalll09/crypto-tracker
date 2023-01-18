import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *{margin: 0; padding: 0; box-sizing:border-box;}
  li{list-style: none;}
  a{color:inherit; text-decoration: none;}
  body{
    font-family: 'Sofia Sans', sans-serif;
    background-color:${(props) => props.theme.bgColor};
    color:${({ theme }) => theme.textColor};
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
