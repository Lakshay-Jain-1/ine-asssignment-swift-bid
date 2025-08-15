import { useState } from "react"
import { supabase } from "../supabase-client"


const SignUp = () => {

    const [userData, setUserData] = useState({})
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(userData)
        const { error } = await supabase.auth.signUp(userData)

        if (error) {
            console.error(error)
        }

    }


    return (
        <>

            <form onSubmit={(e)=>  handleSubmit(e)} >
                <input name="password" type="text"
                    onChange={(event) =>
                        setUserData(
                            function (prev) {
                                return { ...prev, "password": event.target.value }
                            })} />
                <input name="email" type="email"
                    onChange={(event) => {
                        setUserData(
                            function (prev) {
                                return { ...prev, "email": event.target.value }
                            }

                        )
                    }}

                />
                <input type="submit" />
            </form>


        </>
    )


}


export default SignUp