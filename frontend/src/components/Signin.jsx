import { useState } from "react"
import { supabase } from "../supabase-client"


const SignIn = () => {

    const [userData, setUserData] = useState({})
    const handleSubmit = async () => {
        console.log(userData)
        const { error } = await supabase.auth.signInWithPassword(userData)

        if (error) {
            console.error(error)
        }

    }


    return (
        <>

            <form onSubmit={handleSubmit} >
                <input name="password" type="text"
                    onChange={(event) =>
                        setUserData(
                            function (prev) {
                                return { ...prev, "password": event.target.innerText }
                            })} />
                <input name="email" type="email"
                    onChange={(event) => {
                        setUserData(
                            function (prev) {
                                return { ...prev, "email": event.target.innerText }
                            }

                        )
                    }}

                />
                <input type="submit" />
            </form>


        </>
    )


}


export default SignIn