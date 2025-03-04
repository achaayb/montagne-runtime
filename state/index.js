import { atom } from "nanostores";

export let state = (initialValue) => {
    return atom(initialValue);  
}