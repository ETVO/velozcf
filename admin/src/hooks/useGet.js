import { useEffect, useState } from "react"
import { getAuthString } from "../helpers/helpers"

const useGet = (url) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            try {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + getAuthString()
                    }
                })
                const json = await res.json();

                setData(json)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }

        fetchData()
    }, [url])

    return { loading, error, data }
}

export default useGet