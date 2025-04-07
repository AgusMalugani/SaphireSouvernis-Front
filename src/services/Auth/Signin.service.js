export async function Signin( login ){
    try {
     
const response = await fetch("http://localhost:3000/auth/signin",{
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