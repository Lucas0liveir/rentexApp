import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect
} from "react";
import { database } from "../databases";
import { User as ModelUser } from "../databases/model/User";
import { api } from "../services/api";

interface User {
    id: string;
    user_id: string;
    email: string;
    name: string;
    driver_license: string;
    avatar: string;
    token: string;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (user: User) => Promise<void>
}

interface AuthProviderProps {
    children: ReactNode
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {

    const [data, setData] = useState<User>({} as User)

    async function updateUser(user: User) {
        try {
            const userColletion = database.get<ModelUser>('users')
            await database.write(async () => {
                const userSelected = await userColletion.find(user.id)
                await userSelected.update((userData) => {
                    userData.name = user.name,
                    userData.driver_license = user.driver_license,
                    userData.avatar = user.avatar
                })
            })

            setData(user)
        } catch (e) {
            throw new Error(e)
        }
    }

    async function signOut() {
        try {
            const userColletion = database.get<ModelUser>('users')
            await database.write(async () => {
                const userSelected = await userColletion.find(data.id)
                await userSelected.destroyPermanently()
            })

            setData({} as User)

        } catch (e: any) {
            throw new Error(e)
        }
    }

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('/sessions', {
                email,
                password
            })

            const { token, user } = response.data

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            const userColletion = database.get<ModelUser>('users')
            await database.write(async () => {
                await userColletion.create((newUser) => {
                    newUser.user_id = user.id,
                        newUser.name = user.name,
                        newUser.email = user.email,
                        newUser.driver_license = user.driver_license,
                        newUser.avatar = user.avatar,
                        newUser.token = token
                })
            })

            setData({ ...user, token })

        } catch (e) {
            throw new Error(e)
        }
    }

    useEffect(() => {
        async function loadUserData() {
            const userCollection = database.get<ModelUser>('users')
            const response = await userCollection.query().fetch()

            if (response.length > 0) {
                const userData = response[0]._raw as unknown as User
                api.defaults.headers['Authorization'] = `Bearer ${userData.token}`
                setData(userData)
            }
        }

        loadUserData()
    }, [])

    return (
        <AuthContext.Provider
            value={
                {
                    user: data,
                    signIn,
                    signOut,
                    updateUser
                }
            }>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext)

    return context
}

export {
    useAuth,
    AuthProvider
}