import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    }

    body {
    font-family: 'Open Sans', sans-serif;
    background-color: #333;
    color: #f2f2f2;
    }

    html, body, #__next {
    min-height: 100vh;
    display: flex;
    flex: 1;
    }
    
    #__next {
    flex: 1;
    }

    #__next > * {
    flex: 1;
    }
`;
