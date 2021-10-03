import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from "react-native-svg";

import { 
  Button,
  Title,
  ImageContainer
} from './styles';

interface SignInSocialButtonProps extends RectButtonProps {
  svg: React.FC<SvgProps>;
  title: string;
}

export function SignInSocialButton({ 
  svg: Svg, 
  title,
  ...rest
 }: SignInSocialButtonProps) {
  return (
    <Button {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>
      <Title>{title}</Title>
    </Button>
  );
};