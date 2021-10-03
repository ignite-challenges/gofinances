import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
  Container, 
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const { signInWithGoogle, user } = useAuth();

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Google')
    }
  }, [signInWithGoogle]);

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
        <FooterWrapper>
          <SignInSocialButton 
            onPress={handleSignInWithGoogle}
            svg={GoogleSvg}
            title="Entrar com Google"
          />
          <SignInSocialButton 
            svg={AppleSvg} 
            title="Entrar com Apple"
          />
        </FooterWrapper>
      </Footer>
    </Container>
  );
};
