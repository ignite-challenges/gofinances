import React, { useCallback, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useTheme } from 'styled-components/native';
import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
  Container, 
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
  Loading
} from './styles';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';


export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Google')
      setIsLoading(false);
    }
  }, [signInWithGoogle]);

  const handleSignInWithApple = useCallback(async () => {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Apple')
      setIsLoading(false);
    }
  }, [signInWithApple]);

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas{`\n`}
            finanças de forma{`\n`}
            muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com{`\n`}
          uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        {isLoading ?
          <Loading 
            size='large' 
            color={theme.colors.primary} 
          /> 
          :
          <FooterWrapper>
            <SignInSocialButton 
              onPress={handleSignInWithGoogle}
              svg={GoogleSvg}
              title="Entrar com Google"
            />
            {Platform.OS === 'ios' && 
              <SignInSocialButton 
                onPress={handleSignInWithApple}
                svg={AppleSvg} 
                title="Entrar com Apple"
              />
            }
          </FooterWrapper>
        }
      </Footer>
    </Container>
  );
};
