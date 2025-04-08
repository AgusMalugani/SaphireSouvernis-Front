const API_URL = import.meta.env.VITE_API_URL;

export async function Signin( login ){
    try {
     
const response = await fetch(`${API_URL}/auth/signin`,{
    method:"POST",
    headers:{"Content-Type" : "application/json"},
    body:JSON.stringify(login)
})
const data =  await response.json();
return data;   
    } catch (error) {
        throw Error(error)
    }

}