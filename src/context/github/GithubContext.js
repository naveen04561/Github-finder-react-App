import { createContext,useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({children}) => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false,
    }

    const [state, dispatch] = useReducer(githubReducer, initialState);

    // This function is for testing purposes..
    // const fetchUsers = async () => {
    //     setLoading();
    //     // const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/users`,{
    //     const response = await fetch("https://api.github.com/users",{
    //         // mode: "cors",
    //         headers: {
    //             // "access-control-allow-origin" : "*",
    //             Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
    //         }
    //     });
    //     const data = await response.json();
        
    //     dispatch({
    //         type: 'GET_USERS',
    //         payload: data,
    //     });
    // }

    const searchUsers = async (text) => {
        setLoading();

        const params = new URLSearchParams({
            q: text
        })

        const response = await fetch(`https://api.github.com/search/users?${params}`,{
            headers: {
                Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
            }
        });
        const {items} = await response.json();
        
        dispatch({
            type: 'GET_USERS',
            payload: items,
        });
    }

    const getUser = async (login) => {
        setLoading();

        const response = await fetch(`https://api.github.com/users/${login}`,{
            headers: {
                Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
            }
        });

        if(response.status === 404) {
            window.location = '/notfound';
        } else {
            const data = await response.json();
            
            dispatch({
                type: 'GET_USER',
                payload: data,
            });
        }
    }

    const getUserRepos = async (login) => {
        setLoading();

        const params = new URLSearchParams({
            sort: 'created',
            per_page: 10
        })

        const response = await fetch(`https://api.github.com/users/${login}/repos?${params}`,{
            headers: {
                Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
            }
        });
        const data = await response.json();

        console.log(data);
        
        dispatch({
            type: 'GET_REPOS',
            payload: data,
        });
    }

    const setLoading = () => dispatch({
        type: 'SET_LOADING'
    })

    const clearUsers = () => dispatch({
        type: 'CLEAR_USERS',
    })

    return <GithubContext.Provider value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
    }}>
        {children}
    </GithubContext.Provider>
}

export default GithubContext;