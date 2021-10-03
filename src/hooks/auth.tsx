import React, { 
  createContext, 
  ReactNode, 
  useCallback, 
  useContext, 
  useState,
  useEffect
} from "react";
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  userStorageLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string
  };
  type: string;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const userStorageKey = '@gofinances:user';

  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const signInWithGoogle = useCallback(async () => {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const { params, type } = await AuthSession
        .startAsync({ authUrl }) as AuthorizationResponse;

      if(type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();
        const userLogged = {
          id: String(userInfo.id),
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }, [userStorageKey]);

  const signInWithApple = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({ 
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });

      if(credential) {
        const name = credential.fullName!.givenName!;
        const userLogged = {
          name,
          id: String(credential.user),
          email: credential.email!,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`
        }

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
      
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }, [userStorageKey]);

  const signOut = useCallback(async () => {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }, [userStorageKey]);

  const loadUserStorageData = useCallback(async () => {
    const userStorage = await AsyncStorage.getItem(userStorageKey);
    if(userStorage) {
      const userLogged = JSON.parse(userStorage) as User;
      setUser(userLogged)
    }
    setUserStorageLoading(false);
  }, [userStorageKey]);

  useEffect(() => {
    loadUserStorageData();
  }, [loadUserStorageData]);

  return (
    <AuthContext.Provider 
      value={{ 
        userStorageLoading,
        user, 
        signInWithGoogle, 
        signInWithApple,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };