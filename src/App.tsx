import { RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import router from './routes/Router';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './atoms';

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
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
