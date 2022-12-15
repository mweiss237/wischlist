export default interface ApiRepsonse<T>{
    success: boolean
    message?: string
    result: T
}


