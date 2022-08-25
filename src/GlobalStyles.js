import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        
    }
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        &::-webkit-scrollbar
        {
            width: 5px;
            background-color: #F5F5F5;
        }

        &::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	        background-color: #F5F5F5;
        }

        &::-webkit-scrollbar-thumb
        {
            background-color: #ffcc00;
            border: 2px solid #ffcc00;
            border-radius: 5px;
        }
    }

`;
