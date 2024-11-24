"use client"
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'

const page = () => {
    const [formData, setFormData] = useState({
        firstName: "ahmed12323414",
        lastName: "ahmed1234",
        email: 'ahmed112321242141234@gmail.com',
        password: "9PQmxm.PfJf#}'K\"\\:pZd!|dMp?+gjB&0{/U>G2`^`_",
        confirmPassword: "9PQmxm.PfJf#}'K\"\\:pZd!|dMp?+gjB&0{/U>G2`^`_"
    })
    const handelSubmit = async (e: any) => {
        // e.preventDefault()
        // try {

        //     // const response = await axios.post('https://localhost:7086/api/Auth/Register', formData)
        //     // const resp = await axios.get('https://localhost:7086/api/Project/GetProjects')
        //     // console.log(resp, "resp")
        //     // console.log(response, "response")
        // } catch (error) {
        //     console.log(error)
        // }
    }
    return (
        <div>
            <form onSubmit={handelSubmit} >
                <input
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            email: e.target?.value,
                        }))
                    }
                    name="email"
                    type="text"
                />
                <input
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            password: e.target?.value,
                        }))
                    }
                    name="password"
                    type="text"
                />
                <Link href={'https://accounts.google.com/o/oauth2/v2/auth?client_id=1016905658673-6p2ikg0l00ped47d31gbnr10rn5pri91.apps.googleusercontent.com&redirect_uri=https://localhost:7086/api/Auth/CodeExchangeToken&response_type=code&scope=openid%20profile%20email'}>submit</Link>
            </form>
        </div>
    )
}

export default page
