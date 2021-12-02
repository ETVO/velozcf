import { useEffect, useState } from "react"

const useDelete = (url, body) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            try {   
                const res = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                const json = await res.json()

                setData(json)
                setLoading(false)
            } catch(error) {
                setError(error)
                setLoading(false)
            }
        }

        fetchData()
    }, [url, body])

    return { loading, error, data }
}

export default useDelete